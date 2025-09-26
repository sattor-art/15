// Main JavaScript functionality for Bergkau website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeMobileMenu();
    initializeAnimations();
    initializeImageModal();
});

// Image Modal Functions
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Initialize image modal
function initializeImageModal() {
    // Close modal when clicking outside the image
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// Update navigation for multi-page structure
function initializeNavigation() {
    // Update active navigation based on current page
    updateActiveNavigation();
    
    // Smooth scrolling for same-page anchors only
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Update active navigation based on current page
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPage === 'index.html' || currentPage === '') && href === 'index.html') {
            link.classList.add('active');
        } else if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Handle scroll events for header
function handleScroll() {
    // Update header background
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
}

// Initialize scroll effects and animations
function initializeScrollEffects() {
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('products-grid-info') || 
                    entry.target.classList.contains('quality-process-grid') ||
                    entry.target.classList.contains('advantages-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .section-header, .overview-content, .mission-vision-grid, ' +
        '.products-grid-info, .tech-specs-content, .quality-process-grid, .contact-content, ' +
        '.stats-section, .advantages-grid, .certification-content, '.stats-grid, ' +
        '.product-preview-card, .process-step-card, .story-content'
    );
    
    elementsToAnimate.forEach(element => observer.observe(element));
    
    // Add scroll listener for header
    window.addEventListener('scroll', throttle(handleScroll, 16));
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (validateForm(data)) {
            handleFormSubmission(data);
        }
    });
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getTranslation('form-required-error') || 'Это поле обязательно';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = getTranslation('form-email-error') || 'Введите корректный email';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = getTranslation('form-phone-error') || 'Введите корректный номер телефона';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        errorElement.style.display = 'block';
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

// Validate entire form
function validateForm(data) {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle form submission
function handleFormSubmission(data) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = getTranslation('form-sending') || 'Отправка...';
    
    // Simulate form submission (in real implementation, this would send to server)
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showNotification(
            getTranslation('form-success') || 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в течение 24 часов.',
            'success'
        );
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        console.log('Form submitted:', data);
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-yellow)' : 'var(--secondary-gray)'};
        color: ${type === 'success' ? 'var(--primary-black)' : 'var(--white)'};
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2em;
        cursor: pointer;
        margin-left: var(--spacing-sm);
        padding: 0;
    `;
    closeButton.addEventListener('click', () => notification.remove());
    notification.appendChild(closeButton);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('mobile-open') ? 'hidden' : '';
    }
}

// Close mobile menu
function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize animations
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
        }
        
        .error-message {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        @media (max-width: 1024px) {
            .hero-with-bg {
                background-attachment: scroll;
            }
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                width: 100%;
                background: var(--white);
                box-shadow: var(--shadow-lg);
                padding: var(--spacing-lg);
                transform: translateY(-100%);
                transition: var(--transition);
                z-index: 999;
                flex-direction: column;
                gap: var(--spacing-md);
                opacity: 0;
                visibility: hidden;
            }
            
            .nav-menu.mobile-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .mobile-menu-btn {
                position: relative;
                z-index: 1001;
            }
            
            .mobile-menu-btn.active span:first-child {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-btn.active span:last-child {
                transform: rotate(-45deg) translate(7px, -6px);
            }
            
            .tech-specs-content {
                grid-template-columns: 1fr;
                gap: var(--spacing-lg);
            }
            
            .overview-content,
            .story-content,
            .certification-content,
            .contact-content {
                grid-template-columns: 1fr;
                gap: var(--spacing-lg);
            }
            
            .mission-vision-grid {
                grid-template-columns: 1fr;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility function to get translation
function getTranslation(key) {
    if (typeof translations !== 'undefined' && translations[currentLanguage]) {
        return translations[currentLanguage][key];
    }
    return null;
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close language modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('languageModal');
        if (modal && !modal.classList.contains('hidden')) {
            toggleLanguageModal();
        }
        
        // Also close image modal
        closeImageModal();
    }
    
    // Navigate sections with arrow keys (when focused on navigation)
    if (document.activeElement.classList.contains('nav-link')) {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.indexOf(document.activeElement);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].focus();
        }
    }
});

// Add smooth focus indicators
document.addEventListener('DOMContentLoaded', function() {
    // Ensure keyboard navigation is visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Analytics helper (for future integration)
function trackEvent(category, action, label = '') {
    // This would integrate with analytics service in production
    console.log('Event tracked:', { category, action, label });
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('Engagement', 'Primary Button Click', e.target.textContent);
    }
    
    if (e.target.matches('.language-btn')) {
        trackEvent('Localization', 'Language Change', e.target.getAttribute('data-lang'));
    }
    
    if (e.target.matches('.specs-image-fullscreen')) {
        trackEvent('Products', 'Technical Diagram View', 'Full Screen');
    }
});

// Performance optimization - Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'images/Страница - MAIN/main.jpg',
        'images/logo.jpg',
        'images/brand.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadCriticalImages);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bergkau multi-page website initialized successfully');
    
    // Add a subtle loading animation completion
    document.body.classList.add('loaded');
});

// Global functions for modal (needed for onclick attributes)
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Update navigation on scroll
    window.addEventListener('scroll', handleScroll);
}

// Handle scroll events
function handleScroll() {
    // Update header background
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Update active navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });
    
    if (currentSection) {
        updateActiveNavLink(currentSection);
    }
}

// Update active navigation link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + activeId) {
            link.classList.add('active');
        }
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize scroll effects and animations
function initializeScrollEffects() {
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('products-grid') || 
                    entry.target.classList.contains('quality-process')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .section-header, .about-content, .mission-vision, ' +
        '.products-grid, .tech-specs, .quality-process, .contact-content, ' +
        '.stats-section, .product-card, .process-step'
    );
    
    elementsToAnimate.forEach(element => observer.observe(element));
}

// Product filtering functionality
function initializeProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(filter);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in-up');
        }
    });
    
    // Re-trigger animations for visible cards
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.product-card[style*="block"]');
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 50);
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (validateForm(data)) {
            handleFormSubmission(data);
        }
    });
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getTranslation('form-required-error') || 'Это поле обязательно';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = getTranslation('form-email-error') || 'Введите корректный email';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = getTranslation('form-phone-error') || 'Введите корректный номер телефона';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = 'var(--destructive)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

// Validate entire form
function validateForm(data) {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle form submission
function handleFormSubmission(data) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = getTranslation('form-sending') || 'Отправка...';
    
    // Simulate form submission (in real implementation, this would send to server)
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showNotification(
            getTranslation('form-success') || 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в течение 24 часов.',
            'success'
        );
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        console.log('Form submitted:', data);
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-yellow)' : 'var(--secondary-gray)'};
        color: ${type === 'success' ? 'var(--primary-black)' : 'var(--white)'};
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2em;
        cursor: pointer;
        margin-left: var(--spacing-sm);
        padding: 0;
    `;
    closeButton.addEventListener('click', () => notification.remove());
    notification.appendChild(closeButton);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('mobile-open') ? 'hidden' : '';
    }
}

// Close mobile menu
function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize animations
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
        }
        
        .error-message {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                width: 100%;
                background: var(--white);
                box-shadow: var(--shadow-lg);
                padding: var(--spacing-lg);
                transform: translateY(-100%);
                transition: var(--transition);
                z-index: 999;
                flex-direction: column;
                gap: var(--spacing-md);
                opacity: 0;
                visibility: hidden;
            }
            
            .nav-menu.mobile-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .mobile-menu-btn {
                position: relative;
                z-index: 1001;
            }
            
            .mobile-menu-btn.active span:first-child {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-btn.active span:last-child {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility function to get translation
function getTranslation(key) {
    return translations[currentLanguage] && translations[currentLanguage][key];
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close language modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('languageModal');
        if (modal && !modal.classList.contains('hidden')) {
            toggleLanguageModal();
        }
    }
    
    // Navigate sections with arrow keys (when focused on navigation)
    if (document.activeElement.classList.contains('nav-link')) {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.indexOf(document.activeElement);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].focus();
        }
    }
});

// Performance optimizations
// Throttle scroll events
let scrollTimeout;
const originalHandleScroll = handleScroll;
handleScroll = function() {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        originalHandleScroll();
        scrollTimeout = null;
    }, 16); // ~60fps
};

// Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'images/Страница - MAIN/main.jpg',
        'images/logo.jpg',
        'images/brand.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadCriticalImages);

// Add smooth focus indicators
document.addEventListener('DOMContentLoaded', function() {
    // Ensure keyboard navigation is visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Analytics helper (for future integration)
function trackEvent(category, action, label = '') {
    // This would integrate with analytics service in production
    console.log('Event tracked:', { category, action, label });
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('Engagement', 'Primary Button Click', e.target.textContent);
    }
    
    if (e.target.matches('.language-btn')) {
        trackEvent('Localization', 'Language Change', e.target.getAttribute('data-lang'));
    }
    
    if (e.target.matches('.filter-btn')) {
        trackEvent('Products', 'Filter Applied', e.target.textContent);
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bergkau website initialized successfully');
    
    // Add a subtle loading animation completion
    document.body.classList.add('loaded');
});