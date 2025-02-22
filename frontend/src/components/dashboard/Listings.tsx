import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '../../context/ProfileContext';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Item } from '../../types';

function Listings() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const stripeOauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${import.meta.env.VITE_STRIPE_REDIRECT_URI}&state=${encodeURIComponent(user?.sub || '')}`;

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedListing, setSelectedListing] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchListings = async () => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently();
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

    const handleDeactivateListing = async (listing: Item) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/${listing.id}/deactivate`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to deactivate listing.");
            }

            setListings((prev) =>
                prev.map((item) =>
                    item.id === listing.id ? { ...item, is_active: false } : item
                )
            );

            toast.success(`${listing.title} has been deactivated.`, {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            console.error("Error deactivating listing: ", err);
            toast.error("An error occurred while deactivating the list.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    }

    const handleReactivateListing = async (listing: Item) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/${listing.id}/reactivate`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to reactivate listing.");
            }

            setListings((prev) => prev.map((item) =>
                item.id === listing.id ? { ...item, is_active: true } : item
            ));

            toast.success(`${listing.title} has been reactivated.`, {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            console.error("Error reactivating listing: ", err);
            toast.error("An error occurred while reactivating the list.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    }

    const handleDeleteListing = async () => {
        if (!selectedListing) return;

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/${selectedListing.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete listing.");
            }

            setListings((prevListings) => prevListings.filter((item) => item.id !== selectedListing.id));

            toast.success("Listing deleted successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            console.error("Error deleting listing:", err);
            toast.error("An error occurred while deleting the listing.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } finally {
            setOpenDialog(false);
            setSelectedListing(null);
        }
    };

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
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

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

            {/* Listings Grid */}
            <Grid container spacing={3}>
                {listings.map((listing) => (
                    <Grid item xs={12} sm={6} md={4} key={listing.id}>
                        <Card>
                            <CardMedia
                              component="img"
                              height="140"
                              image={listing.showcase_img_urls && listing.showcase_img_urls.length > 0 ? listing.showcase_img_urls[0] : 'https://placehold.co/600x400?text=No+Image+Here'}
                              alt={listing.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{listing.title.length > 30 ? listing.title.slice(0, 30) + "..." : listing.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {listing.description.length > 100 ? listing.description.slice(0, 50) + "..." : listing.description}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 1 }}>${listing.price}</Typography>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-between" }}>
                                <Button size="small" component={RouterLink} to={`/listing/${listing.id}`} color="primary">View</Button>
                                <Button size="small" component={RouterLink} to={`/dashboard/edit-item/${listing.id}`} color="secondary">Edit</Button>
                                {/* <Button size="small" color="secondary" onClick={() => { setSelectedListing(listing); setOpenDialog(true); }}>Delete</Button> */}
                                {listing.is_active ? (
                                    <Button size="small" color="secondary" onClick={() => { setSelectedListing(listing); setOpenDialog(true); }}>Deactivate</Button>
                                ) : (
                                    <Button size="small" color="secondary" onClick={() => handleReactivateListing(listing)}>Reactivate</Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to deactivate this listing? This action will remove the product from users' carts and wishlists.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    {/* <Button onClick={handleDeleteListing} color="error">Delete</Button> */}
                    <Button
                      onClick={() => {
                        if (selectedListing) handleDeactivateListing(selectedListing);
                        setOpenDialog(false);
                      }}
                      color="error"
                    >
                        Deactivate
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Listings;