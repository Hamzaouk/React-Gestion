import * as Yup from 'yup';

const projectSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter a project name')
    .max(100, 'Project name cannot exceed 100 characters'),
  
  description: Yup.string()
    .required('Please provide a project description')
    .max(500, 'Description cannot exceed 500 characters'),
  
  startDate: Yup.date()
    .required('Please select a start date')
    .typeError('Please enter a valid start date'),
  
  endDate: Yup.date()
    .required('Please select an end date')
    .typeError('Please enter a valid end date')
    .min(
      Yup.ref('startDate'), 
      'End date must be after the start date'
    )
    .test(
      'is-valid-date', 
      'Please enter a valid end date', 
      value => value instanceof Date && !isNaN(value)
    ),
  
  budget: Yup.number()
    .required('Please enter a budget amount')
    .typeError('Budget must be a valid number')
    .min(0, 'Budget cannot be negative'),
});

export default projectSchema;