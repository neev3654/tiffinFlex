import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
});

export const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  city: Yup.string().required('City is required'),
  area: Yup.string().required('Area is required'),
  bio: Yup.string().max(200, 'Bio must be under 200 characters'),
  avatar: Yup.mixed()
    .test('fileSize', 'File size too large (>5MB)', (value) => {
      if (!value || typeof value === 'string') return true;
      return value.size <= 5242880;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || typeof value === 'string') return true;
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }),
});
