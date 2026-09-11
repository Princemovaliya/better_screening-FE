import { useParams } from 'react-router-dom';

/**
 * Placeholder for the token-scoped candidate interview room. The full flow (device
 * check → per-question record/upload → submit, with a whole-round countdown) is a
 * later phase — see the implementation plan, §3.4.
 */
export function InterviewRoomLandingPage() {
  const { token } = useParams<{ token: string }>();
  return (
    <div className="text-center max-w-sm">
      <h1 className="font-extrabold text-[22px] text-ink-900">You're invited to an interview</h1>
      <p className="text-[14px] text-ink-500 mt-2">
        The full recording flow lands here in a later phase. Session token:{' '}
        <code className="text-ink-700">{token}</code>
      </p>
    </div>
  );
}
