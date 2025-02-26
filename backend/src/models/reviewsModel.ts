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

export const hasUserReviewedItem = async (user_id: string, item_id: string): Promise<boolean> => {
    const result = await pool.query(
        `SELECT COUNT(*) AS count
        FROM reviews
        WHERE user_id = $1 AND item_id = $2`,
        [user_id, item_id]
    );
    return parseInt(result.rows[0].count, 10) > 0;
}

export const getItemRatingsByItemId = async (item_id: string) => {
    const result = await pool.query(
        `SELECT rating, COUNT(*)::INTEGER AS count
        FROM reviews
        WHERE item_id = $1
        GROUP BY rating
        ORDER BY rating DESC`,
        [item_id]
    );

    const breakdown: { [key: string]: number } ={};
    let totalRating = 0;
    let totalCount = 0;

    result.rows.forEach((row) => {
        breakdown[row.rating] = parseInt(row.count, 10);
        totalRating += row.rating * row.count;
        totalCount += row.count;
    });

    // Calculate average rating
    const overallRating = totalCount > 0 ? totalRating / totalCount : 0;

    return { overallRating, breakdown };
}