import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog, InputBase, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Box, Divider, keyframes
} from '@mui/material';
import { Search, Inbox, CalendarDays, Home as HomeIcon, Filter } from 'lucide-react';
import { useSearchTasks } from '../../hooks/useTasks';

const Keycap = ({ children }) => (
    <Box
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 22,
            height: 22,
            px: 0.5,
            borderRadius: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.100',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'text.secondary',
            lineHeight: 1
        }}
    >
        {children}
    </Box>
);

const CommandPalette = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    
    const userId = "1"; 
    const { data: searchResults = [], isFetching } = useSearchTasks(userId, query);

    // Static Navigation Links
    const navItems = [
        { label: 'Go to Home', icon: <HomeIcon size={18} />, shortcut: ['G', 'H'], action: () => navigate('/') },
        { label: 'Go to Inbox', icon: <Inbox size={18} />, shortcut: ['G', 'I'], action: () => navigate('/inbox') },
        { label: 'Go to Today', icon: <CalendarDays size={18} />, shortcut: ['G', 'T'], action: () => navigate('/') },
        { label: 'Go to Filters & Labels', icon: <Filter size={18} />, shortcut: ['G', 'F'], action: () => navigate('/') },
    ];

    const menuItems = query.length > 1 
        ? searchResults.map(task => ({
            label: task.title,
            description: task.projectName || 'Inbox',
            icon: <Search size={18} />,
            action: () => { navigate(`/tasks/${task.id}`); onClose(); }
          }))
        : navItems.map(item => ({ ...item, action: () => { item.action(); onClose(); } }));

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        } else if (e.key === 'Enter' && menuItems[selectedIndex]) {
            menuItems[selectedIndex].action();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            disableEnforceFocus 
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'flex-start', 
                    pt: '15vh' 
                },
                '& .MuiPaper-root': {
                    borderRadius: 3,
                    boxShadow: 10,
                    maxWidth: 600,
                    width: '100%',
                    m: 0,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Search size={20} sx={{ color: 'text.secondary', flexShrink: 0 }} />
                <InputBase
                    inputRef={inputRef}
                    placeholder="Search or type a command..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                    onKeyDown={handleKeyDown}
                    sx={{ flex: 1, fontSize: '1.1rem', fontWeight: 500 }}
                    autoFocus
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Keycap>Ctrl</Keycap>
                    <Keycap>K</Keycap>
                </Box>
            </Box>

            <List sx={{ p: 1.5, maxHeight: 400, overflowY: 'auto', bgcolor: 'background.paper' }}>
                
                {query.length <= 1 && (
                    <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Navigation
                    </Typography>
                )}

                {menuItems.length === 0 && !isFetching && (
                    <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.disabled' }}>
                        No results found for "{query}"
                    </Typography>
                )}

                {menuItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        selected={index === selectedIndex}
                        onClick={item.action}
                        sx={{
                            borderRadius: 1.5,
                            mb: 0.5,
                            '&.Mui-selected': { bgcolor: 'action.selected' },
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.label} 
                            secondary={item.description} 
                            primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                        {item.shortcut && (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Keycap>{item.shortcut[0]}</Keycap>
                                <Keycap>{item.shortcut[1]}</Keycap>
                            </Box>
                        )}
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, px: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Keycap>↑</Keycap><Keycap>↓</Keycap><Typography variant="caption" sx={{ ml: 0.5, color: 'text.disabled' }}>Navigate</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Keycap>↵</Keycap><Typography variant="caption" sx={{ ml: 0.5, color: 'text.disabled' }}>Open</Typography></Box>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Taskly</Typography>
            </Box>
        </Dialog>
    );
};

export default CommandPalette;