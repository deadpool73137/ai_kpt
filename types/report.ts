export interface AnalysisReport {
  id: string;
  kptEntryId: string;
  userId: string;
  quarter: string;
  summary: string;
  commonIssues: string[];
  suggestions: string[];
  createdAt?: string;
}
