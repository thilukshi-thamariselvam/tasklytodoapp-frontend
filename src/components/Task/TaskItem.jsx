import { useState } from 'react';
import {
    Box, Typography, Checkbox, IconButton, Menu, MenuItem, Divider,
    ListItemIcon, ListItemText
} from '@mui/material';
import {
    CalendarDays, GripVertical, Pencil, MessageSquare, MoreHorizontal,
    Trash2
} from 'lucide-react';
import { useDeleteTask, useUpdateTask } from '../../hooks/useTaskMutations';
import { useNavigate } from 'react-router-dom';
import { useCompleteTask } from '../../hooks/useCompleteTask';


const priorityStyles = {
    URGENT: { border: '#D32F2F', bg: 'rgba(211, 47, 47, 0.1)', hoverBg: 'rgba(211, 47, 47, 0.25)' },
    HIGH: { border: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)', hoverBg: 'rgba(255, 152, 0, 0.25)' },
    MEDIUM: { border: '#1976D2', bg: 'rgba(25, 118, 210, 0.1)', hoverBg: 'rgba(25, 118, 210, 0.25)' },
    LOW: { border: '#E0E0E0', bg: 'transparent', hoverBg: 'rgba(0, 0, 0, 0.04)' },
};

const TaskItem = ({ task, isHovered, onMouseEnter, onMouseLeave, onEditClick }) => {

    const [menuAnchor, setMenuAnchor] = useState(null);
    const deleteTaskMutation = useDeleteTask();
    const updateTaskMutation = useUpdateTask();
    const navigate = useNavigate();
    const completeTaskMutation = useCompleteTask();

    return (
        <Box
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: isHovered ? 'background.paper' : 'transparent',
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'background-color 0.15s ease',
            }}
        >
            <Checkbox
                checked={task.status === 'COMPLETED'}
                icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                }
                checkedIcon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" strokeWidth="2" />
                        <path d="M7.5 12.5l3 3 6-6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                }
                onChange={async (e) => {
                    if (e.target.checked) {
                        try {
                            await completeTaskMutation.mutateAsync(task.id);
                            navigate('/completed');
                        } catch (error) {
                            console.error("Failed to complete task:", error);
                        }
                    } else {
                        try {
                            await updateTaskMutation.mutateAsync({
                                taskId: task.id,
                                data: { status: 'PENDING' }
                            });
                        } catch (error) {
                            console.error("Failed to reopen task:", error);
                        }
                    }
                }}
                sx={{
                    p: 0.5,
                    borderRadius: '50%',
                    color: priorityStyles[task.priority]?.border || '#E0E0E0',
                    backgroundColor: priorityStyles[task.priority]?.bg || 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-checked': {
                        color: priorityStyles[task.priority]?.border || '#9E9E9E',
                        backgroundColor: priorityStyles[task.priority]?.bg || 'transparent',
                    },
                    '& .MuiCheckbox-root': { padding: 0, margin: 0 },
                    '&:hover': {
                        backgroundColor: priorityStyles[task.priority]?.hoverBg || 'rgba(0, 0, 0, 0.04)',
                    }
                }}
            />

            <Box sx={{ flexGrow: 1, pl: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.3 }}>
                    {task.title}
                </Typography>

                {task.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, fontSize: '0.85rem' }}>
                        {task.description}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                    {task.dueDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CalendarDays size={14} />
                            <Typography variant="caption">{task.dueDate}</Typography>
                        </Box>
                    )}

                    {task.projectName ? (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {task.projectName}
                        </Typography>
                    ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Inbox
                        </Typography>
                    )}
                </Box>
            </Box>
            {isHovered && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center',
                        mt: 0.5
                    }}
                >
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <GripVertical size={16} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={onEditClick}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <CalendarDays size={16} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <MessageSquare size={16} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: 'text.secondary' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuAnchor(e.currentTarget);
                        }}
                    >
                        <MoreHorizontal size={16} />
                    </IconButton>
                </Box>
            )}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                slotProps={{
                    paper: {
                        sx: {
                            width: 180,
                            borderRadius: 2,
                            boxShadow: 5,
                            mt: 0.5
                        }
                    }
                }}
            >
                <MenuItem
                    onClick={() => setMenuAnchor(null)}
                >
                    <ListItemText primary="Add comment" />
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={async () => {
                        setMenuAnchor(null);
                        try {
                            await deleteTaskMutation.mutateAsync(task.id);
                        } catch (error) {
                            console.error("Delete failed", error);
                        }
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <Trash2 size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Delete task" />
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default TaskItem;