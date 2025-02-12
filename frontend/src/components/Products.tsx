import { Alert, Box, CircularProgress, Grid } from "@mui/material";
import ItemCard from "./ItemCard";
import usePopularItemsFetch from "../hooks/usePopularItemsFetch";

function Products () {
    const { popularItems, isLoading, error } = usePopularItemsFetch();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">An error occurred when fetching data. Please check the API and try again.</Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Product Grid */}
            <Grid container spacing={3}>
                {popularItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <ItemCard item={item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Products;