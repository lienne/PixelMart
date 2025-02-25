import React, { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  TextField,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';
import CartDropdown from './cart/CartDropdown';
import { LogoProps } from '../types/logoTypes';

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar({ brandName }: LogoProps) {
  const { profile } = useContext(ProfileContext);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // breakpoint for small screens

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
  const openAvatar = Boolean(profileAnchorEl);
  const openMobileMenu = Boolean(mobileAnchorEl);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleAvatarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleAvatarMenuClose();
  };

  useEffect(() => {
    // Clear the search bar when user navigates away from the search page
    if (!location.pathname.startsWith("/search")) {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear the search bar
    }
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <>
    {isMobile && (
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
        {navItems.map((item) => (
          <MenuItem key={item.label} component={RouterLink} to={item.to} onClick={handleMobileMenuClose}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    )}
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: 'black' }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ textTransform: 'none', padding: 0, marginRight: 2 }}
            >
              <Box
                component="img"
                src={brandName}
                alt="PixelMart Logo"
                sx={{ width: 100, height: 'auto' }}
              />
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

            {/* Center: Search bar */}
            {!isMobile && (
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                      key={location.pathname}
                      variant="outlined"
                      placeholder="Search"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchSubmit}
                      size="small"
                      sx={{
                        width: '100%',
                        maxWidth: '650px',
                      }}
                      slotProps={{
                        htmlInput: { 'aria-label': 'search' }
                      }}
                    />
                </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'right' }}>
            {/* Right side: Cart Button */}
            <CartDropdown />

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
