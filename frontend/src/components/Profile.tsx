import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchUserProfile, UserProfile } from '../api/profile';
import { ProfileContext } from '../context/ProfileContext';
import ItemCard from './ItemCard';
import useMultipleItemsFetch from '../hooks/useMultipleItemsFetch';

function Profile() {
  const { identifier } = useParams<{ identifier: string}>();
  const { profile } = useContext(ProfileContext);
  const [ profileData, setProfileData ] = useState<UserProfile | null>(null);
  const { products, isLoading, error } = useMultipleItemsFetch(identifier || "");

  useEffect(() => {
    if (identifier) {
        fetchUserProfile(identifier)
            .then((data) => setProfileData(data))
            .catch((err) => console.error('Error fetching profile: ', err));
    }
  }, [identifier]);

  if (!profileData) {
    return (
      <Container sx={{ py: 4, pt: 14 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 14 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Profile Info */}
        <Box
          sx={{
            flexBasis: { xs: '100%', md: '25%' },
            bgcolor: '#f8f9fa',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profile?.avatar || profileData.avatar}
              alt={profile?.name || profileData.name}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Typography variant="h4">{profileData.name}</Typography>
          </Box>
          <Button variant="contained" color="primary">
            Follow
          </Button>
        </Box>

        {/* Search and Listings */}
        <Box sx={{ flexBasis: { xs: '100%', md: '70%' } }}>
          {/* Search Bar aligned to the right */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 3,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search this shop"
              size="small"
              sx={{ width: { xs: '100%', sm: '50%', md: '33%' } }}
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            Listings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading products. Please try again later.
            </Alert>
          )}

          {/* Product Listings */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
            {products.length > 0 ? (
              products.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard item={item} />
                </Grid>
              ))
            ) : (
              !error && <Typography sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>No items for sale.</Typography>
            )}
          </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;
