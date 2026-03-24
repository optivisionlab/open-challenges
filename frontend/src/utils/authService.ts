import type {
  LoginRequest,
  LoginResponse,
  RegisterIndividualRequest,
  RegisterTeamRequest,
  JoinTeamRequest,
  User,
  Team,
} from "@/types";

// Mock user data for demo
const mockUsers: { [key: string]: User & { password: string } } = {
  "demo@example.com": {
    id: "user-1",
    email: "demo@example.com",
    username: "demouser",
    first_name: "Demo",
    last_name: "User",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demouser",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    password: "password123",
  },
};

// Mock team data
const mockTeams: { [key: string]: Team } = {
  "team-1": {
    id: "team-1",
    name: "AI Legends",
    description: "Top performing AI team",
    leader_id: "user-1",
    logo_url: "https://api.dicebear.com/7.x/icons/svg?seed=ailengends",
    member_count: 5,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-03-20T00:00:00Z",
  },
};

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock implementation - check credentials
      const user = mockUsers[credentials.email];
      if (!user || user.password !== credentials.password) {
        throw new Error("Invalid email or password");
      }

      // Return mock response
      return {
        access_token: `token_${user.id}_${Date.now()}`,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Register individual user
   */
  static async registerIndividual(
    data: RegisterIndividualRequest
  ): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validation
      if (data.password !== data.password_confirm) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (data.email in mockUsers) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Store in mock db
      mockUsers[data.email] = { ...newUser, password: data.password };

      return {
        access_token: `token_${newUser.id}_${Date.now()}`,
        user: newUser,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Register user with team creation
   */
  static async registerWithTeam(
    data: RegisterTeamRequest
  ): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validation
      if (data.password !== data.password_confirm) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (data.email in mockUsers) {
        throw new Error("Email already registered");
      }

      // Create user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Create team
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: data.team_name,
        description: data.team_description || "",
        leader_id: newUser.id,
        logo_url:
          data.team_logo_url ||
          `https://api.dicebear.com/7.x/icons/svg?seed=${data.team_name}`,
        member_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in mock db
      mockUsers[data.email] = { ...newUser, password: data.password };
      mockTeams[newTeam.id] = newTeam;

      return {
        access_token: `token_${newUser.id}_${Date.now()}`,
        user: newUser,
        team: newTeam,
      };
    } catch (error) {
      console.error("Team registration error:", error);
      throw error;
    }
  }

  /**
   * Join existing team with code
   */
  static async joinTeam(data: JoinTeamRequest): Promise<Team> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock: find team by code (code format: first 8 chars of team id)
      const team = Object.values(mockTeams).find(
        (t) => t.id.substring(0, 8) === data.team_code.substring(0, 8)
      );

      if (!team) {
        throw new Error("Invalid team code");
      }

      // Update team member count
      team.member_count += 1;

      return team;
    } catch (error) {
      console.error("Join team error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Clear local session (handled in component)
      return;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(userId: string): Promise<User> {
    try {
      const user = Object.values(mockUsers).find((u) => u.id === userId);
      if (!user) {
        throw new Error("User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  /**
   * Validate credentials (for demo)
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return { valid: errors.length === 0, errors };
  }
}
