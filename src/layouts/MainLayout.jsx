import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarProfile from '../components/Sidebar/SidebarProfile';
import SidebarNav from '../components/Sidebar/SidebarNav';
import SidebarProjects from '../components/Sidebar/SidebarProjects';
import SidebarFooter from '../components/Sidebar/SidebarFooter';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      <Box
        component="aside"
        sx={{
          width: '300px',
          minWidth: '300px',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ p: 2, pb: 0 }}>
          <SidebarProfile />
        </Box>

        <Box sx={{ px: 2, flexGrow: 1 }}>
          <SidebarNav />
          <SidebarProjects />
        </Box>

        <Box sx={{ p: 2, pt: 0 }}>
          <SidebarFooter />
        </Box>

      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          overflowY: 'auto',
          p: 4,
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
};

export default MainLayout;