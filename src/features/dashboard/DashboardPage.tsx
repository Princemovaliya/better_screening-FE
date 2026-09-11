import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="font-extrabold text-[26px] text-ink-900">
        Welcome back, {user?.name.split(' ')[0]} 👋
      </h1>
      <p className="text-[15px] text-ink-500 mt-1 mb-6">
        Jobs, candidates, and interviews are all live — head to one of the sections below,
        or check back here later for KPIs, funnels, and activity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <Card className="p-5">
          <h2 className="font-bold text-ink-900">Jobs</h2>
          <p className="text-[13px] text-ink-500 mt-1 mb-3">Create roles and interview rounds.</p>
          <Link to="/app/jobs">
            <Button variant="secondary" size="sm">
              View jobs
            </Button>
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold text-ink-900">Candidates</h2>
          <p className="text-[13px] text-ink-500 mt-1 mb-3">Track applicants through the pipeline.</p>
          <Link to="/app/candidates">
            <Button variant="secondary" size="sm">
              View candidates
            </Button>
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold text-ink-900">Interviews</h2>
          <p className="text-[13px] text-ink-500 mt-1 mb-3">Schedule and review interviews.</p>
          <Link to="/app/interviews">
            <Button variant="secondary" size="sm">
              View interviews
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
