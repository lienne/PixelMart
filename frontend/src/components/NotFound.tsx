import { Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NotFound() {
    return (
        <Container sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button component={RouterLink} to="/" variant="contained" color="primary">
                Go Home
            </Button>
        </Container>
    );
}

export default NotFound;