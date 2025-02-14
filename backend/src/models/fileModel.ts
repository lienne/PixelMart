import pool from "../database";
import { v4 as uuidv4 } from "uuid";

export interface FileMetadata {
    id: string; // UUID
    user_id: string; // UUID
    file_url: string;
    file_type: string;
    file_size: number;
    uploaded_at: Date;
}

export interface FileDetails {
    id: string; // UUID
    user_id: string; // UUID
    title: string;
    description: string;
    price: number;
    currency: string;
    is_public: boolean;
    category?: string;
    created_at: Date;
}

export interface ShowcaseImage {
    id: string; // UUID
    file_id: string; // UUID
    image_url: string;
    uploaded_at: Date;
}

export const countUserFiles = async (user_id: string): Promise<number> => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM files_details
        WHERE user_id = $1`,
        [user_id]
    );
    return parseInt(result.rows[0].count, 10);
}

export const insertFileMetadata = async (
    user_id: string,
    file_url: string,
    file_type: string,
    file_size: number
): Promise<FileMetadata> => {
    const newFileId = uuidv4(); // Generate UUID for file_metadata.id

    const result = await pool.query(
        `INSERT INTO files_metadata (id, user_id, file_url, file_type, file_size)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [newFileId, user_id, file_url, file_type, file_size]
    );
    return result.rows[0];
}

export const insertFileDetails = async (
    file_id: string, // UUID from files_metadata
    user_id: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    is_public: boolean,
    category: string,
    showcase_img_urls: string[] = []
): Promise<FileDetails> => {
    const result = await pool.query(
        `INSERT INTO files_details (id, user_id, title, description, price, currency, is_public, category, showcase_img_urls)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [file_id, user_id, title, description, price, currency, is_public, category, showcase_img_urls]
    );
    return result.rows[0];
}

export const insertShowcaseImage = async (
    file_id: string,
    image_url: string
): Promise<ShowcaseImage> => {
    const result = await pool.query(
        `INSERT INTO showcase_imgs_metadata (file_id, image_url)
        VALUES ($1, $2)
        RETURNING *`,
        [file_id, image_url]
    );
    return result.rows[0];
}

export const getPopularItems = async (): Promise<FileDetails[]> => {
    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.is_public, fd.category, fd.created_at, fd.showcase_img_urls,
            u.username AS uploader_username
        FROM files_details fd
        JOIN users u ON fd.user_id = u.id
        WHERE fd.is_public = true
        ORDER BY fd.created_at DESC
        LIMIT 100`
    );
    return result.rows;
}

export const getUserFilesByUserId = async (user_id: string): Promise<FileDetails[]> => {
    const result = await pool.query(
        `SELECT * FROM files_details WHERE user_id = $1 ORDER BY created_at DESC`,
        [user_id]
    );
    return result.rows;
}

export const getFileMetadataById = async (id: string): Promise<FileMetadata | null> => {
    const result = await pool.query(
        `SELECT * FROM files_metadata WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const getFileDetailsById = async (id: string): Promise<FileDetails | null> => {
    const result = await pool.query(
        `SELECT fd.id, fd.title, fd.description, fd.price, fd.currency, fd.is_public, fd.category, fd.created_at, fd.showcase_img_urls,
            u.username AS uploader_username     
        FROM files_details fd
        JOIN users u ON fd.user_id = u.id
        WHERE fd.id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const getShowcaseImagesByFileId = async (file_id: string): Promise<ShowcaseImage[]> => {
    const result = await pool.query(
        `SELECT * FROM showcase_imgs_metadata WHERE file_id = $1 ORDER BY uploaded_at ASC`,
        [file_id]
    );
    return result.rows;
}

export const deleteFileMetadata = async (file_id: string): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM files_metadata
        WHERE id = $1
        RETURNING *`,
        [file_id]
    );
    return (result?.rowCount ?? 0) > 0;
}

export const deleteShowcaseImagesMetadata = async (file_id: string): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM showcase_imgs_metadata
        WHERE file_id = $1
        RETURNING *`,
        [file_id]
    );
    return (result?.rowCount ?? 0) > 0;
}

export const deleteFileDetails = async (file_id: string): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM files_details
        WHERE id = $1
        RETURNING *`,
        [file_id]
    );
    return (result?.rowCount ?? 0) > 0;
}