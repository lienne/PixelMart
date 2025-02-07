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

const mainListItems = [
    { label: 'Overview', path: '/dashboard/overview', icon: <HomeRoundedIcon /> },
    { label: 'My Orders', path: '/dashboard/orders', icon: <FormatListBulletedRoundedIcon /> },
    { label: 'My Listings', path: '/dashboard/listings', icon: <StorefrontRoundedIcon /> },
    { label: 'Metrics', path: '/dashboard/metrics', icon: <LeaderboardRoundedIcon /> },
    { label: 'Inbox', path: '/dashboard/inbox', icon: <InboxRoundedIcon /> },
    { label: 'Wishlist', path: '/dashboard/wishlist', icon: <FavoriteBorderRoundedIcon /> },
];

const secondaryListItems = [
    { label: 'Settings', path: '/dashboard/settings', icon: <SettingsRoundedIcon /> },
    // { label: 'About', path: '/about', icon: <InfoRoundedIcon /> },
    { label: 'Feedback', path: '/feedback', icon: <HelpRoundedIcon /> },
];

function MenuContent ({ handleDrawerToggle }: { handleDrawerToggle: () => void }) {
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          component={NavLink}
                          to={item.path}
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
                          component={NavLink}
                          to={item.path}
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