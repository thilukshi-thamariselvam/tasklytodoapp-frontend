import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { X, Settings2 } from 'lucide-react';
import { clearActiveFilter, setSearchContext, clearSearchContext } from '../store/slices/uiSlice';
import { useTasks } from '../hooks/useTasks';
import { useUpdateTaskOrder } from '../hooks/useTaskMutations';
import TaskItem from '../components/Task/TaskItem';
import TaskInlineEditor from '../components/Task/TaskInlineEditor';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';

const SortableTaskItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskItem {...props} dragHandleProps={listeners} />
    </div>
  );
};

const InboxPage = () => {
  const { data: tasks, isLoading, isError } = useTasks("1");
  const activeFilterLabelId = useSelector((state) => state.ui.activeFilterLabelId);
  const activeFilterPriority = useSelector((state) => state.ui.activeFilterPriority);
  const dispatch = useDispatch();
  const updateTaskOrderMutation = useUpdateTaskOrder();
  const queryClient = useQueryClient();

  const [optimisticTasks, setOptimisticTasks] = useState(null);

  useEffect(() => {
    dispatch(setSearchContext('inbox'));
    return () => { dispatch(clearSearchContext()); };
  }, [dispatch]);

  const filteredTasks = tasks?.filter((task) => {
    if (activeFilterLabelId && !task.labels?.some(label => label.id === activeFilterLabelId)) return false;
    if (activeFilterPriority && task.priority !== activeFilterPriority) return false;
    return true;
  }) || [];

  const displayTasks = optimisticTasks || filteredTasks;

  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const showEmptyState = !isLoading && !isError && filteredTasks.length === 0;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = displayTasks.findIndex((t) => t.id === active.id);
      const newIndex = displayTasks.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(displayTasks, oldIndex, newIndex);

      setOptimisticTasks(newOrder);
      const payload = newOrder.map((task, index) => ({
        id: task.id,
        displayOrder: index
      }));

      updateTaskOrderMutation.mutate(payload, {
        onSuccess: () => {
          setOptimisticTasks(null);
        },
        onError: () => {
          setOptimisticTasks(null);
        }
      });
    }
  };

  const renderTaskRow = (task) => (
    editingTaskId === task.id ? (
      <TaskInlineEditor key={task.id} task={task} onCancel={() => setEditingTaskId(null)} />
    ) : (
      <SortableTaskItem
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

      {isLoading && (<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>)}
      {isError && (<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="error">Failed to load tasks.</Typography></Box>)}

      {showEmptyState && null}

      {displayTasks.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ flexGrow: 1 }}>
              {displayTasks.map(renderTaskRow)}
            </Box>
          </SortableContext>
        </DndContext>
      )}
    </Box>
  );
};

export default InboxPage;