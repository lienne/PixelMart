import { useState } from "react";
import { Card, CardMedia, IconButton, Box } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Item } from "../types";
import WishlistButton from "./WishlistButton";

interface Props {
    images: string[];
    item?: Item;
}

function ItemImageCarousel({ images, item }: Props) {
    const [currentImage, setCurrentImage] = useState(0);

    // Image carousel navigation
    const handleNextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }

    return (
        <>
            <Card sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={images[currentImage]}
                    alt="Product Image"
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
                {/* Wishlist Button Overlay */}
                {item && (
                    <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <WishlistButton item={item} />
                    </Box>
                )}
            </Card>

            {/* Image Thumbnails */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {images.map((img, index) => (
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
        </>
    );
}

export default ItemImageCarousel;