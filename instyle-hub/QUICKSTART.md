# ⚡ GET STARTED IN 20 MINUTES

> Fastest way to run your full-stack app

---

## BEFORE YOU START

Make sure you have installed:
- ✅ Node.js (v18+)
- ✅ PostgreSQL (or Docker)
- ✅ Git

---

## The 4-Step Plan

```
STEP 1: Setup Backend  (5 min)
    ↓
STEP 2: Setup Database (5 min)
    ↓
STEP 3: Start Servers  (5 min)
    ↓
STEP 4: Test App       (5 min)
```

---

## STEP 1: BACKEND SETUP (5 min)

```bash
# Navigate to backend
cd backend

# Copy environment config
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

✅ **Backend folder is ready!**

---

## STEP 2: DATABASE SETUP (5 min)

### Option A: PostgreSQL Already Running?

Edit `backend/.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/instyle_hub?schema=public"
```

Change `password` to your PostgreSQL password.

### Option B: Docker

```bash
docker run --name instyle-postgres \
  -e POSTGRES_DB=instyle_hub \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

Then set .env:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/instyle_hub?schema=public"
```

### Run Migrations & Seed

```bash
# Still in backend folder
npm run prisma:migrate

# When prompted for migration name, type: "init"

# Add sample data
npm run seed
```

✅ **Database is ready!**

---

## STEP 3: START SERVERS (5 min)

### Terminal 1: Start Backend

```bash
# In backend folder
npm run dev
```

Look for:
```
🚀 Server is running on http://localhost:5000
```

### Terminal 2: Start Frontend

```bash
# In project root (go back up)
cd ..

# Option A: Python
python -m http.server 3000

# Option B: Node
npx http-server . -p 3000

# Option C: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

Open browser: `http://localhost:3000`

✅ **Both servers running!**

---

## STEP 4: TEST YOUR APP (5 min)

### Test #1: Sign Up

1. Click "Sign Up"
2. Enter:
   - Name: Any name
   - Email: testuser@example.com
   - Password: password123
   - Role: Customer (or Designer)
3. Click "Sign Up"
4. See success message ✅

### Test #2: Browse Designers

1. You should see designers listed (from seed data)
2. See designer profiles with images and ratings
3. Try filtering by specialty

### Test #3: Book Consultation

1. Click a designer "View Profile"
2. Click "Book Consultation"
3. Select date
4. Click "Book"
5. See confirmation ✅

### Test #4: Leave Review

1. Scroll to write review
2. Leave 5-star rating
3. Write comment
4. See review posted ✅

✅ **Everything works!**

---

## YOUR TEST CREDENTIALS

**Pre-seeded test accounts:**
```
Customer:
  Email: sarah@example.com
  Password: password123

Designer:
  Email: alexandra@example.com
  Password: password123
```

---

## TROUBLESHOOTING QUICK FIXES

### Backend won't start?
```bash
# Check PostgreSQL is running
psql -U postgres

# If not, start it
brew services start postgresql  # macOS
docker start instyle-postgres   # Docker
```

### "Database connection failed"?
- Check DATABASE_URL in `.env`
- Make sure database exists: `psql -U postgres -l | grep instyle`

### "Port 5000 already in use"?
```bash
lsof -i :5000
kill -9 <PID>
npm run dev
```

### Frontend can't reach API?
- Verify backend is running on http://localhost:5000
- Check browser console (F12) for errors
- Verify FRONTEND_URL in backend server.js is correct

### "Designers not loading"?
```bash
npm run seed  # Add sample data
```

---

## WHAT YOU CAN DO NOW

✅ **Authentication**
- Register as customer or designer
- Login with email/password
- Logout from navbar
- View your profile

✅ **Designer Marketplace**
- Browse all designers from database
- Filter by specialty
- Search by name
- View designer profiles with reviews

✅ **Bookings**
- Book consultations with designers
- Select consultation dates
- Add notes/preferences
- See booking status

✅ **Reviews**
- Leave star ratings (1-5)
- Write review comments
- See all reviews for designer
- View average rating

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Smooth animations
- Black + pink + gold theme

---

## NEXT ADVANCED STEPS

### Want to add more data?
```bash
npm run prisma:studio
# Opens GUI at http://localhost:5555 to manage data
```

### Want to reset everything?
```bash
npm run prisma:migrate reset
# Warning: Deletes all data
npm run seed  # Re-add sample data
```

### Want to deploy?
See [FULLSTACK-SETUP.md](FULLSTACK-SETUP.md#step-7-deploy)

### Need detailed info?
- [API-DOCUMENTATION.md](API-DOCUMENTATION.md) - All API endpoints
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [FULLSTACK-SETUP.md](FULLSTACK-SETUP.md) - Complete guide

---

## CONNECTING THE PIECES

```
Your Browser (http://localhost:3000)
         │
         │ Click "Sign Up"
         ↓
Frontend JavaScript sends POST to:
  http://localhost:5000/api/auth/register
         │
         │ Backend receives request
         ↓
Express Server validates & creates User
         │
         │ Stores in database
         ↓
PostgreSQL saves user record
         │
         │ Server sends back JWT token
         ↓
Browser stores token in localStorage
         │
         │ Now you can browse designers
         ↓
Frontend calls: http://localhost:5000/api/designers
         │
         │ Backend queries database
         ↓
Returns designer list as JSON
         │
         │ JavaScript renders on page
         ↓
You see designers from DATABASE! ✅
```

---

## WHAT'S RUNNING

```
Terminal 1: npm run dev
  → Express server on http://localhost:5000
  → Listens for API requests
  → Talks to PostgreSQL database
  → Uses JWT for auth

Terminal 2: python -m http.server 3000
  → Frontend server on http://localhost:3000
  → Serves HTML/CSS/JavaScript
  → Makes API calls to backend
  → Stores auth token in localStorage

PostgreSQL
  → Database on port 5432
  → Stores users, designers, bookings, reviews
  → Managed by Prisma ORM
```

---

## KEEP THIS HANDY

**Backend commands:**
```bash
npm run dev                    # Start server
npm run prisma:studio         # Database GUI
npm run seed                  # Add sample data
npm run prisma:migrate        # Create tables
```

**Check health:**
```bash
curl http://localhost:5000/api/health
```

**View database:**
```bash
npm run prisma:studio
# Opens http://localhost:5555
```

---

## YOU'RE READY! 🎉

1. ✅ Set up backend with 4 commands
2. ✅ Set up database with 2 commands
3. ✅ Start both servers
4. ✅ Test your app

**Your full-stack fashion marketplace is live!**

---

**Need help?** → See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)  
**Want details?** → See [FULLSTACK-SETUP.md](FULLSTACK-SETUP.md)  
**API reference?** → See [API-DOCUMENTATION.md](API-DOCUMENTATION.md)

**Happy coding! 🚀**
- Mix & match clothing items
- See the preview update in real-time

### 6. **Authentication Modals**
- Click "Login" to open login modal
- Click "Sign Up" to create account
- Select role: Customer or Designer
- Try Google login button (mock)

### 7. **Other Sections**
- Scroll through "Features", "How It Works", "Testimonials"
- See smooth animations on scroll
- Hover effects on all interactive elements

## 🎨 Customization Tips

### Change Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #d64a6f;      /* Change to your color */
    --accent-gold: #d4af37;        /* Change gold accent */
}
```

### Add More Designers
Open `js/data.js` and add to the designers array:
```javascript
{
    id: 9,
    name: "Your Designer",
    specialty: "casual",
    rating: 4.8,
    followers: "10K",
    projects: "250",
    image: "👗",
    description: "Your description here",
    experience: "5 years",
    location: "City, Country"
}
```

### Modify Testimonials
Add more reviews in `js/data.js`:
```javascript
{
    id: 4,
    name: "Customer Name",
    role: "Profession",
    image: "🎭",
    rating: "★★★★★",
    text: "Their testimonial here..."
}
```

## ⌨️ Keyboard Shortcuts

- **ESC**: Close any open modal
- **Ctrl+K (or Cmd+K)**: Jump to designer search
- **Click Nav Links**: Smooth scroll to sections

## ✨ Features Showcase

### Login & Signup
- Enter mock credentials
- Select customer or designer role
- See mock Google login
- Success notifications

### Designer Marketplace
- Browse 8 curated designers
- Real-time search filter
- Sort by specialty
- Detailed profile modals

### Outfit Visualizer
- Upload photo upload section
- Dropdown outfit customizer
- Live preview updates

### Smooth Animations
- Page load animations
- Hover effects on cards
- Smooth scrolling
- Modal transitions

## 📱 Responsive Design

Test on different screen sizes:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Use Chrome DevTools (F12) → Device Emulation

## 🐛 Troubleshooting

**Q: Styles not loading?**
- Make sure `css/styles.css` exists in the css/ folder
- Check file paths in index.html

**Q: JavaScript not working?**
- Verify `js/script.js` and `js/data.js` exist
- Check browser console (F12) for errors
- Clear browser cache (Ctrl+Shift+Del)

**Q: Fonts not displaying?**
- Check internet connection (uses CDN)
- Google Fonts should load automatically

**Q: Images not showing?**
- Emoji icons are used (should work on all browsers)
- Some older browsers may show emoji differently

## 🔗 File Structure
```
instyle-hub/
├── index.html          ← Main file (open this)
├── css/
│   └── styles.css      ← All styling
├── js/
│   ├── data.js         ← Designer & testimonial data
│   └── script.js       ← All functionality
├── assets/             ← (Optional) for future images
└── README.md           ← Full documentation
```

## 💡 Tips & Tricks

1. **Mobile Menu**: Click hamburger icon on mobile
2. **Search**: Type designer names in search box
3. **Profiles**: Click "View Profile" to see full details
4. **Notifications**: Demo notifications appear on actions
5. **Smooth Scroll**: All nav links use smooth scrolling
6. **Role-based**: Try switching between Customer/Designer in signup

## 🎓 Learning Resources

This project showcases:
- Modern responsive design
- Pure vanilla JavaScript (no frameworks)
- CSS Grid & Flexbox layouts
- Form handling and validation
- Event listeners and callbacks
- Dynamic content rendering
- Modal management
- Search and filter logic

## 🚀 Next Steps

1. Open the app in browser
2. Explore all sections
3. Try all interactive features
4. Customize colors, designers, testimonials
5. Deploy to GitHub Pages or web server

## 📞 Quick Reference

| Action | How To |
|--------|--------|
| Search Designers | Type in search box |
| Filter by Type | Use dropdown filter |
| View Profile | Click "View Profile" |
| Sign Up | Click "Sign Up" button |
| Login | Click "Login" button |
| Upload Photo | In Outfit section |
| Close Modal | Press ESC or click outside |
| Smooth Scroll | Click nav links |
| Change Colors | Edit CSS :root variables |
| Add Designers | Edit js/data.js array |

---

**Enjoy exploring InStyle Hub! 🎀✨**

For more detailed documentation, see README.md
