import { api } from '../../services/api';

export const erpApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Classes
    getClasses: builder.query<any[], void>({
      query: () => 'api/classes',
      providesTags: ['Class'],
    }),
    addClass: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/classes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `api/classes?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/classes?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),

    // 2. Subjects
    getSubjects: builder.query<any[], void>({
      query: () => 'api/subjects',
      providesTags: ['Subject'],
    }),
    addSubject: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/subjects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `api/subjects?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subject'],
    }),
    deleteSubject: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/subjects?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),

    // 3. Departments
    getDepartments: builder.query<any[], void>({
      query: () => 'api/departments',
      providesTags: ['Department'],
    }),
    addDepartment: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `api/departments?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/departments?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),

    // 4. Teachers
    getTeachers: builder.query<any[], void>({
      query: () => 'api/teachers',
      providesTags: ['Teacher'],
    }),
    addTeacher: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/teachers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teacher'],
    }),
    updateTeacher: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `api/teachers?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Teacher'],
    }),
    deleteTeacher: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/teachers?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teacher'],
    }),

    // 5. Students
    getStudents: builder.query<any[], void>({
      query: () => 'api/students',
      providesTags: ['Student'],
    }),
    addStudent: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `api/students?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Student'],
    }),
    deleteStudent: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/students?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),

    // 6. Student Attendance
    getStudentAttendance: builder.query<any[], void>({
      query: () => 'api/attendance/students',
      providesTags: ['Attendance'],
    }),
    takeStudentAttendance: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/attendance/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // 7. Teacher Attendance
    getTeacherAttendance: builder.query<any[], void>({
      query: () => 'api/attendance/teachers',
      providesTags: ['Attendance'],
    }),
    takeTeacherAttendance: builder.mutation<any, any>({
      query: (body) => ({
        url: 'api/attendance/teachers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // 8. Stats
    getDashboardStats: builder.query<any, void>({
      query: () => 'api/dashboard/stats',
    }),
  }),
});

export const {
  useGetClassesQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  
  useGetSubjectsQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  
  useGetTeachersQuery,
  useAddTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  
  useGetStudentAttendanceQuery,
  useTakeStudentAttendanceMutation,
  
  useGetTeacherAttendanceQuery,
  useTakeTeacherAttendanceMutation,

  useGetDashboardStatsQuery,
} = erpApi;
