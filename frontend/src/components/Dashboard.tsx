import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', pt: 14 }}>
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
