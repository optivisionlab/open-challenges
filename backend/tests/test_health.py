"""Test health check endpoints."""
import pytest


@pytest.mark.asyncio
async def test_root(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert "status" in data
    assert data["status"] == "running"


@pytest.mark.asyncio
async def test_health_check_root(client):
    """Test health check at root."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_health_check_api_v1(client):
    """Test health check at API v1."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_docs_available(client):
    """Test that API docs are available."""
    response = client.get("/api/docs")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_redoc_available(client):
    """Test that ReDoc is available."""
    response = client.get("/api/redoc")
    assert response.status_code == 200
