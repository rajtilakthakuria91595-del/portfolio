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
    camera.position.x = 0;
    camera.position.y = 2.5;
    camera.position.z = 5;
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

    // Scroll Progress Tracking
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        // Calculate scroll progress from 0 to 1
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollProgress = Math.min(1, Math.max(0, scrollProgress));
    });

    // --- Black Hole Setup (Gargantua Style) ---
    const blackHoleGroup = new THREE.Group();
    // Tilt the black hole slightly for a more cinematic view
    blackHoleGroup.rotation.x = 0.3;
    blackHoleGroup.rotation.z = -0.2;
    scene.add(blackHoleGroup);

    // 1. Event Horizon (The Black Sphere)
    const eventHorizonGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide
    });
    const eventHorizon = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);
    blackHoleGroup.add(eventHorizon);

    // Add a glowing photon ring behind the black hole
    const photonRingGeometry = new THREE.SphereGeometry(1.6, 64, 64);
    const photonRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffddaa, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const photonRing = new THREE.Mesh(photonRingGeometry, photonRingMaterial);
    blackHoleGroup.add(photonRing);

    // 2. Accretion Disk (Equatorial)
    const diskGroup = new THREE.Group();
    blackHoleGroup.add(diskGroup);

    const innerDiskGeo = new THREE.RingGeometry(1.6, 2.5, 128);
    const innerDiskMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const innerDisk = new THREE.Mesh(innerDiskGeo, innerDiskMat);
    innerDisk.rotation.x = Math.PI / 2; // Lay flat
    diskGroup.add(innerDisk);

    const midDiskGeo = new THREE.RingGeometry(2.5, 4.5, 128);
    const midDiskMat = new THREE.MeshBasicMaterial({
        color: 0xffaa44,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const midDisk = new THREE.Mesh(midDiskGeo, midDiskMat);
    midDisk.rotation.x = Math.PI / 2;
    diskGroup.add(midDisk);
    
    const outerDiskGeo = new THREE.RingGeometry(4.5, 7.0, 128);
    const outerDiskMat = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const outerDisk = new THREE.Mesh(outerDiskGeo, outerDiskMat);
    outerDisk.rotation.x = Math.PI / 2;
    diskGroup.add(outerDisk);

    // 3. Fake Gravitational Lensing (Halo over the top)
    const lensDiskGeometry = new THREE.RingGeometry(1.6, 5.0, 128);
    const lensDiskMaterial = new THREE.MeshBasicMaterial({
        color: 0xffddaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lensDisk = new THREE.Mesh(lensDiskGeometry, lensDiskMaterial);
    // Leave in XY plane to act as an upright halo
    blackHoleGroup.add(lensDisk);

    // Initial Positioning (Far behind)
    const bhStartZ = -40;
    const bhEndZ = 3.0; // Ends at 2 units away from the camera (z=5), filling the screen
    blackHoleGroup.position.z = bhStartZ;
    blackHoleGroup.position.x = 0;

    // --- Galaxy Setup ---
    const parameters = {
        count: 60000,
        size: 0.015,
        radius: 6,
        branches: 4,
        spin: 1.2,
        randomness: 0.3,
        randomnessPower: 3,
        insideColor: '#ffe5cc',
        outsideColor: '#3069ff'
    };

    let geometry = null;
    let material = null;
    let points = null;
    let originalPositions = null; // Store original positions to compute gravity

    const generateGalaxy = () => {
        geometry = new THREE.BufferGeometry();
        originalPositions = new Float32Array(parameters.count * 3);
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

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

            const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
            const y = randomY * 0.4;
            const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Store for gravity calc
            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;

            // Color Logic
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
            depthWrite: false,
            blending: THREE.AdditiveBlending,
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

        // 2. Spin the black hole accretion disk
        diskGroup.rotation.y = elapsedTime * 0.5;

        // 3. Move the Black Hole based on scroll
        // Use an easing function so it accelerates as you scroll down
        const easeScroll = Math.pow(scrollProgress, 2.5);
        const targetBHZ = bhStartZ + (bhEndZ - bhStartZ) * easeScroll;
        
        // Smooth interpolation for the Z position
        blackHoleGroup.position.z += (targetBHZ - blackHoleGroup.position.z) * 0.1;

        // 4. Gravitational Pull on the Milky Way Stars
        if (points && geometry && originalPositions) {
            const positionsAttribute = geometry.getAttribute('position');
            const positions = positionsAttribute.array;

            // Compute black hole position in local space of the points
            const bhWorldPos = new THREE.Vector3();
            blackHoleGroup.getWorldPosition(bhWorldPos);
            
            const pointsMatrixWorldInverse = points.matrixWorld.clone().invert();
            const bhLocalPos = bhWorldPos.clone().applyMatrix4(pointsMatrixWorldInverse);

            // Gravity strength based on scroll
            const pullStrength = easeScroll * 8.0; 

            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3;
                
                const origX = originalPositions[i3];
                const origY = originalPositions[i3 + 1];
                const origZ = originalPositions[i3 + 2];
                
                const dx = bhLocalPos.x - origX;
                const dy = bhLocalPos.y - origY;
                const dz = bhLocalPos.z - origZ;
                
                const distSq = dx*dx + dy*dy + dz*dz;
                const dist = Math.sqrt(distSq);

                // Gravitational force: inversely proportional to square distance
                // Cap the force to avoid overshooting
                const force = Math.min(1.0, pullStrength / (distSq + 0.1));
                
                // If the star reaches the event horizon, hide it or lock it in the center
                if (dist < 1.4 && easeScroll > 0.05) {
                    positions[i3] = bhLocalPos.x;
                    positions[i3 + 1] = bhLocalPos.y;
                    positions[i3 + 2] = bhLocalPos.z;
                } else {
                    // Interpolate towards the black hole
                    positions[i3] = origX + dx * force;
                    positions[i3 + 1] = origY + dy * force;
                    positions[i3 + 2] = origZ + dz * force;
                }
            }
            
            positionsAttribute.needsUpdate = true;
        }

        // 5. Subtle camera parallax based on mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        camera.position.x += (targetX - camera.position.x) * 0.02; 
        camera.position.y += (-targetY - camera.position.y + 2.5) * 0.02; // +2.5 offset from initial pos
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();
});
