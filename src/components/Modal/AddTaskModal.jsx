import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { 
  Dialog, DialogContent, Box, TextField, IconButton, 
  Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography
} from '@mui/material';
import { 
  Mic, MoreHorizontal, CalendarDays, Paperclip, Flag, Bell, 
  AtSign, MapPin, Puzzle, Settings 
} from 'lucide-react';
import { closeAddTaskModal } from '../../store/slices/uiSlice';
import { taskSchema } from '../../validation/taskSchema';

const AddTaskModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.ui.isAddTaskModalOpen);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      projectName: 'Inbox',
    },
    validationSchema: taskSchema,
    onSubmit: (values) => {
      console.log("Task Submitted:", values);
      dispatch(closeAddTaskModal());
      formik.resetForm();
    },
  });

  const handleClose = () => {
    dispatch(closeAddTaskModal());
    formik.resetForm();
  };

  return (
    <Dialog 
      open={isModalOpen} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, position: 'relative', overflow: 'visible' }
      }}
    >
      <DialogContent sx={{ p: 3 }}>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            placeholder="Task name"
            variant="standard"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', fontWeight: 500 } }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.7rem', fontWeight: 600 }}>
              Dictate
            </Box>
            <IconButton size="small" sx={{ color: '#D32F2F' }}><Mic size={18} /></IconButton>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Description"
          variant="standard"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          multiline
          rows={2}
          InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', color: 'text.secondary' } }}
        />

        <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1 }}>
          <Button size="small" startIcon={<CalendarDays size={16} />} variant="outlined" sx={{ textTransform: 'none' }}>Today</Button>
          <Button size="small" startIcon={<Paperclip size={16} />} variant="outlined" sx={{ textTransform: 'none' }}>Attachment</Button>
          <Button size="small" startIcon={<Flag size={16} />} variant="outlined" sx={{ textTransform: 'none' }}>Priority</Button>
          <Button size="small" startIcon={<Bell size={16} />} variant="outlined" sx={{ textTransform: 'none' }}>Reminders</Button>

          <IconButton 
            size="small" 
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <MoreHorizontal size={18} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { width: 220, borderRadius: 2, boxShadow: 5 } }} // Heavy shadow as per spec
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><AtSign size={18} /></ListItemIcon>
            <ListItemText primary="Labels" />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@</Typography>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><MapPin size={18} sx={{ color: '#FFA726' }} /></ListItemIcon>
            <ListItemText primary="Location" />
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Flag size={18} sx={{ color: '#FFA726' }} /></ListItemIcon>
            <ListItemText primary="Deadline" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Puzzle size={18} /></ListItemIcon>
            <ListItemText primary="Add Extension" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemText primary="Edit Task Actions" sx={{ color: 'primary.main', fontWeight: 600 }} />
          </MenuItem>
        </Menu>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button size="small" variant="text" sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Inbox ▾
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={formik.handleSubmit} 
              disabled={!formik.dirty || !formik.isValid} 
              sx={{ textTransform: 'none' }}
            >
              Add task
            </Button>
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;