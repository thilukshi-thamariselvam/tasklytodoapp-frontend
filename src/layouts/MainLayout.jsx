import { Outlet } from 'react-router-dom';
import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { Menu, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import CommandPalette from '../components/CommandPalette/CommandPalette';
import SidebarProfile from '../components/Sidebar/SidebarProfile';
import SidebarNav from '../components/Sidebar/SidebarNav';
import SidebarProjects from '../components/Sidebar/SidebarProjects';
import SidebarFooter from '../components/Sidebar/SidebarFooter';
import AddTaskModal from '../components/Modal/AddTaskModal';

const MainLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    const [isCommandOpen, setIsCommandOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                <Box
                    onClick={() => setIsCommandOpen(true)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        mb: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        maxWidth: 650,
                        '&:hover': { borderColor: 'text.disabled', bgcolor: 'grey.50' },
                        transition: 'all 0.1s ease'
                    }}
                >
                    <Search size={18} sx={{ color: 'text.disabled' }} />
                    <Typography sx={{ color: 'text.disabled', fontSize: '0.9rem', flexGrow: 1 }}>
                        Search tasks...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box sx={{ minWidth: 22, height: 22, borderRadius: 0.5, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, color: 'text.secondary' }}>Ctrl</Box>
                        <Box sx={{ minWidth: 22, height: 22, borderRadius: 0.5, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, color: 'text.secondary' }}>K</Box>
                    </Box>
                </Box>

                <Outlet />
            </Box>
            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
            <AddTaskModal />
        </Box>
    );
};

export default MainLayout;