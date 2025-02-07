import { Box, styled } from "@mui/material";
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

function SideMenu () {
    return (
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
                <MenuContent />
            </Box>
        </Drawer>
    );
}

export default SideMenu;