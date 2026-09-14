import { api } from './client';
import type { DashboardOverview } from './dashboard.types';

export const dashboardApi = {
  getOverview: (days: number) => api.get<DashboardOverview>(`/dashboard?days=${days}`),
};
