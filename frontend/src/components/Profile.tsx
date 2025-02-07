import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchUserProfile, UserProfile } from '../api/profile';
import { ProfileContext } from '../context/ProfileContext';

function Profile() {
  const { auth0Id } = useParams<{ auth0Id: string}>();
  const { profile } = useContext(ProfileContext);
  const [ profileData, setProfileData ] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (auth0Id) {
        fetchUserProfile(auth0Id)
            .then((data) => setProfileData(data))
            .catch((err) => console.error('Error fetching profile: ', err));
    }
  }, [auth0Id]);

  if (!profileData) {
    return <Typography>Loading profile...</Typography>;
  }

  // Placeholder items list – fetch these from backend
  const itemsForSale = [
    {
      id: 1,
      title: 'Digital EBook on Crochet Patterns',
      price: '$9.99',
      image: 'https://i.etsystatic.com/48975160/r/il/39a732/6163941225/il_570xN.6163941225_jszk.jpg',
    },
    {
      id: 2,
      title: 'Video Course: Learn Knitting',
      price: '$29.99',
      image: 'https://i.ytimg.com/vi/hM5M2Fu0RtY/sddefault.jpg',
    },
    {
      id: 3,
      title: 'Printable Planner',
      price: '$4.99',
      image: 'https://worldofprintables.com/wp-content/uploads/2024/11/2025-planner-1024x576.jpg',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 14 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Left Panel: Profile Info */}
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

        {/* Right Panel: Search and Listings */}
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
          <Grid container spacing={3}>
            {itemsForSale.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: 300 }}>
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.title}
                    />
                  )}
                  <CardContent
                    sx={{
                        // height: 'calc(100% - 140px)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;
