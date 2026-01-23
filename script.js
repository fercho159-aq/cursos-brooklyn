// ==================== Performance Optimized Script ====================

// Utility: Debounce function for scroll/resize events
function debounce(func, wait = 10) {
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

// Utility: Throttle function for frequent events
function throttle(func, limit = 16) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== DOM Elements (lazy initialization) ====================
let navbar, navToggle, navMenu, backToTop, contactForm, successModal;

function initDOMElements() {
    navbar = document.getElementById('navbar');
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
    backToTop = document.getElementById('back-to-top');
    contactForm = document.getElementById('contact-form');
    successModal = document.getElementById('success-modal');
}

// ==================== Navbar Scroll Effect (optimized) ====================
const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;

    // Use classList toggle for better performance
    if (navbar) {
        navbar.classList.toggle('scrolled', currentScroll > 50);
    }

    // Back to top button visibility
    if (backToTop) {
        backToTop.classList.toggle('visible', currentScroll > 500);
    }
}, 16);

// ==================== Mobile Menu Toggle ====================
function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const hamburger = navToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    }, { passive: true });

    // Close menu when clicking on a link (event delegation)
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navMenu.classList.remove('active');
            const hamburger = navToggle.querySelector('.hamburger');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    }, { passive: true });
}

// ==================== Smooth Scroll (optimized) ====================
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ==================== Back to Top ====================
function initBackToTop() {
    if (!backToTop) return;

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, { passive: true });
}

// ==================== Contact Form ====================
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // Show success modal
        if (successModal) {
            successModal.classList.add('active');
        }

        // Reset form
        contactForm.reset();
    });
}

// ==================== Modal Functions ====================
function closeModal() {
    if (successModal) {
        successModal.classList.remove('active');
    }
}

function initModal() {
    if (!successModal) return;

    // Close modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    }, { passive: true });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal?.classList.contains('active')) {
        closeModal();
    }
}, { passive: true });

// ==================== Intersection Observer for Animations ====================
function initAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Use requestIdleCallback for non-critical initialization
    const initObservations = () => {
        const elements = document.querySelectorAll('.course-card, .benefit-card, .promo-card, .testimonial-card, .location-card');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initObservations);
    } else {
        setTimeout(initObservations, 200);
    }
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    .nav-link.active {
        color: var(--primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(animationStyles);

// ==================== Active Navigation Link (optimized) ====================
const updateActiveNav = throttle(() => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', isActive);
    });
}, 100);

// ==================== Stagger Animation for Cards ====================
function staggerCards(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ==================== Initialize Everything ====================
function init() {
    initDOMElements();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initModal();
    initAnimations();

    // Stagger animations
    staggerCards('.course-card');
    staggerCards('.benefit-card');
    staggerCards('.testimonial-card');

    // Add scroll listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Add loaded class
    document.body.classList.add('loaded');

    console.log('🎓 Cursos Brooklyn - Website Loaded Successfully!');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== Preloader (Optional) ====================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
}, { passive: true });

// Export closeModal for inline onclick
window.closeModal = closeModal;
