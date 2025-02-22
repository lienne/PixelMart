import pool from "../database";
import { FileDetails } from "./fileModel";

// Global search function
export const searchListingsGlobal = async (query: string, page = 1, limit = 20): Promise<FileDetails[]> => {
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.category, fd.created_at, fd.showcase_img_urls,
            u.username AS uploader_username
        FROM files_details fd
        JOIN users u ON fd.user_id = u.id
        WHERE fd.is_active = TRUE
        AND (fd.title ILIKE $1 OR fd.description ILIKE $1 OR fd.category ILIKE $1)
        ORDER BY fd.created_at DESC
        LIMIT $2 OFFSET $3`,
        [`%${sanitizedQuery}%`, limit, offset] // case insensitive search
    );
    return result.rows;
}

// Seller specific search function
export const searchListingsBySeller = async (sellerId: string, query: string, page = 1, limit = 20): Promise<FileDetails[]> => {
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.category, fd.created_at, fd.showcase_img_urls,
        FROM files_details fd
        WHERE fd.user_id = $1
        AND fd.is_active = TRUE
        AND (fd.title ILIKE $2 OR fd.description ILIKE $2 OR fd.category ILIKE $2)
        ORDER BY fd.created_at DESC
        LIMIT $2 OFFSET $3`,
        [sellerId, `%${sanitizedQuery}%`, limit, offset]
    );
    return result.rows;
}