"""Authentication tests."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


class TestAuthRegister:
    """Test user registration."""
    
    def test_register_success(self, client: TestClient, test_user_data: dict):
        """Test successful user registration."""
        response = client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert data["full_name"] == test_user_data["full_name"]
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["is_active"] is True
    
    def test_register_duplicate_email(
        self,
        client: TestClient,
        test_user_data: dict,
        db: Session
    ):
        """Test registration with duplicate email."""
        # Register first user
        response = client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 201
        
        # Try to register with same email
        test_user_data["username"] = "anotheruser"
        response = client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]
    
    def test_register_duplicate_username(
        self,
        client: TestClient,
        test_user_data: dict
    ):
        """Test registration with duplicate username."""
        # Register first user
        response = client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 201
        
        # Try to register with same username
        test_user_data["email"] = "another@example.com"
        response = client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == 400
        assert "already taken" in response.json()["detail"]
    
    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "invalid-email",
                "username": "testuser",
                "password": "securepassword123",
                "full_name": "Test User"
            }
        )
        
        assert response.status_code == 422
    
    def test_register_short_password(self, client: TestClient):
        """Test registration with short password."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "username": "testuser",
                "password": "short",
                "full_name": "Test User"
            }
        )
        
        assert response.status_code == 422
    
    def test_register_short_username(self, client: TestClient):
        """Test registration with short username."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "username": "ab",
                "password": "securepassword123",
                "full_name": "Test User"
            }
        )
        
        assert response.status_code == 422
    
    def test_register_missing_fields(self, client: TestClient):
        """Test registration with missing fields."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "username": "testuser"
                # Missing password and full_name
            }
        )
        
        assert response.status_code == 422


class TestAuthLogin:
    """Test user login."""
    
    def test_login_success(self, client: TestClient, test_user_data: dict):
        """Test successful login."""
        # Register user first
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Login
        response = client.post(
            "/api/v1/auth/login",
            params={
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_email(self, client: TestClient):
        """Test login with non-existent email."""
        response = client.post(
            "/api/v1/auth/login",
            params={
                "email": "nonexistent@example.com",
                "password": "anypassword"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_invalid_password(self, client: TestClient, test_user_data: dict):
        """Test login with invalid password."""
        # Register user first
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try login with wrong password
        response = client.post(
            "/api/v1/auth/login",
            params={
                "email": test_user_data["email"],
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]


class TestAuthRefresh:
    """Test token refresh."""
    
    def test_refresh_token_success(self, client: TestClient, test_user_data: dict):
        """Test successful token refresh."""
        # Register user
        register_response = client.post("/api/v1/auth/register", json=test_user_data)
        refresh_token = register_response.json()["refresh_token"]
        
        # Refresh token
        response = client.post(
            "/api/v1/auth/refresh",
            params={"refresh_token": refresh_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_refresh_token_invalid(self, client: TestClient):
        """Test refresh with invalid token."""
        response = client.post(
            "/api/v1/auth/refresh",
            params={"refresh_token": "invalid_token"}
        )
        
        assert response.status_code == 401


class TestAuthLogout:
    """Test user logout."""
    
    def test_logout_success(self, client: TestClient, test_user_data: dict):
        """Test successful logout."""
        # Register user
        register_response = client.post("/api/v1/auth/register", json=test_user_data)
        access_token = register_response.json()["access_token"]
        
        # Logout
        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        assert "Successfully logged out" in response.json()["message"]
    
    def test_logout_invalid_token(self, client: TestClient):
        """Test logout with invalid token."""
        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == 401


class TestAuthGetMe:
    """Test get current user."""
    
    def test_get_me_success(self, client: TestClient, test_user_data: dict):
        """Test successful get current user."""
        # Register user
        register_response = client.post("/api/v1/auth/register", json=test_user_data)
        access_token = register_response.json()["access_token"]
        
        # Get current user
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert data["full_name"] == test_user_data["full_name"]
    
    def test_get_me_no_token(self, client: TestClient):
        """Test get current user without token."""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 401
    
    def test_get_me_invalid_token(self, client: TestClient):
        """Test get current user with invalid token."""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == 401


class TestAuthIntegration:
    """Integration tests for authentication flow."""
    
    def test_complete_auth_flow(self, client: TestClient, test_user_data: dict):
        """Test complete authentication flow."""
        # 1. Register
        register_response = client.post("/api/v1/auth/register", json=test_user_data)
        assert register_response.status_code == 201
        register_data = register_response.json()
        access_token = register_data["access_token"]
        refresh_token = register_data["refresh_token"]
        
        # 2. Get current user
        me_response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert me_response.status_code == 200
        assert me_response.json()["email"] == test_user_data["email"]
        
        # 3. Refresh token
        refresh_response = client.post(
            "/api/v1/auth/refresh",
            params={"refresh_token": refresh_token}
        )
        assert refresh_response.status_code == 200
        new_access_token = refresh_response.json()["access_token"]
        
        # 4. Use new token
        me_response2 = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {new_access_token}"}
        )
        assert me_response2.status_code == 200
        
        # 5. Logout
        logout_response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {new_access_token}"}
        )
        assert logout_response.status_code == 200
