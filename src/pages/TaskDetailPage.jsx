import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Divider, Chip, IconButton, CircularProgress, Paper, Checkbox
} from '@mui/material';
import { ArrowLeft, CalendarDays, Clock, Edit } from 'lucide-react';
import { useTaskById } from '../hooks/useTasks';
import { useUpdateTask } from '../hooks/useTaskMutations';

const priorityColors = {
    URGENT: '#D32F2F',
    HIGH: '#FF9800',
    MEDIUM: '#1976D2',
    LOW: '#757575'
};

const TaskDetailPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const updateTaskMutation = useUpdateTask();

    const queryResult = useTaskById(taskId);
    console.log("React Query State:", queryResult);
    const { data: task, isLoading, isError } = queryResult;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !task) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Task not found or failed to load.</Typography>
            </Box>
        );
    }

    const completedSubtasks = task.subtasks?.filter(s => s.status === 'COMPLETED').length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', p: { xs: 2, md: 4 } }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
                    <ArrowLeft size={24} />
                </IconButton>
                <IconButton sx={{ color: 'text.secondary' }}>
                    <Edit size={20} />
                </IconButton>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>

                <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                    {task.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    <Chip
                        label={task.status}
                        size="small"
                        sx={{ fontWeight: 600, bgcolor: task.status === 'COMPLETED' ? '#E8F5E9' : '#FFF3E0', color: task.status === 'COMPLETED' ? '#2E7D32' : '#E65100' }}
                    />
                    <Chip
                        label={task.priority}
                        size="small"
                        sx={{ fontWeight: 600, bgcolor: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}
                    />
                    {task.projectName && (
                        <Chip label={task.projectName} variant="outlined" size="small" />
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    {task.dueDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <CalendarDays size={18} />
                            <Typography variant="body2">Due: {task.dueDate}</Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled' }}>
                        <Clock size={18} />
                        <Typography variant="body2">Created: {new Date(task.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                </Box>

                {task.description ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                            {task.description}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ mb: 4, color: 'text.disabled', fontStyle: 'italic' }}>
                        No description provided.
                    </Typography>
                )}

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Subtasks
                        </Typography>
                        {totalSubtasks > 0 && (
                            <Typography variant="caption" sx={{
                                bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, fontWeight: 600,
                                color: completedSubtasks === totalSubtasks ? 'success.main' : 'text.secondary'
                            }}>
                                {completedSubtasks}/{totalSubtasks}
                            </Typography>
                        )}
                    </Box>

                    {totalSubtasks > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {task.subtasks.map((subtask) => (
                                <Box
                                    key={subtask.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: 'background.default',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    <Checkbox
                                        checked={subtask.status === 'COMPLETED'}
                                        onChange={(e) => {
                                            updateTaskMutation.mutateAsync({
                                                taskId: subtask.id,
                                                data: { status: e.target.checked ? 'COMPLETED' : 'PENDING' }
                                            });
                                        }}
                                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>}
                                        checkedIcon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" strokeWidth="2" /><path d="M7.5 12.5l3 3 6-6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                        sx={{ p: 0.5, color: 'text.secondary', '&.Mui-checked': { color: 'success.main' } }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            flex: 1,
                                            textDecoration: subtask.status === 'COMPLETED' ? 'line-through' : 'none',
                                            color: subtask.status === 'COMPLETED' ? 'text.disabled' : 'text.primary',
                                        }}
                                    >
                                        {subtask.title}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', pl: 1 }}>
                            No subtasks for this task.
                        </Typography>
                    )}
                </Box>

            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 2, pr: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Last updated: {new Date(task.updatedAt).toLocaleString()}
                </Typography>
            </Box>

        </Box>
    );
};

export default TaskDetailPage;