import { api } from './client';
import type { Organization, OrganizationSettings } from './types';

export const organizationsApi = {
  getMine: () => api.get<Organization>('/organizations/me'),
  getMySettings: () => api.get<OrganizationSettings>('/organizations/me/settings'),
};
