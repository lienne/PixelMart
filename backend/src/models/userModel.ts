import pool from "../database";

export interface User {
  id: number;
  auth0_id?: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: Date;
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

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
}

export const findUserByAuth0Id = async(auth0_id: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [auth0_id]);
    return result.rows[0] || null;
}

// export const findUserById = async (userId: string): Promise<User | null> => {
//     const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//     return result.rows[0] || null;
// }

export const updateUser = async(
    auth0_id: string,
    updates: { email?: string, name?: string, avatar?: string}
): Promise<User> => {
    const { email, name, avatar } = updates;
    const result = await pool.query(
        `UPDATE users
        SET auth0_id = $1, name = $3, avatar = $4
        WHERE email = $2
        RETURNING *`,
        [auth0_id, email, name, avatar]
    );

    return result.rows[0];
}

export const updateUserProfileByAuthId = async(
    auth0_id: string,
    updates: { name?: string, avatar?: string}
): Promise<User | null> => {
    const { name, avatar } = updates;
    const result = await pool.query(
        `UPDATE users
        SET name = $2, avatar = $3
        WHERE auth0_id = $1
        RETURNING *`,
        [auth0_id, name, avatar]
    );
    return result.rows[0] || null;
}