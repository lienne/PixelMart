import { NavLink, Outlet } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const navItems = [
  { label: 'Overview', path: '/dashboard/overview' },
  { label: 'My Orders', path: '/dashboard/orders' },
  { label: 'My Listings', path: '/dashboard/listings' },
  { label: 'Metrics', path: '/dashboard/metrics' },
  { label: 'Inbox', path: '/dashboard/inbox' },
  { label: 'Wishlist', path: '/dashboard/wishlist' },
  { label: 'Settings', path: '/dashboard/settings' },
];

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          width: { xs: '100%', md: 240 },
          bgcolor: 'grey.100',
          p: 2,
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <List>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                // Use sx to style the active link.
                sx={{
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
