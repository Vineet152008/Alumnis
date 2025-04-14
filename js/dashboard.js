/**
 * Dashboard functionality for the Zeal Institute Alumni App
 * Handles all the interactions on the dashboard page
 */

// Dashboard module
const Dashboard = {
    // Current user data
    currentUser: null,
    
    // Resources manager
    resources: {
        // Add a new resource
        addResource: function(resourceData) {
            // Get current user
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            // Add timestamp and ID
            resourceData.id = Date.now().toString();
            resourceData.createdAt = new Date().toISOString();
            resourceData.author = {
                id: currentUser.email,
                name: currentUser.fullname
            };
            
            // Get all users
            const users = Auth.getAllUsers();
            
            // Find index of current user
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            // Add resource to user's resources array
            if (!users[userIndex].resources) {
                users[userIndex].resources = [];
            }
            users[userIndex].resources.push(resourceData);
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        },
        
        // Get all resources by current user
        getUserResources: function() {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser || !currentUser.resources) return [];
            
            return currentUser.resources;
        },
        
        // Get all public resources from all users
        getAllPublicResources: function() {
            const users = Auth.getAllUsers();
            let publicResources = [];
            const currentUser = Auth.getCurrentUser();
            const currentUserEmail = currentUser ? currentUser.email : '';
            
            users.forEach(user => {
                if (user.resources && user.resources.length > 0) {
                    // Skip the current user's resources (they're shown in their own section)
                    if (user.email === currentUserEmail) {
                        return;
                    }
                    
                    // Add each public resource with user info
                    const userPublicResources = user.resources
                        .filter(resource => resource.isPublic !== false) // Default to public if not specified
                        .map(resource => {
                            // Make sure author info is included
                            if (!resource.author) {
                                resource.author = {
                                    id: user.email,
                                    name: user.fullname
                                };
                            }
                            return resource;
                        });
                    
                    publicResources = [...publicResources, ...userPublicResources];
                }
            });
            
            // Sort by date (newest first)
            publicResources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return publicResources;
        }
    },
    
    // Mentorship manager
    mentorship: {
        // Generate a mentorship request
        generateMentorshipRequest: function() {
            // In a real app, this would be created by students
            // For demo, we'll create a simulated request
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            const users = Auth.getAllUsers();
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            // Create a sample request
            const requestId = Date.now().toString();
            const request = {
                id: requestId,
                studentName: 'Sample Student',
                studentEmail: 'student@example.com',
                topic: 'Career Guidance',
                message: 'I would love your guidance on career paths in your field. Can we connect for a 30-minute call?',
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            // Add request to user's mentorships array
            if (!users[userIndex].mentorships) {
                users[userIndex].mentorships = [];
            }
            users[userIndex].mentorships.push(request);
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        },
        
        // Get all mentorship requests for current user
        getMentorshipRequests: function() {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser || !currentUser.mentorships) return [];
            
            // Filter for pending requests only
            return currentUser.mentorships.filter(request => request.status === 'pending');
        },
        
        // Get all accepted mentorships for current user
        getAcceptedMentorships: function() {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser || !currentUser.mentorships) return [];
            
            // Filter for accepted mentorships only
            return currentUser.mentorships.filter(request => request.status === 'accepted');
        },
        
        // Accept a mentorship request
        acceptRequest: function(requestId) {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            const users = Auth.getAllUsers();
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (!users[userIndex].mentorships) return false;
            
            // Find the request
            const requestIndex = users[userIndex].mentorships.findIndex(
                request => request.id === requestId
            );
            
            if (requestIndex === -1) return false;
            
            // Update status to accepted
            users[userIndex].mentorships[requestIndex].status = 'accepted';
            users[userIndex].mentorships[requestIndex].acceptedAt = new Date().toISOString();
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        },
        
        // Decline a mentorship request
        declineRequest: function(requestId) {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            const users = Auth.getAllUsers();
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (!users[userIndex].mentorships) return false;
            
            // Find the request
            const requestIndex = users[userIndex].mentorships.findIndex(
                request => request.id === requestId
            );
            
            if (requestIndex === -1) return false;
            
            // Update status to declined
            users[userIndex].mentorships[requestIndex].status = 'declined';
            users[userIndex].mentorships[requestIndex].declinedAt = new Date().toISOString();
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        }
    },
    
    // Events manager
    events: {
        // Get all upcoming events
        getUpcomingEvents: function() {
            // In a real app, these would come from a database
            // For demo, we'll use hardcoded events
            return [
                {
                    id: 'event1',
                    title: 'Alumni Meetup',
                    date: '2023-12-10T18:00:00',
                    location: 'Zeal Campus, Auditorium',
                    description: 'Join fellow alumni for networking and refreshments. There will be a panel discussion on tech industry trends.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    id: 'event2',
                    title: 'Career Webinar',
                    date: '2023-12-15T14:00:00',
                    location: 'Online (Zoom)',
                    description: 'Learn about career opportunities in AI and machine learning from industry experts.',
                    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    id: 'event3',
                    title: 'Annual Alumni Gala',
                    date: '2024-01-20T19:00:00',
                    location: 'Grand Hyatt Hotel',
                    description: 'A black-tie event to celebrate the achievements of our alumni community. Dinner and entertainment included.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            ];
        },
        
        // Get all events the user has RSVP'd to
        getRSVPEvents: function() {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser || !currentUser.events) return [];
            
            return currentUser.events;
        },
        
        // RSVP to an event
        rsvpToEvent: function(eventId) {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            // Get event details from our hardcoded events
            const event = this.getUpcomingEvents().find(e => e.id === eventId);
            if (!event) return false;
            
            const users = Auth.getAllUsers();
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            // Ensure events array exists
            if (!users[userIndex].events) {
                users[userIndex].events = [];
            }
            
            // Check if already RSVP'd
            if (users[userIndex].events.some(e => e.id === eventId)) {
                return false;
            }
            
            // Add event to user's events array
            const rsvpData = {
                id: event.id,
                title: event.title,
                date: event.date,
                rsvpDate: new Date().toISOString()
            };
            
            users[userIndex].events.push(rsvpData);
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        },
        
        // Cancel RSVP to an event
        cancelRSVP: function(eventId) {
            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return false;
            
            const users = Auth.getAllUsers();
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (!users[userIndex].events) return false;
            
            // Filter out the cancelled event
            users[userIndex].events = users[userIndex].events.filter(
                event => event.id !== eventId
            );
            
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            return true;
        }
    },
    
    // Profile manager
    profile: {
        // Update user profile
        updateProfile: function(formData) {
            return Auth.updateUserProfile(formData);
        },
        
        // Update password
        updatePassword: function(currentPassword, newPassword) {
            return Auth.updateUserPassword(currentPassword, newPassword);
        }
    },
    
    // Initialize dashboard
    init: function() {
        // Get current user
        this.currentUser = Auth.getCurrentUser();
        
        // If no user is logged in, UI handling is done in auth.js
        if (!this.currentUser) return;
        
        // Update user profile in sidebar
        this.updateUserProfileDisplay();
        
        // Check for any URL fragments for direct section navigation
        this.checkURLFragment();
        
        // Load initial active section
        this.loadOverviewSection();
        
        // Add event listeners for dashboard navigation
        this.setupEventListeners();
        
        // Hide loading indicators
        this.hideLoadingIndicators();
    },
    
    // Hide all loading indicators
    hideLoadingIndicators: function() {
        // Hide the user-related loading indicators
        const userNameElement = document.getElementById('user-name');
        const userInfoElement = document.getElementById('user-info');
        
        if (userNameElement && userNameElement.textContent === 'Loading...') {
            userNameElement.textContent = this.currentUser.fullname;
        }
        
        if (userInfoElement && userInfoElement.textContent === 'Loading...') {
            userInfoElement.textContent = `${this.currentUser.department}, ${this.currentUser.graduationYear}`;
        }
        
        // Make sure all sections are fully loaded and interactive
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            const loadingElements = section.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                el.classList.remove('loading');
            });
        });
    },
    
    // Check URL fragment for direct navigation
    checkURLFragment: function() {
        const hash = window.location.hash;
        if (!hash) return;
        
        // Check if it's a section navigation
        const sectionMatch = hash.match(/#([a-z]+)(-.*)?$/);
        if (sectionMatch && sectionMatch[1]) {
            const sectionName = sectionMatch[1];
            
            // Valid section names
            const validSections = ['overview', 'resources', 'mentorship', 'events', 'settings'];
            if (validSections.includes(sectionName)) {
                // Show the section
                this.showSection(sectionName);
                
                // Update menu selection
                const menuLinks = document.querySelectorAll('.dashboard-menu a');
                menuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionName) {
                        link.classList.add('active');
                    }
                });
                
                // If it includes an item ID (like events-event1)
                if (sectionMatch[2]) {
                    const itemId = sectionMatch[2].substring(1); // Remove the dash
                    
                    // Specific handling for events
                    if (sectionName === 'events') {
                        // Add a slight delay to ensure section is loaded
                        setTimeout(() => {
                            this.scrollToEventAndHighlight(itemId);
                        }, 500);
                    }
                }
            }
        }
    },
    
    // Scroll to and highlight a specific event
    scrollToEventAndHighlight: function(eventId) {
        const eventItem = document.querySelector(`.dashboard-event-item[data-id="${eventId}"]`);
        if (eventItem) {
            // Scroll to the event
            eventItem.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight it
            eventItem.classList.add('highlighted-event');
            
            // Remove highlight after a few seconds
            setTimeout(() => {
                eventItem.classList.remove('highlighted-event');
            }, 3000);
            
            // Focus on RSVP button
            const rsvpButton = eventItem.querySelector('.rsvp-event');
            if (rsvpButton) {
                rsvpButton.focus();
            }
        }
    },
    
    // Update user profile display in sidebar
    updateUserProfileDisplay: function() {
        const userNameElement = document.getElementById('user-name');
        const userInfoElement = document.getElementById('user-info');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.fullname;
        }
        
        if (userInfoElement && this.currentUser) {
            userInfoElement.textContent = `${this.currentUser.department}, ${this.currentUser.graduationYear}`;
        }
        
        if (userAvatarElement && this.currentUser) {
            // Get first letter of name for avatar
            const firstLetter = this.currentUser.fullname.charAt(0).toUpperCase();
            userAvatarElement.innerHTML = `<span>${firstLetter}</span>`;
        }
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Dashboard menu links
        const menuLinks = document.querySelectorAll('.dashboard-menu a');
        menuLinks.forEach(link => {
            if (link.id !== 'logout-button') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    menuLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Get section to show
                    const sectionToShow = link.getAttribute('data-section');
                    this.showSection(sectionToShow);
                });
            }
        });
        
        // Resource form
        const resourceForm = document.getElementById('resource-form');
        if (resourceForm) {
            resourceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const title = document.getElementById('resource-title').value.trim();
                const type = document.getElementById('resource-type').value;
                const content = document.getElementById('resource-content').value.trim();
                const isPublic = document.getElementById('resource-public').checked;
                
                // Validate
                if (!title || !type || !content) {
                    alert('Please fill all fields');
                    return;
                }
                
                // Add resource
                const result = this.resources.addResource({
                    title,
                    type,
                    content,
                    isPublic
                });
                
                if (result) {
                    alert('Resource added successfully');
                    
                    // Clear form
                    resourceForm.reset();
                    document.getElementById('resource-public').checked = true;
                    
                    // Refresh resources list
                    this.loadResourcesSection();
                } else {
                    alert('Error adding resource');
                }
            });
        }
        
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            // Pre-fill form with user data
            if (this.currentUser) {
                document.getElementById('settings-fullname').value = this.currentUser.fullname;
                document.getElementById('settings-email').value = this.currentUser.email;
                document.getElementById('settings-graduation-year').value = this.currentUser.graduationYear;
                document.getElementById('settings-department').value = this.currentUser.department;
                document.getElementById('settings-expertise').value = this.currentUser.expertise;
            }
            
            // Handle form submission
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const fullname = document.getElementById('settings-fullname').value.trim();
                const graduationYear = document.getElementById('settings-graduation-year').value;
                const department = document.getElementById('settings-department').value;
                const expertise = document.getElementById('settings-expertise').value.trim();
                
                // Validate
                if (!fullname || !graduationYear || !department || !expertise) {
                    alert('Please fill all fields');
                    return;
                }
                
                // Update profile
                const result = this.profile.updateProfile({
                    fullname,
                    graduationYear,
                    department,
                    expertise
                });
                
                if (result.success) {
                    alert(result.message);
                    
                    // Update user profile display
                    this.currentUser = Auth.getCurrentUser(); // refresh user data
                    this.updateUserProfileDisplay();
                } else {
                    alert(result.message);
                }
            });
        }
        
        // Password form
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const currentPassword = document.getElementById('current-password').value;
                const newPassword = document.getElementById('new-password').value;
                const confirmNewPassword = document.getElementById('confirm-new-password').value;
                
                // Validate
                if (!currentPassword || !newPassword || !confirmNewPassword) {
                    alert('Please fill all fields');
                    return;
                }
                
                if (newPassword !== confirmNewPassword) {
                    alert('New passwords do not match');
                    return;
                }
                
                if (newPassword.length < 6) {
                    alert('New password must be at least 6 characters');
                    return;
                }
                
                // Update password
                const result = this.profile.updatePassword(currentPassword, newPassword);
                
                if (result.success) {
                    alert(result.message);
                    passwordForm.reset();
                } else {
                    alert(result.message);
                }
            });
        }
    },
    
    // Show a specific section and hide others
    showSection: function(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show requested section
        const sectionToShow = document.getElementById(`${sectionName}-section`);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
            
            // Load section-specific content
            switch (sectionName) {
                case 'overview':
                    this.loadOverviewSection();
                    break;
                case 'resources':
                    this.loadResourcesSection();
                    break;
                case 'mentorship':
                    this.loadMentorshipSection();
                    break;
                case 'events':
                    this.loadEventsSection();
                    break;
                case 'settings':
                    // Settings are pre-loaded
                    break;
            }
        }
    },
    
    // Load overview section content
    loadOverviewSection: function() {
        // Update stats
        this.updateDashboardStats();
        
        // Load recent activities
        this.loadRecentActivities();
    },
    
    // Load resources section content
    loadResourcesSection: function() {
        const resourcesList = document.querySelector('#resources-list');
        const publicResourcesList = document.querySelector('#public-resources-list');
        const userResources = this.resources.getUserResources();
        
        // Clear current resources
        resourcesList.innerHTML = '';
        publicResourcesList.innerHTML = '';
        
        if (userResources.length === 0) {
            resourcesList.innerHTML = '<div class="empty-state">You haven\'t added any resources yet.</div>';
        } else {
            // Sort resources by date (newest first)
            userResources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            userResources.forEach(resource => {
                const resourceElement = document.createElement('div');
                resourceElement.className = 'resource-item';
                resourceElement.innerHTML = `
                    <div class="resource-header">
                        <h3 class="resource-title">${resource.title}
                            ${resource.isPublic 
                                ? '<span class="public-tag">Public</span>' 
                                : '<span class="private-tag">Private</span>'}
                        </h3>
                        <div class="resource-date">Added: ${new Date(resource.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="resource-description">${resource.content}</div>
                    <div class="resource-controls">
                        <button class="btn-secondary delete-resource" data-id="${resource.id}">Delete</button>
                    </div>
                `;
                resourcesList.appendChild(resourceElement);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-resource').forEach(button => {
                button.addEventListener('click', (e) => {
                    const resourceId = e.target.getAttribute('data-id');
                    this.deleteResource(resourceId);
                });
            });
        }
        
        // Load public resources from other users
        const publicResources = this.resources.getAllPublicResources();
        if (publicResources.length === 0) {
            publicResourcesList.innerHTML = '<div class="empty-state">No public resources from other alumni yet.</div>';
        } else {
            publicResources.forEach(resource => {
                const resourceElement = document.createElement('div');
                resourceElement.className = 'resource-item';
                resourceElement.innerHTML = `
                    <div class="resource-header">
                        <h3 class="resource-title">${resource.title} 
                            <span class="public-tag">Public</span>
                        </h3>
                        <div class="resource-author">Shared by: ${resource.author || 'Anonymous'}</div>
                        <div class="resource-date">Added: ${new Date(resource.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="resource-description">${resource.content}</div>
                `;
                publicResourcesList.appendChild(resourceElement);
            });
        }
    },
    
    // Delete a resource
    deleteResource: function(resourceId) {
        // Get current user
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return false;
        
        // Get all users
        const users = Auth.getAllUsers();
        
        // Find index of current user
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (!users[userIndex].resources) return false;
        
        // Filter out the resource to delete
        users[userIndex].resources = users[userIndex].resources.filter(
            resource => resource.id !== resourceId
        );
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Refresh the resources section
        this.loadResourcesSection();
        
        // Update dashboard stats
        this.updateDashboardStats();
        
        // Also update recent activities as they might include the deleted resource
        this.loadRecentActivities();
        
        return true;
    },
    
    // Load mentorship section content
    loadMentorshipSection: function() {
        const requestsList = document.getElementById('requests-list');
        const menteesList = document.getElementById('mentees-list');
        
        if (!requestsList || !menteesList) return;
        
        // Get mentorship requests
        const requests = this.mentorship.getMentorshipRequests();
        
        // Clear current requests
        requestsList.innerHTML = '';
        
        // If no requests
        if (requests.length === 0) {
            // Check if we need to create a sample request for demo
            if (this.currentUser && (!this.currentUser.mentorships || this.currentUser.mentorships.length === 0)) {
                this.mentorship.generateMentorshipRequest();
                
                // Reload the requests
                return this.loadMentorshipSection();
            }
            
            requestsList.innerHTML = `
                <div class="request-item">
                    <p>No pending mentorship requests.</p>
                </div>
            `;
        } else {
            // Add requests to list
            requests.forEach(request => {
                const date = new Date(request.createdAt).toLocaleDateString();
                requestsList.innerHTML += `
                    <div class="request-item">
                        <h4 class="request-title">${request.topic}</h4>
                        <div class="request-meta">
                            <span><i class="fas fa-user"></i> ${request.studentName}</span>
                            <span><i class="fas fa-calendar"></i> ${date}</span>
                        </div>
                        <div class="request-description">
                            ${request.message}
                        </div>
                        <div class="request-actions">
                            <button class="btn-primary accept-request" data-id="${request.id}">Accept</button>
                            <button class="btn-secondary decline-request" data-id="${request.id}">Decline</button>
                        </div>
                    </div>
                `;
            });
            
            // Add event listeners for accept/decline buttons
            document.querySelectorAll('.accept-request').forEach(button => {
                button.addEventListener('click', () => {
                    const requestId = button.getAttribute('data-id');
                    const result = this.mentorship.acceptRequest(requestId);
                    
                    if (result) {
                        this.loadMentorshipSection();
                    }
                });
            });
            
            document.querySelectorAll('.decline-request').forEach(button => {
                button.addEventListener('click', () => {
                    const requestId = button.getAttribute('data-id');
                    const result = this.mentorship.declineRequest(requestId);
                    
                    if (result) {
                        this.loadMentorshipSection();
                    }
                });
            });
        }
        
        // Get accepted mentorships
        const mentorships = this.mentorship.getAcceptedMentorships();
        
        // Clear current mentees
        menteesList.innerHTML = '';
        
        // If no mentees
        if (mentorships.length === 0) {
            menteesList.innerHTML = `
                <div class="request-item">
                    <p>You are not mentoring anyone yet.</p>
                </div>
            `;
        } else {
            // Add mentees to list
            mentorships.forEach(mentorship => {
                const acceptedDate = new Date(mentorship.acceptedAt).toLocaleDateString();
                menteesList.innerHTML += `
                    <div class="request-item">
                        <h4 class="request-title">${mentorship.topic}</h4>
                        <div class="request-meta">
                            <span><i class="fas fa-user"></i> ${mentorship.studentName}</span>
                            <span><i class="fas fa-envelope"></i> ${mentorship.studentEmail}</span>
                            <span><i class="fas fa-calendar-check"></i> Accepted on ${acceptedDate}</span>
                        </div>
                        <div class="request-description">
                            ${mentorship.message}
                        </div>
                    </div>
                `;
            });
        }
    },
    
    // Load events section content
    loadEventsSection: function() {
        const eventsList = document.getElementById('dashboard-event-list');
        if (!eventsList) return;
        
        // Get all upcoming events
        const events = this.events.getUpcomingEvents();
        
        // Get user's RSVP'd events
        const rsvpEvents = this.events.getRSVPEvents();
        const rsvpEventIds = rsvpEvents.map(event => event.id);
        
        // Clear current events
        eventsList.innerHTML = '';
        
        // Add events to list
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const formattedTime = eventDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            // Check if user has RSVP'd to this event
            const hasRSVP = rsvpEventIds.includes(event.id);
            
            eventsList.innerHTML += `
                <div class="dashboard-event-item" data-id="${event.id}">
                    <div class="event-image" style="background-image: url('${event.image}')"></div>
                    <div class="event-details">
                        <h3 class="dashboard-event-title">${event.title}</h3>
                        <div class="dashboard-event-meta">
                            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                            <span><i class="fas fa-clock"></i> ${formattedTime}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                        <div class="dashboard-event-description">
                            ${event.description}
                        </div>
                        ${hasRSVP 
                            ? `<button class="btn-secondary cancel-rsvp" data-id="${event.id}">Cancel RSVP</button>` 
                            : `<button class="btn-primary rsvp-event" data-id="${event.id}">RSVP</button>`
                        }
                    </div>
                </div>
            `;
        });
        
        // Add event listeners for RSVP buttons
        this.attachEventButtonListeners();
    },
    
    // Attach event listeners for RSVP buttons
    attachEventButtonListeners: function() {
        // Add event listeners for RSVP buttons
        document.querySelectorAll('.rsvp-event').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = button.getAttribute('data-id');
                const result = this.events.rsvpToEvent(eventId);
                
                if (result) {
                    // Show successful RSVP message
                    alert('You have successfully RSVP\'d to this event!');
                    
                    this.loadEventsSection();
                    this.updateDashboardStats();
                }
            });
        });
        
        // Add event listeners for cancel RSVP buttons
        document.querySelectorAll('.cancel-rsvp').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = button.getAttribute('data-id');
                const result = this.events.cancelRSVP(eventId);
                
                if (result) {
                    // Show cancellation message
                    alert('Your RSVP has been cancelled.');
                    
                    this.loadEventsSection();
                    this.updateDashboardStats();
                }
            });
        });
    },
    
    // Update dashboard stats in overview
    updateDashboardStats: function() {
        const resourcesCount = document.getElementById('resources-count');
        const mentorshipCount = document.getElementById('mentorship-count');
        const eventsCount = document.getElementById('events-count');
        
        if (resourcesCount) {
            resourcesCount.textContent = this.resources.getUserResources().length;
        }
        
        if (mentorshipCount) {
            mentorshipCount.textContent = this.mentorship.getAcceptedMentorships().length;
        }
        
        if (eventsCount) {
            eventsCount.textContent = this.events.getRSVPEvents().length;
        }
    },
    
    // Load recent activities in overview
    loadRecentActivities: function() {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;
        
        // Clear current activities
        activitiesList.innerHTML = '';
        
        // Combine different types of activities
        const activities = [];
        
        // Add resources as activities
        const resources = this.resources.getUserResources();
        resources.forEach(resource => {
            activities.push({
                type: 'resource',
                title: `You shared "${resource.title}"`,
                date: new Date(resource.createdAt),
                icon: 'fas fa-share-alt'
            });
        });
        
        // Add mentorships as activities
        const mentorships = this.mentorship.getAcceptedMentorships();
        mentorships.forEach(mentorship => {
            activities.push({
                type: 'mentorship',
                title: `You accepted a mentorship request from ${mentorship.studentName}`,
                date: new Date(mentorship.acceptedAt),
                icon: 'fas fa-user-friends'
            });
        });
        
        // Add events as activities
        const events = this.events.getRSVPEvents();
        events.forEach(event => {
            activities.push({
                type: 'event',
                title: `You RSVP'd to "${event.title}"`,
                date: new Date(event.rsvpDate),
                icon: 'fas fa-calendar-check'
            });
        });
        
        // Sort by most recent
        activities.sort((a, b) => b.date - a.date);
        
        // Limit to 5 most recent
        const recentActivities = activities.slice(0, 5);
        
        // If no activities
        if (recentActivities.length === 0) {
            activitiesList.innerHTML = `
                <div class="resource-item">
                    <p>No recent activities to show.</p>
                </div>
            `;
            return;
        }
        
        // Add activities to list
        recentActivities.forEach(activity => {
            const date = activity.date.toLocaleDateString();
            
            activitiesList.innerHTML += `
                <div class="resource-item">
                    <div class="resource-meta">
                        <span><i class="${activity.icon}"></i> ${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                    </div>
                    <div class="resource-title">
                        ${activity.title}
                    </div>
                </div>
            `;
        });
    }
};

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        Dashboard.init();
    }
}); 