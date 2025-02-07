import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent } from "@mui/material";

export interface Item {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
}

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                const dummyItem: Item = {
                    id: Number(itemId),
                    title: 'Sample Item Title',
                    description: 'Detailed description of item.',
                    price: '$19.99',
                    image: ''
                };
                setItem(dummyItem);
            };

            fetchItem();
        }
    }, [itemId]);

    if (!item) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Loading item details...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {item.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {item.price}
                    </Typography>
                    <Typography variant="body1">
                        {item.description}
                    </Typography>
                </CardContent>
            </Card>
            {/* Additional actions go here, like Buy Now, Add to Card, etc */}
        </Container>
    );
};

export default ItemPage;