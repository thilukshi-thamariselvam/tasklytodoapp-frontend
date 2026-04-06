import {
    Box, TextField, Button, Chip, IconButton, Typography
} from '@mui/material';
import { useState, useRef } from 'react';
import { X, CalendarDays, Plus, Paperclip } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useUpdateTask } from '../../hooks/useTaskMutations';
import { updateTaskAttachment } from '../../api/taskApi';
import PriorityPopover from '../Priority/PriorityPopover';
import DatePickerPopover from '../Date/DatePickerPopover';
import { useLabels } from '../../hooks/useLabels';

const TaskInlineEditor = ({ task, onCancel }) => {
    const queryClient = useQueryClient();
    const updateTaskMutation = useUpdateTask();
    const [subtaskInput, setSubtaskInput] = useState('');
    const { data: labels = [] } = useLabels("1");

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formik = useFormik({
        initialValues: {
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'LOW',
            dueDate: task.dueDate || null,
            subtaskTitles: task.subtasks?.map(s => s.title) || [],
            labelIds: task.labels?.map(l => l.id) || [],
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await updateTaskMutation.mutateAsync({ taskId: task.id, data: values });
                if (selectedFile) {
                    const fileResponse = await updateTaskAttachment(task.id, selectedFile);
                    queryClient.setQueryData(['task', task.id], fileResponse.data.data);
                }
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
                p: 1.5,
                m: 0.25,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'primary.light',
                backgroundColor: '#FAFBFF',
            }}
        >
            <TextField
                fullWidth
                variant="standard"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '1rem', fontWeight: 500 }
                }}
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
                InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '0.85rem', color: 'text.secondary', mt: 0.5 }
                }}
            />

            {/* Tighter Action Buttons Row */}
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, alignItems: 'center' }}>
                <DatePickerPopover
                    value={formik.values.dueDate}
                    onChange={(val) => formik.setFieldValue('dueDate', val)}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <Button
                    size="small"
                    startIcon={<Paperclip size={14} />}
                    sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        minWidth: 0, // Prevents awkward button stretching
                        px: 1.5
                    }}
                    onClick={() => fileInputRef.current.click()}
                >
                    {task.attachmentUrl ? "Replace" : "Attach"}
                </Button>

                <PriorityPopover
                    value={formik.values.priority}
                    onChange={(val) => formik.setFieldValue('priority', val)}
                />

                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.75rem', minWidth: 0, px: 1.5 }}>Reminders</Button>
            </Box>

            {/* Attachment Chip */}
            {(selectedFile || task.attachmentUrl) && (
                <Chip
                    label={selectedFile ? selectedFile.name : task.attachmentUrl.split('/').pop()}
                    size="small"
                    onDelete={selectedFile ? handleRemoveFile : undefined}
                    deleteIcon={<X size={14} />}
                    icon={<Paperclip size={14} />}
                    sx={{ mt: 1, fontSize: '0.75rem' }}
                />
            )}

            {/* Labels Section */}
            {labels.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                    {labels.map((label) => {
                        const isSelected = formik.values.labelIds?.includes(label.id);
                        return (
                            <Box
                                key={label.id}
                                onClick={() => {
                                    const currentIds = formik.values.labelIds || [];
                                    const newIds = isSelected
                                        ? currentIds.filter(id => id !== label.id)
                                        : [...currentIds, label.id];
                                    formik.setFieldValue('labelIds', newIds);
                                }}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.5,
                                    px: 1.5, py: 0.5, borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: isSelected ? label.color : 'divider',
                                    bgcolor: isSelected ? `${label.color}15` : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { bgcolor: `${label.color}25` }
                                }}
                            >
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: label.color }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: isSelected ? label.color : 'text.secondary', fontWeight: isSelected ? 600 : 400 }}>
                                    {label.name}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Subtasks Section */}
            <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Plus size={16} />
                    </IconButton>
                </Box>
                {formik.values.subtaskTitles.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {formik.values.subtaskTitles.map((subtask, index) => (
                            <Chip
                                key={index}
                                label={subtask}
                                size="small"
                                onDelete={() => handleRemoveSubtask(index)}
                                deleteIcon={<X size={14} />}
                                sx={{ fontSize: '0.75rem', bgcolor: 'action.hover', '& .MuiChip-deleteIcon': { color: 'text.secondary' } }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>
                    Inbox ▾
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onCancel} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={formik.handleSubmit}
                        disabled={(!formik.dirty && !selectedFile) || updateTaskMutation.isPending}
                        loading={updateTaskMutation.isPending}
                        sx={{ textTransform: 'none', fontSize: '0.8rem', px: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskInlineEditor;