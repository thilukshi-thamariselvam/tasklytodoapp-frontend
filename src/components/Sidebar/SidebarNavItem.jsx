import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const SidebarNavItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === path;

  return (
    <Box
      onClick={() => navigate(path)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: 1,
        cursor: 'pointer',
        backgroundColor: isActive ? '#F3EDE7' : 'transparent', 
        color: isActive ? 'primary.main' : 'text.secondary', 
        '&:hover': {
          backgroundColor: isActive ? '#F3EDE7' : 'rgba(0, 0, 0, 0.04)', 
        },
        transition: 'all 0.15s ease-in-out',
      }}
    >
      <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: isActive ? 600 : 400,
          fontSize: '0.9rem',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SidebarNavItem;