// ==========================================
// 1. إخفاء شاشة التحميل (تم إصلاح المشكلة هنا)
// ==========================================
// بدل ما ننتظر تحميل كل شيء، نخفي الشاشة بعد ثانيتين من فتح الموقع
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // تشغيل كتابة النص في الواجهة الرئيسية
            const heroElements = document.querySelectorAll('#hero .type-head, #hero .type-sub, #hero .type-para');
            heroElements.forEach((el, index) => setTimeout(() => triggerTyping(el), index * 300));
        }, 800);
    }
}, 2000);

// ==========================================
// 2. الأصوات
// ==========================================
let audioCtx;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'hover') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
}
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('mousemove', initAudio, { once: true });

// ==========================================
// 3. شريط التقدم
// ==========================================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';
});

// ==========================================
// 4. المؤشر المخصص
// ==========================================
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
document.querySelectorAll('a, button, .scale-item, .option-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); playSound('hover'); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    el.addEventListener('click', () => playSound('click'));
});

// ==========================================
// 5. نظام الكتابة
// ==========================================
function typeWriter(element, text, speed) {
    let i = 0; element.innerHTML = '<span class="cursor-blink"></span>';
    const timer = setInterval(() => {
        element.innerHTML = text.substring(0, i) + '<span class="cursor-blink"></span>';
        i++;
        if (i > text.length) { clearInterval(timer); element.innerHTML = text; }
    }, speed);
}
function triggerTyping(element) {
    if (element.classList.contains('typed-done')) return;
    element.classList.add('typed-done');
    const originalText = element.getAttribute('data-text') || element.innerText;
    if (!element.getAttribute('data-text')) element.setAttribute('data-text', originalText); 
    element.innerText = ''; 
    let speed = element.classList.contains('type-para') ? 20 : 50;
    typeWriter(element, originalText, speed);
}
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.type-head, .type-sub, .type-para').forEach((el, index) => setTimeout(() => triggerTyping(el), index * 200));
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('section').forEach(section => observer.observe(section));

// ==========================================
// 6. الوضع السينمائي
// ==========================================
document.getElementById('cinematic-btn').addEventListener('click', () => {
    document.body.classList.toggle('cinematic');
});

// ==========================================
// 7. نافذة هل تعلم
// ==========================================
const facts = [
    "الألماس هو أقسى مادة طبيعية على وجه الأرض، ويتكون من الكربون فقط!",
    "المعدن الوحيد الذي يوجد في الطبيعة في حالته السائلة هو الزئبق.",
    "الذهب لا يصدأ أبداً، ولهذا يستخدم في صناعة المجوهرات منذ آلاف السنين.",
    "بلورات الكوارتز تستخدم في صناعة الساعات لأنها تهتز بمعدل ثابت.",
    "ملح الطعام (الهاليت) يتبلور على شكل مكعبات بسبب ترتيب ذراته."
];
document.getElementById('fact-btn').addEventListener('click', () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('fact-text').innerText = randomFact;
    document.getElementById('fact-modal').classList.add('show');
});
document.getElementById('close-fact').addEventListener('click', () => {
    document.getElementById('fact-modal').classList.remove('show');
});

// ==========================================
// 8. إعدادات Three.js (3D)
// ==========================================
// ننتظر تحميل الصفحة بالكامل عشان نبدأ الـ 3D
window.addEventListener('load', () => {
    function createScene(containerId, buildModelCallback, isInteractive = false) {
        const container = document.getElementById(containerId);
        if(!container) return; // تأمين
        const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050505, 0.04);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.z = 6;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(window.devicePixelRatio); container.appendChild(renderer.domElement);
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.enableZoom = false; controls.enablePan = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const light1 = new THREE.PointLight(0xffffff, 1.5, 30); light1.position.set(5,5,5); scene.add(light1);
        const light2 = new THREE.PointLight(0x888888, 1, 30); light2.position.set(-5,-5,5); scene.add(light2);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1); rimLight.position.set(0,0,-10); scene.add(rimLight);

        const starGeo = new THREE.BufferGeometry(); const starPositions = new Float32Array(800 * 3);
        for(let i=0; i < 800 * 3; i++) { starPositions[i] = (Math.random() - 0.5) * 50; }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x444444, size: 0.08, transparent: true, opacity: 0.6 })); scene.add(stars);

        const model = buildModelCallback(); scene.add(model);
        function animate() {
            requestAnimationFrame(animate); stars.rotation.y += 0.0005;
            if (model && !isInteractive) model.position.y = Math.sin(Date.now() * 0.001) * 0.2;
            controls.update(); renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
        return { scene, camera, renderer, controls, model };
    }

    // 1. بلورة
    createScene('canvas-hero', () => {
        const geo = new THREE.IcosahedronGeometry(2.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1.0 });
        const mesh = new THREE.Mesh(geo, mat); mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff }))); return mesh;
    });

    // 2. الشبكة الذرية
    createScene('canvas-concept', () => {
        const group = new THREE.Group(); const sphereGeo = new THREE.SphereGeometry(0.25, 32, 32); const sphereMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
        for(let x=-1; x<=1; x+=2) for(let y=-1; y<=1; y+=2) for(let z=-1; z<=1; z+=2) { const s = new THREE.Mesh(sphereGeo, sphereMat); s.position.set(x*1.5, y*1.5, z*1.5); group.add(s); }
        group.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true, transparent: true, opacity: 0.4 }))); return group;
    });

    // 3. الأنظمة البلورية
    let systemModels = [];
    const systemsScene = createScene('canvas-systems', () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x7a8a99, metalness: 0.6, roughness: 0.5 }); 
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), mat); cube.position.x = -3; cube.userData = { name: "النظام المكعب", info: "محاور متساوية ومتعامدة. (مثال: ملح الهاليت)" }; group.add(cube); systemModels.push(cube);
        const tetragonal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), mat); tetragonal.position.x = 0; tetragonal.userData = { name: "النظام الرباعي", info: "محوران متساويان والثالث مختلف. (مثال: الزركون)" }; group.add(tetragonal); systemModels.push(tetragonal);
        const hex = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.5, 6), mat); hex.position.x = 3; hex.userData = { name: "النظام السداسي", info: "محاور أفقية بزوايا 120 درجة. (مثال: الكوارتز)" }; group.add(hex); systemModels.push(hex);
        return group;
    }, true);

    const holoRingGeo = new THREE.RingGeometry(1.5, 1.8, 32);
    const holoRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5, wireframe: true });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = -Math.PI / 2; holoRing.position.y = -2; holoRing.visible = false;
    systemsScene.scene.add(holoRing);

    const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
    document.getElementById('canvas-systems').addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, systemsScene.camera);
        const intersects = raycaster.intersectObjects(systemModels);
        
        if (intersects.length > 0) {
            playSound('click');
            const clicked = intersects[0].object;
            holoRing.visible = true;
            holoRing.position.x = clicked.position.x;
            document.getElementById('hologram-info').style.display = 'block';
            document.getElementById('holo-title').innerText = clicked.userData.name;
            document.getElementById('holo-text').innerText = clicked.userData.info;
            document.getElementById('system-desc').innerText = "تم تحديد المعدن!";
        }
    });

    function animateHolo() {
        requestAnimationFrame(animateHolo);
        if(holoRing.visible) { holoRing.rotation.z += 0.02; holoRing.position.y = -2 + Math.sin(Date.now() * 0.005) * 0.1; }
    }
    animateHolo();

    // 4. التناظر
    createScene('canvas-symmetry', () => {
        const group = new THREE.Group(); group.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, metalness: 0.1, transmission: 0.9 })));
        const points = [new THREE.Vector3(-2.5,0,0), new THREE.Vector3(2.5,0,0), new THREE.Vector3(0,-2.5,0), new THREE.Vector3(0,2.5,0), new THREE.Vector3(0,0,-2.5), new THREE.Vector3(0,0,2.5)];
        group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff })));
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ color: 0x4a3b5c, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        plane.rotation.y = Math.PI / 4; group.add(plane); return group;
    });

    // 5. الخصائص
    let propModel, propMaterial; 
    createScene('canvas-properties', () => {
        propMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, flatShading: true, roughness: 0.9, metalness: 0.1 });
        propModel = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 0), propMaterial); return propModel;
    });

    const colors = [0x666666, 0xb08d57, 0x4a607a, 0x7a4a4a, 0x4a7a5a];
    let colorIndex = 0;
    document.getElementById('change-prop').addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length; propMaterial.color.setHex(colors[colorIndex]);
        if(colorIndex === 1) { propMaterial.metalness = 1; propMaterial.roughness = 0.2; } else { propMaterial.metalness = 0.1; propMaterial.roughness = 0.8; }
        propModel.scale.set(1.1, 1.1, 1.1); setTimeout(() => propModel.scale.set(1,1,1), 200);
    });

    // 6. مقياس موس
    let mohsGroup = new THREE.Group(); createScene('canvas-mohs', () => { return mohsGroup; }, true);
    function changeMohsModel(index) {
        while(mohsGroup.children.length > 0) { mohsGroup.remove(mohsGroup.children[0]); }
        let newMesh; const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.9 });
        switch(index) {
            case 0: newMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshStandardMaterial({color: 0x555555, roughness: 1})); break;
            case 1: newMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32), new THREE.MeshStandardMaterial({color: 0x999999, roughness: 0.5})); newMesh.rotation.x = Math.PI / 2; break;
            case 2: newMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32), new THREE.MeshStandardMaterial({color: 0xb08d57, metalness: 0.9})); newMesh.rotation.x = Math.PI / 2; break;
            case 3: newMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.1), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.3, transmission: 0.9})); break;
            case 4: newMesh = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05, transparent: true, opacity: 0.9 })); newMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(newMesh.geometry), new THREE.LineBasicMaterial({ color: 0xffffff }))); break;
        }
        mohsGroup.add(newMesh); newMesh.rotation.y = 0.5;
    }
    document.querySelectorAll('.scale-item').forEach(btn => {
        btn.addEventListener('click', () => { document.querySelectorAll('.scale-item').forEach(b => b.classList.remove('active')); btn.classList.add('active'); changeMohsModel(parseInt(btn.getAttribute('data-index'))); });
    });
    changeMohsModel(4); 
    function animateMohs() { requestAnimationFrame(animateMohs); if (mohsGroup.children.length > 0) mohsGroup.children[0].rotation.y += 0.01; } animateMohs();
});

// ==========================================
// 9. الاختبار
// ==========================================
const quizData = [
    { question: "أي المعادن التالية يعتبر الأقسى ويخدش الزجاج؟", options: ["التلك", "الألماس", "الذهب", "الكوارتز"], correct: 1 },
    { question: "ما هي الخاصية التي تعبر عن لون مسحوق المعدن؟", options: ["البريق", "القساوة", "الحكاكة", "الانفصام"], correct: 2 },
    { question: "ماذا نسمي المادة الصلبة الطبيعية التي لها بناء ذري منتظم؟", options: ["الصخر", "البلورة", "المعدن", "التربة"], correct: 2 },
    { question: "أي من الأنظمة البلورية التالية يشبه شكل مكعب؟", options: ["السداسي", "الرباعي", "المكعب", "المائل"], correct: 2 },
    { question: "ما هو المعدن الذي يأتي في المرتبة الأولى في مقياس موس للقساوة؟", options: ["التلك", "الجبس", "الكالسيت", "الألماس"], correct: 3 }
];
let currentQuestionIndex = 0; let score = 0;
const questionText = document.getElementById('question-text'); const optionsContainer = document.getElementById('options-container');
const scoreArea = document.getElementById('score-area'); const finalScore = document.getElementById('final-score'); const overlay = document.getElementById('feedback-overlay');

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) { document.getElementById('question-area').style.display = 'none'; scoreArea.style.display = 'block'; finalScore.innerText = `${score} / ${quizData.length}`; return; }
    const currentQ = quizData[currentQuestionIndex]; questionText.innerText = currentQ.question; optionsContainer.innerHTML = '';
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button'); btn.classList.add('option-btn'); btn.innerText = option;
        btn.addEventListener('click', () => checkAnswer(index, btn)); optionsContainer.appendChild(btn);
    });
}
function checkAnswer(selectedIndex, btnElement) {
    const currentQ = quizData[currentQuestionIndex];
    if (selectedIndex === currentQ.correct) {
        score++; overlay.classList.add('show'); playSound('click');
        setTimeout(() => { overlay.classList.remove('show'); currentQuestionIndex++; setTimeout(loadQuestion, 300); }, 1500); 
    } else {
        btnElement.style.borderColor = '#ff0000'; btnElement.style.color = '#ff0000';
        setTimeout(() => { btnElement.style.borderColor = '#444'; btnElement.style.color = '#fff'; }, 500);
    }
}
loadQuestion();

// التنقل
document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); document.querySelectorAll('#sidebar a').forEach(l => l.classList.remove('active')); link.classList.add('active'); });
});