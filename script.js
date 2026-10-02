// Shivam Kumar Portfolio — verified-data interaction layer

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 350);
});

// Lightweight optional sound effects
class SoundFX {
    constructor() {
        this.enabled = localStorage.getItem('soundFXEnabled') === 'true';
        this.ctx = null;
        this.button = document.getElementById('soundToggleBtn');
        this.icon = document.getElementById('soundIcon');
        this.sync();
        if (this.button) this.button.addEventListener('click', () => {
            this.enabled = !this.enabled;
            localStorage.setItem('soundFXEnabled', String(this.enabled));
            this.sync();
            if (this.enabled) this.play('pop');
        });
    }
    sync() {
        if (!this.button || !this.icon) return;
        this.button.classList.toggle('sound-on', this.enabled);
        this.icon.className = this.enabled ? 'fas fa-volume-high' : 'fas fa-volume-mute';
    }
    play(type = 'click') {
        if (!this.enabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.ctx) this.ctx = new AudioContext();
            if (this.ctx.state === 'suspended') this.ctx.resume();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = type === 'success' ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(type === 'pop' ? 660 : 520, now);
            osc.frequency.exponentialRampToValueAtTime(type === 'pop' ? 900 : 300, now + 0.07);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (_) {}
    }
}
const sfx = new SoundFX();

// Theme switcher
const themeNames = {
    cyber: 'Cyber Indigo',
    sapphire: 'Midnight Sapphire',
    emerald: 'Emerald Aurora',
    sunset: 'Sunset Pulse',
    matrix: 'Neon Matrix',
    amethyst: 'Amethyst Twilight'
};
const themeSwitcher = document.getElementById('themeSwitcher');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeCurrentName = document.querySelector('.theme-current-name');
const themeOpts = document.querySelectorAll('.theme-opt');

function setTheme(name) {
    const theme = themeNames[name] ? name : 'cyber';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolioTheme', theme);
    themeOpts.forEach(opt => opt.classList.toggle('active', opt.dataset.theme === theme));
    if (themeCurrentName) themeCurrentName.textContent = themeNames[theme];
}
setTheme(localStorage.getItem('portfolioTheme') || 'cyber');

if (themeToggleBtn && themeSwitcher) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfx.play();
        themeSwitcher.classList.toggle('open');
    });
    themeOpts.forEach(opt => opt.addEventListener('click', (e) => {
        e.stopPropagation();
        setTheme(opt.dataset.theme);
        themeSwitcher.classList.remove('open');
        sfx.play('pop');
    }));
    document.addEventListener('click', () => themeSwitcher.classList.remove('open'));
}

// Scroll progress + active navigation
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (scrollProgress) scrollProgress.style.width = max > 0 ? (scrollY / max) * 100 + '%' : '0%';
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 150) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
}, {passive: true});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
function openMobileMenu() {
    if (!mobileMenu || !mobileMenuOverlay) return;
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuOverlay) return;
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMobileMenu));

// Particle background
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    addEventListener('resize', resize);
    const count = Math.min(60, Math.max(24, Math.floor(innerWidth / 24)));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 1.5 + 0.5
        });
    }
    addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, {passive:true});
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,.32)'; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
                const d = Math.hypot(dx, dy);
                if (d < 105) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - d / 105)})`;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Hero typing effect uses only skills/projects actually represented in the repo
const typing = document.getElementById('typingText');
if (typing) {
    const words = ['Real GitHub Projects', 'Full-Stack Applications', 'Responsive Web Interfaces', 'Dashboards & APIs'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
        const word = words[wi];
        typing.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
        if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1400); return; }
        if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, deleting ? 55 : 105);
    };
    setTimeout(tick, 700);
}

// Tilt cards
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -8;
        const ry = ((x - r.width / 2) / r.width) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

<<<<<<< HEAD
// Interactive Terminal CLI
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const termBtns = document.querySelectorAll('.term-btn');

const terminalCommands = {
    help: 'Commands: <span class="term-cmd">finance</span>, <span class="term-cmd">student</span>, <span class="term-cmd">skills</span>, <span class="term-cmd">projects</span>, <span class="term-cmd">education</span>, <span class="term-cmd">contact</span>, <span class="term-cmd">about</span>, <span class="term-cmd">resume</span>, <span class="term-cmd">theme [name]</span>, <span class="term-cmd">clear</span>',
    finance: 'LAUNCH_FINANCE',
    student: 'LAUNCH_STUDENT',
    skills: '⚡ Core Stack: React.js, Next.js, Node.js, TypeScript, Python, Express.js, MongoDB, PostgreSQL, Supabase, REST APIs, Tailwind CSS',
    projects: '🚀 Featured: (1) Finova Pro Personal Finance, (2) Student Dashboard, (3) CertiVerify OCR Verification, (4) Job Listing Platform, (5) Flight Booker, (6) IBVAP Video Analytics',
    education: '🎓 B.Tech in CSE (Uttarakhand Technical University, 2024-2027) | Diploma in CSE (State Board of Tech University, Bihar, 2020-2023) | 🏆 Best Student of the Dept (2023)',
    contact: '📧 shivamsharmakr04@gmail.com | 📞 +91 9771050501 | 📍 Dehradun, Uttarakhand, India | 💼 in/shivam-sharmakr',
    about: '👨‍💻 Shivam Kumar — Full Stack Developer dedicated to crafting responsive, high-performance web apps, REST APIs, and interactive dashboards.',
    resume: 'DOWNLOAD_RESUME',
    whoami: '👋 Hello Explorer! Welcome to Shivam Kumar\'s developer workstation.',
    date: () => `📅 Current Time: ${new Date().toLocaleString()}`,
    sudo: '🔒 Nice try! Access granted to view all projects without admin credentials.',
    clear: 'CLEAR'
};

function executeCommand(cmdRaw) {
    const cmdClean = cmdRaw.trim().toLowerCase();
    if (!cmdClean) return;

    sfx.play('pop');

    if (cmdClean === 'clear') {
        if (terminalOutput) terminalOutput.innerHTML = '';
        return;
    }

    if (cmdClean === 'finance') {
        openProjectModal('finance-dashboard');
        return;
    }

    if (cmdClean === 'student') {
        openProjectModal('student-dashboard');
        return;
    }

    if (cmdClean === 'resume') {
        window.open('Shivam_Kumar_Resume.pdf', '_blank');
        showToast('Opening Shivam Kumar Resume...', 'fas fa-file-pdf');
        return;
    }

    let response = typeof terminalCommands[cmdClean] === 'function' 
        ? terminalCommands[cmdClean]() 
        : terminalCommands[cmdClean];

    // Theme command processor
    if (cmdClean.startsWith('theme')) {
        const parts = cmdClean.split(' ');
        if (parts.length > 1 && themeNames[parts[1]]) {
            setTheme(parts[1]);
            response = `✔ Theme successfully changed to <span class="term-cmd">${themeNames[parts[1]]}</span>!`;
        } else {
            response = `Usage: theme [cyber | sapphire | emerald | sunset | matrix | amethyst]`;
        }
    }

    if (!response) {
        response = `Command not found: "${cmdClean}". Type <span class="term-cmd">help</span> for interactive options.`;
    }

    if (terminalOutput) {
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="terminal-prompt">shivam@portfolio:~$</span> ${cmdRaw}<br><span class="term-res">${response}</span>`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value;
        executeCommand(cmd);
        terminalInput.value = '';
=======
// Skills filters
const skillSearch = document.getElementById('skillSearchInput');
const skillClear = document.getElementById('clearSkillSearch');
const skillTabs = document.querySelectorAll('.skill-tab-btn');
const skillCards = document.querySelectorAll('.skill-card');
function filterSkills() {
    const q = skillSearch ? skillSearch.value.trim().toLowerCase() : '';
    const cat = document.querySelector('.skill-tab-btn.active')?.dataset.category || 'all';
    skillCards.forEach(card => {
        const matchesCat = cat === 'all' || card.dataset.cat === cat;
        const matchesText = !q || card.textContent.toLowerCase().includes(q);
        card.classList.toggle('filtered-out', !(matchesCat && matchesText));
>>>>>>> fd8285b3e3281b64d4d43fd98ce085782cc86cfa
    });
}
if (skillSearch) skillSearch.addEventListener('input', filterSkills);
if (skillClear) skillClear.addEventListener('click', () => { skillSearch.value = ''; filterSkills(); skillSearch.focus(); });
skillTabs.forEach(btn => btn.addEventListener('click', () => {
    skillTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterSkills();
}));

// Project filters
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
        if (show) card.style.animation = 'fadeIn .35s ease forwards';
    });
}));

// Journey tabs
const journeyTabs = document.querySelectorAll('.journey-tab-btn');
const journeyPanes = document.querySelectorAll('.journey-pane');
journeyTabs.forEach(btn => btn.addEventListener('click', () => {
    journeyTabs.forEach(b => b.classList.remove('active'));
    journeyPanes.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('pane-' + btn.dataset.tab)?.classList.add('active');
}));

// Verified project details — no simulated values, no invented live metrics
const projectData = {
    'finance-dashboard': {
<<<<<<< HEAD
        title: 'Finova Pro — Personal Finance Platform',
        subtitle: 'Full-Stack Personal Finance, Analytics & Forecasting Engine',
        img: 'assets/images/finance_dashboard.jpg',
        desc: 'Finova Pro is a comprehensive personal finance application covering income and expense transactions, budget planning, savings goals, recurring subscriptions, user authentication, financial analytics, data exports, and forecasting.',
        isSandbox: true,
        type: 'finance',
        features: [
            'Dynamic financial charts powered by Chart.js and Node.js REST API',
            'Transaction management with categories, income/expense breakdown, and search',
            'Budget tracking and savings goals with automated progress indicators',
            'Subscription monitoring and recurring bill alerts',
            'Secure user authentication with JWT, bcrypt password hashing, and role checks',
            'CSV/PDF summary export workflows and automated financial forecasting'
        ],
        github: 'https://github.com/shivamsharmakr04/finance-Dashboard'
    },
    'student-dashboard': {
        title: 'Student Dashboard — LMS & Academic Management',
        subtitle: 'Modern Student-Focused Platform with Realtime Sync & RLS',
        img: 'assets/images/student_dashboard.jpg',
        desc: 'A modern student-focused learning platform and dashboard built with Next.js and TypeScript, integrating Supabase Realtime, Row Level Security (RLS), and an Express API for course tracking, assignments, and GPA scenarios.',
        isSandbox: true,
        type: 'student',
        features: [
            'Interactive GPA scenario calculator to model quiz, exam, and project outcomes',
            'Course progression monitors across enrolled technical subjects',
            'Assignment priority checklist with status toggle and deadline alerts',
            'Realtime student data synchronization powered by Supabase Realtime & RLS',
            'Modern responsive UI engineered with Next.js 14, TypeScript, and Tailwind CSS',
            'Express backend API integration supporting academic analytics workflows'
        ],
        github: 'https://github.com/shivamsharmakr04/Student-Dashboard'
    },
    'certificate-verification': {
        title: 'CertiVerify — Certificate Verification & Fraud Detection',
        subtitle: 'OCR-Assisted Credential Verification with Student & Admin Portals',
        img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop',
        desc: 'A full-stack certificate verification platform designed to prevent credential fraud. Features student and admin portals, unique certificate IDs, authentication, document processing, OCR-assisted certificate inspection using Tesseract.js, and verification analytics.',
        features: [
            'OCR-assisted credential inspection extracting certificate metadata via Tesseract.js',
            'Public verification portal validating certificates by unique certificate ID',
            'Role-based access control with secure JWT authentication for students and admins',
            'Automated PDF certificate generation and secure download workflows',
            'Comprehensive audit logs and verification analytics dashboard',
            'Robust REST APIs built on Node.js, Express.js, and MongoDB'
        ],
        github: 'https://github.com/shivamsharmakr04/Certificate-verification-system'
    },
    'job-listing-app': {
        title: 'Job Listing Platform — Full-Stack Recruitment Portal',
        subtitle: 'Role-Based Authentication, Resume Uploads & Application Pipelines',
        img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
        desc: 'A full-stack job platform supporting candidate/admin authentication, job search and filtering, application tracking, user profiles, and resume/file upload workflows. Designed RESTful API workflows connecting the React frontend with Node.js/Express backend services.',
        features: [
            'Dedicated candidate and employer/admin workflows with JWT authentication',
            'Multi-filter job search by keyword, location, salary, experience, and category',
            'Resume and document upload management with secure file handling',
            'Application status tracking and candidate management pipeline for recruiters',
            'RESTful API architecture built with Express.js, Node.js, and MongoDB',
            'Responsive mobile-first user interface built with React.js and Vite'
        ],
        github: 'https://github.com/shivamsharmakr04/job-listing-app'
    },
    'flight-booker': {
        title: 'Flight Booker — Airline Reservation Engine',
        subtitle: 'Full-Stack Travel Booking, Interactive Seat Map & PDF Tickets',
        img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop',
        desc: 'Full-stack flight reservation application featuring flight search and filtering, interactive seat selection, passenger management, checkout flow, wallet workflow, booking history, JWT authentication, and server-side PDF ticket generation.',
        features: [
            'Dynamic flight route search with date pickers, price filters, and airline choices',
            'Interactive SVG aircraft seat map with real-time seat status and selection',
            'Multi-passenger management and custom wallet/checkout payment simulation',
            'Server-side automated PDF ticket generation with QR validation using PDFKit',
            'Booking history management with status tracking and ticket retrieval',
            'Secure JWT authentication and RESTful API endpoints on Node.js & Express'
        ],
=======
        title: 'Finova Pro — Personal Finance Dashboard',
        subtitle: 'Full-stack personal finance application',
        desc: 'A full-stack personal finance application for income and expense tracking, budgets, savings goals, subscriptions, visual insights, CSV export, JSON backup/restore, authentication, and WebSocket-based updates.',
        features: ['JWT authentication with bcryptjs', 'Transactions, budgets, savings goals and subscriptions', 'Chart.js financial visualizations', 'CSV export and JSON backup/restore', 'WebSocket communication', 'Node.js + Express backend'],
        github: 'https://github.com/shivamsharmakr04/finance-Dashboard'
    },
    'student-dashboard': {
        title: 'Student Dashboard',
        subtitle: 'Next.js + Supabase student management dashboard',
        desc: 'A full-stack student management dashboard with authenticated accounts, course progress, assignments, schedules, analytics, profile management and realtime data synchronization.',
        features: ['Next.js, React and TypeScript', 'Supabase Authentication', 'Supabase PostgreSQL, Realtime and Row Level Security', 'Express REST API', 'Courses, assignments, schedule and analytics modules', 'Responsive Tailwind CSS interface'],
        github: 'https://github.com/shivamsharmakr04/Student-Dashboard'
    },
    'certificate-verification': {
        title: 'CertiVerify — Certificate Verification Platform',
        subtitle: 'Certificate issuance and verification workflow',
        desc: 'A full-stack certificate verification system supporting unique certificate IDs, OCR-assisted image verification, student/admin portals, file ingestion, verification logs and PDF certificate generation.',
        features: ['React + Vite frontend', 'Node.js + Express backend', 'MongoDB + Mongoose', 'JWT + bcrypt authentication', 'Tesseract.js OCR integration', 'PDF and spreadsheet/file processing'],
        github: 'https://github.com/shivamsharmakr04/Certificate-verification-system'
    },
    'job-portal': {
        title: 'Job Listing Platform',
        subtitle: 'Full-stack recruitment portal',
        desc: 'A full-stack job portal supporting candidate authentication, job discovery, job posting, applications, candidate profiles, resume uploads and employer/admin workflows.',
        features: ['React + Vite frontend', 'Node.js + Express backend', 'MongoDB + Mongoose', 'JWT authentication', 'Resume/file upload handling with Multer', 'Job search, posting and application workflows'],
        github: 'https://github.com/shivamsharmakr04/job-listing-app'
    },
    'flight-booking': {
        title: 'Flight Booker',
        subtitle: 'Full-stack flight reservation application',
        desc: 'A flight reservation application covering search and filtering, interactive seat selection, passenger management, checkout flow, booking history, digital boarding passes and PDF ticket generation.',
        features: ['React + Vite frontend', 'Node.js + Express backend', 'Tailwind CSS responsive UI', 'JWT authentication', 'PDF ticket generation with PDFKit', 'Booking and passenger workflow'],
>>>>>>> fd8285b3e3281b64d4d43fd98ce085782cc86cfa
        github: 'https://github.com/shivamsharmakr04/flight-booker'
    },
    'ibvap': {
        title: 'IBVAP — Intelligent Border Video Analytics Platform',
<<<<<<< HEAD
        subtitle: 'Real-time Operator Console & FastAPI Video Analytics Prototype',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
        desc: 'A React/Vite operator console paired with a FastAPI backend for intelligent video analytics. Features camera grid monitors, zone definition, automated event detection, real-time alert delivery via WebSockets, and health monitoring.',
        features: [
            'Real-time camera feed grid monitoring and zone configuration views',
            'Automated alert dispatch and event notifications streaming over WebSockets',
            'Watchlist management and entity tracking operational console',
            'FastAPI backend with asynchronous event processing and health check endpoints',
            'PostgreSQL database persistence for event logs, alerts, and system telemetry',
            'Containerized architecture with Docker for reproducible deployment'
        ],
        github: 'https://github.com/shivamsharmakr04/IBVAP'
    }
};

// Aliases for backwards compatibility with legacy buttons
projectData['job-portal'] = projectData['job-listing-app'];
projectData['flight-booking'] = projectData['flight-booker'];
projectData['ai-code-assistant'] = projectData['ibvap'];

function renderSandbox(type) {
    if (type === 'finance') {
        return `
            <div class="modal-sandbox-container">
                <div class="sandbox-header">
                    <span class="sandbox-title"><i class="fas fa-chart-line text-success"></i> Finova Pro Live Sandbox Simulation</span>
                    <div class="sandbox-timeframe-picker">
                        <button class="tf-btn" data-tf="1d">1D</button>
                        <button class="tf-btn active" data-tf="1w">1W</button>
                        <button class="tf-btn" data-tf="1m">1M</button>
                        <button class="tf-btn" data-tf="1y">1Y</button>
                    </div>
                </div>
                <div class="finance-live-preview">
                    <div class="finance-metrics-grid">
                        <div class="f-metric-card">
                            <span>Portfolio Net Worth</span>
                            <strong id="finNetWorth" class="text-white">$148,250.00</strong>
                        </div>
                        <div class="f-metric-card">
                            <span>Period Return</span>
                            <strong id="finReturn" class="text-success">+8.40% (+$12,180)</strong>
                        </div>
                        <div class="f-metric-card">
                            <span>Risk Rating</span>
                            <strong class="text-accent">Moderate (Beta 0.88)</strong>
                        </div>
                    </div>
                    <div class="live-chart-canvas-wrap">
                        <svg viewBox="0 0 500 140" id="liveSvgChart">
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
                                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
                                </linearGradient>
                            </defs>
                            <path id="chartArea" d="M 0 100 Q 80 50 160 80 T 320 40 T 500 20 L 500 140 L 0 140 Z" fill="url(#chartGrad)"></path>
                            <path id="chartLine" d="M 0 100 Q 80 50 160 80 T 320 40 T 500 20" fill="none" stroke="#10b981" stroke-width="3"></path>
                        </svg>
                    </div>
                    <div class="stock-ticker-row">
                        <div class="ticker-pill"><i class="fab fa-bitcoin text-warning"></i> BTC: $71,450 <span class="text-success">+1.95%</span></div>
                        <div class="ticker-pill"><i class="fab fa-ethereum text-accent"></i> ETH: $3,520 <span class="text-success">+2.40%</span></div>
                        <div class="ticker-pill"><i class="fas fa-coins text-primary"></i> SOL: $154.20 <span class="text-danger">-0.80%</span></div>
                        <div class="ticker-pill"><i class="fab fa-apple text-white"></i> AAPL: $228.50 <span class="text-success">+0.65%</span></div>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'student') {
        return `
            <div class="modal-sandbox-container">
                <div class="sandbox-header">
                    <span class="sandbox-title"><i class="fas fa-graduation-cap text-accent"></i> Student Dashboard Interactive Simulation</span>
                    <span class="text-gray" style="font-size: 0.8rem;">Semester: Fall 2026</span>
                </div>
                <div class="student-live-preview">
                    <div class="student-course-selector">
                        <button class="course-tab-pill active" data-course="ds">Data Structures (78%)</button>
                        <button class="course-tab-pill" data-course="web">Web Development (92%)</button>
                        <button class="course-tab-pill" data-course="ui">UI/UX Design (65%)</button>
                        <button class="course-tab-pill" data-course="ai">Machine Learning (84%)</button>
                    </div>
                    <div class="student-metrics-display">
                        <div class="gpa-calc-box">
                            <h5><i class="fas fa-calculator"></i> Interactive GPA Scenario Simulator</h5>
                            <div class="gpa-slider-group">
                                <label><span>Current Quiz Average:</span> <strong id="quizVal">88%</strong></label>
                                <input type="range" id="quizSlider" min="50" max="100" value="88">
                            </div>
                            <div class="gpa-slider-group">
                                <label><span>Final Project Score:</span> <strong id="projVal">94%</strong></label>
                                <input type="range" id="projSlider" min="50" max="100" value="94">
                            </div>
                            <div>
                                <small class="text-gray">Predicted Cumulative GPA:</small>
                                <div class="calculated-gpa-badge" id="gpaResult">3.92 / 4.00 (Grade: A)</div>
                            </div>
                        </div>
                        <div class="assignment-checklist">
                            <h5><i class="fas fa-tasks"></i> Upcoming Deliverables</h5>
                            <div class="checklist-items">
                                <label class="chk-item">
                                    <input type="checkbox" checked> <span>Project Proposal Draft (CS 410)</span>
                                </label>
                                <label class="chk-item">
                                    <input type="checkbox"> <span>Midterm Quiz (CS 301) - Due Oct 27</span>
                                </label>
                                <label class="chk-item">
                                    <input type="checkbox"> <span>Lab Report & Git Repo (CS 320)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    return '';
}
=======
        subtitle: 'Security-monitoring command-center prototype',
        desc: 'A full-stack prototype combining a React/Vite operator interface with a FastAPI backend for camera management, zones, events, alerts, watchlists, dashboard data, media handling and realtime alert delivery.',
        features: ['React 18 + Vite frontend', 'FastAPI + Uvicorn backend', 'SQLAlchemy and Alembic', 'PostgreSQL / SQLite development architecture', 'WebSocket alert channel', 'Docker Compose support for PostgreSQL'],
        github: 'https://github.com/shivamsharmakr04/IBVAP'
    },
    'elementum': {
        title: 'Elementum — AI & Digital Product Studio',
        subtitle: 'Interactive React/Vite frontend project',
        desc: 'A self-contained frontend project demonstrating a modern digital-product studio experience with responsive UI, portfolio exploration, service presentation, project estimation, inquiry flow, testimonials and FAQs.',
        features: ['React 19 + Vite 8', 'Tailwind CSS 4', 'Framer Motion', 'Lucide React + React Icons', 'Responsive UI and micro-interactions', 'No required backend or database'],
        github: 'https://github.com/shivamsharmakr04/Elementum'
    }
};

const modalOverlay = document.getElementById('projectModalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
>>>>>>> fd8285b3e3281b64d4d43fd98ce085782cc86cfa

function openProjectModal(id) {
    const data = projectData[id];
    if (!data || !modalOverlay || !modalContent) return;
    modalContent.innerHTML = `
        <div class="modal-content">
            <h2 class="modal-title">${data.title}</h2>
            <span class="modal-subtitle">${data.subtitle}</span>
            <p class="modal-desc">${data.desc}</p>
            <div class="modal-features-list">
                <h4><i class="fas fa-check-circle text-success"></i> Verified features</h4>
                <ul>${data.features.map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('')}</ul>
            </div>
            <div class="modal-actions-row">
                <a class="btn btn-primary" href="${data.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> View GitHub Repository</a>
                <button class="btn btn-secondary" onclick="closeProjectModal()"><i class="fas fa-times"></i> Close</button>
            </div>
        </div>`;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    sfx.play('pop');
}
function closeProjectModal() {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}
if (modalClose) modalClose.addEventListener('click', closeProjectModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeProjectModal(); });
document.addEventListener('click', e => {
    const trigger = e.target.closest('.project-details-btn');
    if (trigger?.dataset.projectId) {
        e.preventDefault();
        openProjectModal(trigger.dataset.projectId);
    }
});

// Command palette
const cmdOverlay = document.getElementById('cmdPaletteOverlay');
const cmdButton = document.getElementById('cmdPaletteBtn');
const cmdClose = document.getElementById('cmdPaletteClose');
const cmdInput = document.getElementById('cmdPaletteInput');
const cmdResults = document.getElementById('cmdPaletteResults');
function openCmdPalette() {
    cmdOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (cmdInput) { cmdInput.value = ''; filterCommands(''); cmdInput.focus(); }
}
function closeCmdPalette() {
    cmdOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}
function filterCommands(q) {
    cmdResults?.querySelectorAll('.cmd-item').forEach(item => {
        item.style.display = !q || item.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none';
    });
}
if (cmdButton) cmdButton.addEventListener('click', openCmdPalette);
if (cmdClose) cmdClose.addEventListener('click', closeCmdPalette);
if (cmdInput) cmdInput.addEventListener('input', e => filterCommands(e.target.value));
cmdOverlay?.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmdPalette(); });
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdPalette(); }
    if (e.key === 'Escape') { closeCmdPalette(); closeProjectModal(); }
});
cmdResults?.addEventListener('click', e => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;
    closeCmdPalette();
    const action = item.dataset.action;
    if (action === 'goto') document.querySelector(item.dataset.target)?.scrollIntoView({behavior:'smooth'});
    if (action === 'resume') window.open('Shivam_Kumar_Resume.pdf', '_blank');
    if (action === 'copy-email') navigator.clipboard?.writeText('shivamsharmakr04@gmail.com').then(() => showToast('Email copied', 'fas fa-check-circle'));
    if (action === 'toggle-theme') {
        const keys = Object.keys(themeNames);
        const current = document.documentElement.dataset.theme || 'cyber';
        setTheme(keys[(keys.indexOf(current) + 1) % keys.length]);
    }
});

// Copy helpers
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.copy;
        if (!value) return;
        navigator.clipboard?.writeText(value).then(() => showToast('Copied', 'fas fa-check-circle'));
    });
});

// Contact form: compose a mailto instead of claiming an external delivery result
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const subject = document.getElementById('subject')?.value.trim() || 'Portfolio enquiry';
        const message = document.getElementById('message')?.value.trim() || '';
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:shivamsharmakr04@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showToast('Opening your email client', 'fas fa-envelope');
    });
}

// Scroll animations
const scrollObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
}), {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});
document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

// Back-to-top button
const topButton = document.getElementById('scrollTop');
window.addEventListener('scroll', () => topButton?.classList.toggle('visible', scrollY > 450), {passive:true});
topButton?.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

function showToast(message, icon = 'fas fa-info-circle') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

// Keep this helper for the existing terminal UI, but use only verified portfolio commands.
const terminalOutput = document.getElementById('terminalOutput');
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalCommands = {
    help: 'Commands: projects, skills, about, contact, resume, clear',
    projects: '7 verified GitHub projects: Finova Pro, Student Dashboard, CertiVerify, Job Listing Platform, Flight Booker, IBVAP, Elementum.',
    skills: 'React, Next.js, TypeScript, JavaScript, Node.js, Express, Python/FastAPI, MongoDB, PostgreSQL, Supabase, Tailwind CSS, REST APIs, WebSockets.',
    about: 'Shivam Kumar — Full-Stack Developer.',
    contact: 'Email: shivamsharmakr04@gmail.com | Location: Dehradun, India',
    resume: 'Opening resume…',
    clear: ''
};
function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd || !terminalOutput) return;
    if (cmd === 'resume') { window.open('Shivam_Kumar_Resume.pdf', '_blank'); return; }
    if (cmd === 'clear') { terminalOutput.innerHTML = ''; return; }
    if (projectData[cmd]) { openProjectModal(cmd); return; }
    const result = terminalCommands[cmd] || `Command not found: "${cmd}". Type help.`;
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="terminal-prompt">shivam@portfolio:~$</span> ${cmd}<br><span class="term-res">${result}</span>`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
if (terminalForm && terminalInput) terminalForm.addEventListener('submit', e => {
    e.preventDefault(); runCommand(terminalInput.value); terminalInput.value = '';
});
document.querySelectorAll('.term-btn').forEach(btn => btn.addEventListener('click', () => runCommand(btn.dataset.cmd)));

// Smooth anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth'});
    }
}));
