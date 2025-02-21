export interface OrderItem {
    id: string;
    file_id: string;
    title: string;
    downloadLink: string;
    price: number;
    seller_id: string;
    seller_name: string;
    previewImage: string;
    created_at: string;
}

export interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}