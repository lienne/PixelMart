export interface Item {
    id: number;
    title: string;
    description: string;
    price: string;
    currency?: number;
    category?: string;
    showcase_img_urls: string[];
    uploader_username: string;
    is_active: boolean;
}