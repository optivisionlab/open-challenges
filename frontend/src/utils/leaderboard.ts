import type { Leaderboard, LeaderboardEntry } from "@/types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Mock leaderboard data for different challenges
export const mockLeaderboards: { [key: string]: LeaderboardEntry[] } = {
  "1": [ // Image Classification Challenge
    {
      rank: 1,
      team_id: "team-1",
      team_name: "AI Legends",
      team_member_count: 5,
      overall_score: 97.85,
      primary_metric_score: 0.9850,
      submission_count: 45,
      last_submission_at: "2026-03-24T10:30:00Z",
      metric_scores: {
        accuracy: 98.5,
        precision: 97.2,
        recall: 96.8,
      },
    },
    {
      rank: 2,
      team_id: "team-2",
      team_name: "Neural Nets Pro",
      team_member_count: 3,
      overall_score: 96.42,
      primary_metric_score: 0.9642,
      submission_count: 38,
      last_submission_at: "2026-03-24T09:15:00Z",
      metric_scores: {
        accuracy: 96.4,
        precision: 96.1,
        recall: 95.5,
      },
    },
    {
      rank: 3,
      team_id: "team-3",
      team_name: "Data Wizards",
      team_member_count: 4,
      overall_score: 95.67,
      primary_metric_score: 0.9567,
      submission_count: 42,
      last_submission_at: "2026-03-24T08:45:00Z",
      metric_scores: {
        accuracy: 95.7,
        precision: 95.2,
        recall: 94.8,
      },
    },
    {
      rank: 4,
      team_id: "team-4",
      team_name: "ML Masters",
      team_member_count: 2,
      overall_score: 94.89,
      primary_metric_score: 0.9489,
      submission_count: 35,
      last_submission_at: "2026-03-23T22:30:00Z",
      metric_scores: {
        accuracy: 94.9,
        precision: 94.5,
        recall: 93.9,
      },
    },
    {
      rank: 5,
      team_id: "team-5",
      team_name: "Code Crunchers",
      team_member_count: 6,
      overall_score: 93.21,
      primary_metric_score: 0.9321,
      submission_count: 28,
      last_submission_at: "2026-03-23T18:00:00Z",
      metric_scores: {
        accuracy: 93.2,
        precision: 93.0,
        recall: 92.5,
      },
    },
    {
      rank: 6,
      team_id: "team-6",
      team_name: "Deep Learning Squad",
      team_member_count: 4,
      overall_score: 91.78,
      primary_metric_score: 0.9178,
      submission_count: 31,
      last_submission_at: "2026-03-23T15:45:00Z",
      metric_scores: {
        accuracy: 91.8,
        precision: 91.5,
        recall: 91.0,
      },
    },
    {
      rank: 7,
      team_id: "team-7",
      team_name: "PyTorch Pioneers",
      team_member_count: 3,
      overall_score: 90.45,
      primary_metric_score: 0.9045,
      submission_count: 25,
      last_submission_at: "2026-03-23T12:30:00Z",
      metric_scores: {
        accuracy: 90.5,
        precision: 90.2,
        recall: 89.7,
      },
    },
    {
      rank: 8,
      team_id: "team-8",
      team_name: "Tensor Flow Team",
      team_member_count: 5,
      overall_score: 89.12,
      primary_metric_score: 0.8912,
      submission_count: 22,
      last_submission_at: "2026-03-23T10:15:00Z",
      metric_scores: {
        accuracy: 89.1,
        precision: 88.9,
        recall: 88.3,
      },
    },
    {
      rank: 9,
      team_id: "team-9",
      team_name: "Smart Brains",
      team_member_count: 2,
      overall_score: 87.89,
      primary_metric_score: 0.8789,
      submission_count: 19,
      last_submission_at: "2026-03-22T20:00:00Z",
      metric_scores: {
        accuracy: 87.9,
        precision: 87.6,
        recall: 87.1,
      },
    },
    {
      rank: 10,
      team_id: "team-10",
      team_name: "Vision Quest",
      team_member_count: 3,
      overall_score: 86.34,
      primary_metric_score: 0.8634,
      submission_count: 16,
      last_submission_at: "2026-03-22T14:30:00Z",
      metric_scores: {
        accuracy: 86.3,
        precision: 86.1,
        recall: 85.6,
      },
    },
  ],
  "2": [ // Time Series Forecasting
    {
      rank: 1,
      team_id: "team-11",
      team_name: "Time Travelers",
      team_member_count: 4,
      overall_score: 88.95,
      primary_metric_score: 0.8895,
      submission_count: 32,
      last_submission_at: "2026-03-24T11:20:00Z",
      metric_scores: {
        mse: 0.0245,
        rmse: 0.1567,
        mae: 0.1234,
      },
    },
    {
      rank: 2,
      team_id: "team-12",
      team_name: "Forecast Experts",
      team_member_count: 3,
      overall_score: 87.23,
      primary_metric_score: 0.8723,
      submission_count: 28,
      last_submission_at: "2026-03-24T10:00:00Z",
      metric_scores: {
        mse: 0.0312,
        rmse: 0.1766,
        mae: 0.1456,
      },
    },
    {
      rank: 3,
      team_id: "team-13",
      team_name: "ARIMA Aces",
      team_member_count: 2,
      overall_score: 85.67,
      primary_metric_score: 0.8567,
      submission_count: 24,
      last_submission_at: "2026-03-24T08:30:00Z",
      metric_scores: {
        mse: 0.0401,
        rmse: 0.2001,
        mae: 0.1678,
      },
    },
  ],
  "3": [ // NLP Sentiment Analysis
    {
      rank: 1,
      team_id: "team-14",
      team_name: "NLP Ninjas",
      team_member_count: 5,
      overall_score: 94.56,
      primary_metric_score: 0.9456,
      submission_count: 41,
      last_submission_at: "2026-03-24T12:00:00Z",
      metric_scores: {
        f1_score: 0.9456,
        precision: 0.9501,
        recall: 0.9412,
      },
    },
    {
      rank: 2,
      team_id: "team-15",
      team_name: "Sentiment Sleuths",
      team_member_count: 3,
      overall_score: 92.34,
      primary_metric_score: 0.9234,
      submission_count: 35,
      last_submission_at: "2026-03-24T11:15:00Z",
      metric_scores: {
        f1_score: 0.9234,
        precision: 0.9289,
        recall: 0.9180,
      },
    },
  ],
};

export class LeaderboardService {
  /**
   * Get leaderboard for a specific challenge
   */
  static async getLeaderboard(challengeId: string): Promise<Leaderboard> {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(
      //   `${API_BASE_URL}/leaderboards/${challengeId}`
      // );
      // return response.json();

      // Mock implementation
      const entries = mockLeaderboards[challengeId] || [];
      return {
        challenge_id: challengeId,
        entries,
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  }

  /**
   * Get leaderboard with pagination
   */
  static async getLeaderboardPaginated(
    challengeId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    try {
      const leaderboard = await this.getLeaderboard(challengeId);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        challenge_id: challengeId,
        entries: leaderboard.entries.slice(start, end),
        total: leaderboard.entries.length,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(leaderboard.entries.length / pageSize),
        updated_at: leaderboard.updated_at,
      };
    } catch (error) {
      console.error("Error fetching paginated leaderboard:", error);
      throw error;
    }
  }

  /**
   * Search team in leaderboard
   */
  static async searchTeam(challengeId: string, teamName: string) {
    try {
      const leaderboard = await this.getLeaderboard(challengeId);
      return leaderboard.entries.find(
        (e) =>
          e.team_name.toLowerCase().includes(teamName.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching team:", error);
      throw error;
    }
  }
}
