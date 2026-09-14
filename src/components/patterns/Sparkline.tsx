/** A tiny inline line chart from real daily-bucketed counts (see the dashboard's
 * `KpiCard.sparkline`) — never decorative/random data. Renders nothing meaningful
 * for an all-zero or single-point series rather than drawing a misleading flat line
 * dressed up as a trend. */
export function Sparkline({ data, colorClassName }: { data: number[]; colorClassName: string }) {
  if (data.length < 2) return null;

  const w = 48;
  const h = 26;
  const pad = 3;
  const max = Math.max(...data);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colorClassName}
      />
    </svg>
  );
}
