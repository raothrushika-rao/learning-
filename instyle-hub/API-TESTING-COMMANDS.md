# 🔬 InStyle Hub - API Testing Guide with Curl Commands

Use these commands to test each API endpoint after starting the backend.

---

## 📝 Setup

Make sure backend is running:
```bash
cd /workspaces/learning-/instyle-hub/backend
npm run dev
```

Backend should be at: `http://localhost:5000/api`

---

## 🧪 Test Sequence

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:** `{"status":"Server is running"}`

---

### Test 2: Register New User (Customer)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "testcustomer@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "name": "Test Customer",
    "email": "testcustomer@example.com",
    "role": "customer"
  }
}
```

**Save the token for later use:** `TOKEN="<token-value>"`

---

### Test 3: Register New Designer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Designer",
    "email": "testdesigner@example.com",
    "password": "password123",
    "role": "designer",
    "specialty": "bridal",
    "brandName": "Test Designs"
  }'
```

**Expected:** Same format as Test 2, with role "designer"

---

### Test 4: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "name": "Sarah",
    "email": "sarah@example.com",
    "role": "customer"
  }
}
```

**Save token:** `TOKEN="<token-value>"`

---

### Test 5: Get Designers (Public - No Auth Required)
```bash
curl http://localhost:5000/api/designers
```

**Expected:** Array of 6 designers with details

---

### Test 6: Get Designers - Search
```bash
curl "http://localhost:5000/api/designers?search=Alexandra"
```

**Expected:** Only Alexandra designer

---

### Test 7: Get Designers - Filter by Specialty
```bash
curl "http://localhost:5000/api/designers?specialty=bridal"
```

**Expected:** Only bridal designers (3: Alexandra, Rami, Jenny)

---

### Test 8: Get Designers - Combined Search & Filter
```bash
curl "http://localhost:5000/api/designers?specialty=bridal&search=Alexandra"
```

**Expected:** Only Alexandra (bridal + matches name)

---

### Test 9: Get Single Designer (Public)
```bash
# First get a designer ID from Test 5, then:
curl http://localhost:5000/api/designers/<designer-id>
```

**Expected:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "brandName": "Alexandra Voss Bridal",
  "specialty": "bridal",
  "bio": "...",
  "pricingRange": "$1000-$3000",
  "rating": 4.5,
  "followers": 100,
  "projectCount": 50,
  "image": "https://...",
  "user": {
    "name": "Alexandra Voss",
    "email": "alexandra@example.com"
  },
  "reviews": [
    {
      "id": "uuid",
      "customerId": "uuid",
      "designerId": "uuid",
      "rating": 5,
      "comment": "Great designer!",
      "createdAt": "2025-03-31T..."
    }
  ]
}
```

---

### Test 10: Get Current User (Protected)
```bash
TOKEN="your-token-from-login"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

**Expected:** Current user object with all details

---

### Test 11: Create Booking (Protected)
```bash
TOKEN="your-token-from-login"
DESIGNER_ID="designer-uuid-from-test-5"

curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"designerId\": \"$DESIGNER_ID\",
    \"date\": \"2025-05-20T10:00:00Z\",
    \"notes\": \"Please create elegant bridal wear\"
  }"
```

**Expected Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid",
    "customerId": "uuid",
    "designerId": "uuid",
    "date": "2025-05-20T10:00:00Z",
    "status": "pending",
    "notes": "Please create elegant bridal wear",
    "customer": {
      "name": "Test Customer",
      "email": "testcustomer@example.com"
    },
    "designer": {
      "brandName": "Alexandra Voss Bridal"
    }
  }
}
```

---

### Test 12: Get My Bookings (Protected)
```bash
TOKEN="your-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/bookings
```

**Expected:** Array of bookings for logged-in user

---

### Test 13: Get Designer Reviews (Public)
```bash
DESIGNER_ID="designer-uuid"
curl http://localhost:5000/api/reviews/designer/$DESIGNER_ID
```

**Expected:** Array of reviews for that designer

---

### Test 14: Create Review (Protected)
```bash
TOKEN="your-token"
DESIGNER_ID="designer-uuid"

curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"designerId\": \"$DESIGNER_ID\",
    \"rating\": 5,
    \"comment\": \"Excellent designer, highly recommended!\"
  }"
```

**Expected Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "uuid",
    "customerId": "uuid",
    "designerId": "uuid",
    "rating": 5,
    "comment": "Excellent designer, highly recommended!",
    "customer": {
      "name": "Sarah",
      "id": "uuid"
    }
  }
}
```

---

### Test 15: Get My Reviews (Protected)
```bash
TOKEN="your-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/reviews
```

**Expected:** Array of reviews submitted by logged-in user

---

### Test 16: Update Booking Status (Protected - Designer Only)
```bash
TOKEN="designer-token"
BOOKING_ID="booking-uuid"

curl -X PUT http://localhost:5000/api/bookings/$BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "confirmed"}'
```

**Valid statuses:** pending, confirmed, completed, cancelled

**Expected:** Updated booking object

---

### Test 17: Cancel Booking (Protected)
```bash
TOKEN="your-token"
BOOKING_ID="booking-uuid"

curl -X DELETE http://localhost:5000/api/bookings/$BOOKING_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "status": "cancelled",
    ...
  }
}
```

---

### Test 18: Delete Review (Protected)
```bash
TOKEN="your-token"
REVIEW_ID="review-uuid"

curl -X DELETE http://localhost:5000/api/reviews/$REVIEW_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

## ❌ Error Tests

### Test: Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@example.com"}'
```

**Expected:** 400 error with message about missing password

---

### Test: Invalid Credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@example.com","password": "wrongpassword"}'
```

**Expected:** 401 error with "Invalid credentials"

---

### Test: No Authorization Token
```bash
curl http://localhost:5000/api/bookings
```

**Expected:** 401 error with "No token provided"

---

### Test: Invalid Authorization Token
```bash
curl -H "Authorization: Bearer invalid-token" \
  http://localhost:5000/api/bookings
```

**Expected:** 401 error with "Invalid token"

---

### Test: Duplicate Email
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Someone",
    "email": "sarah@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

**Expected:** 400 error with "Email already in use"

---

### Test: Invalid Rating
```bash
TOKEN="your-token"
DESIGNER_ID="designer-uuid"

curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"designerId\": \"$DESIGNER_ID\",
    \"rating\": 10,
    \"comment\": \"This should fail\"
  }"
```

**Expected:** 400 error with "Rating must be between 1 and 5"

---

### Test: Not Found
```bash
curl http://localhost:5000/api/designers/invalid-uuid
```

**Expected:** 404 error with "Designer not found"

---

## 🛠️ Helpful Tips

### Save Token to Variable
```bash
# Get token from login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@example.com","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### Pretty Print JSON
Install `jq`:
```bash
brew install jq  # macOS
sudo apt install jq  # Linux
```

Then use:
```bash
curl http://localhost:5000/api/designers | jq .
```

### Test with Postman
1. Download Postman: https://www.postman.com/downloads/
2. Create new request
3. Select GET/POST/PUT/DELETE
4. Paste URL: `http://localhost:5000/api/...`
5. Select "Bearer Token" in Authorization tab
6. Paste token in token field
7. Add JSON body for POST/PUT requests
8. Click Send

### Test File Upload
Create a test file:
```bash
echo "test data" > test.txt
```

---

## 📊 Complete API Response Examples

### Designer Object
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "660e8400-e29b-41d4-a716-446655440000",
  "brandName": "Alexandra Voss Bridal",
  "specialty": "bridal",
  "bio": "Luxury bridal designer with 10+ years experience",
  "pricingRange": "$1000-$3000",
  "rating": 4.8,
  "followers": 150,
  "projectCount": 75,
  "image": "https://via.placeholder.com/400x300?text=Alexandra+Voss",
  "createdAt": "2025-03-31T10:00:00.000Z",
  "updatedAt": "2025-03-31T10:00:00.000Z",
  "user": {
    "name": "Alexandra Voss",
    "email": "alexandra@example.com"
  },
  "reviews": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "customerId": "880e8400-e29b-41d4-a716-446655440000",
      "rating": 5,
      "comment": "Amazing designer!",
      "customer": {
        "name": "Sarah",
        "id": "880e8400-e29b-41d4-a716-446655440000"
      }
    }
  ]
}
```

### Booking Object
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "customerId": "880e8400-e29b-41d4-a716-446655440000",
  "designerId": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2025-05-20T10:00:00.000Z",
  "status": "pending",
  "notes": "Please create elegant bridal wear",
  "createdAt": "2025-03-31T10:00:00.000Z",
  "updatedAt": "2025-03-31T10:00:00.000Z",
  "customer": {
    "name": "Sarah",
    "email": "sarah@example.com"
  },
  "designer": {
    "brandName": "Alexandra Voss Bridal",
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Review Object
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440000",
  "customerId": "880e8400-e29b-41d4-a716-446655440000",
  "designerId": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5,
  "comment": "Excellent designer, highly recommended!",
  "createdAt": "2025-03-31T10:00:00.000Z",
  "updatedAt": "2025-03-31T10:00:00.000Z",
  "customer": {
    "name": "Sarah",
    "id": "880e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## ✅ Verification Checklist

Run through these tests in order:

- [ ] Test 1: Health check returns status
- [ ] Test 2: Register new customer succeeds
- [ ] Test 3: Register new designer succeeds
- [ ] Test 4: Login with test account succeeds
- [ ] Test 5: Get designers returns 6+ designers
- [ ] Test 6: Search works (fewer results)
- [ ] Test 7: Filter by specialty works
- [ ] Test 9: Single designer has reviews array
- [ ] Test 11: Can create booking
- [ ] Test 12: Get my bookings returns recent booking
- [ ] Test 13: Designer reviews show up
- [ ] Test 14: Can submit review
- [ ] Test 15: My reviews shows submitted review
- [ ] Error Test: Missing fields returns 400
- [ ] Error Test: Invalid credentials returns 401
- [ ] Error Test: No token returns 401

If all pass → **API is fully functional! 🎉**

---

**You're all set! Start testing! 🚀**
