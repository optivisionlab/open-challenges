// User types
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

// Team types
export interface Team {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  logo_url?: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "ADMIN" | "MEMBER";
  joined_at: string;
  user: User;
}

// Challenge types
export type ChallengeDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ChallengeStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "ARCHIVED";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  dataset_url?: string;
  status: ChallengeStatus;
  start_date: string;
  end_date: string;
  image_url?: string;
  difficulty_level: ChallengeDifficulty;
  prize_pool?: number;
  participant_count: number;
  submission_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Metric types
export type MetricType = "SCORING_METRIC" | "CUSTOM_METRIC";
export type MetricDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER";

export interface Metric {
  id: string;
  challenge_id: string;
  name: string;
  description?: string;
  metric_type: MetricType;
  formula?: string;
  weight: number;
  is_primary: boolean;
  min_value: number;
  max_value: number;
  direction: MetricDirection;
  created_at: string;
}

// Submission types
export type SubmissionStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";

export interface Submission {
  id: string;
  challenge_id: string;
  team_id: string;
  user_id: string;
  submission_file_id: string;
  submission_format: string;
  status: SubmissionStatus;
  submitted_at: string;
  processed_at?: string;
  error_message?: string;
  is_latest: boolean;
}

export interface SubmissionScore {
  id: string;
  submission_id: string;
  metric_id: string;
  score_value: number;
  calculated_at: string;
  metric: Metric;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  team_id: string;
  team_name: string;
  team_member_count?: number;
  overall_score: number;
  primary_metric_score: number;
  submission_count: number;
  last_submission_at: string;
  metric_scores: {
    [key: string]: number;
  };
}

export interface Leaderboard {
  challenge_id: string;
  entries: LeaderboardEntry[];
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
