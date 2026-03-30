import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { CalendarPlus, Settings2 } from 'lucide-react';

const TodayPage = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Today
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<CalendarPlus size={16} />}
            sx={{ 
              color: 'text.secondary', 
              borderColor: 'divider',
              textTransform: 'none',
              '&:hover': { borderColor: 'text.secondary', backgroundColor: 'background.paper' }
            }}
          >
            Connect calendar
          </Button>
          
          <Tooltip title="Display settings">
            <IconButton sx={{ color: 'text.secondary' }}>
              <Settings2 size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          pb: 10 
        }}
      >
        <Box sx={{ mb: 3, color: '#E6C84C', opacity: 0.8 }}>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="40" r="12" fill="#E6C84C"/>
            <circle cx="38" cy="50" r="12" fill="#F0D75E"/>
            <circle cx="62" cy="50" r="12" fill="#F0D75E"/>
            <circle cx="42" cy="60" r="12" fill="#E6C84C"/>
            <circle cx="58" cy="60" r="12" fill="#E6C84C"/>
            <circle cx="50" cy="52" r="8" fill="#D4A017"/>
            <path d="M50 65 C50 75, 45 85, 40 95" stroke="#6F9E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M40 80 C35 75, 30 78, 32 82" fill="#6F9E5B"/>
          </svg>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Welcome to your Today view,
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, maxWidth: '300px' }}>
          See everything due today across all your projects.
        </Typography>

        <Button 
          variant="outlined"
          startIcon={<span style={{ fontSize: '20px', fontWeight: 700 }}>+</span>}
          sx={{ 
            color: '#6F4E37', 
            borderColor: '#6F4E37',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': { 
              borderColor: '#5D4230', 
              backgroundColor: '#F3EDE7' 
            }
          }}
        >
          Add task
        </Button>
      </Box>

    </Box>
  );
};

export default TodayPage;