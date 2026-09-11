import { useAuth } from '@/context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="font-extrabold text-[26px] text-ink-900">
        Welcome back, {user?.name.split(' ')[0]} 👋
      </h1>
      <p className="text-[15px] text-ink-500 mt-1">
        Jobs, candidates, and interview KPIs land here in Phase 2.
      </p>
    </div>
  );
}
