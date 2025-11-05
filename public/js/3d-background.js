// 3D Animated Background using Three.js
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera position
    camera.position.z = 30;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create geometric shapes
    const geometries = [
        new THREE.TorusGeometry(10, 3, 16, 100),
        new THREE.OctahedronGeometry(8),
        new THREE.IcosahedronGeometry(7)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x6366f1, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x8b5cf6, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xec4899, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        })
    ];
    
    const meshes = [];
    
    geometries.forEach((geometry, index) => {
        const mesh = new THREE.Mesh(geometry, materials[index]);
        mesh.position.x = (index - 1) * 25;
        mesh.position.z = -20;
        scene.add(mesh);
        meshes.push(mesh);
    });
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;
        
        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Animate geometric shapes
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.003 * (index + 1);
            mesh.rotation.y += 0.005 * (index + 1);
            mesh.position.y = Math.sin(time + index) * 5;
        });
        
        // Camera movement based on mouse
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        particlesMesh.rotation.y = scrollY * 0.0005;
        meshes.forEach((mesh, index) => {
            mesh.rotation.z = scrollY * 0.0003 * (index + 1);
        });
    });
})();

