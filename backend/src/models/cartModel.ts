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
        AND fd.is_active = TRUE
        ORDER BY ci.added_at DESC;`,
        [userId]
    );
    return result.rows;
}

export const addCartItemByUserId = async (userId: string, fileId: string): Promise<CartItem> => {
    // Check if file is active
    const fileCheck = await pool.query(
        `SELECT is_active FROM files_details WHERE id = $1`,
        [fileId]
    );

    if (fileCheck.rowCount === 0 || !fileCheck.rows[0].is_active) {
        throw new Error("Cannot add this item. It is no longer available.");
    }

    const result = await pool.query(
        `INSERT INTO cart_items (user_id, file_id, added_at)
        VALUES ($1, $2, now())
        RETURNING *`,
        [userId, fileId]
    );
    
    return result.rows[0];
}

export const deleteCartItemByUserId = async (userId: string, fileId: string): Promise<void> => {
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

    let cartData: CartItem[] = typeof result.rows[0].cart_data === "string"
        ? JSON.parse(result.rows[0].cart_data)
        : result.rows[0].cart_data;

    // Fetch active status of items from database
    const activeItemsResult = await pool.query(
        `SELECT id FROM files_details WHERE is_active = TRUE AND id = ANY($1)`,
        [cartData.map(item => item.file_id)]
    );

    const activeFileIds = new Set(activeItemsResult.rows.map(row => row.id));

    // Filter out deactivated items
    cartData = cartData.filter(item => activeFileIds.has(item.file_id));

    return cartData;
}