import { useState } from "react";
import { Card, CardMedia, IconButton, Box } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Item } from "../../types";
import WishlistButton from "../WishlistButton";

interface ImageCarouselProps {
    images: string[];
    item?: Item;
}

function ItemImageCarousel({ images, item }: ImageCarouselProps) {
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
            {/* Carousel Container */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
                {/* Left Navigation Arrow */}
                <IconButton onClick={handlePrevImage} sx={{ mr: 2 }}>
                    <ArrowBackIos />
                </IconButton>

                {/* Image Card */}
                <Card sx={{ position: "relative", overflow: "visible" }}>
                    <CardMedia
                        component="img"
                        height="400"
                        image={images[currentImage]}
                        alt="Product Image"
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Wishlist Button Overlay */}
                    {item && (
                        <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                            <WishlistButton item={item} />
                        </Box>
                    )}
                </Card>

                {/* Right Navigation Arrow */}
                <IconButton onClick={handleNextImage} sx={{ ml: 2 }}>
                    <ArrowForwardIos />
                </IconButton>
            </Box>

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