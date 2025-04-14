/**
 * Auth module for the Zeal Institute Alumni App
 * Handles user authentication, localStorage management, and session persistence
 */

// Main auth object with authentication methods
const Auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('loggedIn') === 'true';
    },
    
    // Get current user data if logged in
    getCurrentUser: function() {
        if (!this.isLoggedIn()) {
            return null;
        }
        
        const email = localStorage.getItem('currentUserEmail');
        return this.getUserByEmail(email);
    },
    
    // Get user by email
    getUserByEmail: function(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    },
    
    // Get all registered users
    getAllUsers: function() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },
    
    // Register a new user
    registerUser: function(userData) {
        // Get existing users
        const users = this.getAllUsers();
        
        // Check if user with this email already exists
        if (users.some(user => user.email === userData.email)) {
            return {
                success: false,
                message: 'A user with this email already exists'
            };
        }
        
        // Simple password hashing (for demo purposes only)
        // In a real app, use a proper hashing library like bcrypt
        userData.password = this.hashPassword(userData.password);
        
        // Add timestamp for when user was created
        userData.createdAt = new Date().toISOString();
        
        // Add empty arrays for resources, mentorships, and events
        userData.resources = [];
        userData.mentorships = [];
        userData.events = [];
        
        // Add user to users array
        users.push(userData);
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'Registration successful'
        };
    },
    
    // Login user
    loginUser: function(email, password) {
        // Get user by email
        const user = this.getUserByEmail(email);
        
        // If user not found
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        // Check password
        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return {
                success: false,
                message: 'Incorrect password'
            };
        }
        
        // Set login status in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        
        return {
            success: true,
            message: 'Login successful'
        };
    },
    
    // Logout user
    logoutUser: function() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUserEmail');
        
        return {
            success: true,
            message: 'Logout successful'
        };
    },
    
    // Update user profile
    updateUserProfile: function(updatedData) {
        // Get current user
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            return {
                success: false,
                message: 'User not logged in'
            };
        }
        
        // Get all users
        const users = this.getAllUsers();
        
        // Find index of current user
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        // Update user data (excluding email and password)
        users[userIndex].fullname = updatedData.fullname;
        users[userIndex].graduationYear = updatedData.graduationYear;
        users[userIndex].department = updatedData.department;
        users[userIndex].expertise = updatedData.expertise;
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'Profile updated successfully'
        };
    },
    
    // Update user password
    updateUserPassword: function(currentPassword, newPassword) {
        // Get current user
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            return {
                success: false,
                message: 'User not logged in'
            };
        }
        
        // Check current password
        const hashedCurrentPassword = this.hashPassword(currentPassword);
        if (currentUser.password !== hashedCurrentPassword) {
            return {
                success: false,
                message: 'Current password is incorrect'
            };
        }
        
        // Get all users
        const users = this.getAllUsers();
        
        // Find index of current user
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        // Update password
        users[userIndex].password = this.hashPassword(newPassword);
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'Password updated successfully'
        };
    },
    
    // Simple password hashing function
    // NOTE: This is NOT secure for production use
    // In a real application, use a proper hashing library
    hashPassword: function(password) {
        let hash = 0;
        if (password.length === 0) return hash;
        
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash.toString();
    },
    
    // Initialize the auth module
    init: function() {
        // Check if 'users' exists in localStorage
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        
        // Check if we need to hide/show dashboard link in nav
        this.updateDashboardLink();
        
        // Add event listener for logout button if it exists
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logoutUser();
                window.location.href = 'index.html';
            });
        }
    },
    
    // Update dashboard link visibility based on login status
    updateDashboardLink: function() {
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            if (this.isLoggedIn()) {
                dashboardLink.style.display = 'block';
            } else {
                dashboardLink.style.display = 'none';
            }
        }
    }
};

// Initialize the auth module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
    
    // If on dashboard page, check if user is logged in
    if (window.location.pathname.includes('dashboard.html')) {
        const loginRequiredMessage = document.getElementById('login-required-message');
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (!Auth.isLoggedIn()) {
            // Show login required message
            if (loginRequiredMessage) loginRequiredMessage.style.display = 'block';
            if (dashboardContent) dashboardContent.style.display = 'none';
        } else {
            // Show dashboard content
            if (loginRequiredMessage) loginRequiredMessage.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'grid';
        }
    }
}); 