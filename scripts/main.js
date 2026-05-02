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

    // 4. Scroll-Based Effects (Background Color & Parallax)
    const root = document.documentElement;
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    
    window.addEventListener('scroll', () => {
        const scrollPx = window.scrollY;
        const winHeight = window.innerHeight;
        const docHeight = document.body.offsetHeight;
        
        // --- Background Color Transition ---
        let scrollPercent = 0;
        if (docHeight > winHeight) {
            scrollPercent = scrollPx / (docHeight - winHeight);
        }
        scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);
        
        const r = Math.round(10 - (10 * scrollPercent));
        const g = Math.round(10 + (40 * scrollPercent));
        const b = Math.round(10 + (15 * scrollPercent));
        const newColor = `rgb(${r}, ${g}, ${b})`;
        root.style.setProperty('--bg-color', newColor);

        // --- Featured Section Parallax ---
        requestAnimationFrame(() => {
            parallaxContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                if (rect.top <= winHeight && rect.bottom >= 0) {
                    const distance = winHeight - rect.top;
                    const bg = container.querySelector('.parallax-bg');
                    const content = container.querySelector('.parallax-content');
                    const image = container.querySelector('.parallax-image');
                    
                    if (bg) bg.style.transform = `translateY(${distance * 0.15}px)`;
                    if (content) content.style.transform = `translateY(${distance * 0.05}px)`;
                    if (image) image.style.transform = `translateY(${distance * -0.1}px)`;
                }
            });
        });
    });
});
