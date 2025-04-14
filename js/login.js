/**
 * Login functionality for the Zeal Institute Alumni App
 * Handles form submission and validation for the login page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the login form element
    const loginForm = document.getElementById('login-form');
    
    // If login form exists on this page
    if (loginForm) {
        // Add submit event listener to the form
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset any previous error messages
            resetErrorMessages();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Validate form inputs
            let isValid = true;
            
            // Validate email
            if (!validateEmail(email)) {
                displayError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (password.length < 6) {
                displayError('password', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // If form is valid, attempt to login
            if (isValid) {
                // Attempt login
                const result = Auth.loginUser(email, password);
                
                // Display login message
                const loginMessage = document.getElementById('login-message');
                loginMessage.textContent = result.message;
                loginMessage.style.display = 'block';
                
                // Add appropriate class based on result
                if (result.success) {
                    loginMessage.className = 'success-message';
                    
                    // Redirect to dashboard after short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    loginMessage.className = 'error-message';
                }
            }
        });
    }
    
    // Redirect already logged in users to dashboard
    if (Auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
    
    // Helper function to display error message
    function displayError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Add error class to the input field
            const inputField = document.getElementById(fieldId);
            if (inputField) {
                inputField.classList.add('error');
            }
        }
    }
    
    // Helper function to reset error messages
    function resetErrorMessages() {
        // Get all error message elements and hide them
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        // Remove error class from all inputs
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(field => {
            field.classList.remove('error');
        });
    }
    
    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}); 