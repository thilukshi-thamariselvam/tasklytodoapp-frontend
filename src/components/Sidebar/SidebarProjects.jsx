import { Typography } from '@mui/material';

const SidebarProjects = () => {
  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        color: 'text.secondary',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.5px',
        mt: 3,
        mb: 1,
        px: 2,
        textTransform: 'uppercase',
      }}
    >
      My Projects
    </Typography>
  );
};

export default SidebarProjects;