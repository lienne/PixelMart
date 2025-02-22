import pool from "../database";
import { FileDetails } from "./fileModel";

// Global search function
export const searchListingsGlobal = async (query: string, page = 1, limit = 20): Promise<FileDetails[]> => {
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    const offset = (page - 1) * limit;
    const tsQuery = `plainto_tsquery('english', $1)`;

    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.category, fd.created_at, fd.showcase_img_urls,
            u.username AS uploader_username,
            ts_rank(fd.search_vector, ${tsQuery}) AS rank
        FROM files_details fd
        JOIN users u ON fd.user_id = u.id
        WHERE fd.is_active = TRUE
        AND fd.search_vector @@ ${tsQuery}
        ORDER BY rank DESC
        LIMIT $2 OFFSET $3`,
        [sanitizedQuery, limit, offset]
    );
    return result.rows;
}

// Seller specific search function
export const searchListingsBySeller = async (sellerId: string, query: string, page = 1, limit = 20): Promise<FileDetails[]> => {
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    const offset = (page - 1) * limit;
    const tsQuery = `plainto_tsquery('english', $2)`;

    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.category, fd.created_at, fd.showcase_img_urls,
            u.username AS uploader_username,
            ts_rank(fd.search_vector, ${tsQuery}) AS rank
        FROM files_details fd
        JOIN users u ON fd.user_id = u.id
        WHERE fd.user_id = $1
        AND fd.is_active = TRUE
        AND fd.search_vector @@ ${tsQuery}
        ORDER BY rank DESC
        LIMIT $3 OFFSET $4`,
        [sellerId, sanitizedQuery, limit, offset]
    );
    return result.rows;
}