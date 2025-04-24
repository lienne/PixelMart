import pool from "../database";

export interface User {
  id: string;
  auth0_id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  created_at: Date;
  username_changed_at: Date;
  is_deleted: boolean;
  stripe_account_id?: string;
  is_banned: boolean;
}

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const AUTH0_SELLER_ROLE_ID = process.env.AUTH0_SELLER_ROLE_ID!;

export const createUser = async (
    email: string,
    auth0_id?: string,
    name?: string,
    avatar?: string
): Promise<User> => {
    const result = await pool.query(
        'INSERT INTO users (email, auth0_id, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *', [email, auth0_id, name, avatar]
    );
    return result.rows[0];
}

export const findUserByAuth0Id = async(auth0_id: string): Promise<User | null> => {
    const result = await pool.query(
        'SELECT * FROM users WHERE auth0_id = $1',
        [auth0_id]
    );
    return result.rows[0] || null;
}

export const findUserByUsername = async(username: string): Promise<User | null> => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0] || null;
}

export const updateUserProfileByAuthId = async(
    auth0_id: string,
    updates: { name?: string, avatar?: string, username?: string}
): Promise<User | null> => {
    const { name, avatar, username } = updates;
    const result = await pool.query(
        `UPDATE users
        SET name = COALESCE($2, name),
            avatar = COALESCE($3, avatar),
            username = COALESCE($4, username),
            username_changed_at = CASE
                                    WHEN $4 IS NOT NULL THEN NOW()
                                    ELSE username_changed_at
                                END
        WHERE auth0_id = $1
        RETURNING *`,
        [auth0_id, name, avatar, username]
    );
    return result.rows[0] || null;
}

export const getUserIdByAuth0Id = async (auth0Id: string): Promise<User | null> => {
    const result = await pool.query(
        `SELECT id FROM users WHERE auth0_id = $1`,
        [auth0Id]
    );
    return result.rows[0] || null;
}

export const deleteUserByAuth0Id = async (auth0Id: string): Promise<User | null> => {
    const result = await pool.query(
        "UPDATE users SET is_deleted = TRUE WHERE auth0_id = $1",
        [auth0Id]
    );
    return result.rows[0] || null;
}

export const reactivateUserByAuth0Id = async (auth0Id: string): Promise<User | null> => {
    const result = await pool.query(
        "UPDATE users SET is_deleted = FALSE WHERE auth0_id = $1",
        [auth0Id]
    );
    return result.rows[0] || null;
}

async function getManagementToken () {
    const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: `https://${AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            scope: "update:users update:roles read:roles"
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to get Auth0 Management Token: ", data)
        throw new Error("Failed to get Auth0 Management Token");
    }

    return data.access_token;
}

// Assign "seller" role to users who become sellers
export async function assignSellerRole(auth0Id: string) {
    const token = await getManagementToken();

    const response = await fetch(
        `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Id)}/roles`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                roles: [AUTH0_SELLER_ROLE_ID]
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to assign seller role. Response: ", errorText);
        throw new Error("Failed to assign seller role.");
    }

    const text = await response.text();
    if (!text) {
        console.warn("No response body from Auth0 when assigning seller role.");
        return;
    }

    return JSON.parse(text);
}

export const updateStripeAccountIdByAuth0Id = async (
    auth0Id: string,
    stripeAccountId: string
): Promise<User | null> => {
    const result = await pool.query(
        `UPDATE users
        SET stripe_account_id = $2
        WHERE auth0_id = $1
        RETURNING *`,
        [auth0Id, stripeAccountId]
    );

    if (result.rowCount === 0) {
        throw new Error("User not found.");
    }

    // Assign seller role in Auth0
    await assignSellerRole(auth0Id);

    return result.rows[0] || null;
}

export const markUserAsSellerByStripeId = async (stripeAccountId: string): Promise<void> => {
    await pool.query(
        `UPDATE users
        SET is_seller = TRUE
        WHERE stripe_account_id = $1`,
        [stripeAccountId]
    );
}

async function revokeUserSessions(auth0Id: string) {
    const token = await getManagementToken();

    const response = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Id)}/sessions`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        console.error("Failed to revoke user sessions: ", await response.text());
        throw new Error("Failed to revoke user sessions.");
    }
}

export const banUserByUserId = async (userId: string, bannedBy: string, reason: string) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insert into banned_users table
        await client.query(
            `INSERT INTO banned_users (id, banned_by, reason)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [userId, bannedBy, reason]
        );

        // Update users table
        const result = await client.query(
            `UPDATE users SET is_banned = TRUE
            WHERE ID = $1
            RETURNING *`,
            [userId]
        );

        const bannedUserAuth0Id = result.rows[0]?.auth0_id;
        if (bannedUserAuth0Id) {
            await revokeUserSessions(bannedUserAuth0Id);
        }

        await client.query("COMMIT");
        return result.rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error banning user: ", err);
        throw err;
    } finally {
        client.release();
    }
}