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
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
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
  const { profile } = useContext(ProfileContext);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // breakpoint for small screens

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const openAvatar = Boolean(profileAnchorEl);
  const openCart = Boolean(cartAnchorEl);
  const openMobileMenu = Boolean(mobileAnchorEl);

  const handleAvatarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleCartMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  }
  
  const handleCartMenuClose = () => {
    setCartAnchorEl(null);
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  }

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleAvatarMenuClose();
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={openMobileMenu}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={RouterLink} to="/" onClick={handleMobileMenuClose}>
        <p>Browse</p>
      </MenuItem>
      <MenuItem component={RouterLink} to="/about" onClick={handleMobileMenuClose}>
        <p>About</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: 'black' }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: { xs: 'flex', md: 'none '} }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>

          {/* Left side: Logo and Brand */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
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
          </Box>

          {/* Center: Search bar */}
          {!isMobile && (
              <Box sx={{ flexGrow: 2, display: 'flex' }}>
                  <TextField
                  variant="outlined"
                  placeholder="Search"
                  size="small"
                  sx={{
                      width: { xs: '650px', sm: '700px', md: '750px' },
                      marginRight: 2,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  />
              </Box>
          )}

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {/* Right side: Cart Button */}
            <IconButton
              onClick={handleCartMenuOpen}
              color="inherit"
              sx={{
                marginRight: 2,
                width: 40,
                height: 40,
                alignSelf: 'center'
              }}
            >
              <ShoppingCartRoundedIcon />
            </IconButton>
            <Menu
              anchorEl={cartAnchorEl}
              open={openCart}
              onClose={handleCartMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ mt: 1 }}
            >
              <Box
                sx={{
                  padding: 2,
                  minWidth: 200
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                  Cart
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Your cart is empty.
                </Typography>
              </Box>
            </Menu>

            {/* Right side: Authenticated vs. Login */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleAvatarMenuOpen} color="inherit">
                  <Avatar
                    src={profile?.avatar || user?.picture || "https://i.pinimg.com/736x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg"}
                    alt={profile?.name || user?.name || "User Avatar"}
                  />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={openAvatar}
                  onClose={handleAvatarMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem component={RouterLink} to="/dashboard/overview" onClick={handleAvatarMenuClose}>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to={`/profile/${profile?.username || user?.sub}`} onClick={handleAvatarMenuClose}>
                    My Profile
                  </MenuItem>
                  <MenuItem component={RouterLink} to={"/dashboard/settings"} onClick={handleAvatarMenuClose}>
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
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}

export default Navbar;
