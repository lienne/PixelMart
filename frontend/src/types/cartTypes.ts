import { Item } from "./itemTypes";

export interface CartProps {
    [productId: string]: Item;
}