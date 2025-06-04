/**
 * AURORA TIMEPIECES - Main JavaScript
 * 静寂の中に息づく、洗練されたインタラクション
 */

(function() {
    'use strict';

    // Configuration - Refined Parameters
    const CONFIG = {
        scrollThrottle: 16, // 60fps for smooth animations
        observerThreshold: 0.1,
        observerRootMargin: '0px 0px -50px 0px',
        parallaxIntensity: 0.3,
        mouseFollowIntensity: 0.05,
        typingSpeed: 80,
        fadeDelay: 150,
        loadingDelay: 500
    };

    // State Management
    const state = {
        isScrolling: false,
        mousePosition: { x: 0, y: 0 },
        lastScrollTop: 0,
        isLoaded: false,
        animations: new Map(),
        loadStartTime: performance.now()
    };

    /**
     * DOM Ready Handler - Gentle Initialization
     */
    function initialize() {
        console.log('🕰️ AURORA TIMEPIECES - Awakening the timeless experience...');
        
        try {
            // Wait for fonts to load for optimal typography rendering
            Promise.all([
                document.fonts.ready,
                new Promise(resolve => setTimeout(resolve, CONFIG.loadingDelay))
            ]).then(() => {
                initializeIntersectionObserver();
                initializeScrollEffects();
                initializeMouseEnhancements();
                initializeNavigation();
                initializeTimepiece();
                initializeAccessibility();
                initializeLoadingComplete();
                
                state.isLoaded = true;
                const loadTime = performance.now() - state.loadStartTime;
                console.log(`✨ Experience ready in ${Math.round(loadTime)}ms - Let time whisper its secrets...`);
            }).catch(error => {
                console.warn('⚠️ Aurora loading encountered an issue:', error);
                fallbackInitialization();
            });
        } catch (error) {
            console.warn('⚠️ Aurora gracefully handles initialization error:', error);
            fallbackInitialization();
        }
    }

    /**
     * Fallback Initialization - Graceful Degradation
     */
    function fallbackInitialization() {
        document.body.classList.add('aurora-loaded');
        initializeBasicFunctionality();
        console.log('🕰️ Aurora running in compatibility mode');
    }

    /**
     * Basic Functionality for Compatibility
     */
    function initializeBasicFunctionality() {
        // Basic navigation
        const navLinks = document.querySelectorAll('.nav-whisper, .cta-whisper');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });

        // Basic scroll behavior
        window.addEventListener('scroll', handleBasicScroll, { passive: true });
    }

    /**
     * Loading Complete Animation
     */
    function initializeLoadingComplete() {
        // Remove loading class and trigger animations
        setTimeout(() => {
            document.body.classList.remove('aurora-loading');
            document.body.classList.add('aurora-loaded');
            
            // Trigger staggered animations
            const elements = document.querySelectorAll('.aurora-loading');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.remove('aurora-loading');
                    element.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 100);
    }

    /**
     * Intersection Observer - Contemplative Reveal
     */
    function initializeIntersectionObserver() {
        if (!window.IntersectionObserver) {
            console.log('🕰️ IntersectionObserver not supported - using fallback');
            return;
        }

        const observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Add staggered delay for child elements
                    const children = entry.target.querySelectorAll('.timepiece-shrine, .narrative-verse, .contact-vessel');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('fade-in-delayed');
                        }, index * CONFIG.fadeDelay);
                    });
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const elementsToObserve = document.querySelectorAll(`
            .section-title,
            .philosophy-essence,
            .collection-constellation,
            .craftsmanship-narrative,
            .experience-meditation,
            .contact-constellation
        `);

        elementsToObserve.forEach(el => observer.observe(el));
    }

    /**
     * Scroll Effects - Gentle Parallax & Navigation Enhancement
     */
    function initializeScrollEffects() {
        let ticking = false;

        function updateScrollEffects() {
            const scrollTop = window.pageYOffset;
            const scrollDirection = scrollTop > state.lastScrollTop ? 'down' : 'up';
            
            // Navigation visibility enhancement
            const nav = document.querySelector('.nav-sanctuary');
            if (nav) {
                if (scrollTop > 100) {
                    nav.classList.add('nav-elevated');
                } else {
                    nav.classList.remove('nav-elevated');
                }
            }

            // Gentle parallax for hero elements
            const heroTimepiece = document.querySelector('.hero-timepiece-shrine');
            if (heroTimepiece && scrollTop < window.innerHeight) {
                const parallaxOffset = scrollTop * CONFIG.parallaxIntensity;
                heroTimepiece.style.transform = `translateY(${parallaxOffset}px)`;
            }

            // Timepiece floating enhancement
            const watchSilhouette = document.querySelector('.watch-silhouette');
            if (watchSilhouette) {
                const floatOffset = Math.sin(Date.now() * 0.001) * 2;
                const scrollFloat = scrollTop * 0.1;
                watchSilhouette.style.transform = `translateY(${floatOffset - scrollFloat}px) rotate(${floatOffset * 0.5}deg)`;
            }

            state.lastScrollTop = scrollTop;
            ticking = false;
        }

        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }

        // Throttled scroll listener
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    /**
     * Basic Scroll Handler
     */
    function handleBasicScroll() {
        const scrollTop = window.pageYOffset;
        const nav = document.querySelector('.nav-sanctuary');
        if (nav) {
            if (scrollTop > 100) {
                nav.style.background = 'rgba(247, 245, 240, 0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(42, 43, 42, 0.1)';
            } else {
                nav.style.background = 'rgba(247, 245, 240, 0.95)';
                nav.style.boxShadow = 'none';
            }
        }
    }

    /**
     * Mouse Enhancement - Subtle Following Effects
     */
    function initializeMouseEnhancements() {
        if (window.matchMedia('(pointer: coarse)').matches) {
            // Skip mouse effects on touch devices
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        function updateMousePosition(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }

        function animateMouseFollowers() {
            currentX += (mouseX - currentX) * CONFIG.mouseFollowIntensity;
            currentY += (mouseY - currentY) * CONFIG.mouseFollowIntensity;

            // Subtle timepiece movement
            const timepiece = document.querySelector('.timepiece-aura');
            if (timepiece) {
                timepiece.style.transform = `translate(${currentX * 10}px, ${currentY * 10}px)`;
            }

            // Light caress following
            const lightCaress = document.querySelector('.light-caress');
            if (lightCaress) {
                lightCaress.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px)`;
            }

            requestAnimationFrame(animateMouseFollowers);
        }

        document.addEventListener('mousemove', updateMousePosition);
        animateMouseFollowers();
    }

    /**
     * Navigation Enhancement - Smooth & Refined
     */
    function initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-whisper, .cta-whisper');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });

        // Enhanced hover effects for navigation
        const navWhispers = document.querySelectorAll('.nav-whisper');
        navWhispers.forEach(whisper => {
            whisper.addEventListener('mouseenter', () => {
                whisper.style.setProperty('--hover-intensity', '1');
            });
            
            whisper.addEventListener('mouseleave', () => {
                whisper.style.setProperty('--hover-intensity', '0');
            });
        });
    }

    /**
     * Enhanced Navigation Handler
     */
    function handleNavigation(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Smooth scroll with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Fallback for older browsers
                    const targetPosition = target.offsetTop - 80;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
                
                // Add subtle focus indication
                target.classList.add('section-focus');
                setTimeout(() => {
                    target.classList.remove('section-focus');
                }, 2000);
            }
        }
    }

    /**
     * Timepiece Animation - Living Clock
     */
    function initializeTimepiece() {
        const watchSilhouette = document.querySelector('.watch-silhouette');
        if (!watchSilhouette) return;

        try {
            // Create minute hand
            const minuteHand = document.createElement('div');
            minuteHand.className = 'minute-hand';
            minuteHand.style.cssText = `
                position: absolute;
                top: 30%;
                left: 50%;
                width: 1px;
                height: 35%;
                background: var(--aged-parchment);
                transform-origin: center bottom;
                transform: translate(-50%, 0);
                opacity: 0.6;
                z-index: 2;
            `;

            // Create hour markers
            for (let i = 0; i < 12; i++) {
                const marker = document.createElement('div');
                marker.style.cssText = `
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    width: ${i % 3 === 0 ? '2px' : '1px'};
                    height: ${i % 3 === 0 ? '15px' : '8px'};
                    background: var(--aged-parchment);
                    transform-origin: center;
                    transform: translateX(-50%) rotate(${i * 30}deg);
                    opacity: 0.4;
                `;
                watchSilhouette.appendChild(marker);
            }

            watchSilhouette.appendChild(minuteHand);

            // Animate hands
            function updateClock() {
                const now = new Date();
                const minutes = now.getMinutes();
                const hours = now.getHours() % 12;
                
                const minuteAngle = minutes * 6; // 360/60
                const hourAngle = (hours * 30) + (minutes * 0.5); // 360/12 + minute adjustment
                
                minuteHand.style.transform = `translate(-50%, 0) rotate(${minuteAngle}deg)`;
            }

            updateClock();
            setInterval(updateClock, 60000); // Update every minute
        } catch (error) {
            console.warn('🕰️ Timepiece animation error:', error);
        }
    }

    /**
     * Accessibility Enhancements
     */
    function initializeAccessibility() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }

        // Enhanced keyboard navigation
        const focusableElements = document.querySelectorAll(`
            .nav-whisper,
            .cta-whisper,
            .discover-whisper,
            .contact-whisper,
            .footer-whisper
        `);

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('keyboard-focus');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('keyboard-focus');
            });
        });

        // Skip to content functionality
        createSkipLink();
    }

    /**
     * Create Skip Link for Accessibility
     */
    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'メインコンテンツにスキップ';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--deep-charcoal);
            color: var(--aged-parchment);
            padding: 8px;
            text-decoration: none;
            z-index: 1001;
            border-radius: 4px;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * CSS Enhancement Injector
     */
    function injectEnhancements() {
        const style = document.createElement('style');
        style.textContent = `
            .aurora-loaded .hero-title,
            .aurora-loaded .hero-meditation,
            .aurora-loaded .hero-invitation {
                opacity: 1;
                transform: translateY(0);
            }

            .nav-elevated {
                background: rgba(247, 245, 240, 0.98) !important;
                box-shadow: 0 2px 20px rgba(42, 43, 42, 0.1) !important;
            }

            .section-focus {
                position: relative;
            }

            .section-focus::before {
                content: '';
                position: absolute;
                top: -20px;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--antique-bronze), transparent);
                animation: gentleGlow 2s ease-in-out;
            }

            .keyboard-focus {
                outline: 2px solid var(--antique-bronze) !important;
                outline-offset: 2px !important;
            }

            .reduce-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            .minute-hand {
                animation: clockTick 3600s linear infinite;
            }

            /* Fallback styles for unsupported features */
            .no-css-variables {
                color: #2a2b2a;
                background-color: #f7f5f0;
            }

            .no-backdrop-filter .nav-sanctuary {
                background: rgba(247, 245, 240, 0.95);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Performance Monitoring & Analytics
     */
    function initializePerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`⏱️ Aurora total load time: ${loadTime}ms`);
                
                // Report to analytics if needed
                if (window.gtag) {
                    window.gtag('event', 'timing_complete', {
                        'name': 'aurora_load',
                        'value': loadTime
                    });
                }
            });
        }

        // Monitor for errors
        window.addEventListener('error', (e) => {
            console.warn('🕰️ Aurora gracefully handles:', e.message);
        });

        // Monitor for unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.warn('🕰️ Aurora handles promise rejection:', e.reason);
            e.preventDefault(); // Prevent console error
        });
    }

    /**
     * Feature Detection
     */
    function detectFeatures() {
        const features = {
            cssVariables: window.CSS && CSS.supports('color', 'var(--fake-var)'),
            backdropFilter: CSS.supports('backdrop-filter', 'blur(1px)'),
            intersectionObserver: 'IntersectionObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window
        };

        // Add classes based on feature support
        Object.keys(features).forEach(feature => {
            if (!features[feature]) {
                document.documentElement.classList.add(`no-${feature.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            }
        });

        return features;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Detect features and inject enhancements
    detectFeatures();
    injectEnhancements();
    initializePerformanceMonitoring();

    // Export for potential external usage
    window.Aurora = {
        state,
        reinitialize: initialize,
        version: '1.0.0'
    };

})(); 