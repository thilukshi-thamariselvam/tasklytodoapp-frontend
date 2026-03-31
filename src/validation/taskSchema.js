import * as Yup from 'yup';

export const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required('Task title is required')
    .min(1, 'Task title cannot be empty')
    .max(255, 'Task title is too long'),
    
  description: Yup.string()
    .max(2000, 'Description is too long')
    .default(''),
    
  projectName: Yup.string().default('Inbox'),
});