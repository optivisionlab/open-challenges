#!/usr/bin/env python3
"""Test registration and database persistence"""

import requests
import json
import time

api_url = "http://localhost:8000/api/v1"
timestamp = int(time.time())
test_email = f"testuser_{timestamp}@example.com"

print("\n" + "="*70)
print("🧪 TESTING REGISTRATION & DATABASE PERSISTENCE")
print("="*70 + "\n")

# Test registration
print(f"📝 Registering user: {test_email}")
response = requests.post(
    f"{api_url}/auth/register",
    json={
        "email": test_email,
        "username": f"testuser_{timestamp}",
        "password": "SecurePass123!",
        "full_name": "Test User"
    }
)

print(f"Response Status: {response.status_code}\n")

if response.status_code == 201:
    data = response.json()
    print(f"✅ USER CREATED SUCCESSFULLY!")
    print(f"   ID: {data['id']}")
    print(f"   Email: {data['email']}")
    print(f"   Username: {data['username']}")
    print(f"   Created: {data['created_at']}\n")
    
    # Verify database persistence
    print("📊 Verifying database persistence...")
    response = requests.get(
        f"{api_url}/auth/me",
        headers={"Authorization": f"Bearer {data['access_token']}"}
    )
    
    if response.status_code == 200:
        user = response.json()
        print(f"✅ USER FOUND IN DATABASE!")
        print(f"   Email: {user['email']}")
        print(f"   Username: {user['username']}\n")
    else:
        print(f"❌ Failed to retrieve user: {response.json()}\n")
else:
    print(f"❌ Registration failed!")
    print(f"   Error: {response.json()}\n")

print("="*70)
print("✅ DATABASE CONNECTION TEST COMPLETE")
print("="*70 + "\n")
