document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#galaxy-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    // Camera Setup (Positioned to look slightly down at the galaxy)
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 2;
    camera.position.y = 3;
    camera.position.z = 4;
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent background so CSS bg-color shows through
        antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Galaxy Parameters
    const parameters = {
        count: 60000,       // Number of stars
        size: 0.015,        // Size of each star particle
        radius: 6,          // Overall radius of the galaxy
        branches: 4,        // Number of spiral arms
        spin: 1.2,          // How tightly wound the spiral is
        randomness: 0.3,    // Dispersion of stars
        randomnessPower: 3, // Power curve for dispersion (clusters stars towards the center/arms)
        insideColor: '#ffe5cc', // Warm star color at the galactic core
        outsideColor: '#3069ff' // Cool star color at the edges
    };

    let geometry = null;
    let material = null;
    let points = null;

    const generateGalaxy = () => {
        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Position Logic
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            // Adding randomness to disperse stars off the perfect mathematical spiral
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 0.4; // Flatten the Y axis slightly so it's a disc
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Color Logic (Gradient from center to edge)
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Point Material for Stars
        material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false, // Prevents particles from occluding each other weirdly
            blending: THREE.AdditiveBlending, // Makes overlapping stars glow brighter
            vertexColors: true
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);
    };

    generateGalaxy();

    // Responsive Design
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Optional: Subtle mouse interaction for parallax
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // 1. Slow continuous spin of the galaxy
        if (points) {
            points.rotation.y = elapsedTime * 0.03;
        }

        // 2. Subtle camera parallax based on mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        camera.position.x += (targetX - camera.position.x + 2) * 0.02; // +2 offset from initial pos
        camera.position.y += (-targetY - camera.position.y + 3) * 0.02; // +3 offset from initial pos
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();
});
