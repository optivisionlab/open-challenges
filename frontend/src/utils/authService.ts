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
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        email: credentials.email,
        password: credentials.password,
      });

      const response = await fetch(`${this.API_BASE_URL}/auth/login?${params}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      
      // Store user info
      const userInfo = {
        id: data.id,
        email: data.email,
        username: data.username,
        full_name: data.full_name,
        is_active: data.is_active,
        created_at: data.created_at,
      };
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      return {
        access_token: data.access_token,
        user: {
          id: data.id,
          email: data.email,
          username: data.username,
          first_name: data.username,
          last_name: "",
          is_active: data.is_active,
          created_at: data.created_at,
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
      // Validation
      if (data.password !== data.password_confirm) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          full_name: `${data.first_name} ${data.last_name}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const responseData = await response.json();

      // Store tokens
      localStorage.setItem("access_token", responseData.access_token);
      localStorage.setItem("refresh_token", responseData.refresh_token);

      const newUser: User = {
        id: responseData.id,
        email: responseData.email,
        username: responseData.username,
        first_name: data.first_name,
        last_name: data.last_name,
        is_active: responseData.is_active,
        created_at: responseData.created_at,
      };

      return {
        access_token: responseData.access_token,
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
      // Validation
      if (data.password !== data.password_confirm) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // First, register the user
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          full_name: `${data.first_name} ${data.last_name}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const responseData = await response.json();

      // Store tokens
      localStorage.setItem("access_token", responseData.access_token);
      localStorage.setItem("refresh_token", responseData.refresh_token);

      const newUser: User = {
        id: responseData.id,
        email: responseData.email,
        username: responseData.username,
        first_name: data.first_name,
        last_name: data.last_name,
        is_active: responseData.is_active,
        created_at: responseData.created_at,
      };

      // Note: Team creation will be implemented in Phase 3
      // For now, just register the user and return success

      return {
        access_token: responseData.access_token,
        user: newUser,
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
      // This will be implemented in Phase 3 when team management is added
      throw new Error("Team joining not yet implemented");
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
      const token = localStorage.getItem("access_token");
      if (token) {
        const params = new URLSearchParams();
        
        const response = await fetch(`${this.API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Logout failed on server");
        }
      }

      // Clear local session
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(userId?: string): Promise<User> {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        const error = await response.json();
        throw new Error(error.detail || "Failed to get profile");
      }

      const data = await response.json();
      
      return {
        id: data.id,
        email: data.email,
        username: data.username,
        first_name: data.username,
        last_name: "",
        is_active: data.is_active,
        created_at: data.created_at,
      };
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
