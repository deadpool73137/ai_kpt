export interface KptEntry {
  id: string;
  userId: string;
  quarter: string; // e.g. "2025-Q1"
  keep: string[];
  problem: string[];
  try: string[];
  createdAt?: string;
  updatedAt?: string;
}
