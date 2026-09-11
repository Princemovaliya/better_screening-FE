/**
 * Centralized query key factory, namespaced by organizationId — a forcing function so
 * no query can accidentally be shared across tenants in the cache (e.g. after a user
 * switches accounts in the same browser tab).
 */
export const queryKeys = {
  organization: (orgId: string) => ['org', orgId] as const,
  organizationSettings: (orgId: string) => ['org', orgId, 'settings'] as const,
};
