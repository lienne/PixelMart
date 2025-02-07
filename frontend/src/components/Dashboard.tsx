import { Outlet } from 'react-router-dom';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from './SideMenu';
import { useState } from 'react';

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', pt: 14 }}>
      <Box sx={{ display: 'flex' }}>
        {/* Mobile Menu Button (only visible on small screens) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: 'none' },
            position: 'absolute',
            top: 70,
            left: 20
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Side menu (Both Mobile & Desktop) */}
        <SideMenu mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isDesktop ? '240px' : 0,
          transition: 'margin 0.3s ease-in-out'
        }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
