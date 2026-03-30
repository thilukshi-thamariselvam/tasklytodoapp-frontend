import { Box, Avatar, IconButton, Typography } from '@mui/material';
import { Bell, PanelLeftClose, User } from 'lucide-react';

const SidebarProfile = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        pb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            backgroundColor: '#8d6f59',
          }}
        >
          <User color="#FFFFFF" size={18} />
        </Avatar>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          User
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <Bell size={18} />
        </IconButton>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <PanelLeftClose size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SidebarProfile;