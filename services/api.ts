import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/', // Automatically points to local relative API routes in Next.js
  }),
  tagTypes: ['User', 'Student', 'Teacher', 'Class', 'Section', 'Subject', 'Attendance', 'Exam', 'Fee', 'Payroll', 'Notice', 'Homework', 'Book', 'Transport', 'Department'],
  endpoints: () => ({}),
});
