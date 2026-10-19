// ==========================================
// 1. شاشة التحميل
// ==========================================
let progress = 0;
const progressBar = document.querySelector('.progress');
const loader = document.getElementById('loader');

const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 400);
    }
    progressBar.style.width = `${progress}%`;
}, 100);

// ==========================================
// 2. إعدادات Three.js (المجسمات 3D)
// ==========================================
window.addEventListener('load', () => {
    
    function createScene(containerId, buildModelCallback) {
        const container = document.getElementById(containerId);
        const scene = new THREE.Scene();
        
        // ضباب خفيف للخلفية يندمج مع اللون الأسود
        scene.fog = new THREE.FogExp2(0x0f0f0f, 0.04);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 6;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); 
        container.appendChild(renderer.domElement);

        // --- إضاءة بيضاء ورمادية (بدون ألوان فسفورية) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(0xffffff, 1.5, 30); // إضاءة بيضاء قوية
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x888888, 1, 30); // إضاءة رمادية خفيفة
        light2.position.set(-5, -5, 5);
        scene.add(light2);

        // --- جزيئات خلفية (غبار فضائي رمادي) ---
        const starGeo = new THREE.BufferGeometry();
        const starCount = 800;
        const starPositions = new Float32Array(starCount * 3);
        for(let i=0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 50;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0x666666, size: 0.08, transparent: true, opacity: 0.6 });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // --- بناء المجسم ---
        const model = buildModelCallback();
        scene.add(model);

        // --- حركة الماوس ---
        let mouseX = 0; let mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            
            stars.rotation.y += 0.0003;

            if (model) {
                // حركة دوران خفيفة مع الماوس
                model.rotation.x += 0.002 + (mouseY * 0.01);
                model.rotation.y += 0.003 + (mouseX * 0.01);
                // حركة طفو (Floating)
                model.position.y = Math.sin(Date.now() * 0.001) * 0.3;
            }

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ==========================================
    // تصميم المجسمات (ألوان هادئة وفخمة)
    // ==========================================

    // 1. بلورة الكوارتز (فضي/شفاف)
    createScene('canvas-hero', () => {
        const geometry = new THREE.IcosahedronGeometry(2.2, 0);
        const material = new THREE.MeshPhysicalMaterial({ 
            color: 0xcccccc, // رمادي فضي
            metalness: 0.9, 
            roughness: 0.1, 
            transparent: true, 
            opacity: 0.9,
            clearcoat: 1.0 // لمعان زجاجي
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // حواف بيضاء
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } ));
        mesh.add(line);
        return mesh;
    });

    // 2. الشبكة الذرية (رمادي معدني)
    createScene('canvas-concept', () => {
        const group = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
        
        for(let x=-1; x<=1; x+=2) {
            for(let y=-1; y<=1; y+=2) {
                for(let z=-1; z<=1; z+=2) {
                    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
                    sphere.position.set(x * 1.5, y * 1.5, z * 1.5);
                    group.add(sphere);
                }
            }
        }
        
        const boxGeo = new THREE.BoxGeometry(3, 3, 3);
        const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true, transparent: true, opacity: 0.4 });
        group.add(new THREE.Mesh(boxGeo, wireframeMat));
        return group;
    });

    // 3. الأنظمة البلورية (لون معدني داكن)
    createScene('canvas-systems', () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x7a8a99, metalness: 0.7, roughness: 0.4 }); // رمادي مزرق هادئ
        
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), mat);
        cube.position.x = -3;
        group.add(cube);

        const tetragonal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), mat);
        tetragonal.position.x = 0;
        group.add(tetragonal);

        const hexGeo = new THREE.CylinderGeometry(1, 1, 2.5, 6);
        const hex = new THREE.Mesh(hexGeo, mat);
        hex.position.x = 3;
        group.add(hex);

        group.rotation.x = 0.2;
        return group;
    });

    // 4. التناظر (زجاج شفاف مع مستوى بنفسجي داكن)
    createScene('canvas-symmetry', () => {
        const group = new THREE.Group();
        
        const cubeGeo = new THREE.BoxGeometry(3, 3, 3);
        const cubeMat = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, transparent: true, opacity: 0.1, 
            roughness: 0, metalness: 0.1, transmission: 0.9 // تأثير الزجاج
        });
        group.add(new THREE.Mesh(cubeGeo, cubeMat));
        
        // خطوط بيضاء
        const linesMat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const points = [
            new THREE.Vector3(-2.5, 0, 0), new THREE.Vector3(2.5, 0, 0),
            new THREE.Vector3(0, -2.5, 0), new THREE.Vector3(0, 2.5, 0),
            new THREE.Vector3(0, 0, -2.5), new THREE.Vector3(0, 0, 2.5)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        group.add(new THREE.LineSegments(lineGeo, linesMat));

        // مستوى التناظر (بنفسجي داكن هادئ)
        const planeGeo = new THREE.PlaneGeometry(3, 3);
        const planeMat = new THREE.MeshBasicMaterial({ color: 0x4a3b5c, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.y = Math.PI / 4; 
        group.add(plane);

        return group;
    });

    // 5. الخصائص الفيزيائية (صخرة بألوان واقعية)
    let propModel; 
    let propMaterial; 
    createScene('canvas-properties', () => {
        const geo = new THREE.DodecahedronGeometry(2.2, 0); 
        // لون رمادي حجري واقعي
        propMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, flatShading: true, roughness: 0.9, metalness: 0.1 });
        propModel = new THREE.Mesh(geo, propMaterial);
        return propModel;
    });

    const propBtn = document.getElementById('change-prop');
    // ألوان المعدن (ذهبي مطفي، نحاسي، أزرق داكن، أحمر داكن)
    const colors = [0x666666, 0xb08d57, 0x4a607a, 0x7a4a4a, 0x4a7a5a];
    const names = ["حجر عادي", "بريق فلزي (ذهب)", "لون أزرق", "لون أحمر", "لون أخضر"];
    let colorIndex = 0;

    propBtn.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        if(propMaterial && propModel) {
            propMaterial.color.setHex(colors[colorIndex]);
            
            if(colorIndex === 1) { propMaterial.metalness = 1; propMaterial.roughness = 0.2; } // لامع
            else { propMaterial.metalness = 0.1; propMaterial.roughness = 0.8; } // مطفي
            
            propModel.scale.set(1.1, 1.1, 1.1);
            setTimeout(() => propModel.scale.set(1,1,1), 200);
        }
    });

    // 6. مقياس موس (ألماس شفاف)
    createScene('canvas-mohs', () => {
        const geo = new THREE.OctahedronGeometry(2.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, 
            metalness: 1.0, 
            roughness: 0.05, 
            transparent: true, 
            opacity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const diamond = new THREE.Mesh(geo, mat);
        
        // خطوط بيضاء لتوضيح شكل الألماس
        const edges = new THREE.EdgesGeometry(geo);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ));
        diamond.add(line);
        
        return diamond;
    });
});

// ==========================================
// 3. برمجة التنقل
// ==========================================
const navLinks = document.querySelectorAll('#sidebar a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});