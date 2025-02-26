import pool from "../database";

export interface Review {
    id: string; // UUID
    item_id: string; // UUID of the item being sold
    user_id: string; // UUID of review poster
    rating: number;
    comment: string;
    created_at: Date;
    reported?: boolean;
}

export const createReview = async (
    item_id: string,
    user_id: string,
    rating: number,
    comment: string,
): Promise<Review> => {
    const result = await pool.query(
        `INSERT INTO reviews (item_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [item_id, user_id, rating, comment]
    );
    return result.rows[0];
}

export const getReviewsByItemId = async (item_id: string): Promise<Review[]> => {
    const result = await pool.query(
        `SELECT * FROM reviews WHERE item_id = $1 ORDER BY created_at DESC`,
        [item_id]
    );
    return result.rows;
}

export const checkIfUserBoughtItem = async (user_id: string, file_id: string): Promise<boolean> => {
    const result = await pool.query(
        `SELECT COUNT(*) AS count
        FROM orders o
        INNER JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
            AND oi.file_id = $2
            AND o.status = 'paid'`,
        [user_id, file_id]
    );

    return parseInt(result.rows[0].count, 10) > 0;
}