# Troubleshooting & Next Steps - InStyle Hub

> Quick fixes for common issues and what to do next

---

## 🚨 COMMON ISSUES

### Issue 1: "Cannot find module '@prisma/client'"

**Error:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd backend
npm install
npm run prisma:generate
```

---

### Issue 2: "Database connection error"

**Error:**
```
Can't reach database server at `localhost:5432`
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

1. **Start PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo service postgresql start
   
   # Docker
   docker start instyle-postgres
   ```

2. **Verify connection:**
   ```bash
   psql -U postgres -d instyle_hub
   ```

3. **Check .env DATABASE_URL:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/instyle_hub?schema=public"
   ```

---

### Issue 3: "Port 5000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Find process using port:**
```bash
lsof -i :5000
```

**Kill process:**
```bash
kill -9 <PID>
```

**Or use different port:**
```bash
# In .env
PORT=5001

# Then start server on new port
npm run dev
```

---

### Issue 4: "CORS error - blocked by browser"

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

**Verify in server.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Or use permissive CORS (dev only):**
```javascript
app.use(cors());
```

---

### Issue 5: "JWT token not working"

**Error:**
```
"error": "Invalid token" or "No token provided"
```

**Solution:**

1. **Check token is being sent:**
   - Open DevTools (F12)
   - Go to Network tab
   - Click on API request
   - Check "Authorization" header contains: `Bearer eyJh...`

2. **Verify JWT_SECRET in .env:**
   ```
   JWT_SECRET="your-secret-key"
   ```

3. **Check token in localStorage:**
   ```javascript
   // In browser console (F12)
   localStorage.getItem('authToken')
   ```

4. **Verify token expiry:**
   ```
   JWT_EXPIRE="7d"
   ```

---

### Issue 6: "Designer not created during signup"

**Problem:** Signed up as designer but profile doesn't appear.

**Solution:**

1. Check role was set to "designer" in signup form
2. Verify specialty was selected
3. Check database:
   ```bash
   npm run prisma:studio
   # View User and Designer tables
   ```

---

### Issue 7: "API returns empty designer list"

**Problem:** GET /api/designers returns `[]`

**Solution:**

1. **Add sample data:**
   ```bash
   npm run seed
   # Or manually add via Prisma Studio
   ```

2. **Or manually with SQL:**
   ```bash
   psql -U postgres -d instyle_hub
   
   INSERT INTO "User" (id, email, name, password, role) 
   VALUES ('...uuid...', 'designer@test.com', 'Designer Name', '$2a$10$...', 'designer');
   
   INSERT INTO "Designer" (id, "userId", "brandName", specialty, bio)
   VALUES ('...uuid...', '...user-id...', 'Brand Name', 'bridal', 'Bio here');
   ```

---

### Issue 8: "Frontend can't reach API"

**Error:** Network tab shows failed requests or 404 errors.

**Solution:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check API_URL in script.js:**
   ```javascript
   // Line ~5 in js/script.js
   const API_URL = 'http://localhost:5000/api';
   ```

3. **Verify backend is on port 5000:**
   ```bash
   # In backend .env
   PORT=5000
   ```

---

### Issue 9: "Login not working"

**Error:** "Invalid credentials" even with correct email/password.

**Solution:**

1. **Verify user exists in database:**
   ```bash
   npm run prisma:studio
   # Check User table
   ```

2. **Check password hashing:**
   - Passwords are hashed with bcryptjs
   - You must use exact password from signup

3. **Test manually:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

---

### Issue 10: "Booking creation fails"

**Error:** "Designer not found" or other booking errors.

**Solution:**

1. **Verify designer exists:**
   ```bash
   curl http://localhost:5000/api/designers/:designerId
   ```

2. **Check booking date format:**
   ```javascript
   // Must be YYYY-MM-DD
   date: "2024-04-15"  // ✓ Correct
   date: "04/15/2024"  // ✗ Wrong
   ```

3. **Ensure authenticated:**
   ```bash
   curl -X POST http://localhost:5000/api/bookings \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"designerId":"...","date":"2024-04-15","notes":""}'
   ```

---

## ✅ VERIFICATION CHECKLIST

Use this to verify everything is working:

### Backend Setup

- [ ] PostgreSQL is running
- [ ] .env file created with DATABASE_URL
- [ ] `npm install` completed
- [ ] `npm run prisma:migrate` ran successfully
- [ ] Backend starts with `npm run dev`
- [ ] http://localhost:5000/api/health returns 200

### Database

- [ ] Can connect via `psql $DATABASE_URL`
- [ ] Database tables created (check Prisma Studio)
- [ ] At least one designer profile exists
- [ ] Can view data in `npm run prisma:studio`

### Frontend

- [ ] Frontend loads at http://localhost:3000 (or Live Server URL)
- [ ] HTML renders correctly
- [ ] CSS styling is applied (black/pink/gold theme visible)
- [ ] Can see login/signup forms

### API Calls

- [ ] Signup creates user and stores token in localStorage
- [ ] Login retrieves token successfully
- [ ] GET /api/designers returns list (or seed data)
- [ ] Designer profile page loads with data
- [ ] Booking creation stores in database

### Full Flow

- [ ] Register new customer account
- [ ] Login and see logout button in navbar
- [ ] View designer list from database
- [ ] Click designer profile and see details
- [ ] Book consultation and see confirmation
- [ ] Leave review and see it posted
- [ ] Logout clears token and resets navbar

---

## 🚀 NEXT STEPS

### Step 1: Database Setup (⏱️ 10 mins)

```bash
# Start PostgreSQL (if not running)
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
docker start instyle-postgres   # Docker

# Create .env file
cd backend
cp .env.example .env

# Edit .env with your database connection
# Example:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/instyle_hub?schema=public"

# Setup database
npm install
npm run prisma:generate
npm run prisma:migrate
```

### Step 2: Add Sample Data (⏱️ 5 mins)

```bash
# Option A: Use Prisma Studio (recommended)
npm run prisma:studio
# GUI opens - manually add designers

# Option B: Run seed script
npm run seed

# Option C: Manual SQL
psql $DATABASE_URL
# Paste SQL from below
```

### Step 3: Start Backend (⏱️ 2 mins)

```bash
npm run dev
# Should see: "🚀 Server is running on http://localhost:5000"
```

### Step 4: Start Frontend (⏱️ 2 mins)

```bash
# Option 1: Live Server (VS Code)
# Right-click index.html → "Open with Live Server"

# Option 2: Python server
python -m http.server 3000

# Option 3: Node.js server
npx http-server . -p 3000
```

### Step 5: Test Full Flow (⏱️ 15 mins)

1. Open browser to http://localhost:3000
2. Click "Sign Up" → Create customer account
3. See designers listed from database
4. Click designer → View profile and reviews
5. Book consultation → Check confirmation
6. Leave review → See it posted
7. Logout → See navbar reset

---

## 🔧 MANUAL SQL FOR SAMPLE DATA

If you want to add data via SQL instead of Prisma Studio:

```sql
-- Create sample user (password: password123)
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt") 
VALUES (
  '123e4567-e89b-12d3-a456-426614174001',
  'alexandra@example.com',
  'Alexandra Voss',
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm',  -- hashed
  'designer',
  NOW(),
  NOW()
);

-- Create designer profile
INSERT INTO "Designer" (id, "userId", "brandName", specialty, bio, "pricingRange", rating, followers, "projectCount", image, "createdAt", "updatedAt")
VALUES (
  'a23e4567-e89b-12d3-a456-426614174001',
  '123e4567-e89b-12d3-a456-426614174001',
  'Alexandra Voss Bridal',
  'bridal',
  'Luxury bridal designer with 10+ years experience',
  '$1000-$3000',
  4.8,
  1250,
  120,
  'https://via.placeholder.com/300',
  NOW(),
  NOW()
);

-- Repeat for more designers...
```

---

## 📱 TESTING TOOLS

### Test API with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create collection "InStyle Hub API"
3. Add requests:
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/designers
   - POST /api/bookings
   - POST /api/reviews

### View Database Visually

```bash
npm run prisma:studio
# Opens http://localhost:5555
```

### Check Logs

```bash
npm run dev
# Watch console output for errors
```

### Browser DevTools

1. Press F12
2. Network tab - see API calls
3. Console tab - see errors
4. Application tab - see localStorage (authToken)

---

## 🎯 QUICK REFERENCE

| Task | Command |
|------|---------|
| Start backend | `npm run dev` (in backend folder) |
| Start frontend | Live Server or `python -m http.server 3000` |
| View database | `npm run prisma:studio` |
| Add sample data | `npm run seed` |
| Run migrations | `npm run prisma:migrate` |
| Reset database | `npm run prisma:migrate reset` (warning: deletes all data) |
| Check health | `curl http://localhost:5000/api/health` |
| Test login | `curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"...","password":"..."}'` |

---

## ❓ STILL STUCK?

1. **Check logs:**
   - Backend: Look at terminal output when running `npm run dev`
   - Frontend: Press F12 → Console tab
   - Database: Open Prisma Studio `npm run prisma:studio`

2. **Verify configuration:**
   - .env file has DATABASE_URL
   - Backend starts without errors
   - Frontend can fetch from API (check Network tab in F12)

3. **Review documentation:**
   - [API-DOCUMENTATION.md](API-DOCUMENTATION.md) - All endpoints
   - [backend/README.md](backend/README.md) - Backend setup
   - [FULLSTACK-SETUP.md](FULLSTACK-SETUP.md) - Complete guide

4. **Common fixes:**
   - Restart backend: `Ctrl+C` then `npm run dev`
   - Restart frontend: Refresh browser
   - Clear localStorage: DevTools → Application → Clear all cookies

---

**You're all set! 🎉 Your full-stack fashion app is ready to run!**
