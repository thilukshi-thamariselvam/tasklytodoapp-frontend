import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, IconButton, Tooltip, CircularProgress, Chip } from '@mui/material';
import { X, Settings2 } from 'lucide-react';
import { clearActiveFilter, setSearchContext, clearSearchContext } from '../store/slices/uiSlice';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/Task/TaskItem';
import TaskInlineEditor from '../components/Task/TaskInlineEditor';

const InboxPage = () => {
  const { data: tasks, isLoading, isError } = useTasks("1");
  const activeFilterLabelId = useSelector((state) => state.ui.activeFilterLabelId);
  const activeFilterPriority = useSelector((state) => state.ui.activeFilterPriority);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchContext('inbox'));
    return () => {
      dispatch(clearSearchContext());
    };
  }, [dispatch]);


  const filteredTasks = tasks.filter((task) => {
    if (activeFilterLabelId && !task.labels?.some(label => label.id === activeFilterLabelId)) return false;
    if (activeFilterPriority && task.priority !== activeFilterPriority) return false;
    return true;
  });

  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const showEmptyState = !isLoading && !isError && filteredTasks?.length === 0;

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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>Inbox</Typography>
          {!showEmptyState && tasks?.length > 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {tasks.length} task{tasks.length > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>
        <Tooltip title="Display settings">
          <IconButton sx={{ color: 'text.secondary' }}><Settings2 size={20} /></IconButton>
        </Tooltip>
      </Box>

      {isLoading && (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {isError && (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="error">Failed to load tasks.</Typography>
        </Box>
      )}

      {showEmptyState && (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pb: 10 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            {activeFilterLabelId ? 'No tasks match this label' : 'Your Inbox is empty'}
          </Typography>
          {(activeFilterLabelId || activeFilterPriority) && (
            <Button
              startIcon={<X size={16} />}
              onClick={() => {
                dispatch(clearActiveFilter());
                dispatch(clearActiveFilterPriority());
              }}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Clear filter
            </Button>
          )}
        </Box>
      )}

      {filteredTasks?.length > 0 && (
        <Box sx={{ flexGrow: 1 }}>
          {filteredTasks.map(renderTaskRow)}
        </Box>
      )}

    </Box>
  );
};

export default InboxPage;