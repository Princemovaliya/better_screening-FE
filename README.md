# better_screening-FE

Frontend for **Better Screening** — a multi-tenant AI recruitment/interview platform.
React + Vite + TypeScript, styled with Tailwind CSS. See the full architecture and
build plan at `/home/prince/.claude/plans/hi-this-is-merry-milner.md` (or wherever it's
been moved to in this repo going forward).

## Status: Phase 1 — foundation

What's implemented so far:
- Vite + React + TypeScript scaffold, Tailwind CSS v4 (via `@tailwindcss/vite`), path
  alias (`@/*` → `src/*`).
- React Router with two route trees: `/app/*` (authenticated recruiter shell) and
  `/interview-room/:token/*` (candidate portal — deliberately isolated, no recruiter
  code/data ever imported there).
- TanStack Query for server state; a typed `api` client wrapping `fetch`, attaching the
  JWT and unwrapping the backend's `{isError, message, data}` response envelope.
- `AuthContext` (session) and `OrgContext` (current organization, fetched via React
  Query) — real, working signup/login pages wired to the backend's `/auth/signup` and
  `/auth/login` endpoints.
- A small design-system primitive set (`components/ui`) to build on.
- Route-level stub pages for Dashboard/Jobs/Candidates/Interviews/Settings and the
  candidate interview-room landing — full features land in later phases.

Not yet built: the full recruiter feature set (jobs/candidates/interviews CRUD, kanban,
AI evaluation views), team management, the candidate interview-room recording flow
(device check → per-question record/upload → submit, with a whole-round countdown —
see the plan's §3.4), and the polling/real-time layer for async AI results.

## Getting started

```bash
cp .env.example .env.local     # VITE_API_URL defaults to http://localhost:3000/v1
npm install
npm run dev                    # http://localhost:5173
```

Requires the backend (`better_screening-BE`) running locally — see its README.

### Useful scripts

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint       # oxlint
npm run preview    # preview a production build
```

### Conventions

- `src/app/` — route tree, providers, and the two top-level layouts
  (`RecruiterShellLayout`, `InterviewRoomLayout`).
- `src/features/<name>/` — one folder per feature area; the candidate-facing
  `interview-room` feature must never import from recruiter feature folders.
- `src/components/ui/` — design-system primitives; `src/components/patterns/` —
  composite patterns reused across features.
- `src/context/` — cross-cutting React context (auth session, current organization).
- `src/lib/api/` — typed API client + per-resource API modules + a `queryKeys` factory
  that namespaces every React Query cache key by `organizationId`.
