import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card } from '@/components/ui';
import { useOrg } from '@/context/OrgContext';
import { interviewsApi } from '@/lib/api/interviews.api';
import { INTERVIEW_STATUS_LABELS, type InterviewStatus } from '@/lib/api/interviews.types';
import { queryKeys } from '@/lib/api/queryKeys';

const STATUS_TONE: Record<InterviewStatus, 'amber' | 'brand' | 'violet' | 'green' | 'slate'> = {
  scheduled: 'amber',
  invitation_sent: 'brand',
  in_progress: 'violet',
  pending_evaluation: 'violet',
  completed: 'green',
  cancelled: 'slate',
};

export function InterviewDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { organization } = useOrg();
  const queryClient = useQueryClient();

  const { data: interview, isLoading } = useQuery({
    queryKey: queryKeys.interview(organization?.id ?? '', id ?? ''),
    queryFn: () => interviewsApi.get(id!),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['org', organization?.id, 'interviews'] });
  };

  const sendInvitationMutation = useMutation({
    mutationFn: () => interviewsApi.sendInvitation(id!),
    onSuccess: invalidate,
  });
  const cancelMutation = useMutation({
    mutationFn: () => interviewsApi.cancel(id!),
    onSuccess: invalidate,
  });

  if (isLoading) return <div className="p-6 text-sm text-ink-500">Loading…</div>;
  if (!interview) return <div className="p-6 text-sm text-ink-500">Interview not found.</div>;

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <nav className="text-[13px] text-ink-500 mb-4">
        <Link to="/app/interviews" className="hover:text-brand-600 font-medium">
          Interviews
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-800 font-semibold">{interview.roundName}</span>
      </nav>

      <Card className="p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-extrabold text-[20px] text-ink-900">{interview.roundName}</h1>
              <Badge tone={STATUS_TONE[interview.status]} dot>
                {INTERVIEW_STATUS_LABELS[interview.status]}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-ink-500">
              {interview.candidate && (
                <Link to={`/app/candidates/${interview.candidate.id}`} className="hover:text-brand-600">
                  {interview.candidate.name}
                </Link>
              )}
              {interview.job && (
                <Link to={`/app/jobs/${interview.job.id}`} className="hover:text-brand-600">
                  {interview.job.title}
                </Link>
              )}
              <span>{new Date(interview.scheduledAt).toLocaleString()}</span>
              <span>{interview.durationMinutes} min</span>
              <span>{interview.timezone}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {interview.status === 'scheduled' && (
              <Button
                variant="ai"
                loading={sendInvitationMutation.isPending}
                onClick={() => sendInvitationMutation.mutate()}
              >
                Send invitation
              </Button>
            )}
            {(interview.status === 'scheduled' || interview.status === 'invitation_sent') && (
              <Button
                variant="secondary"
                className="!text-rose-600 !border-rose-200 hover:!bg-rose-50"
                loading={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-bold text-ink-900 text-lg mb-3">
          Questions ({interview.questions.length})
        </h2>
        {interview.questions.length === 0 ? (
          <p className="text-sm text-ink-400">No questions configured for this round.</p>
        ) : (
          <div className="space-y-2">
            {interview.questions.map((q, i) => (
              <div key={q.id} className="flex gap-2.5 text-[13px] rounded-lg border border-ink-100 p-3">
                <span className="font-semibold text-ink-400">{i + 1}</span>
                <div>
                  <p className="text-ink-700">{q.questionText}</p>
                  <Badge tone="slate">{q.questionType}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
