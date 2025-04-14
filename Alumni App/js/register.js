/**
 * Registration functionality for the Zeal Institute Alumni App
 * Handles form submission and validation for the registration page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the registration form element
    const registerForm = document.getElementById('register-form');
    
    // If registration form exists on this page
    if (registerForm) {
        // Add submit event listener to the form
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset any previous error messages
            resetErrorMessages();
            
            // Get form values
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const graduationYear = document.getElementById('graduation-year').value;
            const department = document.getElementById('department').value;
            const expertise = document.getElementById('expertise').value.trim();
            
            // Validate form inputs
            let isValid = true;
            
            // Validate fullname
            if (fullname.length < 3) {
                displayError('fullname', 'Please enter your full name');
                isValid = false;
            }
            
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
            
            // Validate confirm password
            if (password !== confirmPassword) {
                displayError('confirm-password', 'Passwords do not match');
                isValid = false;
            }
            
            // Validate graduation year
            if (!graduationYear) {
                displayError('graduation-year', 'Please select your graduation year');
                isValid = false;
            }
            
            // Validate department
            if (!department) {
                displayError('department', 'Please select your department');
                isValid = false;
            }
            
            // Validate expertise
            if (!expertise) {
                displayError('expertise', 'Please enter at least one area of expertise');
                isValid = false;
            }
            
            // If form is valid, create user account
            if (isValid) {
                // Create user data object
                const userData = {
                    fullname,
                    email,
                    password,
                    graduationYear,
                    department,
                    expertise
                };
                
                // Register user
                const result = Auth.registerUser(userData);
                
                // Display result as alert (in real app, use better UI feedback)
                if (result.success) {
                    alert(result.message + '. You will now be redirected to login.');
                    
                    // Redirect to login page after successful registration
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                } else {
                    alert(result.message);
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
        const inputFields = document.querySelectorAll('input, select');
        inputFields.forEach(field => {
            field.classList.remove('error');
        });
    }
    
    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    // Add real-time validation to password fields
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');
    
    if (passwordField && confirmPasswordField) {
        // Check password match on input
        confirmPasswordField.addEventListener('input', function() {
            if (passwordField.value !== confirmPasswordField.value) {
                displayError('confirm-password', 'Passwords do not match');
            } else {
                document.getElementById('confirm-password-error').textContent = '';
                document.getElementById('confirm-password-error').style.display = 'none';
                confirmPasswordField.classList.remove('error');
            }
        });
    }
}); 