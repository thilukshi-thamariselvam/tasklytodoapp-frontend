import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#9f7d64',
      contrastText: '#FFFFFF', 
    },
    background: {
      default: '#FFFFFF',  
      paper: '#FAF9F7',    
    },
    text: {
      primary: '#1A1410',   
      secondary: '#808080', 
    },
    divider: '#EEEEEE',   
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Segoe UI", "San Francisco", sans-serif',
    h4: {
      fontWeight: 700,      
      fontSize: '1.75rem', 
    },
    body2: {
      color: '#282828',    
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
          borderRadius: 8,
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#5D4230', 
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)', 
          },
        },
      },
    },
  },
});