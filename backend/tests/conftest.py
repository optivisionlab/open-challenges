"""Test configuration."""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def app_fixture():
    """Provide the FastAPI app."""
    return app
