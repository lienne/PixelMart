import { Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Listings() {
    const listings: any[] = [];

    if (listings.length === 0) {
        return (
            <Container
              maxWidth="sm"
              sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center'
              }}
            >
                <Typography variant="h5" gutterBottom>
                    You don't have any listings yet...
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/upload"
                >
                    List Something
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Listings
            </Typography>
            {/* Map to render listings */}
        </Container>
    );
}

export default Listings;