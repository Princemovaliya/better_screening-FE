/**
 * Centralized query key factory, namespaced by organizationId — a forcing function so
 * no query can accidentally be shared across tenants in the cache (e.g. after a user
 * switches accounts in the same browser tab).
 */
export const queryKeys = {
  organization: (orgId: string) => ['org', orgId] as const,
  organizationSettings: (orgId: string) => ['org', orgId, 'settings'] as const,

  jobs: (orgId: string, filters?: Record<string, unknown>) =>
    ['org', orgId, 'jobs', filters ?? {}] as const,
  job: (orgId: string, id: string) => ['org', orgId, 'jobs', id] as const,

  candidates: (orgId: string, filters?: Record<string, unknown>) =>
    ['org', orgId, 'candidates', filters ?? {}] as const,
  candidate: (orgId: string, id: string) => ['org', orgId, 'candidates', id] as const,

  interviews: (orgId: string, filters?: Record<string, unknown>) =>
    ['org', orgId, 'interviews', filters ?? {}] as const,
  interview: (orgId: string, id: string) => ['org', orgId, 'interviews', id] as const,
};
