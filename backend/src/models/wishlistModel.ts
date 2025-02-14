import pool from "../database";

export interface WishlistItem {
    user_id: string;
    file_id: string;
    added_at: Date;
}

export const getWishlistItemsByUserId = async (userId: string): Promise<WishlistItem[]> => {
    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.showcase_img_urls, wi.added_at
        FROM wishlist_items wi
        JOIN files_details fd ON wi.file_id = fd.id
        WHERE wi.user_id = $1
        ORDER BY wi.added_at DESC`,
        [userId]
    );
    return result.rows;
}

export const addWishlistItem = async (userId: string, fileId: string): Promise<WishlistItem> => {
    const result = await pool.query(
        `INSERT INTO wishlist_items (user_id, file_id, added_at)
        VALUES ($1, $2, now())
        RETURNING *`,
        [userId, fileId]
    );
    return result.rows[0];
}

export const deleteWishlistItem = async (userId: string, fileId: string): Promise<void> => {
    await pool.query(
        `DELETE FROM wishlist_items WHERE user_id = $1 AND file_id = $2`,
        [userId, fileId]
    );
}