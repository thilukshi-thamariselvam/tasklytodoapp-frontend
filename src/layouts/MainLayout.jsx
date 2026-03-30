import { Box, Tooltip, IconButton } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import SidebarProfile from '../components/Sidebar/SidebarProfile';
import SidebarNav from '../components/Sidebar/SidebarNav';
import SidebarProjects from '../components/Sidebar/SidebarProjects';
import SidebarFooter from '../components/Sidebar/SidebarFooter';

const MainLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

            <Box
                component="aside"
                sx={{
                    width: isSidebarOpen ? '300px' : '0px',
                    minWidth: isSidebarOpen ? '300px' : '0px',
                    backgroundColor: 'background.paper',
                    borderRight: isSidebarOpen ? '1px solid' : 'none',                    
                    transition: 'width 0.25s ease-in-out, min-width 0.25s ease-in-out',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}
            >
                <Box sx={{ p: 2, pb: 0 }}>
                    <SidebarProfile onToggleSidebar={toggleSidebar} />
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
                {!isSidebarOpen && (
                    <Tooltip title="Open Sidebar">
                        <IconButton
                            onClick={toggleSidebar}
                            sx={{ mb: 2, color: 'text.secondary' }}
                        >
                            <Menu size={20} />
                        </IconButton>
                    </Tooltip>
                )}
                <Outlet />
            </Box>

        </Box>
    );
};

export default MainLayout;