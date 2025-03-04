export interface Report {
    id: string;
    reporter_id: string;
    reporter_username: string;
    reported_user_id: string;
    reported_username: string;
    reported_listing_id?: string;
    reported_listing_title?: string;
    reported_review_id?: string;
    reported_review_content?: string;
    listing_id_for_review?: string;
    reason: string;
    status: string;
    created_at: Date;
}