import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Item } from "../types";
import { Link as RouterLink } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useCartData from "../hooks/useCartData";

const CartDropdown = () => {
  const { cartItems, removeFromCart, refetchCart } = useCartData();

  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const openCart = Boolean(cartAnchorEl);

  const handleCartMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartMenuClose = () => {
    setCartAnchorEl(null);
  };

  const handleRemove = async (itemId: number) => {
    await removeFromCart(itemId);
    refetchCart();
  };

  return (
    <>
      {/* Cart Button */}
      <IconButton
        onClick={handleCartMenuOpen}
        color="inherit"
        sx={{ marginRight: 2, width: 40, height: 40, alignSelf: "center" }}
      >
        <ShoppingCartRoundedIcon />
      </IconButton>

      {/* Cart Dropdown Menu */}
      <Menu
        anchorEl={cartAnchorEl}
        open={openCart}
        onClose={handleCartMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ padding: 2, minWidth: 250 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Cart
          </Typography>
        </Box>
        <Divider />

        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item: Item) => (
            <MenuItem key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img src={item.showcase_img_urls && item.showcase_img_urls.length > 0 ? item.showcase_img_urls[0] : 'fallback-image-url.jpg'} alt={item.title} width="40" height="40" />
                <Typography variant="body2">{item.title}</Typography>
              </Box>
              <Button
                size="small"
                color="error"
                onClick={() => handleRemove(item.id)}
              >
                <DeleteOutlineIcon />
              </Button>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              Your cart is empty.
            </Typography>
          </Box>
        )}

        {/* Checkout Button */}
        {cartItems && cartItems.length > 0 && (
          <>
            <Divider />
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/checkout"
                fullWidth
                onClick={handleCartMenuClose}
              >
                Check Out
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default CartDropdown;
