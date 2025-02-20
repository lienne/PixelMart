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
    const orderResult = await pool.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
    if (orderResult.rowCount === 0) {
        throw new Error("Order not found.");
    }

    const order: Order = orderResult.rows[0];
    const itemsResult = await pool.query(`SELECT * FROM order_items WHERE order_id = $1`, [orderId]);
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