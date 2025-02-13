import { Container, Box, Typography, TextField } from '@mui/material';
import Products from './Products';
import { LogoProps } from '../types/logoTypes';

function Home({ brandName, imageSrcPath }: LogoProps) {
  return (
    <Container sx={{ py: 4, pt: 14 }}>
      {/* Header Section */}
      <Box
        component="header"
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Box
                component="img"
                src={brandName}
                alt="PixelMart Logo"
                sx={{ width: 200, height: 'auto', mb: 2 }}
              />
        <Typography variant="subtitle1">
          Your marketplace for digital products.
        </Typography>
      </Box>

      {/* Search Bar Section */}
      <Box
        className="search-container"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 4
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search for products..."
          inputProps={{ 'aria-label': 'Search' }}
          sx={{
            width: { xs: '100%', sm: '50%', md: '33%' },
          }}
        />
      </Box>

      {/* Popular Items Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Popular Items
        </Typography>
        <Products />
      </Box>
    </Container>
  );
}

export default Home;
