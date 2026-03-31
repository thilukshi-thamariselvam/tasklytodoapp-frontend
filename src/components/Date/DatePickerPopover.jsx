import { useState } from 'react';
import { Popover, Box, Typography, Button, Divider } from '@mui/material';
import { Sun, CalendarDays, Armchair, ArrowRight, Ban } from 'lucide-react';
import dayjs from 'dayjs';

const DatePickerPopover = ({ value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const presets = [
        { label: 'Tomorrow', icon: <Sun size={16} sx={{ color: '#FFA726' }} />, date: dayjs().add(1, 'day') },
        { label: 'Later this week', icon: <CalendarDays size={16} sx={{ color: '#AB47BC' }} />, date: dayjs().endOf('week') },
        { label: 'This weekend', icon: <Armchair size={16} sx={{ color: '#42A5F5' }} />, date: dayjs().endOf('week') },
        { label: 'Next week', icon: <ArrowRight size={16} sx={{ color: '#AB47BC' }} />, date: dayjs().add(1, 'week').startOf('week') },
    ];

    const handlePresetClick = (date) => {
        onChange(date.format('YYYY-MM-DD'));
        handleClose();
    };

    const handleNoDate = () => {
        onChange(null);
        handleClose();
    };

    const renderCalendarGrid = () => {
        const today = dayjs();
        const startOfMonth = today.startOf('month');
        const endOfMonth = today.endOf('month');
        const startDayOfWeek = startOfMonth.day();

        const daysArray = [];

        for (let i = 0; i < startDayOfWeek; i++) {
            daysArray.push(<Box key={`empty-${i}`} />);
        }

        for (let day = 1; day <= endOfMonth.date(); day++) {
            const currentDate = startOfMonth.date(day);
            const isSelected = value && currentDate.isSame(dayjs(value), 'day');
            const isToday = currentDate.isSame(today, 'day');

            daysArray.push(
                <Box
                    key={day}
                    onClick={() => {
                        onChange(currentDate.format('YYYY-MM-DD'));
                        handleClose();
                    }}
                    sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: isToday ? 700 : 400,
                        color: isSelected ? '#FFFFFF' : 'text.primary',
                        backgroundColor: isSelected ? 'primary.main' : 'transparent',
                        '&:hover': { backgroundColor: isSelected ? 'primary.main' : 'action.hover' },
                    }}
                >
                    {day}
                </Box>
            );
        }

        return daysArray;
    };

    return (
        <>
            <Button
                size="small"
                variant="outlined"
                startIcon={<CalendarDays size={16} />}
                onClick={handleClick}
                sx={{ textTransform: 'none' }}
            >
                {value ? dayjs(value).format('DD MMM') : 'Today'}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 320,
                            borderRadius: 2,
                            boxShadow: 8,
                            p: 2,
                            mt: 1,
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 36,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        px: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        fontSize: '0.85rem',
                        color: 'text.disabled'
                    }}
                >
                    e.g., next Friday
                </Box>

                {presets.map((preset) => (
                    <Box
                        key={preset.label}
                        onClick={() => handlePresetClick(preset.date)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1,
                            px: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'action.hover' },
                        }}
                    >
                        {preset.icon}
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>{preset.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {preset.date.format('ddd')}
                        </Typography>
                    </Box>
                ))}

                <Box
                    onClick={handleNoDate}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1,
                        px: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                    }}
                >
                    <Ban size={16} sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">No date</Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {currentMonth.format('MMM YYYY')}
                        </Typography>
                        <Box>
                            <Button
                                size="small"
                                onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                                sx={{ minWidth: 32, p: 0.5, color: 'text.secondary' }}
                            >
                                &lt;
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                                sx={{ minWidth: 32, p: 0.5, color: 'text.secondary' }}
                            >
                                &gt;
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, justifyContent: 'center' }}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
                            <Box key={`${d}-${index}`} sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary', pb: 1 }}>
                                {d}
                            </Box>
                        ))}

                        {
                            (() => {
                                const startOfMonth = currentMonth.startOf('month');
                                const endOfMonth = currentMonth.endOf('month');
                                const startDayOfWeek = (startOfMonth.day() + 6) % 7;
                                const daysArray = [];

                                for (let i = 0; i < startDayOfWeek; i++) {
                                    daysArray.push(<Box key={`empty-${i}`} />);
                                }

                                for (let day = 1; day <= endOfMonth.date(); day++) {
                                    const currentDate = startOfMonth.date(day);
                                    const isSelected = value && currentDate.isSame(dayjs(value), 'day');
                                    const isToday = currentDate.isSame(dayjs(), 'day');

                                    daysArray.push(
                                        <Box
                                            key={day}
                                            onClick={() => {
                                                onChange(currentDate.format('YYYY-MM-DD'));
                                                handleClose();
                                            }}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: isToday ? 700 : 400,
                                                color: isSelected ? '#FFFFFF' : 'text.primary',
                                                backgroundColor: isSelected ? 'primary.main' : 'transparent',
                                                '&:hover': { backgroundColor: isSelected ? 'primary.main' : 'action.hover' },
                                            }}
                                        >
                                            {day}
                                        </Box>
                                    );
                                }

                                return daysArray;
                            })()
                        }
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default DatePickerPopover;