import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import {
    Dialog, DialogContent, Box, TextField, IconButton,
    Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Chip
} from '@mui/material';
import {
    Mic, MoreHorizontal, CalendarDays, Paperclip, Flag, Bell,
    AtSign, MapPin, Puzzle, Plus, X
} from 'lucide-react';
import { closeAddTaskModal } from '../../store/slices/uiSlice';
import { useLabels } from '../../hooks/useLabels';
import { taskSchema } from '../../validation/taskSchema';
import { createTask, createTaskWithFile } from '../../api/taskApi';
import DatePickerPopover from '../Date/DatePickerPopover';
import PriorityPopover from '../Priority/PriorityPopover';

const AddTaskModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const isModalOpen = useSelector((state) => state.ui.isAddTaskModalOpen);

    const [anchorEl, setAnchorEl] = useState(null);
    const [subtaskInput, setSubtaskInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const { data: labels = [] } = useLabels("1");

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            projectName: 'Inbox',
            subtaskTitles: [],
            labelIds: [],
        },
        validationSchema: taskSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const payload = { ...values, userId: "1", labelIds: values.labelIds };

                if (selectedFile) {
                    await createTaskWithFile(payload, selectedFile);
                } else {
                    await createTask(payload);
                }

                queryClient.invalidateQueries({ queryKey: ['tasks'] });
                dispatch(closeAddTaskModal());
                resetForm();
                setSelectedFile(null); 
            } catch (error) {
                console.error("Failed to create task:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

    const handleToggleLabel = (labelId) => {
        const currentIds = formik.values.labelIds || [];
        const isSelected = currentIds.includes(labelId);
        formik.setFieldValue('labelIds',
            isSelected
                ? currentIds.filter(id => id !== labelId)
                : [...currentIds, labelId]
        );
    };

    const handleClose = () => {
        dispatch(closeAddTaskModal());
        formik.resetForm();
        setSelectedFile(null);
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
                
                {formik.values.labelIds?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                        {formik.values.labelIds.map(id => {
                            const label = labels.find(l => l.id === id);
                            if (!label) return null;
                            return (
                                <Chip
                                    key={id}
                                    label={label.name}
                                    size="small"
                                    onDelete={() => handleToggleLabel(id)}
                                    deleteIcon={<X size={14} />}
                                    icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: label.color, ml: 0.5 }} />}
                                    sx={{
                                        fontSize: '0.8rem',
                                        bgcolor: `${label.color}15`,
                                        color: label.color,
                                        borderColor: label.color,
                                        '& .MuiChip-deleteIcon': { color: label.color }
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1 }}>
                    <DatePickerPopover
                        value={formik.values.dueDate}
                        onChange={(val) => formik.setFieldValue('dueDate', val)}
                    />
                    
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    
                    {/* Attachment Button */}
                    <Button 
                        size="small" 
                        startIcon={<Paperclip size={16} />} 
                        variant="outlined" 
                        sx={{ textTransform: 'none' }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        Attachment
                    </Button>

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

                {/* Show selected file name */}
                {selectedFile && (
                    <Chip
                        label={selectedFile.name}
                        size="small"
                        onDelete={handleRemoveFile}
                        deleteIcon={<X size={14} />}
                        icon={<Paperclip size={14} />}
                        sx={{ mt: 1, fontSize: '0.8rem' }}
                    />
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{ sx: { width: 220, borderRadius: 2, boxShadow: 5 } }}
                >
                    <MenuItem disabled sx={{ opacity: 0.7 }}>
                        <ListItemIcon><AtSign size={18} /></ListItemIcon>
                        <ListItemText primary="Labels" />
                    </MenuItem>
                    {labels.map((label) => {
                        const isSelected = formik.values.labelIds?.includes(label.id);
                        return (
                            <MenuItem
                                key={label.id}
                                onClick={() => handleToggleLabel(label.id)}
                                sx={{ pl: 5 }}
                            >
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                    <Box
                                        sx={{
                                            width: 14, height: 14, borderRadius: '50%',
                                            bgcolor: isSelected ? label.color : 'transparent',
                                            border: `2px solid ${label.color}`
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={label.name} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                            </MenuItem>
                        );
                    })}
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