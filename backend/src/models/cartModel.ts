import pool from "../database";

export interface CartItem {
    id: number;
    user_id: string;
    file_id: string;
    file_key: string;
    added_at: Date;
    title: string;
    description: string;
    price: number;
    showcase_img_urls: string[];
    seller_id: string;
}

export const getCartItemsByUserId = async (userId: string): Promise<CartItem[]> => {
    const result = await pool.query(
        `SELECT
            ci.file_id AS file_id,
            fd.id AS id,
            fd.title,
            fd.description,
            fd.price,
            fd.showcase_img_urls,
            fd.file_key,
            fd.user_id AS seller_id,
            ci.added_at
        FROM cart_items ci
        JOIN files_details fd ON ci.file_id = fd.id
        WHERE ci.user_id = $1
        ORDER BY ci.added_at DESC;`,
        [userId]
    );
    return result.rows;
}

export const addCartItem = async (userId: string, fileId: string): Promise<CartItem> => {
    const result = await pool.query(
        `INSERT INTO cart_items (user_id, file_id, added_at)
        VALUES ($1, $2, now())
        RETURNING *`,
        [userId, fileId]
    );
    return result.rows[0];
}

export const deleteCartItem = async (userId: string, fileId: string): Promise<void> => {
    await pool.query(
        `DELETE FROM cart_items WHERE user_id = $1 AND file_id = $2`,
        [userId, fileId]
    );
}

export const createCheckoutCart = async (
    user_id: string,
    cartItems: CartItem[]
): Promise<string> => {
    const result = await pool.query(
        `INSERT INTO checkout_carts (user_id, cart_data)
        VALUES ($1, $2)
        RETURNING *`,
        [user_id, JSON.stringify(cartItems)]
    );
    return result.rows[0].id;
}

export const getCheckoutCart = async (cartId: string): Promise<CartItem[]> => {
    const result = await pool.query(
        `SELECT cart_data FROM checkout_carts WHERE id = $1`,
        [cartId]
    );
    if (result.rowCount === 0) {
        throw new Error("Cart snapshot not found.");
    }
    const cartData = result.rows[0].cart_data;
    return typeof cartData === "string" ? JSON.parse(cartData) : cartData;
}