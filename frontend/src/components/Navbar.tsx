import React, { useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  TextField,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';

interface NavbarProps {
  brandName: string;
  imageSrcPath: string;
}

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: "Browse", to: "/" },
  { label: "About", to: "/about" },
];

function Navbar({ brandName, imageSrcPath }: NavbarProps) {
//   const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // breakpoint for small screens

  // State for handling the avatar dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAvatar = Boolean(anchorEl);

  // State for handling mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { profile } = useContext(ProfileContext);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleMenuClose();
  };

  // Toggle mobile drawer
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    // Ignore tab or shift key presses for accessibility
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
        return;
    }
    setDrawerOpen(open);
  };

  // Mobile navigation list for Drawer
  const drawerList = (
    <Box
      sx={{ width: 250}}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
        <List>
            {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                    <ListItemButton component={RouterLink} to={item.to}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: 'black' }}>
      <Toolbar>
        {/* Mobile: Hamburger Icon */}
        {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
        )}

        {/* Logo and Brand */}
        <Button
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ textTransform: 'none', padding: 0, marginRight: 2 }}
        >
          <Avatar
            src={imageSrcPath}
            alt={brandName}
            sx={{ width: 60, height: 60, marginRight: 1 }}
            variant="square"
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {brandName}
          </Typography>
        </Button>

        {/* Desktop: Navigation Buttons */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.to}
                color="inherit"
                sx={{ textTransform: 'none', marginRight: 2 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right side: Search bar */}
        {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                sx={{
                    width: { xs: '150px', sm: '200px', md: '250px' },
                    marginRight: 2,
                }}
                inputProps={{ 'aria-label': 'search' }}
                />
            </Box>
        )}

        {/* Right side: Cart Button */}
        <Button
          component={RouterLink}
          to="/cart"
          color="inherit"
          sx={{ textTransform: 'none', marginRight: 2 }}
        >
          Cart
        </Button>

        {/* Right side: Authenticated vs. Login */}
        {isAuthenticated ? (
          <>
            <IconButton onClick={handleAvatarClick} color="inherit">
              <Avatar
                src={profile?.avatar || user?.picture || "https://i.pinimg.com/736x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg"}
                alt={profile?.name || user?.name || "User Avatar"}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openAvatar}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem component={RouterLink} to="/dashboard/overview" onClick={handleMenuClose}>
                Dashboard
              </MenuItem>
              <MenuItem component={RouterLink} to={`/profile/${user?.sub}`} onClick={handleMenuClose}>
                My Profile
              </MenuItem>
              <MenuItem component={RouterLink} to={"/dashboard/settings"} onClick={handleMenuClose}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
            <>
                <Button
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                    onClick={() => loginWithRedirect()}
                >
                    Login
                </Button>
                <Button
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                    onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
                >
                    Sign Up
                </Button>
            </>
        )}

        {/* Mobile: Show navigation in Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerList}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
