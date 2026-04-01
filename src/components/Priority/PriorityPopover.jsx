import { useState } from 'react';
import { Popover, Box, Typography, IconButton } from '@mui/material';
import { Flag, Check } from 'lucide-react';

const priorities = [
    { label: 'Urgent', value: 'URGENT', color: '#D32F2F' },
    { label: 'High', value: 'HIGH', color: '#FF9800' },
    { label: 'Medium', value: 'MEDIUM', color: '#1976D2' },
    { label: 'Low', value: 'LOW', color: '#9E9E9E' },
];

const PriorityPopover = ({ value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = (priorityValue) => {
        onChange(priorityValue);
        handleClose();
    };

    return (
        <>
            <IconButton
                size="small"
                variant="outlined"
                onClick={handleClick}
                sx={{
                    textTransform: 'none',
                    border: value ? '1px solid #E0E0E0' : '1px solid',
                    borderColor: value ? '#BDBDBD' : 'divider',
                    color: value ? priorities.find(p => p.value === value)?.color : 'text.secondary',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: value ? priorities.find(p => p.value === value)?.color : 'text.primary'
                    }
                }}
            >
                <Flag size={16} />
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: { width: 180, borderRadius: 2, boxShadow: 5, mt: 1 }
                    }
                }}
            >
                {priorities.map((priority) => (
                    <Box
                        key={priority.value}
                        onClick={() => handleSelect(priority.value)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            py: 1.2,
                            px: 2,
                            cursor: 'pointer',
                            borderRadius: 1,
                            '&:hover': { backgroundColor: 'action.hover' },
                        }}
                    >
                        <Flag size={16} style={{ color: priority.color }} />
                        <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
                            {priority.label}
                        </Typography>
                        {value === priority.value && (
                            <Check size={16} sx={{ color: 'primary.main' }} />
                        )}
                    </Box>
                ))}
            </Popover>
        </>
    );
};

export default PriorityPopover;