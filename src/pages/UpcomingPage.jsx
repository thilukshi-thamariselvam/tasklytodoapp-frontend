import { useEffect } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/Task/TaskItem';
import { useDispatch } from 'react-redux';
import { setSearchContext, clearSearchContext } from '../store/slices/uiSlice';

const UpcomingPage = () => {
    const { data: tasks = [], isLoading } = useTasks("1");

    if (isLoading) return <Typography>Loading...</Typography>;

    const todayStart = dayjs().startOf('day');
    const upcomingTasks = tasks.filter(task =>
        task.dueDate !== null && !dayjs(task.dueDate).isBefore(todayStart)
    );

    const groupedTasks = upcomingTasks.reduce((acc, task) => {
        const dateStr = task.dueDate;
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort();

    const getDateLabel = (dateStr) => {
        const today = dayjs().startOf('day');
        const taskDate = dayjs(dateStr).startOf('day');

        if (taskDate.isSame(today, 'day')) {
            return { label: 'Today', color: '#1976D2' };
        }
        if (taskDate.isSame(today.add(1, 'day'), 'day')) {
            return { label: 'Tomorrow', color: '#388E3C' };
        }

        return { label: taskDate.format('dddd, MMMM D'), color: 'text.secondary' };
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchContext('upcoming'));
        return () => {
            dispatch(clearSearchContext());
        };
    }, [dispatch]);

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                Upcoming
            </Typography>

            {sortedDates.length === 0 ? (
                <Typography sx={{ color: 'text.disabled', mt: 4 }}>
                    No upcoming tasks with due dates.
                </Typography>
            ) : (
                sortedDates.map((dateStr) => {
                    const { label, color } = getDateLabel(dateStr);
                    return (
                        <Box key={dateStr} sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    color: color,
                                    mb: 1,
                                    textTransform: label === 'Overdue' || label === 'Today' || label === 'Tomorrow' ? 'uppercase' : 'none',
                                    letterSpacing: label === 'Overdue' || label === 'Today' || label === 'Tomorrow' ? 1 : 0
                                }}
                            >
                                {label}
                            </Typography>

                            <Box
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    overflow: 'hidden'
                                }}
                            >
                                {groupedTasks[dateStr].map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        isHovered={false}
                                        onMouseEnter={() => { }}
                                        onMouseLeave={() => { }}
                                        onEditClick={() => { }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    );
                })
            )}
        </Box>
    );
};

export default UpcomingPage;