import React, { useContext } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    path?: string;
    href?: string;
}

function MenuContent ({ handleDrawerToggle }: { handleDrawerToggle: () => void }) {
    const { user } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const stripeOauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${import.meta.env.VITE_STRIPE_REDIRECT_URI}&state=${encodeURIComponent(user?.sub || '')}`;
    const is_seller = profile?.is_seller;


    const baseItems: NavItem[] =[
        { label: 'Overview', path: '/dashboard/overview', icon: <HomeRoundedIcon /> },
        { label: 'My Orders', path: '/dashboard/orders', icon: <FormatListBulletedRoundedIcon /> },
        { label: 'Wishlist', path: '/dashboard/wishlist', icon: <FavoriteBorderRoundedIcon /> },
    ];

    const sellerItems: NavItem[] = [
        { label: 'My Listings', path: '/dashboard/listings', icon: <StorefrontRoundedIcon /> },
        { label: 'Metrics', path: '/dashboard/metrics', icon: <LeaderboardRoundedIcon /> },
        { label: 'Inbox', path: '/dashboard/inbox', icon: <InboxRoundedIcon /> },
    ];

    const nonSellerItem: NavItem = {
        label: 'Become a Seller',
        href: stripeOauthUrl,
        icon: <StorefrontRoundedIcon />
    };
    
    const secondaryListItems: NavItem[] = [
        { label: 'Settings', path: '/dashboard/settings', icon: <SettingsRoundedIcon /> },
        // { label: 'About', path: '/about', icon: <InfoRoundedIcon /> },
        { label: 'Contact Us', path: '/contact', icon: <HelpRoundedIcon /> },
    ];

    const mainListItems: NavItem[] = [
        ...baseItems,
        ...(is_seller ? sellerItems : [nonSellerItem])
    ];

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          component={item.href ? "a" : NavLink}
                          {...(item.href ? { href: item.href } : { to: item.path! })}
                          onClick={handleDrawerToggle}
                          sx={{
                            '&.active': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            },
                          }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          component={item.href ? "a" : NavLink}
                          {...(item.href ? { href: item.href } : { to: item.path! })}
                          onClick={handleDrawerToggle}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

export default MenuContent;