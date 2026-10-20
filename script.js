// ==========================================
// 1. المؤثرات الصوتية (UI Sounds)
// ==========================================
let audioCtx;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
}
// تفعيل الصوت مع أول تفاعل للمستخدم
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('mousemove', initAudio, { once: true });

// ==========================================
// 2. وضع العرض (Fullscreen)
// ==========================================
document.getElementById('fs-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
});

// ==========================================
// 3. إعدادات شاشة التحميل
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            const heroElements = document.querySelectorAll('#hero .type-head, #hero .type-sub, #hero .type-para');
            heroElements.forEach((el, index) => {
                setTimeout(() => triggerTyping(el), index * 300);
            });
        }, 800); 
    }, 1500); 
});

// ==========================================
// 4. المؤشر المخصص والأصوات
// ==========================================
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .scale-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); playSound('hover'); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    el.addEventListener('click', () => playSound('click'));
});

// ==========================================
// 5. نظام الكتابة عند السكرول
// ==========================================
function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = '<span class="cursor-blink"></span>';
    const timer = setInterval(() => {
        element.innerHTML = text.substring(0, i) + '<span class="cursor-blink"></span>';
        i++;
        if (i > text.length) {
            clearInterval(timer);
            element.innerHTML = text;
        }
    }, speed);
}

function triggerTyping(element) {
    if (element.classList.contains('typed-done')) return;
    element.classList.add('typed-done');
    const originalText = element.getAttribute('data-text') || element.innerText;
    if (!element.getAttribute('data-text')) element.setAttribute('data-text', originalText); 
    element.innerText = ''; 
    let speed = 40;
    if (element.classList.contains('type-para')) speed = 20;
    if (element.classList.contains('type-head')) speed = 50;
    typeWriter(element, originalText, speed);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const elementsToType = entry.target.querySelectorAll('.type-head, .type-sub, .type-para');
            elementsToType.forEach((el, index) => {
                setTimeout(() => triggerTyping(el), index * 200); 
            });
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('section').forEach(section => observer.observe(section));


// ==========================================
// 6. إعدادات Three.js (المجسمات)
// ==========================================
window.addEventListener('load', () => {
    
    // --- دالة إنشاء المشهد ---
    function createScene(containerId, buildModelCallback, isInteractive = false) {
        const container = document.getElementById(containerId);
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.04);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 6;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); 
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const light1 = new THREE.PointLight(0xffffff, 1.5, 30); light1.position.set(5, 5, 5); scene.add(light1);
        const light2 = new THREE.PointLight(0x888888, 1, 30); light2.position.set(-5, -5, 5); scene.add(light2);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1); rimLight.position.set(0, 0, -10); scene.add(rimLight);

        // جزيئات خلفية
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(800 * 3);
        for(let i=0; i < 800 * 3; i++) { starPositions[i] = (Math.random() - 0.5) * 50; }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x444444, size: 0.08, transparent: true, opacity: 0.6 }));
        scene.add(stars);

        const model = buildModelCallback();
        scene.add(model);

        function animate() {
            requestAnimationFrame(animate);
            stars.rotation.y += 0.0005;
            if (model && !isInteractive) model.position.y = Math.sin(Date.now() * 0.001) * 0.2; // طفو للمجسمات العادية
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        return { scene, camera, renderer, controls, model };
    }

    // --- 1. بلورة الكوارتز ---
    createScene('canvas-hero', () => {
        const geo = new THREE.IcosahedronGeometry(2.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1.0 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff })));
        return mesh;
    });

    // --- 2. الشبكة الذرية ---
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

    // --- 3. الأنظمة البلورية ---
    createScene('canvas-systems', () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x7a8a99, metalness: 0.7, roughness: 0.4 }); 
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), mat); cube.position.x = -3; group.add(cube);
        const tetragonal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), mat); tetragonal.position.x = 0; group.add(tetragonal);
        const hex = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.5, 6), mat); hex.position.x = 3; group.add(hex);
        return group;
    });

    // --- 4. التناظر ---
    createScene('canvas-symmetry', () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, metalness: 0.1, transmission: 0.9 })));
        const points = [new THREE.Vector3(-2.5,0,0), new THREE.Vector3(2.5,0,0), new THREE.Vector3(0,-2.5,0), new THREE.Vector3(0,2.5,0), new THREE.Vector3(0,0,-2.5), new THREE.Vector3(0,0,2.5)];
        group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff })));
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ color: 0x4a3b5c, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        plane.rotation.y = Math.PI / 4; group.add(plane);
        return group;
    });

    // --- 5. الخصائص ---
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

    // ==========================================
    // 7. مقياس موس التفاعلي 3D
    // ==========================================
    const mohsModels = []; // لحفظ الأشكال المختلفة
    let mohsGroup = new THREE.Group();
    
    const mohsSceneObj = createScene('canvas-mohs', () => {
        return mohsGroup;
    }, true);

    // دالة تغيير الشكل بناءً على الزر
    function changeMohsModel(index) {
        // مسح المجسم القديم
        while(mohsGroup.children.length > 0) { mohsGroup.remove(mohsGroup.children[0]); }
        
        let newMesh;
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.9 });

        // بناء الشكل حسب الدرجة
        switch(index) {
            case 0: // تلك (ناعم جداً)
                newMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshStandardMaterial({color: 0x555555, roughness: 1}));
                break;
            case 1: // ظفر
                newMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32), new THREE.MeshStandardMaterial({color: 0x999999, roughness: 0.5}));
                newMesh.rotation.x = Math.PI / 2;
                break;
            case 2: // نحاس (عملة)
                newMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32), new THREE.MeshStandardMaterial({color: 0xb08d57, metalness: 0.9, roughness: 0.3}));
                newMesh.rotation.x = Math.PI / 2;
                break;
            case 3: // زجاج
                newMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.1), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.3, transmission: 0.9}));
                break;
            case 4: // ألماس
                newMesh = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05, transparent: true, opacity: 0.9, clearcoat: 1.0 }));
                newMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(newMesh.geometry), new THREE.LineBasicMaterial({ color: 0xffffff })));
                break;
        }
        
        mohsGroup.add(newMesh);
        // إعطاء المجسم حركة دوران مستمرة
        newMesh.rotation.y = 0.5;
    }

    // تفعيل الأزرار
    const mohsButtons = document.querySelectorAll('.scale-item');
    mohsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            mohsButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            changeMohsModel(parseInt(btn.getAttribute('data-index')));
        });
    });
    // تشغيل الأولى تلقائياً
    changeMohsModel(4); // الألماس
    
    // إضافة دوران للمجسم في قسم مقياس موس
    function animateMohs() {
        requestAnimationFrame(animateMohs);
        if (mohsGroup.children.length > 0) {
            mohsGroup.children[0].rotation.y += 0.01;
            mohsGroup.children[0].rotation.x += 0.005;
        }
    }
    animateMohs();


    // ==========================================
    // 8. الاختبار التفاعلي 3D (Quiz)
    // ==========================================
    const quizQuestions = [
        { q: "أي المعادن التالية يخدش الزجاج؟", options: ["التلك", "الألماس", "الذهب"], correct: 1 },
        { q: "ما هو المعدن الذي له بناء ذري مكعب؟", options: ["الكوارتز", "الهاليت", "الزركون"], correct: 1 }
    ];
    let currentQuizIndex = 0;

    const quizSceneObj = createScene('canvas-quiz', () => {
        const group = new THREE.Group();
        const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        
        // إنشاء 3 مكعبات
        for(let i=0; i<3; i++) {
            const mat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.x = (i - 1) * 2.5; // توزيعهم بجانب بعض
            cube.userData = { index: i }; // لحفظ رقم المكعب
            group.add(cube);
        }
        return group;
    }, true);

    // إعداد Raycaster للتفاعل مع المكعبات
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function loadQuiz() {
        if(currentQuizIndex >= quizQuestions.length) {
            document.getElementById('quiz-question').innerText = "أحسنت! لقد أكملت التحدي بنجاح.";
            quizSceneObj.model.children.forEach(c => c.material.color.setHex(0x222222));
            return;
        }
        
        const q = quizQuestions[currentQuizIndex];
        document.getElementById('quiz-question').innerText = q.q;
        
        // إعادة تعيين ألوان المكعبات
        quizSceneObj.model.children.forEach((cube, i) => {
            cube.material.color.setHex(0x333333);
            cube.position.y = 0;
            // كتابة الخيارات على المكعبات (سنستخدم خاصية الـ User Data لحفظ الخيار)
            cube.userData.text = q.options[i];
        });
    }
    loadQuiz();

    // حدث الضغط بالماوس للتفاعل مع المكعبات
    document.getElementById('canvas-quiz').addEventListener('click', (e) => {
        // حساب موقع الماوس
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, quizSceneObj.camera);
        const intersects = raycaster.intersectObjects(quizSceneObj.model.children);

        if (intersects.length > 0) {
            const clickedCube = intersects[0].object;
            const selectedIndex = clickedCube.userData.index;
            
            if (selectedIndex === quizQuestions[currentQuizIndex].correct) {
                // إجابة صحيحة
                clickedCube.material.color.setHex(0xffffff); // يضيء أبيض
                playSound('click');
                setTimeout(() => {
                    currentQuizIndex++;
                    loadQuiz();
                }, 1000);
            } else {
                // إجابة خاطئة
                clickedCube.material.color.setHex(0x111111); // يغمق
                clickedCube.position.y = -1; // يهبط
                playSound('hover'); // صوت خطأ
            }
        }
    });
});