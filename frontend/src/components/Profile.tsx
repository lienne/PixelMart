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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import FlagIcon from "@mui/icons-material/Flag";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserProfile, UserProfile } from '../api/profile';
import ItemCard from './ItemCard';
import useMultipleItemsFetch from '../hooks/useMultipleItemsFetch';
import { useAuth0 } from '@auth0/auth0-react';
import useReportsFetch from '../hooks/useReportsFetch';
import { toast } from 'react-toastify';

function Profile() {
  const { identifier } = useParams<{ identifier: string}>();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [ profileData, setProfileData ] = useState<UserProfile | null>(null);
  const { products, isLoading, error } = useMultipleItemsFetch(identifier || "");
  const [searchQuery, setSearchQuery] = useState("");
  const { report } = useReportsFetch();
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (identifier) {
      if (isAuthenticated && user && user.sub === identifier) {
        // Logged in user viewing their own profile: get all information
        getAccessTokenSilently()
          .then((token) => fetchUserProfile(identifier, token))
          .then((data) => setProfileData(data))
          .catch((err) => console.error('Error fetching profile: ', err));
      } else {
        // Public profile fetch: hide sensitive information
        fetchUserProfile(identifier)
          .then((data) => {console.log(data); setProfileData(data);})
          .catch((err) => console.error('Error fetching public profile: ', err));
      }
    }
  }, [identifier, isAuthenticated, user, getAccessTokenSilently]);

  const handleReportUser = () => {
    setOpenReportDialog(true);
  }

  const handleSubmitReport = async () => {
      if (!profileData || !profileData.username) {
        toast.error("Invalid user profile. Cannot report.", {
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      if (!reportReason.trim()) {
          toast.info("Please enter a reason for reporting.", {
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          return;
      }

      await report({
        reportedUsername: profileData?.username,
        reason: reportReason
      });
      setOpenReportDialog(false);
      setReportReason("");
  }

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
            position: 'relative',
          }}
        >
          {/* Report Button */}
          {user?.sub !== profileData.id && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton size="small" color="error" onClick={handleReportUser}>
                    <FlagIcon fontSize="small" />
                </IconButton>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profileData.avatar}
              alt={profileData.name}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Product Listings - Filter Products based on search query */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 ? (
                products.filter(item =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <ItemCard item={item} />
                  </Grid>
                ))
              ) : (
                !error && (
                  <Typography sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
                    No matching items found.
                  </Typography>
                )
              )}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Report Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
          <DialogTitle>Report User</DialogTitle>
          <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Reason for Reporting"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenReportDialog(false)} color="primary">
                  Cancel
              </Button>
              <Button onClick={handleSubmitReport} color="error">
                  Submit Report
              </Button>
          </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;
