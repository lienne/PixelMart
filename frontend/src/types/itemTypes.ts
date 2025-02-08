export interface Item {
    id: number;
    title: string;
    description: string;
    price: string;
    images: string[];
    thumbnail?: string;
    quantity?: number;
}