import { useContext, useState } from "react";
import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Container, IconButton, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth0 } from "@auth0/auth0-react";
import { ProfileContext } from "../../context/ProfileContext";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../ItemCard";
import useMultipleItemsFetch from "../../hooks/useMultipleItemsFetch";

function Overview() {
    const { user } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const { products, isLoading, error } = useMultipleItemsFetch();
    const [currentPopularIndex, setCurrentPopularIndex] = useState(0);

    const popularItems = products.slice(0, 5);

    // Mock data for recent orders
    const recentOrders = [
        { id: 1, title: 'Order #1', date: '2023-01-01', amount: '$9.99' },
        { id: 2, title: 'Order #2', date: '2023-01-05', amount: '$14.99' },
        { id: 3, title: 'Order #3', date: '2023-01-10', amount: '$4.99' },
    ];

    const handlePrev = () => {
        setCurrentPopularIndex((prev) =>
            prev === 0 ? popularItems.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentPopularIndex((prev) =>
            prev === popularItems.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'stretch' }}>
            {/* Left Column: Profile Card and Most Popular Items Card */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Profile Card */}
              <Card sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar
                  src={profile?.avatar || user?.picture || 'https://i.pinimg.com/736x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg'}
                  alt={profile?.name || user?.name || 'User Avatar'}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5">
                    {profile?.name || user?.name || 'Your Name'}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/dashboard/settings"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    Settings
                  </Button>
                </CardContent>
              </Card>
              
              {/* Most Popular Items Card */}
              <Card sx={{ flex: '1 1 auto', position: 'relative' }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ m: 2 }}>
                    Error loading popular items. Please try again later.
                  </Alert>
                ) : popularItems.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={popularItems[currentPopularIndex].id}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ width: "100%" }}
                    >
                      <ItemCard item={popularItems[currentPopularIndex]} noShadow={true} />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <Typography sx={{ p: 3 }}>No popular items available.</Typography>
                )}

                {/* Navigation Arrows */}
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    zIndex: 1,
                  }}
                >
                  <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    zIndex: 1,
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>

                <Box sx={{ textAlign: 'right', p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/"
                    variant="text"
                    color="primary"
                  >
                    See all
                  </Button>
                </Box>
              </Card>
            </Box>
    
            {/* Right Column: Recent Orders Card */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Recent Orders
                </Typography>
                <Box>
                  {recentOrders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <Typography variant="body1">{order.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.date}
                      </Typography>
                      <Typography variant="body1">{order.amount}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ textAlign: 'right', p: 2 }}>
                <Button
                  component={RouterLink}
                  to="/dashboard/orders"
                  variant="text"
                  color="primary"
                >
                  See all
                </Button>
              </Box>
            </Card>
          </Box>
        </Container>
      );
}

export default Overview;