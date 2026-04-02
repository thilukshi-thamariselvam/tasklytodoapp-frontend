import * as Yup from 'yup';
import dayjs from 'dayjs';

export const taskSchema = Yup.object().shape({
    title: Yup.string()
        .required('Task title is required')
        .min(1, 'Task title cannot be empty')
        .max(255, 'Task title is too long'),

    description: Yup.string()
        .max(2000, 'Description is too long')
        .default(''),

    dueDate: Yup.mixed()
        .transform((value, originalValue) => {
            if (originalValue === null || originalValue === '') return null;
            return dayjs(originalValue).format('YYYY-MM-DD');
        })
        .nullable(),

    priority: Yup.string()
        .oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 'Invalid priority')
        .default('LOW'),

    projectName: Yup.string().default('Inbox'),

    subtaskTitles: Yup.array().of(Yup.string().max(255, 'Subtask title is too long')),
});