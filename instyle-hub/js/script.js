// ============================================
// INSTYLE HUB - MAIN SCRIPT (API VERSION)
// ============================================

const API_URL = 'http://localhost:5000/api';
let currentUserRole = 'customer';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// ============================================
// API HELPER FUNCTIONS
// ============================================

async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                authToken = null;
                showNotification('Session expired. Please login again.', 'error');
            }
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// AUTHENTICATION
// ============================================

function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

function clearAuth() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
}

// ============================================
// Navigation and Menu
// ============================================

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = 80;
        const elementPosition = element.offsetTop - navHeight;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Modal Functions
// ============================================

function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('signupModal').classList.remove('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('show');
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function closeDesignerModal() {
    document.getElementById('designerModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchModal() {
    if (document.getElementById('loginModal').classList.contains('show')) {
        closeLoginModal();
        openSignupModal();
    } else {
        closeSignupModal();
        openLoginModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const designerModal = document.getElementById('designerModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === designerModal) {
        closeDesignerModal();
    }
};

// ============================================
// User Role Selection
// ============================================

function selectRole(role) {
    currentUserRole = role;
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide designer specialty field
    const designerSpecialty = document.getElementById('designerSpecialty');
    if (role === 'designer') {
        designerSpecialty.style.display = 'block';
    } else {
        designerSpecialty.style.display = 'none';
    }
}

// ============================================
// FORM HANDLERS
// ============================================

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (!response.token) {
            throw new Error('No token received from server');
        }

        setAuthToken(response.token);
        currentUser = response.user;
        currentUserRole = response.user.role;
        
        showNotification(`Welcome back, ${response.user.name}!`, 'success');
        closeLoginModal();
        form.reset();
        updateNavbar();
        
        if (document.getElementById('designerGrid')) {
            loadDesigners();
        }
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;
    const specialty = form.querySelector('#designerSpecialty select')?.value || '';

    // Validation
    if (!name || !email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (name.length < 2) {
        showNotification('Name must be at least 2 characters', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (currentUserRole === 'designer' && !specialty) {
        showNotification('Please select a specialty', 'error');
        return;
    }

    try {
        const data = {
            name,
            email,
            password,
            role: currentUserRole,
        };

        if (currentUserRole === 'designer') {
            data.specialty = specialty;
            data.brandName = name;
        }

        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (!response.token) {
            throw new Error('No token received from server');
        }

        setAuthToken(response.token);
        currentUser = response.user;
        currentUserRole = response.user.role;

        showNotification(`Welcome, ${response.user.name}!`, 'success');
        closeSignupModal();
        form.reset();
        currentUserRole = 'customer'; // Reset for next signup
        updateNavbar();
        loadDesigners();
    } catch (error) {
        showNotification(error.message || 'Signup failed', 'error');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleLogout() {
    clearAuth();
    showNotification('Logged out successfully', 'success');
    updateNavbar();
    loadDesigners();
}

function updateNavbar() {
    const navButtons = document.querySelector('.nav-buttons');
    
    if (currentUser) {
        navButtons.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-weight: 600; color: var(--text-dark);">${currentUser.name}</span>
                <button class="btn-login" onclick="viewMyBookings()" style="font-size: 0.9rem; padding: 8px 12px;">My Bookings</button>
                <button class="btn-login" onclick="handleLogout()" style="font-size: 0.9rem; padding: 8px 12px; background: #d4a5a5;">Logout</button>
            </div>
        `;
    } else {
        navButtons.innerHTML = `
            <button class="btn-login" onclick="openLoginModal()">Login</button>
            <button class="btn-signup" onclick="openSignupModal()">Sign Up</button>
        `;
    }
}

async function viewMyBookings() {
    if (!currentUser) {
        showNotification('Please login first', 'error');
        return;
    }

    try {
        const response = await apiCall('/bookings');
        const bookings = response.bookings || response || [];

        let bookingsHTML = '<div class="designer-profile">';
        bookingsHTML += '<h2 style="margin-bottom: 20px;">My Bookings</h2>';

        if (bookings.length === 0) {
            bookingsHTML += '<p style="color: #999; text-align: center; padding: 40px;">No bookings yet. <a href="#marketplace" onclick="scrollTo(\'marketplace\')" style="color: var(--primary-color); text-decoration: none;">Browse designers</a></p>';
        } else {
            bookings.forEach(booking => {
                const bookingDate = new Date(booking.date).toLocaleDateString();
                const designerName = booking.designer?.brandName || booking.customer?.name || 'Unknown';
                
                bookingsHTML += `
                    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 10px; margin-bottom: 15px; background: #fafafa;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <h4 style="margin: 0 0 5px 0; font-size: 1.1rem;">${designerName}</h4>
                                <small style="color: #999;">Date: ${bookingDate}</small>
                            </div>
                            <span style="display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; 
                                ${booking.status === 'confirmed' ? 'background: #d4f1ed; color: #2d9e88;' : 
                                  booking.status === 'pending' ? 'background: #fff3cd; color: #856404;' :
                                  booking.status === 'completed' ? 'background: #d4edda; color: #155724;' :
                                  'background: #f8d7da; color: #721c24;'}">
                                ${booking.status.toUpperCase()}
                            </span>
                        </div>
                        ${booking.notes ? `<p style="margin: 10px 0; color: #333; font-size: 0.9rem;"><strong>Notes:</strong> ${escapeHtml(booking.notes)}</p>` : ''}
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; display: flex; gap: 10px;">
                            ${booking.status === 'pending' ? `<button class="btn-secondary" onclick="cancelBooking('${booking.id}')" style="font-size: 0.85rem; padding: 5px 10px;">Cancel</button>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        bookingsHTML += '</div>';

        document.getElementById('designerModalContent').innerHTML = bookingsHTML;
        document.getElementById('designerModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        showNotification('Failed to load bookings: ' + error.message, 'error');
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        await apiCall(`/bookings/${bookingId}`, {
            method: 'DELETE'
        });

        showNotification('Booking cancelled successfully', 'success');
        viewMyBookings(); // Refresh bookings list
    } catch (error) {
        showNotification('Failed to cancel booking: ' + error.message, 'error');
    }
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// Designer Marketplace
// ============================================

async function loadDesigners(specialty = 'all', search = '') {
    try {
        const designerGrid = document.getElementById('designerGrid');
        if (designerGrid) {
            designerGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #999;">Loading designers...</p>';
        }

        let url = '/designers?';
        if (specialty !== 'all') url += `specialty=${specialty}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;

        const response = await apiCall(url);
        const designers = response.designers || response || [];

        if (!Array.isArray(designers)) {
            throw new Error('Invalid response format');
        }

        renderDesigners(designers);
    } catch (error) {
        const designerGrid = document.getElementById('designerGrid');
        if (designerGrid) {
            designerGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #d32f2f;">Failed to load designers. Please try again.</p>`;
        }
        console.error('Designer loading error:', error);
    }
}

function renderDesigners(designers) {
    const designerGrid = document.getElementById('designerGrid');
    if (!designerGrid) return;
    
    designerGrid.innerHTML = '';

    if (!designers || designers.length === 0) {
        designerGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #999;">No designers found. Try a different search.</p>';
        return;
    }

    designers.forEach((designer, index) => {
        const designerCard = document.createElement('div');
        designerCard.className = 'designer-card';
        designerCard.style.animationDelay = `${index * 0.05}s`;

        const ratingValue = designer.rating || 0;
        const rating = '★'.repeat(Math.floor(ratingValue)) + (ratingValue % 1 >= 0.5 ? '★' : '');

        designerCard.innerHTML = `
            <div class="designer-image">
                ${designer.image || '👗'}
            </div>
            <div class="designer-info">
                <div class="designer-name">${escapeHtml(designer.brandName || 'Unknown Designer')}</div>
                <div class="designer-specialty">${(designer.specialty || 'general').charAt(0).toUpperCase() + (designer.specialty || 'general').slice(1)}</div>
                <div class="rating">${rating || '★★★★☆'}</div>
                <div class="designer-stats">
                    <div class="stat">
                        <div class="stat-value">${designer.followers || 0}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${designer.projectCount || 0}</div>
                        <div class="stat-label">Projects</div>
                    </div>
                </div>
                <button onclick="openDesignerProfile('${designer.id}')">View Profile</button>
            </div>
        `;

        designerGrid.appendChild(designerCard);
    });
}

function filterDesigners() {
    const searchInput = document.getElementById('designerSearch');
    const filterSelect = document.getElementById('designerFilter');
    
    const search = searchInput?.value || '';
    const specialty = filterSelect?.value || 'all';
    
    loadDesigners(specialty, search);
}

async function openDesignerProfile(designerId) {
    if (!designerId) {
        showNotification('Invalid designer ID', 'error');
        return;
    }

    try {
        const response = await apiCall(`/designers/${designerId}`);
        const designer = response.designer || response;

        if (!designer || !designer.id) {
            throw new Error('Invalid designer data received');
        }

        const modalContent = `
            <div class="designer-profile">
                <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid var(--border-color);">
                    <div style="font-size: 80px; margin-bottom: 20px;">${designer.image || '👗'}</div>
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 10px;">${escapeHtml(designer.brandName || 'Unknown')}</h2>
                    <div style="color: var(--primary-color); font-weight: 600; margin-bottom: 10px;">
                        ${'★'.repeat(Math.floor(designer.rating || 0))} ${(designer.rating || 0).toFixed(1)}/5
                    </div>
                    <p style="color: var(--text-light); margin-bottom: 15px;">${(designer.specialty || 'general').charAt(0).toUpperCase() + (designer.specialty || 'general').slice(1)} Specialist</p>
                </div>
                
                <div style="padding: 30px 0; border-bottom: 1px solid var(--border-color);">
                    <p style="margin-bottom: 20px; line-height: 1.8;">${escapeHtml(designer.bio || 'No bio available')}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <div style="color: var(--text-light); font-size: 0.9rem;">Pricing</div>
                            <div style="font-weight: 700; font-size: 1.2rem; color: var(--secondary-color);">${escapeHtml(designer.pricingRange || 'Contact for pricing')}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light); font-size: 0.9rem;">Reviews</div>
                            <div style="font-weight: 700; font-size: 1.2rem; color: var(--secondary-color);">${(designer.reviews?.length || 0)}</div>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 30px 0;">
                    ${currentUser 
                        ? `<button class="btn-primary" onclick="bookConsultation('${designerId}')" style="width: 100%; margin-bottom: 15px;">Book Consultation</button>
                           <button class="btn-secondary" onclick="loadDesignerReviews('${designerId}')" style="width: 100%;">View Reviews</button>`
                        : `<button class="btn-primary" onclick="openLoginModal()" style="width: 100%;">Login to Book</button>`
                    }
                </div>
            </div>
        `;

        document.getElementById('designerModalContent').innerHTML = modalContent;
        document.getElementById('designerModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        showNotification('Failed to load designer details: ' + (error.message || 'Unknown error'), 'error');
        console.error('Designer profile error:', error);
    }
}

async function bookConsultation(designerId) {
    if (!currentUser) {
        showNotification('Please login first', 'error');
        return;
    }

    if (!designerId) {
        showNotification('Invalid designer ID', 'error');
        return;
    }

    const date = prompt('Enter consultation date (YYYY-MM-DD):\n\nExample: 2024-04-20');
    if (!date) return;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        showNotification('Invalid date format. Use YYYY-MM-DD', 'error');
        return;
    }

    // Validate date is not in the past
    if (new Date(date) < new Date()) {
        showNotification('Please select a future date', 'error');
        return;
    }

    const notes = prompt('Add any notes or preferences (optional):') || '';

    try {
        await apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify({
                designerId,
                date,
                notes: notes.substring(0, 500) // Limit to 500 characters
            })
        });

        showNotification('Consultation booked successfully! 🎉', 'success');
        closeDesignerModal();
    } catch (error) {
        showNotification('Failed to book consultation: ' + (error.message || 'Unknown error'), 'error');
        console.error('Booking error:', error);
    }
}

async function loadDesignerReviews(designerId) {
    try {
        const response = await apiCall(`/reviews/designer/${designerId}`);
        const reviews = response.reviews || response;
        
        let reviewsHTML = '<div style="margin: 20px 0;"><h3 style="margin-bottom: 15px;">Recent Reviews</h3>';
        
        if (!reviews || reviews.length === 0) {
            reviewsHTML += '<p style="color: #999;">No reviews yet. Be the first to review!</p>';
        } else {
            reviews.forEach(review => {
                reviewsHTML += `
                    <div style="padding: 15px; background: #f5f5f5; border-radius: 10px; margin: 10px 0; border-left: 4px solid var(--primary-color);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <strong style="font-weight: 600;">${review.customer?.name || 'Anonymous'}</strong>
                            <span style="color: var(--primary-color); font-weight: 600;">${'★'.repeat(review.rating)}</span>
                        </div>
                        <p style="margin: 8px 0; color: #333; line-height: 1.5;">${escapeHtml(review.comment)}</p>
                        <small style="color: #999;">Review on: ${new Date(review.createdAt).toLocaleDateString()}</small>
                    </div>
                `;
            });
        }
        
        reviewsHTML += '</div>';
        
        // Add review form if logged in
        if (currentUser && currentUser.role === 'customer') {
            reviewsHTML += `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <h4 style="margin-bottom: 15px;">Leave a Review</h4>
                    <form onsubmit="submitReview(event, '${designerId}')" style="display: flex; flex-direction: column;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Rating</label>
                            <select id="reviewRating" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: 'Poppins', sans-serif;">
                                <option value="">Select rating</option>
                                <option value="5">★★★★★ - Excellent</option>
                                <option value="4">★★★★☆ - Very Good</option>
                                <option value="3">★★★☆☆ - Good</option>
                                <option value="2">★★☆☆☆ - Fair</option>
                                <option value="1">★☆☆☆☆ - Poor</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Comment</label>
                            <textarea id="reviewComment" required placeholder="Share your experience..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: 'Poppins', sans-serif; min-height: 100px; resize: vertical;"></textarea>
                        </div>
                        <button type="submit" class="btn-primary" style="align-self: flex-start;">Submit Review</button>
                    </form>
                </div>
            `;
        }
        
        document.getElementById('designerModalContent').innerHTML = document.getElementById('designerModalContent').innerHTML.split('<div style="margin: 20px 0;"><h3')[0] + reviewsHTML;
    } catch (error) {
        console.error('Error loading reviews:', error);
        showNotification('Failed to load reviews', 'error');
    }
}

async function submitReview(event, designerId) {
    event.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to submit a review', 'error');
        return;
    }

    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;

    if (!rating || !comment.trim()) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        await apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                designerId,
                rating,
                comment
            })
        });

        showNotification('Review submitted successfully!', 'success');
        document.getElementById('reviewRating').value = '';
        document.getElementById('reviewComment').value = '';
        
        // Reload reviews
        loadDesignerReviews(designerId);
    } catch (error) {
        showNotification('Failed to submit review: ' + error.message, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Outfit Visualization
// ============================================

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5000000) { // 5MB limit
            showNotification('File size too large. Maximum 5MB allowed.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewArea = document.getElementById('previewArea');
            previewArea.style.backgroundImage = `url(${e.target.result})`;
            previewArea.style.backgroundSize = 'cover';
            previewArea.style.backgroundPosition = 'center';
            previewArea.style.color = 'transparent';
            previewArea.textContent = '';
            showNotification('Photo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function updatePreview() {
    const topSelect = document.getElementById('topSelect');
    const bottomSelect = document.getElementById('bottomSelect');
    const accessoriesSelect = document.getElementById('accessoriesSelect');
    
    const top = topSelect?.value || '';
    const bottom = bottomSelect?.value || '';
    const accessories = accessoriesSelect?.value || '';
    
    let previewText = 'Your outfit preview will appear here';
    let outfitDescription = [];
    
    if (top) {
        outfitDescription.push('👕 ' + topSelect.options[topSelect.selectedIndex].text);
    }
    if (bottom) {
        outfitDescription.push('👖 ' + bottomSelect.options[bottomSelect.selectedIndex].text);
    }
    if (accessories) {
        outfitDescription.push('💎 ' + accessoriesSelect.options[accessoriesSelect.selectedIndex].text);
    }
    
    if (outfitDescription.length > 0) {
        previewText = outfitDescription.join('<br>');
    }
    
    const previewArea = document.getElementById('previewArea');
    if (previewArea.style.backgroundImage === 'none' || previewArea.style.backgroundImage === '') {
        previewArea.style.color = '#666';
        previewArea.innerHTML = previewText;
    }
}

async function connectWithDesigner() {
    if (!currentUser) {
        showNotification('Please login to connect with a designer', 'error');
        openLoginModal();
        return;
    }

    try {
        // Load available designers
        const response = await apiCall('/designers');
        const designers = response.designers || response;
        
        if (!designers || designers.length === 0) {
            showNotification('No designers available at the moment', 'error');
            return;
        }

        // Create designer selection modal
        let designerListHTML = '<div style="max-height: 400px; overflow-y: auto;">';
        designers.forEach(designer => {
            designerListHTML += `
                <div style="padding: 10px; border-bottom: 1px solid #ddd; cursor: pointer; hover: background: #f5f5f5;" onclick="selectDesignerForBooking('${designer.id}', '${designer.brandName}')">
                    <strong>${designer.brandName}</strong>
                    <br>
                    <small style="color: #999;">${designer.specialty} • ${designer.pricingRange}</small>
                </div>
            `;
        });
        designerListHTML += '</div>';

        const modalHTML = `
            <div class="designer-profile">
                <h2 style="margin-bottom: 20px;">Select a Designer</h2>
                ${designerListHTML}
            </div>
        `;

        document.getElementById('designerModalContent').innerHTML = modalHTML;
        document.getElementById('designerModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        showNotification('Failed to load designers: ' + error.message, 'error');
    }
}

async function selectDesignerForBooking(designerId, designerName) {
    const date = prompt(`Book consultation with ${designerName}\n\nEnter preferred date (YYYY-MM-DD):\n\nExample: 2024-04-20`);
    
    if (!date) return;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        showNotification('Invalid date format. Use YYYY-MM-DD', 'error');
        return;
    }

    const notes = prompt('Add any notes or preferences (optional):') || '';

    try {
        await apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify({
                designerId,
                date,
                notes
            })
        });

        showNotification(`Consultation booked with ${designerName}! Check your email for confirmation.`, 'success');
        closeDesignerModal();
    } catch (error) {
        showNotification('Failed to book consultation: ' + error.message, 'error');
    }
}

// ============================================
// Testimonials
// ============================================

async function renderTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;

    try {
        // Try to fetch testimonials from reviews API
        const response = await apiCall('/reviews');
        const reviews = response.reviews || response || [];

        if (reviews.length === 0) {
            // Fallback to static testimonials
            renderStaticTestimonials();
            return;
        }

        testimonialsGrid.innerHTML = '';

        // Show the top 3 reviews as testimonials
        reviews.slice(0, 3).forEach((review, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="testimonial-rating">${'★'.repeat(review.rating)}</div>
                <p class="testimonial-text">"${escapeHtml(review.comment)}"</p>
                <div class="testimonial-author">${review.customer?.name || 'Customer'}</div>
                <div class="testimonial-role">Verified Review</div>
            `;

            testimonialsGrid.appendChild(card);
        });
    } catch (error) {
        console.log('Could not load reviews, showing static testimonials instead');
        renderStaticTestimonials();
    }
}

function renderStaticTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;

    const testimonials = [
        {
            name: "Emily Richardson",
            role: "Fashion Enthusiast",
            image: "👩‍🦰",
            rating: "★★★★★",
            text: "InStyle Hub completely transformed my wardrobe! I found amazing designers and they understood exactly what I wanted."
        },
        {
            name: "David Martinez",
            role: "Professional",
            image: "👨‍💼",
            rating: "★★★★★",
            text: "Finally found a platform that connects me with incredible designers. The booking process was seamless and efficient."
        },
        {
            name: "Sophia Chen",
            role: "Model & Influencer",
            image: "👩‍🎨",
            rating: "★★★★★",
            text: "As a content creator, I need unique styles. InStyle Hub's designer recommendations are spot-on and always on-trend!"
        }
    ];

    testimonialsGrid.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="testimonial-rating">${testimonial.rating}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-image">${testimonial.image}</div>
            <div class="testimonial-author">${testimonial.name}</div>
            <div class="testimonial-role">${testimonial.role}</div>
        `;

        testimonialsGrid.appendChild(card);
    });
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    if (authToken) {
        updateNavbar();
    }

    loadDesigners();
    renderTestimonials();
    setupSmoothScroll();
    addPageAnimations();
});

// ============================================
// Additional Features
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function addPageAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .step, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Handle form inputs with animations
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });

    const searchInput = document.getElementById('designerSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterDesigners, 300));
    }
});

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
        closeDesignerModal();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('designerSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
});
