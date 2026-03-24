export interface GlobalLeaderboardEntry {
  rank: number;
  team_id: string;
  team_name: string;
  team_member_count: number;
  overall_score: number;
  total_score: number;
  submission_count: number;
  submissions: number;
  challenges_completed: number;
  participation_rate: number;
  last_submission: string;
  last_submission_at: string;
  recent_submission: string;
  badges: string[];
  primary_metric_score?: number;
  last_submission_date?: string;
}

export interface LeaderboardFilter {
  challenge_id?: string;
  time_period: "all_time" | "this_month" | "this_week";
  sort_by: "score" | "submissions" | "recent";
}

export class GlobalLeaderboardService {
  /**
   * Get global leaderboard with pagination
   */
  static async getGlobalLeaderboard(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    entries: GlobalLeaderboardEntry[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockData: GlobalLeaderboardEntry[] = [
      {
        rank: 1,
        team_id: "team_1",
        team_name: "AI Legends",
        team_member_count: 5,
        overall_score: 9850,
        total_score: 28500,
        submission_count: 34,
        submissions: 34,
        recent_submission: "2026-03-24",
        last_submission_at: "2026-03-24T14:30:00Z",
        last_submission: "2 hours ago",
        challenges_completed: 6,
        participation_rate: 100,
        badges: ["🏆", "⭐", "🔥"],
      },
      {
        rank: 2,
        team_id: "team_2",
        team_name: "Data Warriors",
        team_member_count: 4,
        overall_score: 9620,
        total_score: 27300,
        submission_count: 31,
        submissions: 31,
        recent_submission: "2026-03-24",
        last_submission_at: "2026-03-24T12:30:00Z",
        last_submission: "4 hours ago",
        challenges_completed: 5,
        participation_rate: 83,
        badges: ["⭐", "🔥"],
      },
      {
        rank: 3,
        team_id: "team_3",
        team_name: "Neural Ninjas",
        team_member_count: 3,
        overall_score: 9410,
        total_score: 26800,
        submission_count: 28,
        submissions: 28,
        recent_submission: "2026-03-23",
        last_submission_at: "2026-03-23T18:45:00Z",
        last_submission: "1 day ago",
        challenges_completed: 5,
        participation_rate: 100,
        badges: ["⭐"],
      },
      {
        rank: 4,
        team_id: "team_4",
        team_name: "Code Crusaders",
        team_member_count: 6,
        overall_score: 9200,
        total_score: 25600,
        submission_count: 25,
        submissions: 25,
        recent_submission: "2026-03-23",
        last_submission_at: "2026-03-23T10:15:00Z",
        last_submission: "2 days ago",
        challenges_completed: 4,
        participation_rate: 67,
        badges: [],
      },
      {
        rank: 5,
        team_id: "team_5",
        team_name: "ML Mavericks",
        team_member_count: 4,
        overall_score: 8950,
        total_score: 24700,
        submission_count: 22,
        submissions: 22,
        recent_submission: "2026-03-22",
        last_submission_at: "2026-03-22T16:20:00Z",
        last_submission: "3 days ago",
        challenges_completed: 4,
        participation_rate: 75,
        badges: [],
      },
      {
        rank: 6,
        team_id: "team_6",
        team_name: "Python Pioneers",
        team_member_count: 3,
        overall_score: 8720,
        total_score: 23450,
        submission_count: 20,
        submissions: 20,
        recent_submission: "2026-03-22",
        last_submission_at: "2026-03-22T09:00:00Z",
        last_submission: "5 days ago",
        challenges_completed: 4,
        participation_rate: 80,
        badges: [],
      },
      {
        rank: 7,
        team_id: "team_7",
        team_name: "Algorithm Assassins",
        team_member_count: 5,
        overall_score: 8510,
        total_score: 22900,
        submission_count: 18,
        submissions: 18,
        recent_submission: "2026-03-21",
        last_submission_at: "2026-03-21T15:45:00Z",
        last_submission: "1 week ago",
        challenges_completed: 3,
        participation_rate: 60,
        badges: [],
      },
      {
        rank: 8,
        team_id: "team_8",
        team_name: "Data Scientists United",
        team_member_count: 4,
        overall_score: 8300,
        total_score: 22100,
        submission_count: 16,
        submissions: 16,
        recent_submission: "2026-03-21",
        last_submission_at: "2026-03-21T11:30:00Z",
        last_submission: "1 week ago",
        challenges_completed: 3,
        participation_rate: 50,
        badges: [],
      },
      {
        rank: 9,
        team_id: "team_9",
        team_name: "Tech Titans",
        team_member_count: 7,
        overall_score: 8080,
        total_score: 21300,
        submission_count: 14,
        submissions: 14,
        recent_submission: "2026-03-20",
        last_submission_at: "2026-03-20T13:00:00Z",
        last_submission: "2 weeks ago",
        challenges_completed: 3,
        participation_rate: 43,
        badges: [],
      },
      {
        rank: 10,
        team_id: "team_10",
        team_name: "Code Crafters",
        team_member_count: 2,
        overall_score: 7850,
        total_score: 20500,
        submission_count: 12,
        submissions: 12,
        recent_submission: "2026-03-20",
        last_submission_at: "2026-03-20T10:45:00Z",
        last_submission: "2 weeks ago",
        challenges_completed: 3,
        participation_rate: 50,
        badges: [],
      },
      {
        rank: 11,
        team_id: "team_11",
        team_name: "Smart Solvers",
        team_member_count: 3,
        overall_score: 7620,
        total_score: 19800,
        submission_count: 10,
        submissions: 10,
        recent_submission: "2026-03-19",
        last_submission_at: "2026-03-19T14:20:00Z",
        last_submission: "3 weeks ago",
        challenges_completed: 2,
        participation_rate: 40,
        badges: [],
      },
      {
        rank: 12,
        team_id: "team_12",
        team_name: "Quantum Questers",
        team_member_count: 4,
        overall_score: 7400,
        total_score: 19200,
        submission_count: 8,
        submissions: 8,
        recent_submission: "2026-03-19",
        last_submission_at: "2026-03-19T09:15:00Z",
        last_submission: "3 weeks ago",
        challenges_completed: 2,
        participation_rate: 33,
        badges: [],
      },
      {
        rank: 13,
        team_id: "team_13",
        team_name: "Innovation Inc",
        team_member_count: 5,
        overall_score: 7150,
        total_score: 18600,
        submission_count: 6,
        submissions: 6,
        recent_submission: "2026-03-18",
        last_submission_at: "2026-03-18T16:45:00Z",
        last_submission: "1 month ago",
        challenges_completed: 2,
        participation_rate: 29,
        badges: [],
      },
      {
        rank: 14,
        team_id: "team_14",
        team_name: "Future Developers",
        team_member_count: 3,
        overall_score: 6920,
        total_score: 18000,
        submission_count: 5,
        submissions: 5,
        recent_submission: "2026-03-18",
        last_submission_at: "2026-03-18T12:00:00Z",
        last_submission: "1 month ago",
        challenges_completed: 2,
        participation_rate: 33,
        badges: [],
      },
      {
        rank: 15,
        team_id: "team_15",
        team_name: "The Analysts",
        team_member_count: 2,
        overall_score: 6700,
        total_score: 17400,
        submission_count: 4,
        submissions: 4,
        recent_submission: "2026-03-17",
        last_submission_at: "2026-03-17T15:30:00Z",
        last_submission: "1 month ago",
        challenges_completed: 1,
        participation_rate: 25,
        badges: [],
      },
    ];

    const total = mockData.length;
    const pages = Math.ceil(total / limit);
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedData = mockData.slice(startIdx, endIdx);

    return {
      entries: paginatedData,
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Get global statistics
   */
  static async getGlobalStats(): Promise<{
    total_teams: number;
    total_submissions: number;
    total_participants: number;
    average_score: number;
    total_challenges: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      total_teams: 150,
      total_submissions: 3542,
      total_participants: 625,
      average_score: 6230,
      total_challenges: 6,
    };
  }

  /**
   * Get trending teams (most active recently)
   */
  static async getTrendingTeams(limit: number = 5): Promise<GlobalLeaderboardEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockTrending: GlobalLeaderboardEntry[] = [
      {
        rank: 1,
        team_id: "team_1",
        team_name: "AI Legends",
        team_member_count: 5,
        overall_score: 9850,
        total_score: 28500,
        submission_count: 34,
        submissions: 34,
        recent_submission: "2026-03-24",
        last_submission_at: "2026-03-24T14:30:00Z",
        last_submission: "2 hours ago",
        challenges_completed: 6,
        participation_rate: 100,
        badges: ["🏆", "⭐", "🔥"],
      },
      {
        rank: 2,
        team_id: "team_2",
        team_name: "Data Warriors",
        team_member_count: 4,
        overall_score: 9620,
        total_score: 27300,
        submission_count: 31,
        submissions: 31,
        recent_submission: "2026-03-24",
        last_submission_at: "2026-03-24T12:30:00Z",
        last_submission: "4 hours ago",
        challenges_completed: 5,
        participation_rate: 83,
        badges: ["⭐", "🔥"],
      },
      {
        rank: 4,
        team_id: "team_4",
        team_name: "Code Crusaders",
        team_member_count: 6,
        overall_score: 9200,
        total_score: 25600,
        submission_count: 25,
        submissions: 25,
        recent_submission: "2026-03-23",
        last_submission_at: "2026-03-23T10:15:00Z",
        last_submission: "2 days ago",
        challenges_completed: 4,
        participation_rate: 67,
        badges: [],
      },
      {
        rank: 11,
        team_id: "team_11",
        team_name: "Smart Solvers",
        team_member_count: 3,
        overall_score: 7620,
        total_score: 19800,
        submission_count: 10,
        submissions: 10,
        recent_submission: "2026-03-19",
        last_submission_at: "2026-03-19T14:20:00Z",
        last_submission: "3 weeks ago",
        challenges_completed: 2,
        participation_rate: 40,
        badges: [],
      },
      {
        rank: 13,
        team_id: "team_13",
        team_name: "Innovation Inc",
        team_member_count: 5,
        overall_score: 7150,
        total_score: 18600,
        submission_count: 6,
        submissions: 6,
        recent_submission: "2026-03-18",
        last_submission_at: "2026-03-18T16:45:00Z",
        last_submission: "1 month ago",
        challenges_completed: 2,
        participation_rate: 29,
        badges: [],
      },
    ];

    return mockTrending.slice(0, limit);
  }
}
