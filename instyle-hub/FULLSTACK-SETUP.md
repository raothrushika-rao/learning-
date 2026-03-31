# Full-Stack Setup Guide - InStyle Hub

## 🚀 Complete Backend + Frontend Setup

This guide walks you through setting up and running the complete full-stack application.

---

## STEP 1: DATABASE SETUP (PostgreSQL)

### Option A: Local PostgreSQL Installation

**Install PostgreSQL:**
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

**Start PostgreSQL:**
```bash
# Windows (PowerShell as Admin)
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# Mac
brew services start postgresql

# Linux
sudo service postgresql start
```

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal, create database
CREATE DATABASE instyle_hub;
```

### Option B: Docker (Recommended)

**Install Docker:** https://www.docker.com/get-started

**Run PostgreSQL Container:**
```bash
docker run --name instyle-postgres \
  -e POSTGRES_DB=instyle_hub \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

**Verify Connection:**
```bash
docker exec -it instyle-postgres psql -U postgres -d instyle_hub
```

---

## STEP 2: BACKEND SETUP

### 1. Navigate to Backend Directory

```bash
cd instyle-hub/backend
```

### 2. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
```

**Update .env:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/instyle_hub?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Setup Database with Prisma

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

**Migration prompts:**
- Name it: `init` (or any name)
- This creates all tables from schema.prisma

### 5. (Optional) Seed Database with Sample Data

Create `backend/prisma/seed.js`:

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    // Create sample user
    const user = await prisma.user.create({
        data: {
            id: uuidv4(),
            name: 'Alexandra Voss',
            email: 'alexandra@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'designer'
        }
    });

    // Create designer profile
    await prisma.designer.create({
        data: {
            id: uuidv4(),
            userId: user.id,
            brandName: 'Alexandra Voss Bridal',
            specialty: 'bridal',
            bio: 'Luxury bridal designer',
            pricingRange: '$1000-$3000'
        }
    });

    console.log('Database seeded!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
```

Update `package.json`:
```json
"scripts": {
    "seed": "node prisma/seed.js"
}
```

Run seed:
```bash
npm run seed
```

### 6. Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server is running on http://localhost:5000
📚 API Documentation:
   - Auth: POST /api/auth/register, /api/auth/login
   - Designers: GET /api/designers
   - Bookings: GET/POST /api/bookings
   - Reviews: GET/POST /api/reviews
```

---

## STEP 3: FRONTEND SETUP

### 1. Frontend Already Configured

The frontend files are already in the root directory:
- `index.html` - HTML with all sections
- `css/styles.css` - All styling
- `js/script.js` - API-connected frontend (UPDATED)

### 2. Update API URL (if needed)

In `js/script.js`, line 5:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Change if backend runs on different port/address.

### 3. Start Frontend

**Option A: Live Server (VS Code Extension)**

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Opens at `http://localhost:5500`

**Option B: Python Server**

```bash
# Navigate to project root
cd instyle-hub

# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**Option C: Node.js Server**

```bash
npm install -g http-server
http-server . -p 3000
```

---

## STEP 4: TEST THE APPLICATION

### 1. Test Backend API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Designers:**
```bash
curl http://localhost:5000/api/designers
```

### 2. Test Frontend

1. Open `http://localhost:3000` (or your frontend URL)
2. Click "Sign Up"
3. Create account (customer)
4. See designers Load from API
5. Click "View Profile"
6. Login and try "Book Consultation"

---

## STEP 5: CREATING SAMPLE DATA

### Use Prisma Studio (GUI)

```bash
cd backend
npm run prisma:studio
```

Opens at `http://localhost:5555` - manage data graphically!

### Or Use curl Commands

```bash
# Get JWT token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}' \
  | jq -r '.token')

# Book consultation with token
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "designerId":"designer-id-here",
    "date":"2024-04-15",
    "notes":"I want bridal wear"
  }'
```

---

## STEP 6: COMMON ISSUES & FIXES

### Issue: "Cannot find module '@prisma/client'"

**Fix:**
```bash
cd backend
npm install
npm run prisma:generate
```

### Issue: "Database connection failed"

**Fix:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Ensure database exists:
   ```bash
   psql -U postgres -l | grep instyle_hub
   ```

### Issue: "Port 5000 already in use"

**Fix:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: Frontend can't reach backend

**Fix:**
1. Verify backend is running on http://localhost:5000
2. Check API_URL in script.js
3. Verify CORS is enabled in server.js
4. Check browser console for errors (F12)

### Issue: JWT token not working

**Fix:**
1. Ensure JWT_SECRET is same in .env and backend
2. Check token is sent in Authorization header
3. Verify token hasn't expired (set JWT_EXPIRE in .env)

---

## STEP 7: DEPLOY

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

```bash
# Netlify
netlify deploy --prod --dir=.

# Or upload files manually to Vercel
```

---

## PROJECT STRUCTURE

```
instyle-hub/
├── backend/
│   ├── server.js                 # Main Express app
│   ├── package.json              # Backend dependencies
│   ├── .env                       # Environment variables
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.js               # Seed data
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── designers.js          # Designer endpoints
│   │   ├── bookings.js           # Booking endpoints
│   │   └── reviews.js            # Review endpoints
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── designerController.js
│   │   ├── bookingController.js
│   │   └── reviewController.js
│   └── middleware/
│       └── auth.js               # JWT verification
│
├── index.html                    # Frontend (HTML)
├── css/
│   └── styles.css                # Styling
├── js/
│   ├── script.js                 # API-connected frontend
│   └── data.js                   # (old, can delete)
└── README.md
```

---

## API ENDPOINTS SUMMARY

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
-  `GET /api/auth/me` - Get current user (protected)

### Designers
- `GET /api/designers` - Get all designers
- `GET /api/designers?specialty=bridal` - Filter by specialty
- `GET /api/designers/:id` - Get designer details
- `PUT /api/designers/profile` - Update profile (protected, designer only)

### Bookings
- `GET /api/bookings` - Get user's bookings (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id` - Update booking status (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

### Reviews
- `GET /api/reviews/designer/:id` - Get reviews for designer
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews` - Get my reviews (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

---

## NEXT STEPS

1. ✅ Setup database
2. ✅ Start backend
3. ✅ Start frontend
4. ✅ Test APIs
5. ☐ Add more designers via Prisma Studio
6. ☐ Test booking flow
7. ☐ Add reviews (POST /api/reviews)
8. ☐ Deploy to production

---

## SUPPORT & DEBUGGING

**Check Backend Logs:**
```bash
cd backend
npm run dev
# Watch console output for errors
```

**Check Frontend Errors:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see API calls

**Test API Manually:**
- Use Postman: https://www.postman.com/
- Use Insomnia: https://insomnia.rest/
- Or use curl commands above

---

**Your full-stack app is ready! 🎉**
