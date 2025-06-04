/**
 * AURORA TIMEPIECES - Advanced Animation Controller
 * 時の流れを静寂の中で表現する、高度なアニメーション
 */

(function() {
    'use strict';

    // Animation Configuration
    const ANIM_CONFIG = {
        particleCount: 8,
        particleSpeed: 0.3,
        waveDuration: 12000,
        glowIntensity: 0.15,
        timeUpdateInterval: 1000,
        parallaxLayers: 3
    };

    // Animation State
    const animState = {
        particles: [],
        animationId: null,
        lastTime: 0,
        isActive: true,
        clockElements: new Map()
    };

    /**
     * Particle System - Floating Aurora Dust
     */
    class AuroraParticle {
        constructor(container) {
            this.container = container;
            this.reset();
            this.createElement();
        }

        reset() {
            this.x = Math.random() * this.container.offsetWidth;
            this.y = Math.random() * this.container.offsetHeight;
            this.vx = (Math.random() - 0.5) * ANIM_CONFIG.particleSpeed;
            this.vy = (Math.random() - 0.5) * ANIM_CONFIG.particleSpeed;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.size = Math.random() * 2 + 1;
            this.phase = Math.random() * Math.PI * 2;
        }

        createElement() {
            this.element = document.createElement('div');
            this.element.className = 'aurora-particle';
            this.element.style.cssText = `
                position: absolute;
                width: ${this.size}px;
                height: ${this.size}px;
                background: radial-gradient(circle, rgba(139, 115, 85, 0.6), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
            `;
            this.container.appendChild(this.element);
        }

        update(deltaTime) {
            this.phase += deltaTime * 0.001;
            
            this.x += this.vx * deltaTime * 0.1;
            this.y += this.vy * deltaTime * 0.1;
            
            // Add gentle sine wave motion
            const sineOffset = Math.sin(this.phase) * 0.5;
            
            // Boundary checking with wrap-around
            if (this.x < -10) this.x = this.container.offsetWidth + 10;
            if (this.x > this.container.offsetWidth + 10) this.x = -10;
            if (this.y < -10) this.y = this.container.offsetHeight + 10;
            if (this.y > this.container.offsetHeight + 10) this.y = -10;

            // Update opacity with breathing effect
            const breathingOpacity = (Math.sin(this.phase * 0.5) + 1) * 0.15 + 0.05;
            
            this.element.style.transform = `translate(${this.x + sineOffset}px, ${this.y}px)`;
            this.element.style.opacity = breathingOpacity;
        }

        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    /**
     * Advanced Clock Animation
     */
    class TimepieceController {
        constructor(clockElement) {
            this.clockElement = clockElement;
            this.hands = {};
            this.isRunning = false;
            this.createClockHands();
        }

        createClockHands() {
            // Hour hand
            this.hands.hour = this.createHand('hour-hand', {
                width: '3px',
                height: '25%',
                background: 'var(--deep-charcoal)',
                opacity: '0.8',
                zIndex: '3'
            });

            // Minute hand
            this.hands.minute = this.createHand('minute-hand', {
                width: '2px',
                height: '35%',
                background: 'var(--warm-slate-grey)',
                opacity: '0.9',
                zIndex: '4'
            });

            // Second hand
            this.hands.second = this.createHand('second-hand', {
                width: '1px',
                height: '40%',
                background: 'var(--antique-bronze)',
                opacity: '0.7',
                zIndex: '5'
            });

            // Center dot
            const centerDot = document.createElement('div');
            centerDot.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: var(--deep-charcoal);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 6;
            `;
            this.clockElement.appendChild(centerDot);
        }

        createHand(className, styles) {
            const hand = document.createElement('div');
            hand.className = className;
            hand.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${styles.width};
                height: ${styles.height};
                background: ${styles.background};
                transform-origin: center bottom;
                transform: translate(-50%, -100%);
                opacity: ${styles.opacity};
                z-index: ${styles.zIndex};
                transition: transform 0.1s ease-out;
            `;
            this.clockElement.appendChild(hand);
            return hand;
        }

        updateTime() {
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // Calculate angles (0 degrees = 12 o'clock)
            const hourAngle = (hours * 30) + (minutes * 0.5);
            const minuteAngle = minutes * 6;
            const secondAngle = seconds * 6;

            // Apply smooth rotation
            this.hands.hour.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
            this.hands.minute.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
            this.hands.second.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
        }

        start() {
            this.isRunning = true;
            this.updateTime();
            
            // Update every second for smooth second hand
            this.interval = setInterval(() => {
                if (this.isRunning) {
                    this.updateTime();
                }
            }, 1000);
        }

        stop() {
            this.isRunning = false;
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
    }

    /**
     * Meditation Wave Effect
     */
    function createMeditationWaves() {
        const hero = document.querySelector('.hero-sanctuary');
        if (!hero) return;

        const waveContainer = document.createElement('div');
        waveContainer.className = 'meditation-waves';
        waveContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
        `;

        // Create multiple wave layers
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = `meditation-wave wave-${i}`;
            wave.style.cssText = `
                position: absolute;
                bottom: -100px;
                left: -50%;
                width: 200%;
                height: 200px;
                background: linear-gradient(45deg,
                    rgba(139, 115, 85, ${0.02 + i * 0.01}),
                    rgba(74, 107, 107, ${0.01 + i * 0.005}),
                    transparent);
                border-radius: 50%;
                animation: meditationFlow ${ANIM_CONFIG.waveDuration + i * 2000}ms linear infinite;
                animation-delay: ${i * -1000}ms;
            `;
            waveContainer.appendChild(wave);
        }

        hero.appendChild(waveContainer);
    }

    /**
     * Chiaroscuro Lighting Effect
     */
    function initializeChiaroscuroLighting() {
        const timepieceCards = document.querySelectorAll('.timepiece-shrine');
        
        timepieceCards.forEach(card => {
            const lightingOverlay = document.createElement('div');
            lightingOverlay.className = 'chiaroscuro-lighting';
            lightingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg,
                    rgba(247, 245, 240, 0.1) 0%,
                    transparent 30%,
                    transparent 70%,
                    rgba(42, 43, 42, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.8s ease;
                pointer-events: none;
                z-index: 1;
            `;

            card.style.position = 'relative';
            card.appendChild(lightingOverlay);

            // Activate on hover
            card.addEventListener('mouseenter', () => {
                lightingOverlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                lightingOverlay.style.opacity = '0';
            });
        });
    }

    /**
     * Text Reveal Animation
     */
    function initializeTextReveal() {
        const textElements = document.querySelectorAll('.hero-title, .section-title, .philosophy-verse');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.cssText = `
                    display: inline-block;
                    margin-right: 0.3em;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: wordReveal 0.8s ease-out forwards;
                    animation-delay: ${wordIndex * 100}ms;
                `;
                wordSpan.textContent = word;
                element.appendChild(wordSpan);
            });
        });
    }

    /**
     * Aurora Glow Effect
     */
    function createAuroraGlow() {
        const glowElements = document.querySelectorAll('.timepiece-aura, .footer-brand');
        
        glowElements.forEach(element => {
            const glowLayer = document.createElement('div');
            glowLayer.className = 'aurora-glow-layer';
            glowLayer.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(ellipse at center,
                    rgba(139, 115, 85, ${ANIM_CONFIG.glowIntensity}),
                    rgba(74, 107, 107, ${ANIM_CONFIG.glowIntensity * 0.7}),
                    transparent 60%);
                animation: auroraFlow 8s ease-in-out infinite;
                pointer-events: none;
                z-index: -1;
            `;

            element.style.position = 'relative';
            element.appendChild(glowLayer);
        });
    }

    /**
     * Main Animation Loop
     */
    function animationLoop(currentTime) {
        if (!animState.isActive) return;

        const deltaTime = currentTime - animState.lastTime;
        animState.lastTime = currentTime;

        // Update particles
        animState.particles.forEach(particle => {
            particle.update(deltaTime);
        });

        animState.animationId = requestAnimationFrame(animationLoop);
    }

    /**
     * Initialize Particle System
     */
    function initializeParticles() {
        const hero = document.querySelector('.hero-sanctuary');
        if (!hero) return;

        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particleContainer);

        // Create particles
        for (let i = 0; i < ANIM_CONFIG.particleCount; i++) {
            const particle = new AuroraParticle(particleContainer);
            animState.particles.push(particle);
        }
    }

    /**
     * Initialize All Timepieces
     */
    function initializeTimepieces() {
        const clockElements = document.querySelectorAll('.watch-silhouette');
        
        clockElements.forEach(clockElement => {
            const controller = new TimepieceController(clockElement);
            animState.clockElements.set(clockElement, controller);
            controller.start();
        });
    }

    /**
     * Inject Additional CSS Animations
     */
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes meditationFlow {
                0% { transform: translateX(-50%) rotate(0deg); }
                100% { transform: translateX(50%) rotate(360deg); }
            }

            @keyframes wordReveal {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes auroraFlow {
                0%, 100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 0.3;
                }
                33% {
                    transform: scale(1.1) rotate(120deg);
                    opacity: 0.5;
                }
                66% {
                    transform: scale(0.9) rotate(240deg);
                    opacity: 0.4;
                }
            }

            .aurora-particle {
                filter: blur(0.5px);
            }

            .timepiece-shrine:hover .chiaroscuro-lighting {
                animation: lightingShift 2s ease-in-out infinite;
            }

            @keyframes lightingShift {
                0%, 100% {
                    background: linear-gradient(135deg,
                        rgba(247, 245, 240, 0.1) 0%,
                        transparent 30%,
                        transparent 70%,
                        rgba(42, 43, 42, 0.1) 100%);
                }
                50% {
                    background: linear-gradient(225deg,
                        rgba(42, 43, 42, 0.1) 0%,
                        transparent 30%,
                        transparent 70%,
                        rgba(247, 245, 240, 0.1) 100%);
                }
            }

            .hour-hand, .minute-hand {
                filter: drop-shadow(0 0 2px rgba(42, 43, 42, 0.3));
            }

            .second-hand {
                filter: drop-shadow(0 0 1px rgba(139, 115, 85, 0.5));
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Performance Management
     */
    function managePerformance() {
        // Reduce animations on lower-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            ANIM_CONFIG.particleCount = Math.max(4, ANIM_CONFIG.particleCount / 2);
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                animState.isActive = false;
                animState.clockElements.forEach(controller => controller.stop());
            } else {
                animState.isActive = true;
                animState.clockElements.forEach(controller => controller.start());
                animationLoop(performance.now());
            }
        });
    }

    /**
     * Cleanup Function
     */
    function cleanup() {
        if (animState.animationId) {
            cancelAnimationFrame(animState.animationId);
        }

        animState.particles.forEach(particle => particle.destroy());
        animState.particles = [];

        animState.clockElements.forEach(controller => controller.stop());
        animState.clockElements.clear();
    }

    /**
     * Initialize All Advanced Animations
     */
    function initializeAdvancedAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('🕰️ Respecting reduced motion preference - Minimal animations only');
            return;
        }

        console.log('✨ Initializing advanced Aurora animations...');

        injectAnimationStyles();
        managePerformance();
        
        // Initialize effects
        initializeParticles();
        initializeTimepieces();
        createMeditationWaves();
        initializeChiaroscuroLighting();
        createAuroraGlow();
        initializeTextReveal();

        // Start main animation loop
        animState.lastTime = performance.now();
        animationLoop(animState.lastTime);

        console.log('🌟 Advanced animations awakened - Poetry in motion');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAdvancedAnimations);
    } else {
        initializeAdvancedAnimations();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Export for external control
    window.AuroraAnimations = {
        pause: () => { animState.isActive = false; },
        resume: () => { 
            animState.isActive = true; 
            animationLoop(performance.now()); 
        },
        cleanup: cleanup,
        state: animState
    };

})(); 