import pool from "../database";

export interface Order {
    id: string; // UUID
    user_id: string; // UUID of the buyer
    stripe_session_id: string;
    total_amount: number;
    status: string;
    created_at: Date;
    items?: OrderItem[]; // Include for convenience when fetching
}

export interface OrderItem {
    id: string; // UUID
    order_id: string; // UUID referencing the order
    file_id: string; // UUID referencing files_details
    file_key: string;
    title: string;
    price: number;
    seller_id: string; // UUID of the seller
    created_at: Date;
}

export const createOrder = async (
    user_id: string,
    stripe_session_id: string,
    total_amount: number,
    status: string = "paid"
): Promise<Order> => {
    const result = await pool.query(
        `INSERT INTO orders (user_id, stripe_session_id, total_amount, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user_id, stripe_session_id, total_amount, status]
    );
    return result.rows[0];
}

export const createOrderItem = async (
    order_id: string,
    file_id: string,
    file_key: string,
    title: string,
    price: number,
    seller_id: string
): Promise<OrderItem> => {
    const result = await pool.query(
        `INSERT INTO order_items (order_id, file_id, file_key, title, price, seller_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [order_id, file_id, file_key, title, price, seller_id]
    );
    return result.rows[0];
}

export const getOrderDetailsById = async (orderId: string): Promise<Order> => {
    const orderResult = await pool.query(
        `SELECT * FROM orders WHERE id = $1`,
        [orderId]
    );
    if (orderResult.rowCount === 0) {
        throw new Error("Order not found.");
    }

    const order: Order = orderResult.rows[0];

    const itemsResult = await pool.query(
        `SELECT oi.id, oi.file_id, oi.file_key, oi.title, oi.price,
                u.id AS seller_id, u.name AS seller_name,
                (SELECT si.image_url FROM showcase_imgs_metadata si WHERE si.file_id = oi.file_id LIMIT 1) AS "previewImage"
        FROM order_items oi
        LEFT JOIN users u ON oi.seller_id = u.id
        WHERE oi.order_id = $1`,
        [orderId]
    );

    order.items = itemsResult.rows;
    
    return order;
}

export const getOrderBySessionId = async (sessionId: string): Promise<Order> => {
    const result = await pool.query(
        `SELECT * FROM orders WHERE stripe_session_id = $1`,
        [sessionId]
    );
    if (result.rowCount === 0) {
        throw new Error("Order not found.");
    }
    const order: Order = result.rows[0];
    const itemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
    );
    order.items = itemsResult.rows;
    return order;
}

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    const result = await pool.query(
        `SELECT o.id, o.total_amount, o.status, o.created_at,
            COALESCE(json_agg(
                CASE WHEN oi.id IS NOT NULL THEN json_build_object(
                    'id', oi.id,
                    'order_id', oi.order_id,
                    'file_id', oi.file_id,
                    'file_key', oi.file_key,
                    'title', oi.title,
                    'price', oi.price,
                    'seller_id', oi.seller_id,
                    'seller_name', u.name,
                    'previewImage', (SELECT si.image_url FROM showcase_imgs_metadata si WHERE si.file_id = oi.file_id LIMIT 1),
                    'created_at', oi.created_at
                ) ELSE NULL END
            ) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN users u ON oi.seller_id = u.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [userId]
    );
    return result.rows.map((order) => ({
        ...order,
        items: order.items ?? [], // Ensure items is always an array
    }));
}

export const hasUserPurchasedItem = async (userId: string, fileId: string): Promise<boolean> => {
    const result = await pool.query(
        `SELECT 1 FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = $1 AND oi.file_id = $2
        LIMIT 1`,
        [userId, fileId]
    );
    return (result.rowCount ?? 0) > 0;
}