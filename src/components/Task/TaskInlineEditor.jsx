import { Box, TextField, Button, Chip, IconButton } from '@mui/material';
import { X, CalendarDays, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useUpdateTask } from '../../hooks/useTaskMutations';
import PriorityPopover from '../Priority/PriorityPopover';

const TaskInlineEditor = ({ task, onCancel }) => {
    const updateTaskMutation = useUpdateTask();
    const [subtaskInput, setSubtaskInput] = useState('');

    const formik = useFormik({
        initialValues: {
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'LOW',
            subtaskTitles: task.subtasks?.map(s => s.title) || [],
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await updateTaskMutation.mutateAsync({ taskId: task.id, data: values });
                onCancel();
            } catch (error) {
                console.error("Failed to update task", error);
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

    return (
        <Box
            sx={{
                p: 2,
                m: 0.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#FFFFFF',
                boxShadow: 2,
            }}
        >
            <TextField
                fullWidth
                variant="standard"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                InputProps={{ disableUnderline: true, sx: { fontSize: '1rem', fontWeight: 500 } }}
                autoFocus
            />

            <TextField
                fullWidth
                variant="standard"
                name="description"
                placeholder="Add description"
                value={formik.values.description}
                onChange={formik.handleChange}
                multiline
                rows={1}
                InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: 'text.secondary', mt: 1 } }}
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                {task.dueDate && (
                    <Chip
                        icon={<CalendarDays size={14} />}
                        label={task.dueDate}
                        onDelete={onCancel}
                        sx={{ color: '#D32F2F', border: '1px solid #EF9A9A', backgroundColor: 'transparent' }}
                    />
                )}

                <PriorityPopover
                    value={formik.values.priority}
                    onChange={(val) => formik.setFieldValue('priority', val)}
                />
                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>Reminders</Button>
            </Box>
            
            <Box sx={{ mt: 1.5 }}>
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
                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem' } }}
                        sx={{ flex: 1 }}
                    />
                    <IconButton size="small" onClick={handleAddSubtask} disabled={!subtaskInput.trim()} sx={{ color: 'text.secondary' }}>
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
                                sx={{ fontSize: '0.8rem', bgcolor: 'action.hover', '& .MuiChip-deleteIcon': { color: 'text.secondary' } }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary' }}>
                    Inbox ▾
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onCancel} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={formik.handleSubmit}
                        disabled={!formik.dirty || updateTaskMutation.isPending}
                        loading={updateTaskMutation.isPending}
                        sx={{ textTransform: 'none' }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskInlineEditor;