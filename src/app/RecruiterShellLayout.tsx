import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { NotificationsBell } from '@/components/patterns/NotificationsBell';
import {
  IconBriefcase,
  IconDashboard,
  IconPeople,
  IconSearch,
  IconSettings,
  IconSparkle,
  IconVideo,
  Logo,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useOrg } from '@/context/OrgContext';
import { dashboardApi } from '@/lib/api/dashboard.api';
import { queryKeys } from '@/lib/api/queryKeys';

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/app/jobs', label: 'Jobs', icon: IconBriefcase },
  { to: '/app/candidates', label: 'Candidates', icon: IconPeople },
  { to: '/app/interviews', label: 'Interviews', icon: IconVideo },
  { to: '/app/settings', label: 'Settings', icon: IconSettings },
];

const ROLE_LABEL: Record<string, string> = { admin: 'Admin', recruiter: 'Recruiter' };

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function RecruiterShellLayout() {
  const { user, signOut } = useAuth();
  const { organization } = useOrg();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Same query the dashboard page itself uses (period=30) — React Query dedupes this
  // into one request whenever both are mounted, so the sidebar widget riding along
  // costs nothing extra in the common case.
  const { data } = useQuery({
    queryKey: queryKeys.dashboard(organization?.id ?? '', 30),
    queryFn: () => dashboardApi.getOverview(30),
    enabled: !!organization,
  });

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-ink-800">
      <aside className="fixed inset-y-0 left-0 w-[240px] bg-white border-r border-ink-200 flex flex-col">
        <div className="px-5 h-16 flex items-center border-b border-ink-100">
          <Logo size={30} />
        </div>
        <div className="px-5 pt-4 pb-1">
          <p className="text-[11px] font-bold tracking-wider text-ink-400">WORKSPACE</p>
        </div>
        <nav className="px-3 pb-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800',
                )
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl bg-violet-50 border border-violet-100 p-3.5">
          <div className="flex items-center gap-1.5 text-violet-700 font-bold text-[12px] mb-1">
            <IconSparkle className="w-3.5 h-3.5" />
            AI Assistant
          </div>
          <p className="text-[12px] text-ink-600 leading-snug">
            You have <span className="font-semibold">{data?.today.roundsToReview ?? 0} rounds</span> to
            review and <span className="font-semibold">{data?.today.interviewsToday ?? 0} interviews</span>{' '}
            today.
          </p>
        </div>

        <div className="mt-auto p-3 border-t border-ink-100">
          <div className="flex items-center gap-2.5 px-2 pb-2">
            <div className="w-8 h-8 rounded-full ai-gradient text-white grid place-items-center font-bold text-[12px] shrink-0">
              {user ? initialsOf(user.name) : ''}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-ink-400 truncate">
                {user ? (ROLE_LABEL[user.role] ?? user.role) : ''}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-ink-500 hover:bg-ink-100"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="pl-[240px] min-h-screen">
        <div className="h-16 flex items-center justify-between gap-4 px-6 border-b border-ink-100 bg-white">
          <form
            className="flex-1 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) navigate(`/app/candidates?search=${encodeURIComponent(search.trim())}`);
            }}
          >
            <div className="relative">
              <IconSearch className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates…"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-ink-50 border border-transparent text-[13px] outline-none focus:bg-white focus:border-ink-200 transition-colors"
              />
            </div>
          </form>
          <div className="flex items-center gap-1 shrink-0">
            <span className="hidden sm:inline text-[12px] text-ink-400 mr-1">{organization?.name}</span>
            <NotificationsBell />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
