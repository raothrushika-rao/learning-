# 🚀 InStyle Hub - Complete Setup Guide

## Overview
This guide walks you through setting up the entire InStyle Hub full-stack application from scratch.

**Project Structure:**
```
instyle-hub/
├── backend/           # Express API (PORT 5000)
├── frontend/          # HTML/CSS/JS (PORT 3000)
├── index.html         # Main entry point
├── js/                # JavaScript files
├── css/               # Stylesheets
└── setup.sh          # Automated setup script (optional)
```

---

## ⚙️ STEP 1: Backend Setup

### 1.1 Create `.env` file

The `.env` file has already been created with SQLite configuration:

```env
DATABASE_URL="file:./instyle_hub.db"
JWT_SECRET="instyle-hub-secret-key-2024-change-in-production"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Location:** `/workspaces/learning-/instyle-hub/backend/.env`

✅ **Status: COMPLETE**

### 1.2 Install Dependencies

**Command:**
```bash
cd /workspaces/learning-/instyle-hub/backend
npm install
```

**What this does:**
- Installs Express.js, Prisma, JWT, bcrypt, and other dependencies
- Creates `node_modules` folder

**Expected output:**
```
added XX packages in X.XXs
```

---

## 🗄️ STEP 2: Database Setup

### 2.1 Generate Prisma Client

**Command:**
```bash
cd /workspaces/learning-/instyle-hub/backend
npm run prisma:generate
```

**What this does:**
- Generates Prisma Client from schema.prisma
- Creates types for your database

---

### 2.2 Run Migrations

**Command:**
```bash
cd /workspaces/learning-/instyle-hub/backend
npm run prisma:migrate -- --name init
```

**What this does:**
- Creates the database file `instyle_hub.db`
- Creates all tables: User, Designer, Booking, Review
- Sets up relationships between tables

**Expected output:**
```
✔ Generated Prisma Client (X.X.X) to ./node_modules/.prisma/client in 123ms
✔ Created migration - 123_init

Your migrations have been created and your database has been updated.
```

---

### 2.3 Seed Database with Sample Data

**Command:**
```bash
cd /workspaces/learning-/instyle-hub/backend
npm run seed
```

**What this does:**
- Creates 6 sample designers
- Creates 1 test customer account
- Creates sample bookings and reviews
- All password for test accounts: `password123`

**Test Accounts Created:**
```
Customers:
- sarah@example.com / password123

Designers:
- alexandra@example.com / password123 (Bridal)
- monica@example.com / password123 (Formal)
- rami@example.com / password123 (Bridal)
- jenny@example.com / password123 (Bridal)
- oscar@example.com / password123 (Luxury)
- zuhair@example.com / password123 (Casual)
```

---

## 🌐 STEP 3: Start Backend Server

### 3.1 Start Development Server

**Command:**
```bash
cd /workspaces/learning-/instyle-hub/backend
npm run dev
```

**Expected output:**
```
🚀 Server is running on http://localhost:5000
📚 API Documentation:
   - Auth: POST /api/auth/register, /api/auth/login
   - Designers: GET /api/designers
   - Bookings: GET/POST /api/bookings
   - Reviews: GET/POST /api/reviews
```

✅ **Backend is now running at http://localhost:5000**

---

## 🖥️ STEP 4: Start Frontend Server

### 4.1 In a NEW Terminal Tab/Window

**Command:**
```bash
cd /workspaces/learning-/instyle-hub
python -m http.server 3000
```

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

> **Note:** If Python isn't available, use:
> ```bash
> npx http-server -p 3000
> ```

✅ **Frontend is now running at http://localhost:3000**

---

## ✅ STEP 5: Test the Application

### 5.1 Open in Browser

Navigate to: **http://localhost:3000**

You should see the InStyle Hub landing page with:
- Header with "Login" and "Sign Up" buttons
- Hero section
- Marketplace section showing 6 designers
- Features section
- Mix & Match section
- Testimonials
- Footer

### 5.2 Test Sign Up (New Customer)

1. Click "Sign Up" button
2. Fill form:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Password:** password123
   - **Role:** Customer
3. Click "Sign Up"
4. ✅ You should see success message and name in navbar

### 5.3 Test Sign Up (New Designer)

1. Click "Sign Up" button
2. Select Role: "I'm a Designer"
3. Specialty field appears → Select "bridal"
4. Fill form:
   - **Name:** Jane Designer
   - **Email:** jane@example.com
   - **Password:** password123
   - **Specialty:** bridal
5. Click "Sign Up"
6. ✅ Designer profile created

### 5.4 Test Login

1. Click "Logout" if logged in
2. Click "Login"
3. Use test account:
   - **Email:** sarah@example.com
   - **Password:** password123
4. Click "Login"
5. ✅ Should see success message

### 5.5 Test Designer Discovery

1. Make sure you're logged in
2. Scroll to "Marketplace" section
3. ✅ Should see 6 designer cards with:
   - Designer name
   - Specialty
   - Price range
   - Ratings
   - Photo

### 5.6 Test Designer Search

1. In Marketplace section
2. Type in search box: "Alexandra"
3. ✅ Should filter to show only Alexandra

### 5.7 Test Designer Filtering

1. Click specialty filter dropdown
2. Select "bridal"
3. ✅ Should show only bridal designers (Alexandra, Rami, Jenny)

### 5.8 Test View Designer Profile

1. Click "View Profile" on any designer
2. Modal opens showing:
   - Designer name and image
   - Specialty and rating
   - Bio text
   - Pricing range
   - "Book Consultation" button
   - "View Reviews" button

### 5.9 Test Book Consultation

1. In designer profile modal
2. Click "Book Consultation"
3. Prompt asks for date
4. Enter date: 2025-05-20
5. Another prompt for notes (optional) → "Please create elegant bridal wear"
6. ✅ Should see success notification

### 5.10 Test View Bookings

1. Navbar should show "My Bookings" button
2. Click "My Bookings"
3. Modal shows all your bookings with:
   - Designer name
   - Booking date
   - Status (pending)
   - Notes
   - Cancel button

### 5.11 Test View & Submit Review

1. In designer profile modal
2. Click "View Reviews"
3. See existing reviews section
4. ✅ If logged in as customer, should see review form with:
   - Star rating selector (1-5)
   - Comment textarea
   - Submit button
5. Select 5 stars
6. Write: "Excellent designer!"
7. Click "Submit Review"
8. ✅ Review should appear in the list

### 5.12 Test Logout

1. Click "Logout" in navbar
2. ✅ Should return to login/signup buttons

---

## 🔍 STEP 6: Verify API Endpoints

Open New Terminal Tab and test each endpoint:

### 6.1 Test GET /api/designers

```bash
curl http://localhost:5000/api/designers
```

**Expected:** JSON array of 6 designers

### 6.2 Test POST /api/auth/login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@example.com","password":"password123"}'
```

**Expected:**
```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": "...",
    "name": "Sarah",
    "email": "sarah@example.com",
    "role": "customer"
  }
}
```

### 6.3 Test POST /api/bookings

```bash
TOKEN="<paste-token-from-login>"
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "designerId": "<designer-id>",
    "date": "2025-05-20",
    "notes": "Test booking"
  }'
```

**Expected:** 201 Created with booking details

### 6.4 Test GET /api/bookings

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/bookings
```

**Expected:** JSON array of user's bookings

### 6.5 Test POST /api/reviews

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "designerId": "<designer-id>",
    "rating": 5,
    "comment": "Great designer!"
  }'
```

**Expected:** 201 Created with review details

---

## 🐛 Troubleshooting

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: "sqlite database file not found"
**Solution:**
```bash
cd backend
npm run prisma:migrate -- --name init
npm run seed
```

### Issue: "JWT_SECRET is undefined"
**Solution:** Make sure `.env` file exists in `/backend` folder with `JWT_SECRET` value

### Issue: "Cannot connect to frontend"
**Solution:**
- Check if frontend server is running on port 3000
- Check browser console (F12) for CORS errors
- Try refreshing browser with Ctrl+Shift+R (hard refresh)

### Issue: "Designers not showing"
**Solution:**
```bash
cd backend
npm run seed
```

### Issue: "Login fails with 'Invalid credentials'"
**Solution:**
- Make sure you're using correct test credentials from seed
- Check that database was seeded: `npm run seed`
- Try resetting database: `rm instyle_hub.db && npm run prisma:migrate`

---

## 📋 Verification Checklist

Before considering setup complete, verify:

**Backend:**
- [ ] `npm install` completed without errors
- [ ] `npm run prisma:generate` created Prisma client
- [ ] `npm run prisma:migrate --name init` created database
- [ ] `npm run seed` populated sample data
- [ ] `npm run dev` started server on port 5000
- [ ] `curl http://localhost:5000/api/health` returns OK

**Frontend:**
- [ ] Frontend server running on port 3000
- [ ] Page loads without console errors
- [ ] Designers visible in marketplace
- [ ] Can sign up as customer
- [ ] Can sign up as designer
- [ ] Can login with test account
- [ ] Can book consultation
- [ ] Can view and submit reviews
- [ ] "My Bookings" shows bookings
- [ ] Can logout

**API Integration:**
- [ ] DevTools Network tab shows API calls to `/api/*`
- [ ] JWT tokens visible in Authorization headers
- [ ] All responses have 200 or 201 status codes
- [ ] No 401 or 403 errors (unless intentional)

---

## 🚀 Next Steps

### Development Workflow

1. **Backend changes:**
   - Edit files in `/backend`
   - Server auto-reloads with `npm run dev` (nodemon)
   - Test with curl or Postman

2. **Frontend changes:**
   - Edit files in `/js` or `/css`
   - Refresh browser to see changes
   - Check console for errors (F12)

3. **Database changes:**
   - Edit schema in `/backend/prisma/schema.prisma`
   - Run: `npm run prisma:migrate -- --name <description>`
   - Run: `npm run seed` to repopulate

### Deploy to Production

1. Update `.env` with production values
2. Change `NODE_ENV` to "production"
3. Use a production database (PostgreSQL)
4. Use strong `JWT_SECRET`
5. Set up CORS for production domain
6. Deploy backend to hosting (Heroku, Render, etc.)
7. Deploy frontend to CDN (Vercel, Netlify, etc.)

---

## 💡 Tips

- **Database GUI:** `npm run prisma:studio` opens Prisma Studio to browse data
- **Reset Database:** `rm backend/instyle_hub.db && npm run prisma:migrate -- --name init && npm run seed`
- **Debug Mode:** Check browser console (F12) and backend server output
- **API Testing:** Use Postman or curl for testing endpoints
- **Frontend debugging:** Add `console.log()` in `js/script.js` and check F12 console

---

**Setup Complete! 🎉**

Your InStyle Hub application is now ready for use. Start the backend and frontend servers as described in Steps 3 and 4, then navigate to http://localhost:3000 to begin using the application.

For questions or issues, check the Troubleshooting section above.
