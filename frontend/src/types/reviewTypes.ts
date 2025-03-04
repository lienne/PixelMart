export interface Review {
    id: string;
    item_id: string;
    reviewer_id: string;
    reviewer_username: string;
    rating: number;
    comment: string;
    created_at: Date;
    reported: boolean;
}