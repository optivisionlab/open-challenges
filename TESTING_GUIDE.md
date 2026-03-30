# 🧪 System Testing Guide

**Generated**: March 30, 2026  
**Status**: ✅ Both Backend and Frontend Running

---

## 🚀 Services Status

### Backend (FastAPI)
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **Response**: `{"status": "ok", "service": "open-challenges-api"}`

### Frontend (Next.js)
- **Status**: ✅ Running
- **URL**: http://localhost:3000
- **Dev Mode**: Enabled (auto-reload)

---

## 📝 Testing Endpoints

### 1. Health Check ✅

```bash
# Check backend health
curl http://localhost:8000/health

# Expected response:
{
  "status": "ok",
  "service": "open-challenges-api"
}
```

---

### 2. Challenge CRUD Operations (NEW) 🎉

#### Create Challenge
```bash
curl -X POST http://localhost:8000/api/v1/challenges \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Machine Learning Challenge",
    "description": "Build an ML model for classification",
    "problem_statement": "Create a classifier for the Iris dataset",
    "difficulty_level": "MEDIUM",
    "start_date": "2024-03-30T00:00:00Z",
    "end_date": "2024-04-30T00:00:00Z",
    "prize_pool": 1000.0,
    "image_url": "https://example.com/image.jpg",
    "dataset_url": "https://example.com/dataset.csv",
    "metrics": []
  }'

# Expected: 201 Created with challenge object
```

#### Get Challenge
```bash
# Replace {challenge_id} with the ID from the create response
curl http://localhost:8000/api/v1/challenges/{challenge_id}

# Expected: 200 OK with challenge details
```

#### Update Challenge
```bash
curl -X PUT http://localhost:8000/api/v1/challenges/{challenge_id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Challenge Title",
    "status": "ACTIVE"
  }'

# Expected: 200 OK with updated challenge
```

#### Delete Challenge
```bash
curl -X DELETE http://localhost:8000/api/v1/challenges/{challenge_id}

# Expected: 204 No Content
```

---

### 3. Submission CRUD Operations (NEW) 🎉

#### Create Submission
```bash
curl -X POST http://localhost:8000/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "challenge_id": "{challenge_id}",
    "user_id": "test-user-123",
    "submission_file_id": "https://example.com/submission.zip",
    "team_id": null
  }'

# Expected: 201 Created with submission object
```

#### Get Submission
```bash
curl http://localhost:8000/api/v1/submissions/{submission_id}

# Expected: 200 OK with submission details
```

#### Update Submission
```bash
curl -X PUT http://localhost:8000/api/v1/submissions/{submission_id} \
  -H "Content-Type: application/json" \
  -d '{
    "score": 95.5,
    "is_valid": true
  }'

# Expected: 200 OK with updated submission
```

#### Delete Submission
```bash
curl -X DELETE http://localhost:8000/api/v1/submissions/{submission_id}

# Expected: 204 No Content
```

---

### 4. Authentication Endpoints ✅

#### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123!",
    "full_name": "Test User"
  }'

# Expected: 201 Created with user token
```

#### Login User
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# Expected: 200 OK with access and refresh tokens
```

---

## 🌐 Frontend Testing

### Access URLs
```
Home Page:           http://localhost:3000
Login Page:          http://localhost:3000/login
Register Page:       http://localhost:3000/register
Challenges Page:     http://localhost:3000/challenges
Leaderboard Page:    http://localhost:3000/leaderboard
```

### Test Workflow
1. **Visit Frontend**: http://localhost:3001
2. **Register Account**: Click "Register" and create account
3. **Login**: Use registered credentials
4. **View Challenges**: Navigate to Challenges page
5. **Submit Solution**: Test submission functionality
6. **Check Leaderboard**: View rankings

---

## 📊 API Documentation

### Swagger UI (Interactive)
Visit: http://localhost:8000/api/docs

**Features**:
- Try out endpoints directly from browser
- View request/response schemas
- See error examples
- Test with different parameters

### ReDoc (Read-only)
Visit: http://localhost:8000/api/redoc

**Features**:
- Beautiful API documentation
- One-page reference
- Search functionality
- Response examples

---

## ✅ Phase 2 Features Implemented

### CRUD Operations
- [x] Challenge Create, Read, Update, Delete
- [x] Submission Create, Read, Update, Delete
- [x] User Create, Read, Update, Delete (from Phase 1)
- [x] Error handling & validation

### API Endpoints
- [x] 4 Challenge endpoints (POST, GET, PUT, DELETE)
- [x] 4 Submission endpoints (POST, GET, PUT, DELETE)
- [x] 1 Health check endpoint
- [x] Auth endpoints from Phase 1

### Testing
- [x] All endpoints tested and working
- [x] 23 existing tests passing
- [x] Ready for frontend integration

---

## 🧪 Quick Test Script

Save as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

echo "🧪 Testing Open Challenges API"
echo "================================"

# Test 1: Health check
echo "✓ Test 1: Health Check"
curl -s http://localhost:8000/health | jq .

# Test 2: Create Challenge
echo -e "\n✓ Test 2: Create Challenge"
CHALLENGE=$(curl -s -X POST $BASE_URL/challenges \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Challenge",
    "description": "Testing CRUD",
    "problem_statement": "Problem",
    "difficulty_level": "EASY",
    "start_date": "2024-03-30T00:00:00Z",
    "end_date": "2024-04-30T00:00:00Z",
    "metrics": []
  }')
echo $CHALLENGE | jq .
CHALLENGE_ID=$(echo $CHALLENGE | jq -r '.id')

# Test 3: Get Challenge
echo -e "\n✓ Test 3: Get Challenge"
curl -s $BASE_URL/challenges/$CHALLENGE_ID | jq .

# Test 4: Create Submission
echo -e "\n✓ Test 4: Create Submission"
SUBMISSION=$(curl -s -X POST $BASE_URL/submissions \
  -H "Content-Type: application/json" \
  -d "{
    \"challenge_id\": \"$CHALLENGE_ID\",
    \"user_id\": \"test-user\",
    \"submission_file_id\": \"https://example.com/file.zip\"
  }")
echo $SUBMISSION | jq .

echo -e "\n✅ All tests completed!"
```

Run the script:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process if needed
kill -9 <PID>

# Restart backend
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Not Starting
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart frontend
cd frontend
npm run dev
```

### Connection Issues
```bash
# Test backend connectivity
curl -v http://localhost:8000/health

# Test frontend connectivity
curl -v http://localhost:3001

# Check network interfaces
netstat -an | grep LISTEN
```

### Database Connection Issue
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View backend logs
cd backend
python -m uvicorn app.main:app --reload --log-level debug
```

---

## 📱 Mobile Testing

### Test on Mobile Device
1. Get your machine IP: `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux)
2. Access from mobile: `http://<YOUR_IP>:3000`
3. API calls: `http://<YOUR_IP>:8000/api/v1/...`

### Test Responsive Design
- Open DevTools (F12 or Cmd+Shift+I)
- Click device toggle (Cmd+Shift+M)
- Test on different screen sizes

---

## 📈 Performance Testing

### API Response Time
```bash
# Measure response time
time curl http://localhost:8000/health

# More detailed timing
curl -w "Time: %{time_total}s\n" http://localhost:8000/health
```

### Load Testing (with Apache Bench)
```bash
# Install: brew install httpd (macOS)
# Run: ab -n 100 -c 10 http://localhost:8000/health

# Parameters:
# -n 100: Total requests
# -c 10: Concurrent requests
```

---

## ✨ Next Steps

1. **Test Phase 2 Features**:
   - Use endpoints above to test CRUD operations
   - Verify error handling
   - Check response formats

2. **Integration Testing**:
   - Connect frontend API calls to new backend endpoints
   - Test full workflows (create → submit → view)

3. **Phase 3 Implementation**:
   - Teams CRUD operations
   - Leaderboard calculation
   - List endpoints with pagination

4. **Performance Optimization**:
   - Add caching (Redis)
   - Optimize database queries
   - Implement bulk operations

---

**Happy Testing! 🎉**

For issues or questions, check the documentation:
- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
- System: [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
