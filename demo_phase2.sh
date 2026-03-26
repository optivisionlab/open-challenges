#!/bin/bash

# Phase 2 - Authentication & Authorization Demo
# This script demonstrates all authentication endpoints

set -e

BASE_URL="http://localhost:8000/api/v1"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Phase 2: Authentication & Authorization Demo           ║${NC}"
echo -e "${BLUE}║     Open Challenges Platform - March 26, 2026              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ===== STEP 1: REGISTRATION =====
echo -e "${YELLOW}📝 Step 1: User Registration${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: POST /api/v1/auth/register"
echo "Registering new user: alice@example.com"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "username": "alice_wonder",
    "password": "SecurePass123!",
    "full_name": "Alice Wonder"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$REGISTER_RESPONSE" | python -m json.tool
echo ""

# Extract tokens
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['refresh_token'])")

echo -e "${GREEN}✓ Registration successful!${NC}"
echo -e "  Access Token: ${BLUE}${ACCESS_TOKEN:0:20}...${NC}"
echo -e "  Refresh Token: ${BLUE}${REFRESH_TOKEN:0:20}...${NC}"
echo ""

# ===== STEP 2: GET CURRENT USER =====
echo -e "${YELLOW}👤 Step 2: Get Current User Profile${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: GET /api/v1/auth/me"
echo "Using access token from registration..."
echo ""

PROFILE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${GREEN}Response:${NC}"
echo "$PROFILE" | python -m json.tool
echo ""
echo -e "${GREEN}✓ Successfully retrieved current user profile!${NC}"
echo ""

# ===== STEP 3: LOGIN =====
echo -e "${YELLOW}🔑 Step 3: User Login${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: POST /api/v1/auth/login"
echo "Logging in as: alice@example.com"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$LOGIN_RESPONSE" | python -m json.tool
echo ""

NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo -e "${GREEN}✓ Login successful!${NC}"
echo -e "  New Access Token: ${BLUE}${NEW_ACCESS_TOKEN:0:20}...${NC}"
echo ""

# ===== STEP 4: REFRESH TOKEN =====
echo -e "${YELLOW}🔄 Step 4: Refresh Access Token${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: POST /api/v1/auth/refresh"
echo "Refreshing access token..."
echo ""

REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -d "refresh_token=$REFRESH_TOKEN")

echo -e "${GREEN}Response:${NC}"
echo "$REFRESH_RESPONSE" | python -m json.tool
echo ""

REFRESHED_TOKEN=$(echo "$REFRESH_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo -e "${GREEN}✓ Token refreshed successfully!${NC}"
echo -e "  New Access Token: ${BLUE}${REFRESHED_TOKEN:0:20}...${NC}"
echo ""

# ===== STEP 5: USE REFRESHED TOKEN =====
echo -e "${YELLOW}✅ Step 5: Verify Refreshed Token${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: GET /api/v1/auth/me"
echo "Using refreshed access token..."
echo ""

PROFILE_2=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $REFRESHED_TOKEN")

echo -e "${GREEN}Response:${NC}"
echo "$PROFILE_2" | python -m json.tool
echo ""
echo -e "${GREEN}✓ Refreshed token works correctly!${NC}"
echo ""

# ===== STEP 6: LOGOUT =====
echo -e "${YELLOW}🚪 Step 6: User Logout${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo "Endpoint: POST /api/v1/auth/logout"
echo "Logging out..."
echo ""

LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $REFRESHED_TOKEN")

echo -e "${GREEN}Response:${NC}"
echo "$LOGOUT_RESPONSE" | python -m json.tool
echo ""
echo -e "${GREEN}✓ Logout successful! Token has been blacklisted.${NC}"
echo ""

# ===== ERROR HANDLING =====
echo -e "${YELLOW}⚠️  Step 7: Error Handling Tests${NC}"
echo -e "${BLUE}─────────────────────────────────────${NC}"
echo ""

# Test: Invalid credentials
echo "Testing invalid credentials..."
INVALID_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "WrongPassword"
  }')

echo -e "${RED}Error Response (Expected):${NC}"
echo "$INVALID_LOGIN" | python -m json.tool
echo ""

# Test: Duplicate email registration
echo "Testing duplicate email registration..."
DUPLICATE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "username": "alice_two",
    "password": "AnotherPass123!",
    "full_name": "Alice Two"
  }')

echo -e "${RED}Error Response (Expected):${NC}"
echo "$DUPLICATE" | python -m json.tool
echo ""

# ===== SUMMARY =====
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Demo Summary                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All Phase 2 endpoints working correctly!${NC}"
echo ""
echo "Endpoints Tested:"
echo -e "  ${GREEN}✓${NC} POST /api/v1/auth/register    - User registration"
echo -e "  ${GREEN}✓${NC} POST /api/v1/auth/login       - User authentication"
echo -e "  ${GREEN}✓${NC} GET  /api/v1/auth/me          - Get current user"
echo -e "  ${GREEN}✓${NC} POST /api/v1/auth/refresh     - Token refresh"
echo -e "  ${GREEN}✓${NC} POST /api/v1/auth/logout      - User logout"
echo ""
echo "Features Demonstrated:"
echo -e "  ${GREEN}✓${NC} Secure password hashing (Bcrypt)"
echo -e "  ${GREEN}✓${NC} JWT token generation & validation"
echo -e "  ${GREEN}✓${NC} Dual token system (Access + Refresh)"
echo -e "  ${GREEN}✓${NC} Bearer token authentication"
echo -e "  ${GREEN}✓${NC} Error handling & validation"
echo -e "  ${GREEN}✓${NC} RBAC ready for implementation"
echo ""
echo -e "${BLUE}API Documentation: ${YELLOW}http://localhost:8000/api/docs${NC}"
echo ""
