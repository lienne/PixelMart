import { useParams } from "react-router-dom";
import { Container, Typography, Grid, CircularProgress, Box, Alert } from "@mui/material";
import { useSingleItemFetch } from "../../hooks/useSingleItemFetch";
import ItemDetails from "./ItemDetails";
import ItemImageCarousel from "./ItemImageCarousel";
import ReviewsSection from "./ReviewsSection";
import useReviewsFetch from "../../hooks/useReviewsFetch";

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const { item, loading, error } = useSingleItemFetch(itemId);
    const { reviews, loading: loadingReviews, error: reviewsError } = useReviewsFetch(itemId);

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
            {loadingReviews ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <CircularProgress />
                </Box>
            ) : reviewsError ? (
                <Alert severity="error">{reviewsError}</Alert>
            ) : reviews?.length === 0 ? (
                <Typography>No recent reviews.</Typography>
            ) : (
                <ReviewsSection reviews={reviews} />
            )}
        </Container>
    );
}

export default ItemPage;