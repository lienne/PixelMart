import { useParams } from "react-router-dom";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import { useSingleItemFetch } from "../../hooks/useSingleItemFetch";
import ItemDetails from "./ItemDetails";
import ItemImageCarousel from "./ItemImageCarousel";
import ReviewsSection, { Review } from "./ReviewsSection";

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const { item, loading, error } = useSingleItemFetch(itemId);

    // Dummy review data for now
    const dummyReviews: Review[] =[
        {
            id: "1",
            reviewer: "Alice",
            rating: 5,
            comment: "Amazing product!",
            createdAt: "2023-02-01T12:00:00Z",
        },
        {
            id: "2",
            reviewer: "Bob",
            rating: 4,
            comment: "Good value for the price.",
            createdAt: "2023-02-05T15:30:00Z",
        }
    ]

    if (loading) {
        return (
            <Container sx={{ py: 4, pt: 14 }}>
                <Typography>Loading item details...</Typography>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4, pt: 14 }}>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        );
    }

    if (!item) {
        return (
            <Container sx={{ py: 4, pt: 14 }}>
                <Typography>Item not found.</Typography>
            </Container>
        );
    }

    if (!item.is_active) {
        return (
            <Container sx={{ textAlign: 'center', pt: 14 }}>
                <Typography variant="h5" color="error">
                    This listing is no longer available.
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Grid container spacing={4}>
                {/* Left side: Image Carousel */}
                <Grid item xs={12} md={6}>
                    <ItemImageCarousel images={item.showcase_img_urls[0] ? item.showcase_img_urls : ['https://placehold.co/600x400?text=No+Image+Here']} item={item} />
                </Grid>

                {/* Right side: item Details */}
                <Grid item xs={12} md={6}>
                    <ItemDetails item={item} />
                </Grid>
            </Grid>

            {/* Reviews Section */}
            <ReviewsSection reviews={dummyReviews} />
        </Container>
    );
}

export default ItemPage;