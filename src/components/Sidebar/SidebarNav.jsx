import { Button, Box } from '@mui/material';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openAddTaskModal } from '../../store/slices/uiSlice';
import { sidebarNavItems } from '../../constants/sidebarNavItems';
import SidebarNavItem from './SidebarNavItem';

const SidebarNav = () => {
  const dispatch = useDispatch();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>

      <Button
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={() => dispatch(openAddTaskModal())}
        sx={{ 
          mb: 2, 
          justifyContent: 'flex-start', 
          pl: 2,
          py: 1,
          backgroundColor: 'primary.main',
        }}
      >
        Add task
      </Button>

      {sidebarNavItems.map((item) => (
        <SidebarNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          path={item.path}
        />
      ))}
    </Box>
  );
};

export default SidebarNav;