import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard } from '@/components/patterns/KpiCard';
import {
  Badge,
  Button,
  Card,
  IconBriefcase,
  IconCalendarCheck,
  IconCheckCircle,
  IconFunnel,
  IconPeople,
  IconSparkle,
  IconTarget,
  Select,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useOrg } from '@/context/OrgContext';
import { ACTIVITY_ICON, type ActivityType } from '@/lib/api/activity.types';
import { CANDIDATE_STAGE_LABELS, CANDIDATE_STAGES, type CandidateStage } from '@/lib/api/candidates.types';
import { dashboardApi } from '@/lib/api/dashboard.api';
import type { JobStatus } from '@/lib/api/jobs.types';
import { queryKeys } from '@/lib/api/queryKeys';

const STATUS_TONE: Record<JobStatus, 'green' | 'amber' | 'slate'> = {
  open: 'green',
  draft: 'amber',
  closed: 'slate',
};

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { organization } = useOrg();
  const [period, setPeriod] = useState<7 | 30>(30);

  const { data } = useQuery({
    queryKey: queryKeys.dashboard(organization?.id ?? '', period),
    queryFn: () => dashboardApi.getOverview(period),
    enabled: !!organization,
  });

  const maxStageCount = Math.max(1, ...Object.values(data?.candidatesByStage ?? {}));

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-extrabold text-[26px] text-ink-900">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[15px] text-ink-500 mt-1">
            Here's what's happening with your hiring process today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Select
            className="!h-10 !w-auto"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value) as 7 | 30)}
          >
            <option value={7}>This week</option>
            <option value={30}>This month</option>
          </Select>
          <Link to="/app/jobs/new">
            <Button variant="ai">+ Create job</Button>
          </Link>
        </div>
      </div>

      {data && (
        <Card className="p-4 mb-5 !bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-100">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-lg ai-gradient text-white grid place-items-center shrink-0 mt-0.5">
                <IconSparkle className="w-4 h-4" />
              </span>
              <p className="text-[14px] text-ink-800">
                <span className="font-bold">AI summary:</span> {data.aiSummary.interviewsPending}{' '}
                interview{data.aiSummary.interviewsPending === 1 ? ' is' : 's are'} scheduled and{' '}
                {data.aiSummary.candidatesReadyToAdvance} candidate
                {data.aiSummary.candidatesReadyToAdvance === 1 ? ' is' : 's are'} ready to advance.
                {data.aiSummary.strongestOpenReqTitle && (
                  <>
                    {' '}
                    Your strongest open req is{' '}
                    <span className="font-bold">{data.aiSummary.strongestOpenReqTitle}</span>.
                  </>
                )}
              </p>
            </div>
            <Link to="/app/candidates?stage=interview">
              <Button size="sm" variant="secondary" className="shrink-0">
                Review now
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-5">
        <KpiCard
          icon={<IconBriefcase className="w-4.5 h-4.5" />}
          iconBg="bg-indigo-500"
          label="Current openings"
          value={data?.kpis.openings.value ?? 0}
          delta={data?.kpis.openings.delta ?? 0}
          sparkline={data?.kpis.openings.sparkline ?? []}
          sparklineColor="text-indigo-400"
        />
        <KpiCard
          icon={<IconPeople className="w-4.5 h-4.5" />}
          iconBg="bg-blue-500"
          label="Total candidates"
          value={data?.kpis.candidates.value ?? 0}
          delta={data?.kpis.candidates.delta ?? 0}
          sparkline={data?.kpis.candidates.sparkline ?? []}
          sparklineColor="text-blue-400"
        />
        <KpiCard
          icon={<IconCalendarCheck className="w-4.5 h-4.5" />}
          iconBg="bg-amber-500"
          label="Interviews pending"
          value={data?.kpis.interviewsPending.value ?? 0}
          delta={data?.kpis.interviewsPending.delta ?? 0}
          sparkline={data?.kpis.interviewsPending.sparkline ?? []}
          sparklineColor="text-amber-400"
        />
        <KpiCard
          icon={<IconTarget className="w-4.5 h-4.5" />}
          iconBg="bg-emerald-500"
          label="Hired this month"
          value={data?.kpis.hired.value ?? 0}
          delta={data?.kpis.hired.delta ?? 0}
          sparkline={data?.kpis.hired.sparkline ?? []}
          sparklineColor="text-emerald-400"
        />
        <KpiCard
          icon={<IconFunnel className="w-4.5 h-4.5" />}
          iconBg="bg-violet-500"
          label="In screening"
          value={data?.kpis.inScreening.value ?? 0}
          delta={data?.kpis.inScreening.delta ?? 0}
          sparkline={data?.kpis.inScreening.sparkline ?? []}
          sparklineColor="text-violet-400"
        />
        <KpiCard
          icon={<IconCheckCircle className="w-4.5 h-4.5" />}
          iconBg="bg-pink-500"
          label="Interviews completed"
          value={data?.kpis.interviewsCompleted.value ?? 0}
          delta={data?.kpis.interviewsCompleted.delta ?? 0}
          sparkline={data?.kpis.interviewsCompleted.sparkline ?? []}
          sparklineColor="text-pink-400"
        />
      </div>

      <Card className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-ink-900 text-lg">Current openings</h2>
            <p className="text-[13px] text-ink-500">Your active job requisitions</p>
          </div>
          <Link to="/app/jobs" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        {!data || data.openJobs.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-6">No jobs posted yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-[13px] min-w-[640px]">
              <thead>
                <tr className="text-ink-400 border-b border-ink-100">
                  <th className="font-semibold pb-2.5 pr-3">Job title</th>
                  <th className="font-semibold pb-2.5 pr-3">Department</th>
                  <th className="font-semibold pb-2.5 pr-3">Applicants</th>
                  <th className="font-semibold pb-2.5 pr-3">Screening</th>
                  <th className="font-semibold pb-2.5 pr-3">Interviews</th>
                  <th className="font-semibold pb-2.5 pr-3">Status</th>
                  <th className="font-semibold pb-2.5">Posted</th>
                </tr>
              </thead>
              <tbody>
                {data.openJobs.map((job) => (
                  <tr key={job.id} className="border-b border-ink-50 last:border-0">
                    <td className="py-3 pr-3">
                      <Link to={`/app/jobs/${job.id}`} className="font-semibold text-ink-900 hover:text-brand-600">
                        {job.title}
                      </Link>
                      <p className="text-[12px] text-ink-400">{job.location ?? '—'}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <Badge tone="sky">{job.department}</Badge>
                    </td>
                    <td className="py-3 pr-3 font-semibold text-ink-800">{job.applicants}</td>
                    <td className="py-3 pr-3 font-semibold text-ink-800">{job.screening}</td>
                    <td className="py-3 pr-3 font-semibold text-ink-800">{job.interviews}</td>
                    <td className="py-3 pr-3">
                      <Badge tone={STATUS_TONE[job.status as JobStatus]} dot>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-ink-500">
                      {new Date(job.postedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold text-ink-900 text-lg mb-4">Candidate pipeline</h2>
          <div className="space-y-3">
            {[...CANDIDATE_STAGES, 'rejected' as const].map((stage: CandidateStage) => {
              const count = data?.candidatesByStage[stage] ?? 0;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-24 text-[13px] text-ink-500 shrink-0">
                    {CANDIDATE_STAGE_LABELS[stage]}
                  </span>
                  <div className="flex-1 h-6 rounded-md bg-ink-100 overflow-hidden">
                    <div
                      className="h-full ai-gradient transition-all"
                      style={{ width: `${(count / maxStageCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[13px] font-semibold text-ink-800">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold text-ink-900 text-lg mb-4">Recent activity</h2>
          {!data || data.recentActivity.length === 0 ? (
            <p className="text-sm text-ink-400">Nothing yet — activity will show up here as your team works.</p>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.map((a) => (
                <div key={a.id} className="flex gap-2.5 text-[13px]">
                  <span className="shrink-0">{ACTIVITY_ICON[a.type as ActivityType] ?? '•'}</span>
                  <div>
                    <p className="text-ink-700">{a.message}</p>
                    <p className="text-[11px] text-ink-400">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
