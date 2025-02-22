import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import ItemCard from "./ItemCard";
import { Item } from "../types";

function SearchResults () {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const { results, loading } = useSearch(query);

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Typography variant="h4">Search Results for "{query}"</Typography>

            {/* Loading Indicator */}
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}

            {/* Show Search Results */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                {results.length > 0 ? (
                    results.map((item: Item) => <ItemCard key={item.id} item={item} />)
                ) : (
                    <Typography>No results found.</Typography>
                )}
            </Box>
        </Container>
    );
}

export default SearchResults;