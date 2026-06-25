/* ========================================
   BULADEV + ASA Construction
   Main JavaScript File
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initFAQAccordion();
    initFormValidation();
    initProjectFilter();
    initScrollAnimations();
});

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const headerOverlay = document.getElementById('headerOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileNav || !headerOverlay) return;

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        headerOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        headerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    headerOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ========================================
   Header Scroll Effect
   ======================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   FAQ Accordion
   ======================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ========================================
   Form Validation
   ======================================== */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(contactForm);
        const errors = {};

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
        
        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`[name="${field}"]`);
            if (!input || !input.value.trim()) {
                isValid = false;
                errors[field] = 'This field is required';
                if (input) input.classList.add('error');
            } else {
                if (input) input.classList.remove('error');
            }
        });

        // Validate email format
        const emailInput = contactForm.querySelector('[name="email"]');
        if (emailInput && emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                isValid = false;
                errors.email = 'Please enter a valid email address';
                emailInput.classList.add('error');
            }
        }

        // Validate phone format (if provided)
        const phoneInput = contactForm.querySelector('[name="phone"]');
        if (phoneInput && phoneInput.value.trim()) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(phoneInput.value.trim())) {
                isValid = false;
                errors.phone = 'Please enter a valid phone number';
                phoneInput.classList.add('error');
            }
        }

        if (isValid) {
            // Show success message
            showFormSuccess(contactForm);
            contactForm.reset();
        } else {
            // Show error message
            showFormErrors(contactForm, errors);
        }
    });

    // Remove error class on input
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

function showFormSuccess(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
        background-color: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        animation: fadeIn 0.3s ease-out;
    `;
    successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
    
    form.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showFormErrors(form, errors) {
    // Remove existing error messages
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());

    // Add new error messages
    Object.keys(errors).forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            errorDiv.textContent = errors[field];
            input.parentNode.appendChild(errorDiv);
        }
    });
}

/* ========================================
   Project Filter
   ======================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.projects-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.textContent.toLowerCase();

            // Filter cards
            projectCards.forEach(card => {
                const category = card.querySelector('.project-card-category');
                if (!category) return;

                const cardCategory = category.textContent.toLowerCase();

                if (filter === 'all projects' || cardCategory.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fadeIn, .animate-slideInLeft, .animate-slideInRight, .animate-scaleIn');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });

    // Also observe cards and sections
    const cards = document.querySelectorAll('.card, .service-card, .project-card, .testimonial-card, .team-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

/* ========================================
   Utility Functions
   ======================================== */

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get current year for copyright
function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.footer-copyright');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(element => {
        const text = element.textContent;
        const updatedText = text.replace(/\d{4}/, currentYear);
        element.textContent = updatedText;
    });
}

// Initialize on page load
updateCopyrightYear();

/* ========================================
   Lazy Loading Images (Optional Enhancement)
   ======================================== */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// Initialize lazy loading
initLazyLoading();

/* ========================================
   Console Welcome Message
   ======================================== */
console.log('%c BULADEV + ASA Construction ', 'background: #FF6B35; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Building Success Together ', 'background: #1A1A1A; color: white; font-size: 14px; padding: 5px;');
