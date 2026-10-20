* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Cairo', sans-serif;
    cursor: none; 
}

:root {
    --bg-color: #050505;
    --section-bg: #111111;
    --text-color: #ffffff;
    --text-muted: #888888;
    --border-color: #333333;
    --font-mono: 'Share Tech Mono', monospace;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    overflow-x: hidden;
    scroll-behavior: smooth;
}

/* --- المؤشر المخصص --- */
.cursor {
    width: 15px; height: 15px; border: 2px solid #fff; border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9999;
    transition: transform 0.1s ease, background-color 0.2s ease;
    transform: translate(-50%, -50%); mix-blend-mode: difference;
}
.cursor.hover { transform: translate(-50%, -50%) scale(1.5); background-color: #fff; border-color: transparent; }

/* --- شاشة التحميل --- */
#loader {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    background-color: #000; display: flex; justify-content: center; align-items: center;
    z-index: 10000; transition: opacity 0.8s ease;
}
.loader-content { text-align: center; }
.loader-content h2 { font-size: 2.5rem; color: #fff; margin-bottom: 20px; letter-spacing: 5px; font-family: var(--font-mono); }
.loader-content p { font-size: 1rem; color: var(--text-muted); margin-top: 20px; letter-spacing: 1px; }
.spinner {
    width: 50px; height: 50px; border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #ffffff; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- شريط التنقل --- */
#sidebar { position: fixed; right: 25px; top: 50%; transform: translateY(-50%); z-index: 100; }
#sidebar ul { list-style: none; display: flex; flex-direction: column; gap: 15px; }
#sidebar a {
    display: flex; justify-content: center; align-items: center;
    width: 35px; height: 35px; border-radius: 50%;
    background: transparent; color: #666; text-decoration: none;
    font-size: 0.9rem; font-weight: bold; transition: 0.3s; border: 1px solid var(--border-color);
    font-family: var(--font-mono);
}
#sidebar a:hover, #sidebar a.active { background: #fff; color: #000; border-color: #fff; }

/* --- الأقسام --- */
section {
    min-height: 100vh; width: 100%; position: relative;
    display: flex; align-items: center; /* التعديل هنا: توسيط عمودي */
    padding: 50px; border-bottom: 1px solid var(--border-color);
}
.section-dark { background-color: var(--section-bg); }

/* --- كروت النصوص (تم تعديل مكانها لتكون على اليمين ولا تغطي المجسم) --- */
.content { 
    z-index: 10; max-width: 450px; /* تصغير العرض */
    pointer-events: none; 
    background: rgba(10, 10, 10, 0.8); padding: 30px; border-radius: 12px; 
    border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); 
    position: absolute; right: 10%; /* نقلها لليمين */
    text-align: right; /* محاذاة النص لليمين */
}

.content h1 { font-size: 3.5rem; margin-bottom: 10px; color: #fff; font-weight: 700; }
.content h2 { font-size: 2rem; color: #fff; margin-bottom: 15px; font-weight: 700; }
.content h3 { font-size: 1rem; color: var(--text-muted); margin-bottom: 20px; font-family: var(--font-mono); letter-spacing: 2px; }
.content p { font-size: 1.1rem; line-height: 1.8; color: #ccc; margin-bottom: 10px; }
.content strong { color: #fff; }

/* --- تأثير الكتابة --- */
.type-head, .type-sub, .type-para { opacity: 1; }
.cursor-blink { display: inline-block; width: 2px; height: 1.2rem; background: #fff; animation: blink 0.8s infinite; vertical-align: middle; margin-right: 2px; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.canvas-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }

/* زر القسم 5 */
button#change-prop, .btn {
    margin-top: 20px; padding: 10px 25px; background: transparent;
    color: #fff; border: 1px solid #555; border-radius: 6px; font-size: 1rem; font-weight: bold; transition: 0.3s; pointer-events: auto;
}
button#change-prop:hover, .btn:hover { background: #fff; color: #000; }

/* مقياس موس */
.mohs-scale { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-start; flex-wrap: wrap; pointer-events: auto; }
.scale-item {
    background: #000; padding: 12px 15px; border-radius: 8px; font-size: 0.85rem;
    border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; color: var(--text-muted); transition: 0.3s; cursor: none;
}
.scale-item:hover { border-color: #fff; color: #fff; transform: scale(1.05); }
.scale-item.active { background: #fff; color: #000; border-color: #fff; }
.scale-item span { font-size: 1.5rem; font-weight: bold; color: #fff; font-family: var(--font-mono); }
.scale-item.active span { color: #000; }

/* ==========================================
   تنسيقات قسم الاختبار (Quiz)
   ========================================== */
#quiz { flex-direction: column; justify-content: center; }
.quiz-container {
    z-index: 10; width: 100%; max-width: 700px;
    background: rgba(10, 10, 10, 0.9); padding: 40px; border-radius: 15px;
    border: 1px solid var(--border-color); text-align: center;
}
.quiz-container h2 { font-size: 2rem; margin-bottom: 30px; color: #fff; }

.options { display: flex; flex-direction: column; gap: 15px; }
.option-btn {
    background: #111; color: #fff; border: 1px solid #444;
    padding: 15px 20px; font-size: 1.2rem; border-radius: 8px;
    transition: 0.3s; font-weight: bold; cursor: none;
}
.option-btn:hover { background: #333; border-color: #fff; }

#score-area h1 { font-size: 5rem; color: #fff; margin: 20px 0; font-family: var(--font-mono); }

/* شاشة "صح" الكبيرة */
#feedback-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    background: rgba(0, 0, 0, 0.95); /* خلفية سوداء */
    display: flex; justify-content: center; align-items: center;
    z-index: 99999; opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
}
#feedback-overlay.show { opacity: 1; pointer-events: auto; }
#feedback-overlay h1 {
    font-size: 15rem; color: #ffffff; /* كلمة صح بيضاء على خلفية سوداء */
    font-weight: 700; transform: scale(0.5);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* تأثير ارتداد */
}
#feedback-overlay.show h1 { transform: scale(1); }

/* تصغير الخطوط للجوال */
@media (max-width: 768px) {
    section { justify-content: center; align-items: flex-end; padding-bottom: 20px; }
    .content { 
        position: relative; right: 0; max-width: 100%; 
        margin-top: 50vh; text-align: center; padding: 20px; 
    }
    .mohs-scale { justify-content: center; }
    #sidebar { right: 10px; }
    #sidebar a { width: 25px; height: 25px; font-size: 0.7rem; }
    .cursor { display: none; }
    #feedback-overlay h1 { font-size: 8rem; }
}