import { Submission, SubmissionScore } from "@/types";

export class SubmissionService {
  // private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  /**
   * Submit a solution for a challenge
   */
  static async submitSolution(
    challengeId: string,
    formData: {
      submission_type: "CODE" | "FILE" | "LINK";
      code?: string;
      file?: File;
      github_link?: string;
      language?: string;
      description?: string;
    }
  ): Promise<Submission> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock submission response
    const mockSubmission: Submission = {
      id: `sub_${Date.now()}`,
      challenge_id: challengeId,
      team_id: "team_001",
      user_id: "user_001",
      submission_file_id: `file_${Date.now()}`,
      submission_format: formData.submission_type,
      status: "PROCESSING",
      submitted_at: new Date().toISOString(),
      is_latest: true,
    };

    return mockSubmission;
  }

  /**
   * Get submission details
   */
  static async getSubmission(submissionId: string): Promise<Submission | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockSubmission: Submission = {
      id: submissionId,
      challenge_id: "1",
      team_id: "team_001",
      user_id: "user_001",
      submission_file_id: "file_001",
      submission_format: "CODE",
      status: "SUCCESS",
      submitted_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
      is_latest: true,
    };

    return mockSubmission;
  }

  /**
   * Get user's submissions for a challenge
   */
  static async getSubmissionsByChallenge(
    challengeId: string,
    limit: number = 10
  ): Promise<Submission[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockSubmissions: Submission[] = [
      {
        id: "sub_001",
        challenge_id: challengeId,
        team_id: "team_001",
        user_id: "user_001",
        submission_file_id: "file_001",
        submission_format: "CODE",
        status: "SUCCESS",
        submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        processed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        is_latest: true,
      },
      {
        id: "sub_002",
        challenge_id: challengeId,
        team_id: "team_001",
        user_id: "user_001",
        submission_file_id: "file_002",
        submission_format: "CODE",
        status: "SUCCESS",
        submitted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        processed_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        is_latest: false,
      },
      {
        id: "sub_003",
        challenge_id: challengeId,
        team_id: "team_001",
        user_id: "user_001",
        submission_file_id: "file_003",
        submission_format: "FILE",
        status: "FAILED",
        submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        processed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        error_message: "Execution timeout: Code took longer than 30 seconds",
        is_latest: false,
      },
    ];

    return mockSubmissions.slice(0, limit);
  }

  /**
   * Get submission scores (for leaderboard)
   */
  static async getSubmissionScores(submissionId: string): Promise<SubmissionScore[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockScores: SubmissionScore[] = [
      {
        id: "score_001",
        submission_id: submissionId,
        metric_id: "metric_001",
        score_value: 0.957,
        calculated_at: new Date().toISOString(),
        metric: {
          id: "metric_001",
          challenge_id: "1",
          name: "Accuracy",
          description: "Classification accuracy",
          metric_type: "SCORING_METRIC",
          weight: 100,
          is_primary: true,
          min_value: 0,
          max_value: 1,
          direction: "HIGHER_IS_BETTER",
          created_at: new Date().toISOString(),
        },
      },
      {
        id: "score_002",
        submission_id: submissionId,
        metric_id: "metric_002",
        score_value: 0.234,
        calculated_at: new Date().toISOString(),
        metric: {
          id: "metric_002",
          challenge_id: "1",
          name: "Execution Time",
          description: "Execution time in seconds",
          metric_type: "CUSTOM_METRIC",
          weight: 20,
          is_primary: false,
          min_value: 0,
          max_value: 60,
          direction: "LOWER_IS_BETTER",
          created_at: new Date().toISOString(),
        },
      },
    ];

    return mockScores;
  }

  /**
   * Validate submission data
   */
  static validateSubmission(formData: {
    submission_type?: string;
    code?: string;
    file?: File;
    github_link?: string;
    description?: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.submission_type) {
      errors.push("Submission type is required");
    }

    if (formData.submission_type === "CODE") {
      if (!formData.code || formData.code.trim().length === 0) {
        errors.push("Code is required");
      }
      if (!formData.code || formData.code.length > 100000) {
        errors.push("Code must be less than 100KB");
      }
    }

    if (formData.submission_type === "FILE") {
      if (!formData.file) {
        errors.push("File is required");
      }
      if (formData.file && formData.file.size > 50 * 1024 * 1024) {
        errors.push("File must be less than 50MB");
      }
    }

    if (formData.submission_type === "LINK") {
      if (!formData.github_link || formData.github_link.trim().length === 0) {
        errors.push("GitHub link is required");
      }
      if (formData.github_link && !formData.github_link.includes("github.com")) {
        errors.push("Must be a valid GitHub URL");
      }
    }

    if (formData.description && formData.description.length > 5000) {
      errors.push("Description must be less than 5000 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
