import { useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Settings2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/Task/TaskItem';
import { groupTasksByDate } from '../utils/taskUtils';

const CompletedPage = () => {
  const { data: tasks, isLoading, isError } = useTasks("1");
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  if (isLoading) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">Failed to load tasks.</Typography>
      </Box>
    );
  }

  const completedTasks = tasks?.filter(task => task.status === 'COMPLETED');

  const completedDates = {};
  
  completedTasks?.forEach(task => {
    const dateKey = task.updatedAt ? task.updatedAt.substring(0, 10) : 'No Date';
    if (!completedDates[dateKey]) completedDates[dateKey] = [];
    completedDates[dateKey].push(task);
  });

  const sortedDates = Object.keys(completedDates).sort().reverse(); 

  const renderTaskRow = (task) => (
    editingTaskId === task.id ? (
      <TaskInlineEditor 
        key={task.id} 
        task={task} 
        onCancel={() => setEditingTaskId(null)} 
      />
    ) : (
      <TaskItem 
        key={task.id} 
        task={task} 
        isHovered={hoveredTaskId === task.id}
        onMouseEnter={() => setHoveredTaskId(task.id)}
        onMouseLeave={() => setHoveredTaskId(null)}
        onEditClick={() => setEditingTaskId(task.id)}
      />
    )
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>Activity: All projects</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Settings2 size={16} />} sx={{ color: 'text.secondary', borderColor: 'divider', textTransform: 'none' }}>
            Everyone
          </Button>
          <Tooltip title="Display settings">
            <IconButton sx={{ color: 'text.secondary' }}><Settings2 size={20} /></IconButton>
            </Tooltip>
        </Box>
      </Box>

      {sortedDates.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pb: 10 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>Your Activity Log is empty</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, maxWidth: '300px' }}>
            Tasks you complete will show up here grouped by the date they were completed.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {sortedDates.map((dateString) => (
            <Box key={dateString} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                  {dateString}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {completedDates[dateString].length} action{completedDates[dateString].length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {completedDates[dateString].map(renderTaskRow)}
            </Box>
          ))}
        </Box>
      )}

    </Box>
  );
};

export default CompletedPage;