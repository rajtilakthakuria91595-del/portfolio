document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Typing Effect for Hero
    const roles = ["make websites", "solve DSA", "write clean code", "build modern UIs"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const dynamicTextElement = document.querySelector('.dynamic-text');
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            dynamicTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            dynamicTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect
    setTimeout(typeEffect, 1000);

    // 2. Intersection Observer for Scroll Reveals
    const fadeElements = document.querySelectorAll('.section-hidden');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                // Optional: Stop observing once revealed
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    fadeElements.forEach(el => fadeObserver.observe(el));

    // 3. Custom Cursor Glow Tracking
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    });

    // 4. Scroll-Based Background Color Transition (Black to Green)
    // We update the --bg-color CSS variable on the document root
    const root = document.documentElement;
    
    window.addEventListener('scroll', () => {
        // Calculate scroll progress (0 to 1)
        const scrollPx = window.scrollY;
        const winHeight = window.innerHeight;
        const docHeight = document.body.offsetHeight;
        
        // Prevent division by zero
        let scrollPercent = 0;
        if (docHeight > winHeight) {
            scrollPercent = scrollPx / (docHeight - winHeight);
        }
        
        // Clamp between 0 and 1
        scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);
        
        // Start Color: rgb(10, 10, 10) (Black-ish)
        // End Color: rgb(0, 50, 25) (Deep Emerald Green)
        const r = Math.round(10 - (10 * scrollPercent));
        const g = Math.round(10 + (40 * scrollPercent));
        const b = Math.round(10 + (15 * scrollPercent));
        
        const newColor = `rgb(${r}, ${g}, ${b})`;
        root.style.setProperty('--bg-color', newColor);
    });
});
