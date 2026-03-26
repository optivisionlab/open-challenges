"""Test configuration."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.main import app
from app.utils.db import get_db
from app.models.base import Base


# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create test database and session."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db: Session):
    """Create a test client with test database."""
    def override_get_db():
        yield db
    
    app.dependency_overrides[get_db] = override_get_db
    
    test_client = TestClient(app)
    yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def app_fixture():
    """Provide the FastAPI app."""
    return app


@pytest.fixture
def test_user_data():
    """Test user data."""
    return {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "securepassword123",
        "full_name": "Test User"
    }


@pytest.fixture
def test_user_login():
    """Test user login credentials."""
    return {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }

