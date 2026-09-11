import { api } from './client';
import type { Job, JobInput, JobStatus } from './jobs.types';
import { toQueryString } from './queryString';

export interface ListJobsParams {
  status?: JobStatus;
  department?: string;
  search?: string;
}

export const jobsApi = {
  list: (params: ListJobsParams = {}) => api.get<Job[]>(`/jobs${toQueryString(params)}`),
  get: (id: string) => api.get<Job>(`/jobs/${id}`),
  create: (input: JobInput) => api.post<Job>('/jobs', input),
  update: (id: string, input: Partial<JobInput>) => api.patch<Job>(`/jobs/${id}`, input),
  remove: (id: string) => api.delete<void>(`/jobs/${id}`),
};
