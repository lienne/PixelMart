import { Container, Box, Typography, TextField, Grid } from '@mui/material';
import ItemCard from './ItemCard';
import Products from './Products';

function Home() {

  const popularItems = [
    {
      id: 1,
      title: "Digital E-Book on Crochet Patterns",
      price: "$9.99",
      image: "https://i.etsystatic.com/48975160/r/il/39a732/6163941225/il_570xN.6163941225_jszk.jpg",
    },
    {
      id: 2,
      title: "Video Tutorial: Knitting Basics",
      price: "$14.99",
      image: "https://i.ytimg.com/vi/hM5M2Fu0RtY/sddefault.jpg",
    },
    {
      id: 3,
      title: "Printable Planner",
      price: "$4.99",
      image: "https://worldofprintables.com/wp-content/uploads/2024/11/2025-planner-1024x576.jpg",
    },
    {
      id: 4,
      title: "Digital Art Pack",
      price: "$19.99",
      image: "https://public-files.gumroad.com/q8nhb95lvfoawg4i0kf2u2ij91kh",
    },
    {
      id: 5,
      title: "Online Course: Advanced Crochet",
      price: "$29.99",
      image: "https://www.thesprucecrafts.com/thmb/PP9UpF9Vl1082X1KjmIZG-09D9o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/highteafloralblockcrochetpattern-0552bb8710ce4afbadf121cd6de04a71.jpg",
    },
    {
      id: 6,
      title: "Photography eBook",
      price: "$12.99",
      image: "https://ianmiddletonphotography.com/wp-content/uploads/2020/07/Cover-website.jpg",
    },
  ];
  
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
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to PixelMart!
        </Typography>
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
        {/* <Grid container spacing={3}>
          {popularItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid> */}
        <Products />
      </Box>
    </Container>
  );
}

export default Home;
