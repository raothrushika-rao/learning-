# Backend API Documentation - InStyle Hub

> Complete API reference for the InStyle Hub backend server

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require an **Authorization** header with a JWT token:

```
Authorization: Bearer <token>
```

**Token obtained from:**
```
POST /auth/login
POST /auth/register
```

---

## Endpoints

### 1. AUTH ENDPOINTS

#### Register User

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "customer", // or "designer"
  "specialty": "bridal" // only if role is "designer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**Status Codes:**
- `201` - Registration successful
- `400` - Email already exists or invalid data
- `500` - Server error

---

#### Login User

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `404` - User not found

---

#### Get Current User (Protected)

**Request:**
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "designer": null
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid or missing token

---

### 2. DESIGNER ENDPOINTS

#### Get All Designers

**Request:**
```http
GET /designers
GET /designers?specialty=bridal&search=alexandra
```

**Query Parameters:**
- `specialty` (optional) - Filter by specialty: bridal, casual, formal, custom
- `search` (optional) - Search by brand name or bio

**Response:**
```json
{
  "designers": [
    {
      "id": "987e6543-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "brandName": "Alexandra Voss Bridal",
      "specialty": "bridal",
      "bio": "Luxury bridal designer with 10 years experience",
      "pricingRange": "$1000-$3000",
      "rating": 4.8,
      "followers": 1250,
      "projectCount": 120,
      "image": "url-to-image.jpg",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### Get Designer by ID

**Request:**
```http
GET /designers/:id
```

**Path Parameters:**
- `id` - Designer ID (UUID)

**Response:**
```json
{
  "designer": {
    "id": "987e6543-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "brandName": "Alexandra Voss Bridal",
    "specialty": "bridal",
    "bio": "Luxury bridal designer",
    "pricingRange": "$1000-$3000",
    "rating": 4.8,
    "followers": 1250,
    "projectCount": 120,
    "image": "url-to-image.jpg",
    "reviews": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174000",
        "customerId": "111e1111-e89b-12d3-a456-426614174000",
        "rating": 5,
        "comment": "Amazing work!",
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Designer not found
- `500` - Server error

---

#### Update Designer Profile (Protected, Designer Only)

**Request:**
```http
PUT /designers/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "brandName": "New Brand Name",
  "bio": "Updated bio",
  "specialty": "formal",
  "pricingRange": "$500-$2000"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "designer": {
    "id": "987e6543-e89b-12d3-a456-426614174000",
    "brandName": "New Brand Name",
    "specialty": "formal",
    "pricingRange": "$500-$2000"
  }
}
```

**Status Codes:**
- `200` - Update successful
- `401` - Unauthorized (not logged in or not a designer)
- `400` - Invalid data
- `404` - Designer profile not found

---

### 3. BOOKING ENDPOINTS

#### Create Booking (Protected)

**Request:**
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "designerId": "987e6543-e89b-12d3-a456-426614174000",
  "date": "2024-04-15",
  "notes": "I want a custom wedding dress"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "654e3210-e89b-12d3-a456-426614174000",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "designerId": "987e6543-e89b-12d3-a456-426614174000",
    "date": "2024-04-15",
    "status": "pending",
    "notes": "I want a custom wedding dress",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Status Codes:**
- `201` - Booking created
- `400` - Invalid data or date already exists with this designer
- `401` - Unauthorized
- `404` - Designer not found

---

#### Get User Bookings (Protected)

**Request:**
```http
GET /bookings
Authorization: Bearer <token>
```

**Response (Customer):**
```json
{
  "bookings": [
    {
      "id": "654e3210-e89b-12d3-a456-426614174000",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "designerId": "987e6543-e89b-12d3-a456-426614174000",
      "date": "2024-04-15",
      "status": "pending",
      "notes": "Custom wedding dress",
      "designer": {
        "brandName": "Alexandra Voss Bridal",
        "specialty": "bridal"
      },
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Response (Designer):**
```json
{
  "bookings": [
    {
      "id": "654e3210-e89b-12d3-a456-426614174000",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2024-04-15",
      "status": "pending",
      "notes": "Custom wedding dress",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

#### Update Booking Status (Protected, Designer Only)

**Request:**
```http
PUT /bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed" // or "completed", "cancelled"
}
```

**Response:**
```json
{
  "message": "Booking updated successfully",
  "booking": {
    "id": "654e3210-e89b-12d3-a456-426614174000",
    "status": "confirmed",
    "updatedAt": "2024-01-02T15:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Update successful
- `401` - Unauthorized (not designer)
- `404` - Booking not found

---

#### Cancel Booking (Protected)

**Request:**
```http
DELETE /bookings/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Booking cancelled successfully"
}
```

**Status Codes:**
- `200` - Cancellation successful
- `401` - Unauthorized
- `404` - Booking not found

---

### 4. REVIEW ENDPOINTS

#### Create Review (Protected)

**Request:**
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "designerId": "987e6543-e89b-12d3-a456-426614174000",
  "rating": 5,
  "comment": "Amazing work! Highly recommend!"
}
```

**Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "designerId": "987e6543-e89b-12d3-a456-426614174000",
    "rating": 5,
    "comment": "Amazing work! Highly recommend!",
    "createdAt": "2024-01-03T12:00:00Z"
  }
}
```

**Status Codes:**
- `201` - Review created
- `400` - Invalid rating (must be 1-5) or designer not found
- `401` - Unauthorized

---

#### Get Designer Reviews

**Request:**
```http
GET /reviews/designer/:id
```

**Path Parameters:**
- `id` - Designer ID

**Response:**
```json
{
  "reviews": [
    {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "rating": 5,
      "comment": "Amazing work!",
      "customer": {
        "name": "John Doe"
      },
      "createdAt": "2024-01-03T12:00:00Z"
    }
  ],
  "averageRating": 4.8
}
```

**Status Codes:**
- `200` - Success
- `404` - Designer not found

---

#### Get My Reviews (Protected)

**Request:**
```http
GET /reviews
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "designerId": "987e6543-e89b-12d3-a456-426614174000",
      "rating": 5,
      "comment": "Amazing work!",
      "designer": {
        "brandName": "Alexandra Voss Bridal"
      },
      "createdAt": "2024-01-03T12:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

#### Delete Review (Protected)

**Request:**
```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

**Status Codes:**
- `200` - Deletion successful
- `401` - Unauthorized
- `404` - Review not found

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Messages:**
- `"Invalid credentials"` - Wrong email/password
- `"User already exists"` - Email already registered
- `"No token provided"` or `"Invalid token"` - Auth header missing/invalid
- `"Unauthorized"` - User doesn't have permission for this action
- `"Not found"` - Resource (designer, booking, review) doesn't exist

---

## Rate Limiting

Currently no rate limiting implemented. Add in production!

---

## Example Usage Flow

### 1. Register as Customer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah",
    "email": "sarah@example.com",
    "password": "MyPassword123",
    "role": "customer"
  }'
```

### 2. Get Designers

```bash
curl http://localhost:5000/api/designers?specialty=bridal
```

### 3. Book Consultation

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "designerId": "DESIGNER_ID_HERE",
    "date": "2024-04-20",
    "notes": "Wedding dress consultation"
  }'
```

### 4. Leave Review

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "designerId": "DESIGNER_ID_HERE",
    "rating": 5,
    "comment": "Perfect service!"
  }'
```

---

## Database Schema

See `backend/prisma/schema.prisma` for complete schema with relationships.

**Main Models:**
- **User** - Customers and designers
- **Designer** - Designer profiles linked to users
- **Booking** - Consultations between customers and designers
- **Review** - Customer reviews of designers

---

## Development Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs (v4)
- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire in 7 days
- Specialty options: "bridal", "casual", "formal", "custom"
- Booking statuses: "pending", "confirmed", "completed", "cancelled"

---

**Last Updated:** January 2024
