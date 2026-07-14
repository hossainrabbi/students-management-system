import { api } from '../../services/api';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface FinancialDataPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface AttendanceDataPoint {
  day: string;
  rate: number;
}

export interface ClassDistributionPoint {
  className: string;
  students: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
  charts: {
    financial: FinancialDataPoint[];
    attendance: AttendanceDataPoint[];
    classDistribution: ClassDistributionPoint[];
  };
  recentNotices: any[];
  recentHomework: any[];
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => 'api/dashboard/stats',
      providesTags: ['Student', 'Teacher', 'Class', 'Attendance', 'Fee', 'Notice', 'Homework'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
