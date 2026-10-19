// ==========================================
// 1. شاشة التحميل
// ==========================================
let progress = 0;
const progressBar = document.querySelector('.progress');
const loader = document.getElementById('loader');

const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 500);
    }
    progressBar.style.width = `${progress}%`;
}, 100);

// ==========================================
// 2. إعدادات Three.js الأساسية
// ==========================================
window.addEventListener('load', () => {
    
    // دالة لإنشاء مشهد 3D جديد (لتجنب تكرار الكود)
    function createScene(containerId, buildModelCallback) {
        const container = document.getElementById(containerId);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // إضاءة عامة
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const pointLight = new THREE.PointLight(0x00E5FF, 2, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // بناء المجسم الخاص بهذا القسم
        const model = buildModelCallback();
        scene.add(model);

        // حركة الماوس
        let mouseX = 0; let mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // حلقة الرسم
        function animate() {
            requestAnimationFrame(animate);
            model.rotation.x += 0.002 + (mouseY * 0.01);
            model.rotation.y += 0.005 + (mouseX * 0.01);
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 1. القسم الأول: بلورة (Icosahedron) ---
    createScene('canvas-hero', () => {
        const geo = new THREE.IcosahedronGeometry(2.5, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.6 });
        return new THREE.Mesh(geo, mat);
    });

    // --- 2. القسم الثاني: الشبكة الذرية (Concept) ---
    createScene('canvas-concept', () => {
        const group = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        // بناء مكعب من الكرات لتمثيل الذرات
        for(let x=-1; x<=1; x+=2) {
            for(let y=-1; y<=1; y+=2) {
                for(let z=-1; z<=1; z+=2) {
                    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
                    sphere.position.set(x, y, z);
                    group.add(sphere);
                }
            }
        }
        // إضافة أسلاك تربط الذرات
        const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.3 });
        const boxGeo = new THREE.BoxGeometry(2, 2, 2);
        group.add(new THREE.Mesh(boxGeo, wireframeMat));
        return group;
    });

    // --- 3. القسم الثالث: الأنظمة البلورية (Systems) ---
    createScene('canvas-systems', () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, wireframe: true });
        
        // المكعب
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), mat);
        cube.position.x = -2.5;
        group.add(cube);

        // الرباعي (متوازي مستطيلات)
        const tetragonal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), mat);
        tetragonal.position.x = 0;
        group.add(tetragonal);

        // السداسي
        const hexGeo = new THREE.CylinderGeometry(1, 1, 2, 6);
        const hex = new THREE.Mesh(hexGeo, mat);
        hex.position.x = 2.5;
        group.add(hex);

        return group;
    });

    // --- 4. القسم الرابع: التناظر (Symmetry) ---
    createScene('canvas-symmetry', () => {
        const group = new THREE.Group();
        // مكعب شفاف
        const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
        group.add(new THREE.Mesh(cubeGeo, cubeMat));
        
        // خطوط التناظر (محاور)
        const linesMat = new THREE.LineBasicMaterial({ color: 0x00E5FF });
        const points = [
            new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(0, 0, -2), new THREE.Vector3(0, 0, 2)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lines = new THREE.LineSegments(lineGeo, linesMat);
        group.add(lines);

        // مستوى التناظر
        const planeGeo = new THREE.PlaneGeometry(2.5, 2.5);
        const planeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = Math.PI / 4; // إمالة المستوى
        group.add(plane);

        return group;
    });

    // --- 5. القسم الخامس: الخصائص (Properties) ---
    let propModel;
    createScene('canvas-properties', () => {
        // شكل صخرة (Dodecahedron)
        const geo = new THREE.DodecahedronGeometry(2, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true, roughness: 0.8 });
        propModel = new THREE.Mesh(geo, mat);
        return propModel;
    });

    // تفاعل زر تغيير الخصائص
    const propBtn = document.getElementById('change-prop');
    let colorIndex = 0;
    const colors = [0x888888, 0xffd700, 0x00E5FF, 0xff0033]; // رمادي، ذهبي، سماوي، أحمر
    propBtn.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        if(propModel) {
            propModel.material.color.setHex(colors[colorIndex]);
            propModel.material.metalness = colorIndex === 1 ? 0.9 : 0.1; // الذهبي لامع
        }
    });

    // --- 6. القسم السادس: مقياس موس (Mohs) ---
    createScene('canvas-mohs', () => {
        // هرم/بلورة تمثل الألماس
        const geo = new THREE.OctahedronGeometry(2, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, metalness: 0.5, roughness: 0.1 });
        const diamond = new THREE.Mesh(geo, mat);
        return diamond;
    });
});

// ==========================================
// 3. تفعيل التمرير السلس والـ Sidebar
// ==========================================
const navLinks = document.querySelectorAll('#sidebar a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        
        // تغيير اللون النشط
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});