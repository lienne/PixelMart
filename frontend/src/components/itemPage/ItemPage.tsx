import { useParams } from "react-router-dom";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import { useSingleItemFetch } from "../../hooks/useSingleItemFetch";
import ItemDetails from "./ItemDetails";
import ItemImageCarousel from "./ItemImageCarousel";

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const { item, loading, error } = useSingleItemFetch(itemId);

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

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Grid container spacing={4}>
                {/* Left side: Image Carousel */}
                <Grid item xs={12} md={6}>
                    <ItemImageCarousel images={item.showcase_img_urls} item={item} />
                </Grid>

                {/* Right side: item Details */}
                <Grid item xs={12} md={6}>
                    <ItemDetails item={item} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ItemPage;