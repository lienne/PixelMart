import pool from "../database";

export const createReport = async (
    reporterId: string,
    reportedUserId: string,
    reportedListingId?: string,
    reportedReviewId?: string,
    reason?: string
) => {
    const result = await pool.query(
        `INSERT INTO reports (reporter_id, reported_user_id, reported_listing_id, reported_review_id, reason)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [reporterId, reportedUserId, reportedListingId || null, reportedReviewId || null, reason]
    );
    return result.rows[0];
}

export const getAllReportsFromDatabase = async () => {
    const result = await pool.query(
        `SELECT r.id,
                r.reason,
                r.status,
                r.created_at,
                reporter.username AS reporter_username,
                reported_user.username AS reported_username,
                r.reported_listing_id,
                r.reported_review_id,
                listings.title AS reported_listing_title,
                reviews.listing_id AS listing_id_for_review,
                reviews.comment AS reported_review_content
        FROM reports r
        JOIN users AS reporter ON r.reporter_id = reporter.id
        JOIN users AS reported_user ON r.reported_user_id = reported_user.id
        LEFT JOIN files_details AS listings ON r.reported_listing_id = listings.id
        LEFT JOIN reviews ON r.reported_review_id = reviews.id
        LEFT JOIN files_details AS review_listing ON reviews.listing_id = review_listing.id
        ORDER BY r.created_at DESC`
    );
    return result.rows;
}

export const dismissReportById = async (reportId: string) => {
    const result = await pool.query(
        `UPDATE reports
        SET status = 'dismissed'
        WHERE id = $1
        RETURNING *`,
        [reportId]
    );
    return result.rows[0];
}