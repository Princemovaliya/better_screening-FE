import type { ActivityLogEntry } from './activity.types';

export interface KpiCard {
  value: number;
  delta: number;
  sparkline: number[];
}

export interface OpenJobRow {
  id: string;
  title: string;
  department: string;
  location: string | null;
  status: string;
  applicants: number;
  screening: number;
  interviews: number;
  postedAt: string;
}

export interface AiSummary {
  interviewsPending: number;
  candidatesReadyToAdvance: number;
  strongestOpenReqTitle: string | null;
}

export interface DashboardOverview {
  kpis: {
    openings: KpiCard;
    candidates: KpiCard;
    interviewsPending: KpiCard;
    hired: KpiCard;
    inScreening: KpiCard;
    interviewsCompleted: KpiCard;
  };
  aiSummary: AiSummary;
  openJobs: OpenJobRow[];
  today: { interviewsToday: number; roundsToReview: number };
  recentActivity: ActivityLogEntry[];
  candidatesByStage: Record<string, number>;
}
