// ==========================================
// 1. برمجة شاشة التحميل (Loading Screen)
// ==========================================
let progress = 0;
const progressBar = document.querySelector('.progress');
const loader = document.getElementById('loader');

// محاكاة حركة التحميل
const loadingInterval = setInterval(() => {
    progress += Math.random() * 8; // زيادة عشوائية عشان تطلع طبيعية
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // إخفاء الشاشة بعد اكتمال 100%
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none'; // إزالة الشاشة نهائياً
            }, 500); // وقت التلاشي
        }, 400);
    }
    progressBar.style.width = `${progress}%`;
}, 100);


// ==========================================
// 2. برمجة المجسم ثلاثي الأبعاد (Three.js)
// ==========================================
// التأكد من تحميل المكتبة
window.addEventListener('load', () => {
    const container = document.getElementById('canvas-container');

    // إنشاء المشهد
    const scene = new THREE.Scene();

    // إعداد الكاميرا
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    // إعداد المحرك (Renderer)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // إنشاء الشكل الهندسي (بلورة - Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2.5, 0); 
    
    // خصائص الشكل (شبكي وتوهج)
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00E5FF, 
        wireframe: true, 
        transparent: true,
        opacity: 0.6
    });
    
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // إضافة إضاءة للمشهد
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00E5FF, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // حركة الماوس لتدوير المجسم
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // حركة الرسم (Animation Loop)
    function animate() {
        requestAnimationFrame(animate);
        
        // دوران تلقائي هادئ
        crystal.rotation.x += 0.001;
        crystal.rotation.y += 0.002;

        // تفاعل بسيط مع الماوس
        crystal.rotation.y += mouseX * 0.005;
        crystal.rotation.x += mouseY * 0.005;

        renderer.render(scene, camera);
    }
    animate();

    // تحديث حجم الشاشة
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});


// ==========================================
// 3. برمجة زر "ابدأ الاستكشاف"
// ==========================================
document.getElementById('explore-btn').addEventListener('click', () => {
    document.getElementById('section2').scrollIntoView({ behavior: 'smooth' });
});