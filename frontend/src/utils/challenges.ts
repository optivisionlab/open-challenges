import type { Challenge, PaginatedResponse, Metric } from "@/types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Mock data for demo purposes (will be replaced with real API calls)
export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Image Classification Challenge",
    description:
      "Build a model to classify images into 10 different categories with high accuracy.",
    problem_statement:
      "You are given a dataset of 50,000 labeled images from 10 different categories. Your task is to build a machine learning model that can accurately classify images into one of these categories.",
    dataset_url: "https://example.com/datasets/image-classification",
    status: "ACTIVE",
    start_date: "2026-01-15T00:00:00Z",
    end_date: "2026-04-15T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    difficulty_level: "MEDIUM",
    prize_pool: 5000,
    participant_count: 245,
    submission_count: 892,
    created_by: "admin-1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-03-20T12:00:00Z",
  },
  {
    id: "2",
    title: "Time Series Forecasting",
    description: "Predict future stock prices using historical time series data.",
    problem_statement:
      "Using 5 years of historical stock price data, build a model to forecast the next 30 days of closing prices for a specific stock.",
    dataset_url: "https://example.com/datasets/time-series",
    status: "ACTIVE",
    start_date: "2026-02-01T00:00:00Z",
    end_date: "2026-05-01T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1611532900597-0ef6a0f8d0f5?w=500&h=300&fit=crop",
    difficulty_level: "HARD",
    prize_pool: 8000,
    participant_count: 156,
    submission_count: 423,
    created_by: "admin-2",
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-03-22T15:30:00Z",
  },
  {
    id: "3",
    title: "NLP Sentiment Analysis",
    description: "Detect sentiment in customer reviews with advanced NLP techniques.",
    problem_statement:
      "Classify a corpus of customer reviews into sentiment categories: positive, negative, neutral. The dataset contains 10,000 labeled reviews from various e-commerce platforms.",
    dataset_url: "https://example.com/datasets/nlp-sentiment",
    status: "ACTIVE",
    start_date: "2026-03-01T00:00:00Z",
    end_date: "2026-06-01T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    difficulty_level: "MEDIUM",
    prize_pool: 6000,
    participant_count: 198,
    submission_count: 567,
    created_by: "admin-1",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-03-21T10:15:00Z",
  },
  {
    id: "4",
    title: "Regression: House Price Prediction",
    description: "Predict house prices based on various features using regression models.",
    problem_statement:
      "Build a regression model to predict house prices based on features like square footage, number of rooms, location, and age of the house.",
    dataset_url: "https://example.com/datasets/house-prices",
    status: "CLOSED",
    start_date: "2025-12-15T00:00:00Z",
    end_date: "2026-03-15T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
    difficulty_level: "EASY",
    prize_pool: 3000,
    participant_count: 312,
    submission_count: 1125,
    created_by: "admin-3",
    created_at: "2025-12-01T00:00:00Z",
    updated_at: "2026-03-15T23:59:59Z",
  },
  {
    id: "5",
    title: "Computer Vision Object Detection",
    description: "Detect and localize objects in images using advanced CV techniques.",
    problem_statement:
      "Implement an object detection model to identify and locate multiple objects within images. The dataset contains images with bounding box annotations.",
    dataset_url: "https://example.com/datasets/object-detection",
    status: "ACTIVE",
    start_date: "2026-03-10T00:00:00Z",
    end_date: "2026-06-10T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1677691711202-c3f61f71e8c4?w=500&h=300&fit=crop",
    difficulty_level: "HARD",
    prize_pool: 10000,
    participant_count: 167,
    submission_count: 289,
    created_by: "admin-2",
    created_at: "2026-02-20T00:00:00Z",
    updated_at: "2026-03-22T14:00:00Z",
  },
  {
    id: "6",
    title: "Anomaly Detection",
    description: "Detect anomalies in network traffic and system logs.",
    problem_statement:
      "Build an anomaly detection system to identify unusual patterns in network traffic and system logs. The dataset contains both normal and anomalous traffic patterns.",
    dataset_url: "https://example.com/datasets/anomaly-detection",
    status: "DRAFT",
    start_date: "2026-04-01T00:00:00Z",
    end_date: "2026-07-01T23:59:59Z",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=500&h=300&fit=crop",
    difficulty_level: "HARD",
    prize_pool: 7000,
    participant_count: 0,
    submission_count: 0,
    created_by: "admin-1",
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
];

export class ChallengeService {
  /**
   * Get list of all challenges with pagination
   */
  static async getChallenges(page: number = 1, pageSize: number = 10) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(
      //   `${API_BASE_URL}/challenges?page=${page}&page_size=${pageSize}`
      // );
      // return response.json();

      // Mock implementation
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = mockChallenges.slice(start, end);

      return {
        items,
        total: mockChallenges.length,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(mockChallenges.length / pageSize),
      } as PaginatedResponse<Challenge>;
    } catch (error) {
      console.error("Error fetching challenges:", error);
      throw error;
    }
  }

  /**
   * Get single challenge by ID
   */
  static async getChallengeById(id: string) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges/${id}`);
      // return response.json();

      // Mock implementation
      const challenge = mockChallenges.find((c) => c.id === id);
      if (!challenge) throw new Error("Challenge not found");
      return challenge;
    } catch (error) {
      console.error("Error fetching challenge:", error);
      throw error;
    }
  }

  /**
   * Get active challenges
   */
  static async getActiveChallenges() {
    try {
      // Mock implementation
      const challenges = mockChallenges.filter((c) => c.status === "ACTIVE");
      return challenges;
    } catch (error) {
      console.error("Error fetching active challenges:", error);
      throw error;
    }
  }

  /**
   * Get challenges filtered by difficulty
   */
  static async getChallengesByDifficulty(difficulty: "EASY" | "MEDIUM" | "HARD") {
    try {
      // Mock implementation
      const challenges = mockChallenges.filter((c) => c.difficulty_level === difficulty);
      return challenges;
    } catch (error) {
      console.error("Error fetching challenges by difficulty:", error);
      throw error;
    }
  }

  /**
   * Get challenges filtered by status
   */
  static async getChallengesByStatus(status: string) {
    try {
      // Mock implementation
      const challenges = mockChallenges.filter((c) => c.status === status);
      return challenges;
    } catch (error) {
      console.error("Error fetching challenges by status:", error);
      throw error;
    }
  }

  /**
   * Search challenges by query
   */
  static async searchChallenges(query: string) {
    try {
      // Mock implementation
      const lowerQuery = query.toLowerCase();
      const results = mockChallenges.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.problem_statement.toLowerCase().includes(lowerQuery)
      );
      return results;
    } catch (error) {
      console.error("Error searching challenges:", error);
      throw error;
    }
  }

  /**
   * Filter challenges by multiple criteria
   */
  static async filterChallenges(filters: {
    status?: string[];
    difficulty?: string[];
    search?: string;
    minPrize?: number;
    maxPrize?: number;
  }) {
    try {
      // Mock implementation
      let results = [...mockChallenges];

      if (filters.status && filters.status.length > 0) {
        results = results.filter((c) => filters.status!.includes(c.status));
      }

      if (filters.difficulty && filters.difficulty.length > 0) {
        results = results.filter((c) =>
          filters.difficulty!.includes(c.difficulty_level)
        );
      }

      if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        results = results.filter(
          (c) =>
            c.title.toLowerCase().includes(lowerSearch) ||
            c.description.toLowerCase().includes(lowerSearch)
        );
      }

      if (filters.minPrize !== undefined) {
        results = results.filter((c) => (c.prize_pool || 0) >= filters.minPrize!);
      }

      if (filters.maxPrize !== undefined) {
        results = results.filter((c) => (c.prize_pool || 0) <= filters.maxPrize!);
      }

      return results;
    } catch (error) {
      console.error("Error filtering challenges:", error);
      throw error;
    }
  }

  /**
   * Create new challenge
   */
  static async createChallenge(data: Partial<Challenge>) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();

      // Mock implementation
      const newChallenge: Challenge = {
        id: Math.random().toString(36).substring(7),
        title: data.title || "",
        description: data.description || "",
        problem_statement: data.problem_statement || "",
        status: data.status || "DRAFT",
        difficulty_level: data.difficulty_level || "MEDIUM",
        dataset_url: data.dataset_url,
        image_url: data.image_url,
        prize_pool: data.prize_pool,
        start_date: data.start_date || new Date().toISOString(),
        end_date: data.end_date || new Date().toISOString(),
        participant_count: 0,
        submission_count: 0,
        created_by: "current-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockChallenges.push(newChallenge);
      return newChallenge;
    } catch (error) {
      console.error("Error creating challenge:", error);
      throw error;
    }
  }

  /**
   * Update challenge
   */
  static async updateChallenge(id: string, data: Partial<Challenge>) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();

      // Mock implementation
      const index = mockChallenges.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Challenge not found");

      mockChallenges[index] = {
        ...mockChallenges[index],
        ...data,
        updated_at: new Date().toISOString(),
      };

      return mockChallenges[index];
    } catch (error) {
      console.error("Error updating challenge:", error);
      throw error;
    }
  }

  /**
   * Delete challenge
   */
  static async deleteChallenge(id: string) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
      //   method: 'DELETE',
      // });
      // return response.ok;

      // Mock implementation
      const index = mockChallenges.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Challenge not found");

      mockChallenges.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error deleting challenge:", error);
      throw error;
    }
  }
}

/**
 * Metric Service - Handle metric-related operations
 */
export class MetricService {
  static async getMetrics(challengeId: string): Promise<Metric[]> {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/metrics`);
      // return response.json();

      // Mock implementation
      return [
        {
          id: "1",
          challenge_id: challengeId,
          name: "Accuracy",
          description: "Percentage of correct predictions",
          metric_type: "SCORING_METRIC",
          weight: 1,
          is_primary: true,
          min_value: 0,
          max_value: 100,
          direction: "HIGHER_IS_BETTER",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          challenge_id: challengeId,
          name: "F1 Score",
          description: "Harmonic mean of precision and recall",
          metric_type: "SCORING_METRIC",
          weight: 0.8,
          is_primary: false,
          min_value: 0,
          max_value: 1,
          direction: "HIGHER_IS_BETTER",
          created_at: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  }

  static async createMetric(
    challengeId: string,
    data: Partial<Metric>
  ): Promise<Metric> {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/metrics`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();

      // Mock implementation
      return {
        id: Math.random().toString(36).substring(7),
        challenge_id: challengeId,
        ...data,
        created_at: new Date().toISOString(),
      } as Metric;
    } catch (error) {
      console.error("Error creating metric:", error);
      throw error;
    }
  }
}
