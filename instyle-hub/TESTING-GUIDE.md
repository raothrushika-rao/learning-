# API Integration Test Guide

> Verify that all script.js refactoring is working correctly with backend APIs

---

## 🚀 BEFORE YOU START

1. **Backend running**: `cd backend && npm run dev`
2. **Frontend running**: `python -m http.server 3000`
3. **Database seeded**: `cd backend && npm run seed` (if not done)
4. **Browser open**: http://localhost:3000

---

## 🧪 TEST SUITE

### TEST 1: Load Designers from API ✅

**Action:**
1. Open http://localhost:3000
2. Wait 2 seconds

**Expected:**
- See 6 designer cards populate the grid
- Each has image, name, specialty, rating, followers, projects
- Data matches database (not hardcoded)

**Verify in Browser DevTools:**
```
Network tab → Filter "designers" 
Should see: GET http://localhost:5000/api/designers
Status: 200
Response shows 6 designers as JSON
```

---

### TEST 2: Search Designers ✅

**Action:**
1. Type "Alexandra" in search box
2. Results update immediately

**Expected:**
- Only Alexandra Voss appears
- Other designers disappear

**Verify in Browser DevTools:**
```
Network tab → See new request
Should see: GET .../designers?search=alexandra
Response shows 1 designer
```

---

### TEST 3: Filter by Specialty ✅

**Action:**
1. Open filter dropdown
2. Select "bridal"

**Expected:**
- Only bridal designers show (Alexandra, Rami, Jenny)
- Others hide

**Verify:**
```
GET .../designers?specialty=bridal
Response shows 3 designers
```

---

### TEST 4: Sign Up as Customer ✅

**Action:**
1. Click "Sign Up"
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Customer
3. Click "Sign Up"

**Expected:**
- Green success notification
- Modal closes
- Navbar shows "Test User" + "My Bookings" + "Logout"
- JWT stored in localStorage

**Verify in Browser DevTools:**
```
Network tab:
POST /api/auth/register
Status: 201
Response: { token: "eyJ...", user: { name, email, role } }

Application tab → localStorage:
authToken: "eyJ..."
```

---

### TEST 5: Sign Up as Designer ✅

**Action:**
1. Click "Sign Up"
2. Select Role: "I'm a Designer"
3. Specialty field appears
4. Fill form:
   - Name: Fashion Designer
   - Email: designer@example.com
   - Password: password123
   - Specialty: bridal
5. Click "Sign Up"

**Expected:**
- Designer profile created in database
- Same JWT flow as customer signup

**Verify:**
```
POST /api/auth/register
Payload includes: { role: "designer", specialty: "bridal" }
Status: 201
```

---

### TEST 6: Sign Up Validation ✅

**Action:**
Try each invalid input:
1. Empty email → "Please fill in all fields"
2. Invalid email "test" → "Please enter a valid email"
3. Password < 6 chars "pass" → "Password must be at least 6 characters"
4. Designer without specialty → "Please select a specialty"

**Expected:**
- Error messages appear for each
- No API calls made for invalid data

---

### TEST 7: Login ✅

**Action:**
1. Click "Logout" (if signed up)
2. Click "Login"
3. Use test credentials:
   - Email: sarah@example.com (seeded user)
   - Password: password123
4. Click "Login"

**Expected:**
- Success notification
- Navbar updates with user name
- Can see designers

**Verify:**
```
Network tab:
POST /api/auth/login
Response: { token: "eyJ...", user: {...} }
```

---

### TEST 8: Login Validation ✅

**Action:**
1. Try wrong credentials
   - Email: sarah@example.com
   - Password: wrongpassword
2. Try non-existent user
   - Email: notexist@example.com
   - Password: password123

**Expected:**
- Error messages appear
- No user logs in

---

### TEST 9: View Designer Profile ✅

**Action:**
1. Login first (or signup)
2. Click "View Profile" on any designer
3. Modal opens

**Expected:**
- Designer name, image, rating
- Bio, pricing, review count
- "Book Consultation" button
- "View Reviews" button

**Verify:**
```
GET /api/designers/{designerId}
Response shows: { id, name, bio, rating, reviews: [...] }
```

---

### TEST 10: Book Consultation ✅

**Action:**
1. In designer profile
2. Click "Book Consultation"
3. Enter date: 2024-05-15
4. Click OK

**Expected:**
- Success notification: "Consultation booked!"
- Modal closes
- Booking saved in database

**Verify:**
```
POST /api/bookings
Payload: { designerId: "...", date: "2024-05-15", notes: "" }
Status: 201
```

---

### TEST 11: Book Validation ✅

**Action:**
1. Try invalid dates:
   - "2024/05/15" (wrong format) → Error
   - "2024-01-01" (past date) → Error
2. Hit OK without date → Cancel

**Expected:**
- Errors before API call
- No booking created

---

### TEST 12: View My Bookings ✅

**Action:**
1. Click "My Bookings" in navbar
2. Modal shows bookings

**Expected:**
- Shows designer name, date, status
- Status badge (pending/confirmed)
- Notes visible
- "Cancel" button available

**Verify:**
```
GET /api/bookings
Response: { bookings: [{...}, {...}] }
```

---

### TEST 13: Cancel Booking ✅

**Action:**
1. In "My Bookings" modal
2. Click "Cancel" on pending booking
3. Confirm cancellation

**Expected:**
- Booking removed from list
- Success notification

**Verify:**
```
DELETE /api/bookings/{bookingId}
Status: 200
```

---

### TEST 14: View Reviews ✅

**Action:**
1. View designer profile
2. Click "View Reviews"
3. Modal shows reviews section

**Expected:**
- Shows existing reviews
- Star ratings visible
- Reviewer names and dates shown
- Review text visible and escaped (no HTML)

**Verify:**
```
GET /api/reviews/designer/{designerId}
Response: { reviews: [{rating, comment, customer: {name}, createdAt}, ...] }
```

---

### TEST 15: Submit Review ✅

**Action:**
1. In "View Reviews" section
2. Select rating: 5 stars
3. Write comment: "Great designer!"
4. Click "Submit Review"

**Expected:**
- Success notification
- Review appears in list immediately
- Form clears

**Verify:**
```
POST /api/reviews
Payload: { designerId: "...", rating: 5, comment: "Great designer!" }
Status: 201
```

---

### TEST 16: Review Validation ✅

**Action:**
1. Try to submit without rating
2. Try to submit without comment
3. Submit with empty fields

**Expected:**
- Required field errors
- No API call

---

### TEST 17: Connect with Designer (Outfit Section) ✅

**Action:**
1. Scroll to "Mix & Match" section
2. Click "Connect with Designer"

**Expected:**
- Modal shows designer selection list
- Each designer has name, specialty, pricing

**Verify:**
```
GET /api/designers
Returns all designers for selection
```

---

### TEST 18: Select Designer from Outfit ✅

**Action:**
1. In designer selection modal
2. Click on a designer name
3. Modal asks for date
4. Enter date: 2024-05-20
5. Click OK

**Expected:**
- Booking created
- Success notification
- Modal closes

**Verify:**
```
POST /api/bookings
Same as TEST 10
```

---

### TEST 19: Photo Upload ✅

**Action:**
1. In "Mix & Match" section
2. Click "Upload Photo"
3. Select an image file (< 5MB)

**Expected:**
- Success notification
- Photo displays in preview area

**Note:** No API call (client-side only)

---

### TEST 20: Logout ✅

**Action:**
1. Click "Logout" in navbar

**Expected:**
- Navbar resets to "Login" and "Sign Up" buttons
- localStorage authToken cleared
- Designers still visible (public route)

**Verify:**
```
Browser DevTools → Application → localStorage
authToken should be gone
```

---

## 🔍 Verify NO DUMMY DATA

### Check 1: Network tab inspection
```
Open DevTools → Network tab
Load page, then check:
- Is data.js loaded? NO ✅
- Does GET /api/designers show real database data? YES ✅
```

### Check 2: Search console
```
Open DevTools → Console
Type: designers
Result: ReferenceError: designers is not defined ✅
(This means dummy data is gone!)
```

### Check 3: Source code
```
View page source (Ctrl+U)
Search: "<script src=\"data.js\">"
Result: Not found ✅
```

---

## 🚨 ERROR SCENARIOS

### Test Network Error
**Action:**
1. Stop backend server
2. Refresh page
3. Try to load designers

**Expected:**
- "Failed to load designers" message
- No crash

---

### Test 401 Unauthorized
**Action:**
1. Login successfully
2. Open DevTools → Storage → localStorage
3. Delete authToken manually
4. Try to view "My Bookings"

**Expected:**
- Login modal appears
- "Session expired" message

---

### Test Invalid Data
**Action:**
1. Try to book with invalid designer ID
2. Try to submit review with invalid rating

**Expected:**
- Friendly error message
- No unexpected behavior

---

## 📋 FINAL CHECKLIST

- [ ] No hardcoded designers array
- [ ] All designers load from API
- [ ] Search/filter work from API
- [ ] Signup calls POST /api/auth/register  
- [ ] Login calls POST /api/auth/login
- [ ] JWT token stored in localStorage
- [ ] Bookings saved to database
- [ ] Reviews visible from database
- [ ] Can submit new reviews
- [ ] Can cancel bookings
- [ ] Can logout
- [ ] Error handling for all APIs
- [ ] Form validation before API calls
- [ ] No data.js imported or used
- [ ] XSS prevention (escaped HTML)
- [ ] Date validation working

---

## 🎯 SUMMARY

If all 20 tests pass + final checklist complete:

**✅ REFACTORING SUCCESSFUL!**

Your app is:
- ✅ 100% API-driven
- ✅ 0% dummy data
- ✅ Production-ready
- ✅ Fully validated
- ✅ Secure (XSS prevention, validation)
- ✅ Error-handled

**Ready to deploy!** 🚀
