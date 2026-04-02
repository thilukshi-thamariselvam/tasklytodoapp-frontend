import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import {
    Dialog, DialogContent, Box, TextField, IconButton,
    Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Chip
} from '@mui/material';
import {
    Mic, MoreHorizontal, CalendarDays, Paperclip, Flag, Bell,
    AtSign, MapPin, Puzzle, Settings, Plus, X
} from 'lucide-react';
import { closeAddTaskModal } from '../../store/slices/uiSlice';
import { taskSchema } from '../../validation/taskSchema';
import { createTask } from '../../api/taskApi';
import DatePickerPopover from '../Date/DatePickerPopover';
import PriorityPopover from '../Priority/PriorityPopover';

const AddTaskModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const isModalOpen = useSelector((state) => state.ui.isAddTaskModalOpen);

    const [anchorEl, setAnchorEl] = useState(null);
    const [subtaskInput, setSubtaskInput] = useState('');

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            projectName: 'Inbox',
            subtaskTitles: [],
        },
        validationSchema: taskSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = { ...values, userId: "1" };
                await createTask(payload);
                queryClient.invalidateQueries({ queryKey: ['tasks'] });

                dispatch(closeAddTaskModal());
                formik.resetForm();
            } catch (error) {
                console.error("Failed to create task:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleAddSubtask = () => {
        const trimmed = subtaskInput.trim();
        if (trimmed && !formik.values.subtaskTitles.includes(trimmed)) {
            formik.setFieldValue('subtaskTitles', [...formik.values.subtaskTitles, trimmed]);
            setSubtaskInput('');
        }
    };

    const handleRemoveSubtask = (indexToRemove) => {
        formik.setFieldValue('subtaskTitles',
            formik.values.subtaskTitles.filter((_, index) => index !== indexToRemove)
        );
    };

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
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Add subtask"
                            variant="standard"
                            value={subtaskInput}
                            onChange={(e) => setSubtaskInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubtask();
                                }
                            }}
                            InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem' } }}
                            sx={{ flex: 1 }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleAddSubtask}
                            disabled={!subtaskInput.trim()}
                            sx={{ color: 'text.secondary' }}
                        >
                            <Plus size={18} />
                        </IconButton>
                    </Box>

                    {formik.values.subtaskTitles.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {formik.values.subtaskTitles.map((subtask, index) => (
                                <Chip
                                    key={index}
                                    label={subtask}
                                    size="small"
                                    onDelete={() => handleRemoveSubtask(index)}
                                    deleteIcon={<X size={14} />}
                                    sx={{
                                        fontSize: '0.8rem',
                                        bgcolor: 'action.hover',
                                        '& .MuiChip-deleteIcon': { color: 'text.secondary' }
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>


                <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1 }}>
                    <DatePickerPopover
                        value={formik.values.dueDate}
                        onChange={(val) => formik.setFieldValue('dueDate', val)}
                    />
                    <Button size="small" startIcon={<Paperclip size={16} />} variant="outlined" sx={{ textTransform: 'none' }}>Attachment</Button>
                    <PriorityPopover
                        value={formik.values.priority}
                        onChange={(val) => formik.setFieldValue('priority', val)}
                    />
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
                    PaperProps={{ sx: { width: 220, borderRadius: 2, boxShadow: 5 } }}
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
                            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
                            loading={formik.isSubmitting}
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