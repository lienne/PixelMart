import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Button, Grid, Box, IconButton } from "@mui/material";
import useLocalStorageState from 'use-local-storage-state';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const API_URL = "https://dummyjson.com/products";

export interface Item {
    id: number;
    title: string;
    description: string;
    price: string;
    images: string[];
}

export interface CartProps {
    [productId: string]: Item;
}

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [cart, setCart] = useLocalStorageState<CartProps>('cart', {});

    useEffect(() => {
        if (itemId) {
            fetchItemDetails(itemId);
        }
    }, [itemId]);

    async function fetchItemDetails(id: string) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            setItem(data);
        } catch (err) {
            console.error("Error fetching item:", err);
        }
    }

    // Handle adding to cart
    const addToCart = () => {
        if (item) {
            setCart((prevCart) => ({
                ...prevCart,
                [item.id]: { ...item },
            }));
        }
    };

    // Image carousel navigation
    const handleNextImage = () => {
        if (item) {
            setCurrentImage((prev) => (prev + 1) % item.images.length);
        }
    };

    const handlePrevImage = () => {
        if (item) {
            setCurrentImage((prev) => (prev - 1 + item.images.length) % item.images.length);
        }
    }

    if (!item) {
        return (
            <Container sx={{ py: 4, pt: 14 }}>
                <Typography>Loading item details...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Grid container spacing={4}>
                {/* Left side: Image Carousel */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="400"
                          image={item.images[currentImage]}
                          alt={item.title}
                          sx={{ objectFit: 'cover' }}
                        />

                        {/* Navigation Arrows */}
                        <IconButton
                          onClick={handlePrevImage}
                          sx={{ position: "absolute", top: "50%", left: 10, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
                        >
                            <ArrowBackIos />
                        </IconButton>
                        <IconButton
                          onClick={handleNextImage}
                          sx={{ position: "absolute", top: "50%", right: 10, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    </Card>

                    {/* Image Thumbnails */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        {item.images.map((img, index) => (
                            <CardMedia
                              key={index}
                              component="img"
                              src={img}
                              alt={`Thumbnail ${index}`}
                              sx={{
                                width: 70,
                                height: 70,
                                objectFit: "cover",
                                cursor: "pointer",
                                border: currentImage === index ? "2px solid black" : "none",
                                mx: 1,
                                borderRadius: "5px"
                              }}
                              onClick={() => setCurrentImage(index)}
                            />
                        ))}
                    </Box>
                </Grid>

                {/* Right side: item Details */}
                <Grid item xs={12} md={6}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {item.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {item.description}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                            ${item.price}
                        </Typography>

                        {/* Add to Cart Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={addToCart}
                          disabled={(cart ?? {})[item.id] !== undefined}
                        >
                            {(cart ?? {})[item.id] ? "In Cart" : "Add to Cart"}
                        </Button>
                    </CardContent>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ItemPage;