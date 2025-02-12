export interface Item {
    id: number;
    title: string;
    description: string;
    price: string;
    currency?: number;
    category?: string;
    showcase_img_urls: string[];
}