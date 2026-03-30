import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#DC4C3E',   
      contrastText: '#FFFFFF', 
    },
    background: {
      default: '#FFFFFF',  
      paper: '#FAFAFA',    
    },
    text: {
      primary: '#202020',   
      secondary: '#808080', 
    },
    divider: '#EEEEEE',   
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "San Francisco", sans-serif',
    h4: {
      fontWeight: 700,      
      fontSize: '1.75rem', 
    },
    body2: {
      color: '#808080',    
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
            backgroundColor: '#C7413A', 
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