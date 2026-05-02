document.addEventListener('DOMContentLoaded', () => {
    // 1. Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Custom Cursor Glow Tracking
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    });

    // 3. Cinematic Hero Animations
    const tl = gsap.timeline();

    // Nav fade down
    tl.from('.gsap-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Hero items stagger fade up
    tl.from('.gsap-hero-item', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
    }, "-=0.5");

    // 4. Scroll-Triggered Fade Ups for Bento Cards and Sections
    const fadeElements = document.querySelectorAll('.gsap-fade-up');
    
    fadeElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when top of element hits 85% from top of viewport
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // 5. Portfolite 'Antigravity' Hover effects via GSAP
    // Apply floating hover to the profile picture
    const profile = document.querySelector('.profile-container');
    if (profile) {
        profile.addEventListener('mouseenter', () => {
            gsap.to(profile, {
                y: -10,
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.out',
                boxShadow: '0 20px 40px rgba(255, 255, 255, 0.05)'
            });
        });

        profile.addEventListener('mouseleave', () => {
            gsap.to(profile, {
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                boxShadow: 'none'
            });
        });
    }

    // Apply floating hover to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
});
