import { Request, Response } from 'express';

export const getProducts = (req: Request, res: Response) => {
    // Typically fetch products from a database here
    res.json([
        { id: 1, name: 'Digital Ebook' },
        { id: 2, name: 'Online Course' }
    ]);
};