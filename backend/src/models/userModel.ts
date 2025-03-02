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
}

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
    return result.rows[0] || null;
}