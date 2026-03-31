import dayjs from 'dayjs';

export const groupTasksByDate = (tasks) => {
  const todayStart = dayjs().startOf('day');

  const groupedTasks = {
    overdue: [],
    today: [],
    upcoming: [],
    noDate: [], 
  };

  if (!tasks || tasks.length === 0) return groupedTasks;

  tasks.forEach((task) => {
    if (!task.dueDate) {
      groupedTasks.noDate.push(task);
      return;
    }

    const taskDate = dayjs(task.dueDate).startOf('day');

    if (taskDate.isBefore(todayStart)) {
      groupedTasks.overdue.push(task);
    } else if (taskDate.isSame(todayStart)) {
      groupedTasks.today.push(task);
    } else {
      groupedTasks.upcoming.push(task);
    }
  });

  return groupedTasks;
};