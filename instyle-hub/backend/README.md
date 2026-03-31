# Backend Configuration & Deployment - InStyle Hub

Backend server for the InStyle Hub full-stack application.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup .env file
cp .env.example .env
# Edit .env with your PostgreSQL connection

# 3. Setup database
npm run prisma:generate
npm run prisma:migrate

# 4. Start server
npm run dev
```

Server runs on: `http://localhost:5000`

---

## Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "seed": "node prisma/seed.js"
}
```

---

## Environment Setup

### .env File

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Edit with your values:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/instyle_hub?schema=public"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

---

## Database Setup

### PostgreSQL Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

**Examples:**

```
# Local PostgreSQL
postgresql://postgres:password@localhost:5432/instyle_hub?schema=public

# Docker PostgreSQL
postgresql://postgres:password@localhost:5432/instyle_hub?schema=public

# Heroku Postgres
postgresql://user:password@ec2-1-2-3-4.compute-1.amazonaws.com:5432/db

# AWS RDS
postgresql://admin:password@instyle.c9akciq32.us-east-1.rds.amazonaws.com:5432/instyle_hub?schema=public
```

### Setup Database Tables

```bash
# Create database schema
npm run prisma:migrate

# When prompted, enter migration name (e.g., "init")

# View database GUI
npm run prisma:studio
```

### Seed Database (Optional)

Create sample data:

```bash
npm run seed
```

---

## Middleware

### Authentication Middleware

File: `middleware/auth.js`

Protects routes by validating JWT token in Authorization header.

**Usage:**
```javascript
router.get('/protected', authMiddleware, controller);
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

### Role-Based Middleware

Control access by user role (customer/designer):

```javascript
router.put('/profile', authMiddleware, designerMiddleware, updateProfile);
router.get('/bookings', authMiddleware, customerMiddleware, getBookings);
```

---

## API Structure

### Routes

- `/api/auth` - User registration & login
- `/api/designers` - Designer discovery & profiles
- `/api/bookings` - Consultation management
- `/api/reviews` - Designer reviews

### Controllers

Each route has a corresponding controller in `/controllers`:

- `authController.js` - Auth logic
- `designerController.js` - Designer operations
- `bookingController.js` - Booking operations
- `reviewController.js` - Review operations

### Database (Prisma)

Schema: `prisma/schema.prisma`

Models:
- User (customers & designers)
- Designer (designer profiles)
- Booking (consultations)
- Review (customer reviews)

---

## Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Docker Deployment

```bash
# Build Docker image
docker build -t instyle-hub .

# Run container
docker run -p 5000:5000 -e DATABASE_URL="..." instyle-hub
```

### AWS/DigitalOcean/GCP Deployment

1. Create Node.js server
2. Install dependencies: `npm install`
3. Setup environment: Create `.env` with DATABASE_URL
4. Run migrations: `npm run prisma:migrate`
5. Start server: `npm start`

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```
Error: Can't reach database server at `localhost:5432`
```

**Fix:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

### Prisma Client Not Found

```bash
npm install @prisma/client
npm run prisma:generate
```

### CORS Errors

Edit `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### JWT Token Invalid

- Check JWT_SECRET is same in .env
- Verify token format: `Bearer <token>`
- Check token isn't expired

---

## Performance Tips

1. **Add database indexes** for frequently queried fields
2. **Implement pagination** in GET endpoints
3. **Cache designer listings** with Redis
4. **Add request logging** with Morgan
5. **Set up APM** with New Relic or Datadog

---

## Security

### Production Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (enforce SSL)
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Enable CORS restrictions
- [ ] Add request logging
- [ ] Use environment variables (no hardcoded secrets)
- [ ] Add helmet.js for security headers
- [ ] Setup database backups

### Install Helmet for Headers

```bash
npm install helmet
```

Use in server.js:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Monitoring

### View Logs

```bash
# See running server logs
npm run dev
```

### Database Monitoring

```bash
# Open Prisma Studio
npm run prisma:studio
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

---

## API Test

### Test with curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123","role":"customer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get Designers
curl http://localhost:5000/api/designers
```

### Test with Postman

Import collection from: `backend/postman-collection.json` (create this file with all endpoints)

---

## File Structure

```
backend/
├── server.js              # Main Express app
├── package.json           # Dependencies
├── .env                   # Configuration (gitignored)
├── .env.example           # Config template
├── .gitignore             # Git ignore rules
│
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migration history
│   └── seed.js            # Seed data
│
├── routes/                # API endpoints
│   ├── auth.js
│   ├── designers.js
│   ├── bookings.js
│   └── reviews.js
│
├── controllers/           # Business logic
│   ├── authController.js
│   ├── designerController.js
│   ├── bookingController.js
│   └── reviewController.js
│
└── middleware/            # Express middleware
    └── auth.js            # JWT validation
```

---

## Technology Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcryptjs
- **Security:** CORS, helmet
- **Development:** nodemon

---

## Contact & Support

For issues or questions:
1. Check `.env` configuration
2. Verify database connection
3. Check database migrations: `npm run prisma:studio`
4. Review API documentation in `API-DOCUMENTATION.md`
5. Check server logs: `npm run dev`

---

**Backend Version:** 1.0.0  
**Last Updated:** January 2024
