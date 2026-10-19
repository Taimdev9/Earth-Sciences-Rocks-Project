// ==========================================
// 1. إعدادات شاشة التحميل
// ==========================================
window.addEventListener('load', () => {
    // إخفاء شاشة التحميل بعد 2 ثانية (عشان تاخذ وقتها بالظهور)
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            
            // بمجرد اختفاء شاشة التحميل، نبدأ تأثير الكتابة في القسم الأول (Hero)
            const heroElements = document.querySelectorAll('#hero .type-head, #hero .type-sub, #hero .type-para');
            heroElements.forEach((el, index) => {
                setTimeout(() => triggerTyping(el), index * 500); // تأخير بسيط بين كل سطر
            });

        }, 800); // وقت التلاشي
    }, 2000); 
});

// ==========================================
// 2. المؤشر المخصص (Custom Cursor)
// ==========================================
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .scale-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ==========================================
// 3. نظام الكتابة "الكيبورد" عند النزول بالسكرول
// ==========================================
function typeWriter(element, text, speed, callback) {
    let i = 0;
    // إضافة مؤشر يرمش في بداية الكتابة
    element.innerHTML = '<span class="cursor-blink"></span>';
    
    const timer = setInterval(() => {
        // إضافة الحرف الحالي + المؤشر اللي يرمش
        element.innerHTML = text.substring(0, i) + '<span class="cursor-blink"></span>';
        i++;
        
        // إذا خلص النص
        if (i > text.length) {
            clearInterval(timer);
            element.innerHTML = text; // إزالة المؤشر في النهاية
            if(callback) callback();
        }
    }, speed);
}

function triggerTyping(element) {
    // إذا كان النص مكتوب مسبقاً، لا تعيده
    if (element.classList.contains('typed-done')) return;
    element.classList.add('typed-done');
    
    // حفظ النص الأصلي عشان نكتبه
    const originalText = element.getAttribute('data-text') || element.innerText;
    if (!element.getAttribute('data-text')) {
        element.setAttribute('data-text', originalText); 
    }
    
    element.innerText = ''; // تفريغ النص للبدء بالكتابة
    
    // تحديد السرعة (العناوين أسرع شوي من الفقرات)
    let speed = 40;
    if (element.classList.contains('type-para')) speed = 25;
    if (element.classList.contains('type-head')) speed = 60;
    
    typeWriter(element, originalText, speed);
}

// مراقبة الشاشة (عشان تشغل الكتابة لما تنزل للقسم)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // لما القسم يبان في الشاشة، ابحث عن النصوص اللي جواه وشغل الكتابة
            const elementsToType = entry.target.querySelectorAll('.type-head, .type-sub, .type-para');
            
            elementsToType.forEach((el, index) => {
                // تأخير بسيط بين كل سطر عشان يطلع احترافي
                setTimeout(() => {
                    triggerTyping(el);
                }, index * 300); 
            });
        }
    });
}, { threshold: 0.3 }); // يشتغل لما 30% من القسم يبان

// تطبيق المراقبة على كل الأقسام
document.querySelectorAll('section').forEach(section => observer.observe(section));


// ==========================================
// 4. إعدادات Three.js (المجسمات 3D)
// ==========================================
window.addEventListener('load', () => {
    function createScene(containerId, buildModelCallback) {
        const container = document.getElementById(containerId);
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.04);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 6;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); 
        container.appendChild(renderer.domElement);

        // التحكم بالمجسم (سحب ولف)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = false;

        // إضاءة
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const light1 = new THREE.PointLight(0xffffff, 1.5, 30); light1.position.set(5, 5, 5); scene.add(light1);
        const light2 = new THREE.PointLight(0x888888, 1, 30); light2.position.set(-5, -5, 5); scene.add(light2);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1); rimLight.position.set(0, 0, -10); scene.add(rimLight);

        // جزيئات خلفية
        const starGeo = new THREE.BufferGeometry();
        const starCount = 800;
        const starPositions = new Float32Array(starCount * 3);
        for(let i=0; i < starCount * 3; i++) { starPositions[i] = (Math.random() - 0.5) * 50; }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x444444, size: 0.08, transparent: true, opacity: 0.6 }));
        scene.add(stars);

        const model = buildModelCallback();
        scene.add(model);

        function animate() {
            requestAnimationFrame(animate);
            stars.rotation.y += 0.0005;
            if (model) model.position.y = Math.sin(Date.now() * 0.001) * 0.2;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- تصميم المجسمات (ألوان هادئة وفخمة) ---

    // 1. بلورة الكوارتز
    createScene('canvas-hero', () => {
        const geo = new THREE.IcosahedronGeometry(2.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1.0 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff })));
        return mesh;
    });

    // 2. الشبكة الذرية
    createScene('canvas-concept', () => {
        const group = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
        for(let x=-1; x<=1; x+=2) for(let y=-1; y<=1; y+=2) for(let z=-1; z<=1; z+=2) {
            const s = new THREE.Mesh(sphereGeo, sphereMat); s.position.set(x*1.5, y*1.5, z*1.5); group.add(s);
        }
        group.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true, transparent: true, opacity: 0.4 })));
        return group;
    });

    // 3. الأنظمة البلورية
    createScene('canvas-systems', () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x7a8a99, metalness: 0.7, roughness: 0.4 }); 
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), mat); cube.position.x = -3; group.add(cube);
        const tetragonal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), mat); tetragonal.position.x = 0; group.add(tetragonal);
        const hex = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.5, 6), mat); hex.position.x = 3; group.add(hex);
        return group;
    });

    // 4. التناظر
    createScene('canvas-symmetry', () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, metalness: 0.1, transmission: 0.9 })));
        const points = [new THREE.Vector3(-2.5,0,0), new THREE.Vector3(2.5,0,0), new THREE.Vector3(0,-2.5,0), new THREE.Vector3(0,2.5,0), new THREE.Vector3(0,0,-2.5), new THREE.Vector3(0,0,2.5)];
        group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff })));
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ color: 0x4a3b5c, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        plane.rotation.y = Math.PI / 4; group.add(plane);
        return group;
    });

    // 5. الخصائص
    let propModel, propMaterial; 
    createScene('canvas-properties', () => {
        propMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, flatShading: true, roughness: 0.9, metalness: 0.1 });
        propModel = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 0), propMaterial);
        return propModel;
    });

    const colors = [0x666666, 0xb08d57, 0x4a607a, 0x7a4a4a, 0x4a7a5a];
    let colorIndex = 0;
    document.getElementById('change-prop').addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        propMaterial.color.setHex(colors[colorIndex]);
        if(colorIndex === 1) { propMaterial.metalness = 1; propMaterial.roughness = 0.2; }
        else { propMaterial.metalness = 0.1; propMaterial.roughness = 0.8; }
        propModel.scale.set(1.1, 1.1, 1.1); setTimeout(() => propModel.scale.set(1,1,1), 200);
    });

    // 6. مقياس موس (ألماس)
    createScene('canvas-mohs', () => {
        const geo = new THREE.OctahedronGeometry(2.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05, transparent: true, opacity: 0.9, clearcoat: 1.0 });
        const diamond = new THREE.Mesh(geo, mat);
        diamond.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff })));
        return diamond;
    });
});

// ==========================================
// 5. شريط التنقل
// ==========================================
document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('#sidebar a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});