# better_screening-FE

Frontend for **Better Screening** — a multi-tenant AI recruitment/interview platform.
React + Vite + TypeScript, styled with Tailwind CSS. See the full architecture and
build plan at `/home/prince/.claude/plans/hi-this-is-merry-milner.md` (or wherever it's
been moved to in this repo going forward).

## Status: Phase 3 — storage + candidate portal skeleton

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
- A small design-system primitive set (`components/ui`): Button, Input, Select,
  Textarea, Field, Card, Badge, Modal, Logo.
- **Jobs**: list with filters, a create/edit form with dynamic field arrays for skills
  and interview rounds (each round with its own dynamic question list), a details page.
- **Candidates**: list with filters, an "Add candidate" modal, a details page (stage
  change, notes, per-candidate interview list, delete).
- **Interviews**: list with status filter, a "Schedule interview" modal (from the
  candidate details page), a details page (reschedule/cancel/send-invitation, question
  list).
- Verified end-to-end in a real browser (Playwright against the live backend):
  signup → create job with rounds/skills → add candidate → schedule interview
  (candidate stage auto-advances) → edit an existing job (values pre-populate
  correctly) — zero console errors throughout.

- **Candidate interview room** (`/interview-room/:token`, isolated route tree, no
  recruiter code/data reachable): landing → device check (camera/mic preview) →
  one question at a time, each recorded then uploaded before advancing → thank-you
  screen. A single whole-round countdown (not per-question) is shown throughout and
  auto-submits on expiry. Reopening the link mid-round resumes at the first
  unanswered question rather than restarting.
  - Simplification vs. the original plan: uploads are **blocking per question**
    (record → upload → then advance) rather than a background queue that lets the
    candidate start the next question while the previous one still uploads. This
    still satisfies "nothing is lost on a crash" (each answer is durably stored
    before moving on) with much less moving-part complexity; a background queue
    with retry is a reasonable later upgrade if upload latency becomes an issue.
- Verified end-to-end in a real browser (Playwright, real MediaRecorder via Chrome's
  fake-device flags, actual presigned uploads to MinIO — not mocked): the full
  candidate flow (landing → device check → record both questions → thank-you),
  resuming correctly at question 2 after simulating a crash (with the countdown
  continuing from the original deadline, not resetting), and the Phase 2 recruiter
  flows (job creation, candidate creation, interview scheduling) — zero console
  errors throughout.

Not yet built: dashboard KPIs/charts/activity feed, team management, settings pages,
and the BullMQ-driven async AI pipeline / polling layer for results (deferred to
later phases per the plan's build order).

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
