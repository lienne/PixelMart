export interface CartItem {
    id: number;
    user_id: string;
    file_id: string;
    added_at: string;
    title: string;
    description: string;
    price: number;
    showcase_img_urls: string[];
    seller_id: string;
}