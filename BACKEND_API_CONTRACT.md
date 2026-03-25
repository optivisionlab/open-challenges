# Open Challenges Platform - Backend API Contract Reference

**Version**: 1.0.0  
**Base URL**: `http://localhost:8000/api/v1`  
**Default Response Format**: JSON  

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Challenge Endpoints](#challenge-endpoints)
3. [Submission Endpoints](#submission-endpoints)
4. [Leaderboard Endpoints](#leaderboard-endpoints)
5. [Team Endpoints](#team-endpoints)
6. [User Endpoints](#user-endpoints)
7. [Common Response Formats](#common-response-formats)
8. [Error Handling](#error-handling)

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}
```

**Response (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-03-25T10:00:00Z",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Error (400):**
```json
{
  "detail": "Email already registered"
}
```

---

### POST /auth/login
User login with credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Error (401):**
```json
{
  "detail": "Invalid credentials"
}
```

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

### POST /auth/logout
Logout user (blacklist token).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

### GET /auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-25T14:30:00Z"
}
```

---

## Challenge Endpoints

### GET /challenges
List all challenges (paginated with filters).

**Query Parameters:**
```
skip: integer (default: 0) - Pagination offset
limit: integer (default: 20, max: 100) - Items per page
status: string - DRAFT, ACTIVE, CLOSED, ARCHIVED
difficulty: string - EASY, MEDIUM, HARD
search: string - Search in title/description
sort_by: string - created_at, participants, submissions
order: string - asc, desc
```

**Example:**
```
GET /challenges?skip=0&limit=10&status=ACTIVE&difficulty=MEDIUM&sort_by=participants&order=desc
```

**Response (200):**
```json
{
  "total": 150,
  "skip": 0,
  "limit": 10,
  "items": [
    {
      "id": "ch_123",
      "title": "Image Classification Challenge",
      "description": "Classify images into 10 categories",
      "problem_statement": "You need to build a model...",
      "status": "ACTIVE",
      "difficulty_level": "MEDIUM",
      "prize_pool": 10000,
      "image_url": "https://...",
      "dataset_url": "https://...",
      "start_date": "2024-03-20T00:00:00Z",
      "end_date": "2024-04-20T23:59:59Z",
      "participant_count": 250,
      "submission_count": 1205,
      "created_by": "user_456",
      "created_at": "2024-03-15T10:00:00Z",
      "updated_at": "2024-03-25T14:30:00Z"
    }
  ]
}
```

---

### POST /challenges
Create a new challenge (admin only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Image Classification Challenge",
  "description": "Classify images into 10 categories",
  "problem_statement": "You need to build a model that...",
  "difficulty_level": "MEDIUM",
  "prize_pool": 10000,
  "image_url": "https://...",
  "dataset_url": "https://...",
  "start_date": "2024-03-20T00:00:00Z",
  "end_date": "2024-04-20T23:59:59Z",
  "metrics": [
    {
      "name": "Accuracy",
      "description": "Percentage of correct predictions",
      "metric_type": "ACCURACY",
      "weight": 100,
      "is_primary": true,
      "min_value": 0,
      "max_value": 100,
      "direction": "HIGHER_IS_BETTER"
    },
    {
      "name": "Precision",
      "description": "True positives over predicted positives",
      "metric_type": "PRECISION",
      "weight": 50,
      "is_primary": false,
      "min_value": 0,
      "max_value": 1,
      "direction": "HIGHER_IS_BETTER"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "ch_123",
  "title": "Image Classification Challenge",
  "status": "DRAFT",
  "metrics": [...],
  "created_at": "2024-03-25T10:00:00Z"
}
```

**Error (403):**
```json
{
  "detail": "Admin access required"
}
```

---

### GET /challenges/{id}
Get challenge details.

**Response (200):**
```json
{
  "id": "ch_123",
  "title": "Image Classification Challenge",
  "description": "Classify images into 10 categories",
  "problem_statement": "You need to build a model...",
  "status": "ACTIVE",
  "difficulty_level": "MEDIUM",
  "prize_pool": 10000,
  "image_url": "https://...",
  "dataset_url": "https://...",
  "start_date": "2024-03-20T00:00:00Z",
  "end_date": "2024-04-20T23:59:59Z",
  "participant_count": 250,
  "submission_count": 1205,
  "created_by": "user_456",
  "created_at": "2024-03-15T10:00:00Z",
  "updated_at": "2024-03-25T14:30:00Z",
  "metrics": [
    {
      "id": "m_1",
      "name": "Accuracy",
      "metric_type": "ACCURACY",
      "weight": 100,
      "is_primary": true,
      "direction": "HIGHER_IS_BETTER"
    }
  ]
}
```

---

### PUT /challenges/{id}
Update challenge (admin or creator only).

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "ACTIVE"
}
```

**Response (200):**
```json
{
  "id": "ch_123",
  "title": "Updated Title",
  "updated_at": "2024-03-25T15:00:00Z"
}
```

---

### DELETE /challenges/{id}
Delete challenge (admin only).

**Response (204):**
```
No content
```

---

### GET /challenges/{id}/metrics
Get all metrics for a challenge.

**Response (200):**
```json
{
  "challenge_id": "ch_123",
  "metrics": [
    {
      "id": "m_1",
      "name": "Accuracy",
      "description": "Percentage of correct predictions",
      "metric_type": "ACCURACY",
      "weight": 100,
      "is_primary": true,
      "min_value": 0,
      "max_value": 100,
      "direction": "HIGHER_IS_BETTER",
      "formula": null,
      "created_at": "2024-03-15T10:00:00Z"
    }
  ]
}
```

---

### POST /challenges/{id}/metrics
Add new metric to challenge (admin or creator).

**Request:**
```json
{
  "name": "F1 Score",
  "description": "Harmonic mean of precision and recall",
  "metric_type": "F1_SCORE",
  "weight": 75,
  "is_primary": false,
  "min_value": 0,
  "max_value": 1,
  "direction": "HIGHER_IS_BETTER"
}
```

**Response (201):**
```json
{
  "id": "m_2",
  "name": "F1 Score",
  "created_at": "2024-03-25T15:00:00Z"
}
```

---

## Submission Endpoints

### POST /submissions
Submit solution for a challenge.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
challenge_id: string (required)
team_id: string (optional - required if not personal)
file: File (required, max 100MB)
submission_format: string (optional - description of format)
```

**Response (201):**
```json
{
  "id": "sub_123",
  "challenge_id": "ch_123",
  "team_id": "team_456",
  "user_id": "user_789",
  "status": "PENDING",
  "submission_file_id": "file_xyz",
  "submitted_at": "2024-03-25T15:00:00Z",
  "processed_at": null,
  "error_message": null,
  "is_latest": true
}
```

**Error (413):**
```json
{
  "detail": "File too large (max 100MB)"
}
```

---

### GET /submissions
List user submissions (with filters).

**Query Parameters:**
```
challenge_id: string - Filter by challenge
team_id: string - Filter by team
status: string - PENDING, PROCESSING, COMPLETED, FAILED
skip: integer - Pagination offset
limit: integer - Items per page
```

**Response (200):**
```json
{
  "total": 25,
  "items": [
    {
      "id": "sub_123",
      "challenge_id": "ch_123",
      "team_id": "team_456",
      "status": "COMPLETED",
      "submitted_at": "2024-03-25T15:00:00Z",
      "processed_at": "2024-03-25T15:05:00Z",
      "scores": [
        {
          "metric_id": "m_1",
          "metric_name": "Accuracy",
          "score_value": 0.92
        }
      ]
    }
  ]
}
```

---

### GET /submissions/{id}
Get submission details with scores.

**Response (200):**
```json
{
  "id": "sub_123",
  "challenge_id": "ch_123",
  "team_id": "team_456",
  "user_id": "user_789",
  "status": "COMPLETED",
  "submitted_at": "2024-03-25T15:00:00Z",
  "processed_at": "2024-03-25T15:05:00Z",
  "error_message": null,
  "is_latest": true,
  "scores": [
    {
      "id": "score_1",
      "metric_id": "m_1",
      "metric_name": "Accuracy",
      "score_value": 0.92,
      "calculated_at": "2024-03-25T15:05:00Z"
    },
    {
      "id": "score_2",
      "metric_id": "m_2",
      "metric_name": "F1 Score",
      "score_value": 0.89,
      "calculated_at": "2024-03-25T15:05:00Z"
    }
  ]
}
```

---

### GET /submissions/{id}/scores
Get only scores for submission.

**Response (200):**
```json
{
  "submission_id": "sub_123",
  "total_score": 91.5,
  "scores": [
    {
      "metric_id": "m_1",
      "metric_name": "Accuracy",
      "weight": 100,
      "score_value": 0.92,
      "weighted_score": 92
    },
    {
      "metric_id": "m_2",
      "metric_name": "F1 Score",
      "weight": 50,
      "score_value": 0.89,
      "weighted_score": 44.5
    }
  ]
}
```

---

## Leaderboard Endpoints

### GET /challenges/{id}/leaderboard
Get challenge leaderboard.

**Query Parameters:**
```
limit: integer (default: 50) - Top N entries
offset: integer (default: 0) - For pagination
user_rank_around: string (optional) - Get rank +/- 5 around specific user
```

**Response (200):**
```json
{
  "challenge_id": "ch_123",
  "challenge_title": "Image Classification Challenge",
  "total_participants": 250,
  "updated_at": "2024-03-25T15:30:00Z",
  "rankings": [
    {
      "rank": 1,
      "team_id": "team_001",
      "team_name": "Team Champions",
      "member_count": 3,
      "total_score": 95.2,
      "primary_metric_score": 0.95,
      "scores": {
        "m_1": {
          "metric_name": "Accuracy",
          "value": 0.95
        },
        "m_2": {
          "metric_name": "F1 Score",
          "value": 0.93
        }
      },
      "submission_count": 42,
      "last_submission": "2024-03-25T15:00:00Z",
      "improvement_trend": "up"
    },
    {
      "rank": 2,
      "team_id": "team_002",
      "team_name": "Data Wizards",
      "member_count": 2,
      "total_score": 93.8,
      "primary_metric_score": 0.94,
      "submission_count": 38,
      "last_submission": "2024-03-25T14:45:00Z",
      "improvement_trend": "stable"
    }
  ]
}
```

---

### GET /leaderboard
Global leaderboard (across all challenges).

**Query Parameters:**
```
period: string - all_time, monthly, weekly
limit: integer - Top N
filter_by: string - total_wins, avg_rank, participation_count
```

**Response (200):**
```json
{
  "period": "all_time",
  "rankings": [
    {
      "rank": 1,
      "user_id": "user_001",
      "username": "champion_user",
      "total_score": 8500,
      "challenges_won": 5,
      "challenges_participated": 12,
      "average_rank": 2.5,
      "badges": ["legend", "consistent_performer"]
    }
  ]
}
```

---

### GET /challenges/{id}/statistics
Get challenge statistics.

**Response (200):**
```json
{
  "challenge_id": "ch_123",
  "total_participants": 250,
  "total_submissions": 1205,
  "average_submission_score": 76.5,
  "submission_success_rate": 0.85,
  "best_score": 98.5,
  "worst_score": 12.3,
  "score_distribution": {
    "0-10": 5,
    "10-20": 12,
    "20-30": 25,
    "30-40": 45,
    "40-50": 58,
    "50-60": 72,
    "60-70": 85,
    "70-80": 95,
    "80-90": 105,
    "90-100": 121
  },
  "submission_timeline": [
    {
      "date": "2024-03-20",
      "count": 45,
      "average_score": 65.3
    }
  ]
}
```

---

## Team Endpoints

### POST /teams
Create a new team.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "name": "Team Champions",
  "description": "A group of data scientists"
}
```

**Response (201):**
```json
{
  "id": "team_123",
  "name": "Team Champions",
  "description": "A group of data scientists",
  "created_by": "user_789",
  "created_at": "2024-03-25T15:00:00Z"
}
```

---

### GET /teams/{id}
Get team details with members.

**Response (200):**
```json
{
  "id": "team_123",
  "name": "Team Champions",
  "description": "A group of data scientists",
  "member_count": 3,
  "members": [
    {
      "user_id": "user_789",
      "username": "leader",
      "full_name": "Team Leader",
      "role": "LEADER",
      "joined_at": "2024-03-25T15:00:00Z"
    },
    {
      "user_id": "user_790",
      "username": "member1",
      "full_name": "Team Member 1",
      "role": "MEMBER",
      "joined_at": "2024-03-25T15:10:00Z"
    }
  ],
  "created_at": "2024-03-25T15:00:00Z"
}
```

---

## User Endpoints

### GET /users/{id}
Get user profile.

**Response (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "challenges_created": 5,
  "challenges_participated": 15,
  "total_submissions": 125,
  "average_rank": 12.5,
  "best_ranking": 1,
  "created_at": "2024-03-20T10:00:00Z"
}
```

---

### PUT /users/{id}
Update user profile (self only).

**Request:**
```json
{
  "full_name": "John Updated",
  "bio": "Data scientist and ML enthusiast"
}
```

**Response (200):**
```json
{
  "id": "user_123",
  "full_name": "John Updated",
  "updated_at": "2024-03-25T15:00:00Z"
}
```

---

## Common Response Formats

### Pagination Response
```json
{
  "total": 150,
  "skip": 0,
  "limit": 10,
  "items": []
}
```

### Error Response
```json
{
  "detail": "Error message here",
  "status_code": 400
}
```

### Success Response
```json
{
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 413 | Payload Too Large | File too large |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Common Error Codes

**401 - Invalid Token**
```json
{
  "detail": "Invalid or expired token"
}
```

**403 - Permission Denied**
```json
{
  "detail": "Admin access required"
}
```

**404 - Not Found**
```json
{
  "detail": "Challenge not found"
}
```

**422 - Validation Error**
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Authorization Headers

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Development Notes

- All timestamps in UTC ISO 8601 format
- Pagination defaults: limit=20, offset=0
- Max pagination limit: 100 items
- File uploads: multipart/form-data
- All endpoints return JSON

---

## API Documentation (Auto-generated)

Once backend is running:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

