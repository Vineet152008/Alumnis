/**
 * Main JavaScript file for the Zeal Institute Alumni App
 * Handles UI interactions and functionality for the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle nav
            nav.classList.toggle('nav-active');
            
            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger animation
            burger.classList.toggle('toggle');
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, this would send data to a server
            // For demo, just show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Populate upcoming events
    populateEvents();
    
    // Function to populate events on the homepage
    function populateEvents() {
        const eventList = document.getElementById('event-list');
        if (!eventList) return;
        
        // Sample events data (in a real app, this would come from a server)
        const events = [
            {
                id: 'event1',
                title: 'Alumni Meetup',
                date: 'December 10, 2023',
                location: 'Zeal Campus, Auditorium',
                description: 'Join fellow alumni for networking and refreshments.',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
                id: 'event2',
                title: 'Career Webinar',
                date: 'December 15, 2023',
                location: 'Online (Zoom)',
                description: 'Learn about career opportunities in AI and machine learning.',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
                id: 'event3',
                title: 'Annual Alumni Gala',
                date: 'January 20, 2024',
                location: 'Grand Hyatt Hotel',
                description: 'A black-tie event to celebrate the achievements of our alumni.',
                image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
        ];
        
        // Clear current content
        eventList.innerHTML = '';
        
        // Check if Auth is available and user is logged in
        const isLoggedIn = window.Auth && Auth.isLoggedIn();
        
        // Add events to the list
        events.forEach(event => {
            eventList.innerHTML += `
                <div class="event-card">
                    <div class="event-image" style="background-image: url('${event.image}')"></div>
                    <div class="event-details">
                        <div class="event-date">${event.date}</div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-description">${event.description}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <button class="btn-primary rsvp-button" data-id="${event.id}">RSVP Now</button>
                    </div>
                </div>
            `;
        });
        
        // Add event listeners to RSVP buttons
        document.querySelectorAll('.rsvp-button').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                
                // Check if user is logged in
                if (window.Auth && Auth.isLoggedIn()) {
                    // If logged in, redirect to dashboard events section
                    window.location.href = `dashboard.html#events-${eventId}`;
                } else {
                    // If not logged in, redirect to login page
                    alert('Please log in to RSVP for this event');
                    window.location.href = 'login.html';
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 