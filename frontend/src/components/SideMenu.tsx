import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import MenuContent from "./MenuContent";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    position: 'fixed',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
        marginTop: '64px',
        height: `calc(100vh - 64px)`,
    },
});

function SideMenu ({ mobileOpen, handleDrawerToggle }: { mobileOpen: boolean, handleDrawerToggle: () => void }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    return (
        <>
            {isMobile ? (
                /* Mobile Drawer (Temporary) */
                <MuiDrawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true,
                  }}
                  sx={{
                    [`& .${drawerClasses.paper}`]: {
                        width: drawerWidth,
                    },
                  }}
                >
                    <MenuContent handleDrawerToggle={handleDrawerToggle} />
                </MuiDrawer>
            ) : (
                /* Desktop Drawer (Permanent) */
                <Drawer
                  variant="permanent"
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    [`& .${drawerClasses.paper}`]: {
                        backgroundColor: 'background.paper',
                    },
                  }}
                >
                    <Box
                      sx={{
                        overflow: 'auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                        <MenuContent handleDrawerToggle={() => {}} />
                    </Box>
                </Drawer>
            )}
        </>
    );
}

export default SideMenu;