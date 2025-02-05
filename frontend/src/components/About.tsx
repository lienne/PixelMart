import { Container, Box, Typography, Link } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box component="header" sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          About PixelMart
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> What is this website all about?
        </Typography>
        <Typography variant="body1" paragraph>
          PixelMart is a place for buying and selling digital content. This can range anywhere from PDFs, videos, and learning content, to crochet patterns, art, and anything in between!
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> How do I sell my content here?
        </Typography>
        <Typography variant="body1" paragraph>
          Selling your content on PixelMart is easy! Simply upload your files in your dashboard and they'll appear in your profile. Payments are processed securely via a payment processing service for your convenience.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> Does it cost anything to sell on PixelMart?
        </Typography>
        <Typography variant="body1" paragraph>
          For the time being, PixelMart is free to use, but donations are highly encouraged! I developed this website by myself and it took a lot of time and effort. In the future, if PixelMart becomes more popular and the running costs increase, I might implement a service fee or something similar. But nothing will be done without proper notice.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> What is the refund policy for digital items bought on PixelMart?
        </Typography>
        <Typography variant="body1" paragraph>
          Each refund policy is individual to each seller. Please contact the seller directly to inquire about refunds. Keep in mind that, since digital products can be downloaded immediately after payment, most sellers will have a no-refunds policy.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> Can I sell NSFW content on PixelMart?
        </Typography>
        <Typography variant="body1" paragraph>
          PixelMart currently does not allow any NSFW content to be sold here. Please keep your content SFW!
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> Is my personal information secure on this website?
        </Typography>
        <Typography variant="body1" paragraph>
          Yes, I take your privacy and security very seriously. Please refer to our privacy policy for more information.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          <b>Q:</b> Who are you?
        </Typography>
        <Typography variant="body1" paragraph>
          My name is Liana and I am a software developer. You can check out my{' '}
          <Link href="https://github.com/lienne" target="_blank" rel="noopener">
            Github
          </Link>{' '}
          here, and my{' '}
          <Link href="https://lienne.github.io/" target="_blank" rel="noopener">
            personal website
          </Link>{' '}
          here. You can also{' '}
          <Link href="#" target="_blank" rel="noopener">
            donate
          </Link>{' '}
          here!
        </Typography>
      </Box>
    </Container>
  );
}

export default About;