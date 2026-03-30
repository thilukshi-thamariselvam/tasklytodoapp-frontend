import { Box, Typography } from '@mui/material';
import { Plus, CircleHelp } from 'lucide-react';

const SidebarFooter = () => {
  return (
    <Box sx={{ mt: 'auto', pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          cursor: 'pointer',
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          borderRadius: 1,
        }}
      >
        <Plus size={18} />
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          Add a team
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          cursor: 'pointer',
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          borderRadius: 1,
        }}
      >
        <CircleHelp size={18} />
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          Help & resources
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarFooter;