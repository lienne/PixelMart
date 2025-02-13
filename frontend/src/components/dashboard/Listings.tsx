import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '../../context/ProfileContext';

function Listings() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const stripeOauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${import.meta.env.VITE_STRIPE_REDIRECT_URI}&state=${encodeURIComponent(user?.sub || '')}`;

    console.log(import.meta.env.VITE_STRIPE_REDIRECT_URI);

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently();
                console.log("access token: ", token);
                const response = await fetch(`${API_BASE_URL}/files/user/${user.sub}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch listings.");
                }
                
                const data = await response.json();
                setListings(data.files);
            } catch (err: any) {
                setError(err.message || "Error fetching listings.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [user, getAccessTokenSilently, API_BASE_URL]);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h5">Loading your listings...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Container>
        );
    }

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
                {profile?.is_seller ? "You don't have any listings yet..." : "Become a seller to start listing your products!"}
                </Typography>
                {profile?.is_seller ? (
                    <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/dashboard/upload"
                  >
                      List Something
                  </Button>
                ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component="a"
                      href={stripeOauthUrl}
                    >
                        Become a Seller
                    </Button>
                )}
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h4" gutterBottom>
                    My Listings
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/dashboard/upload"
                >
                    Add a Listing
                </Button>
            </Box>
            {/* Map to render listings */}
            <Grid container spacing={3}>
                {listings.map((listing) => (
                    <Grid item xs={12} sm={6} md={4} key={listing.id}>
                        <Card>
                            <CardMedia
                              component="img"
                              height="140"
                              image={listing.showcase_img_urls && listing.showcase_img_urls.length > 0 ? listing.showcase_img_urls[0] : 'fallback-image-url.jpg'}
                              alt={listing.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{listing.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {listing.description.length > 100 ? listing.description.slice(0, 100) + "..." : listing.description}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 1 }}>${listing.price}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={RouterLink} to={`/item/${listing.id}`} color="primary">View</Button>
                                <Button size="small" color="secondary">Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Listings;