const yup = require('yup');

// Task validation schema using Yup
const taskValidationSchema = yup.object().shape({
  description: yup
    .string()
    .required('Task description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  startDate: yup
    .date()
    .required('Start date is required')
    .typeError('Please enter a valid date'),
  
  endDate: yup
    .date()
    .required('End date is required')
    .typeError('Please enter a valid date')
    .min(
      yup.ref('startDate'),
      'End date must be after or equal to the start date'
    ),
  
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status value'),
  
  projectId: yup
    .string()
    .required('Project ID is required')
});

export default taskSchema;