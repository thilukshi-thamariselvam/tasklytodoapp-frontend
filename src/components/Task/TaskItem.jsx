import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { CalendarDays, GripVertical, Pencil, MessageSquare, MoreHorizontal } from 'lucide-react';

const TaskItem = ({ task, isHovered, onMouseEnter, onMouseLeave, onEditClick }) => {
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
                sx={{ mt: -0.5, color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' } }}
            />

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.3 }}>
                    {task.title}
                </Typography>

                {task.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.85rem' }}>
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
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <MoreHorizontal size={16} />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default TaskItem;