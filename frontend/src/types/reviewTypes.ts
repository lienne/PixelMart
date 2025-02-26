export interface Review {
    id: string;
    item_id: string;
    reviewer: string;
    rating: number;
    comment: string;
    created_at: Date;
    reported: boolean;
}