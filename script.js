// ==========================================================================
// SHIVAM KUMAR - PORTFOLIO INTERACTION ENGINE
// Audio FX, 6-Theme Manager, Terminal, Command Palette, Interactive Sandboxes
// ==========================================================================

// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 450);
});

// ==========================================
// 1. Web Audio API Micro-Synthesizer (Zero External Audio Files)
// ==========================================
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('soundFXEnabled') === 'true';
        this.initButton();
    }

    initCtx() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initButton() {
        const btn = document.getElementById('soundToggleBtn');
        const icon = document.getElementById('soundIcon');
        if (!btn || !icon) return;

        if (this.enabled) {
            btn.classList.add('sound-on');
            icon.className = 'fas fa-volume-high';
        } else {
            btn.classList.remove('sound-on');
            icon.className = 'fas fa-volume-mute';
        }

        btn.addEventListener('click', () => {
            this.enabled = !this.enabled;
            localStorage.setItem('soundFXEnabled', this.enabled);
            if (this.enabled) {
                this.initCtx();
                btn.classList.add('sound-on');
                icon.className = 'fas fa-volume-high';
                this.play('pop');
                showToast('Sound Effects Enabled 🔊', 'fas fa-volume-high');
            } else {
                btn.classList.remove('sound-on');
                icon.className = 'fas fa-volume-mute';
                showToast('Sound Effects Muted 🔇', 'fas fa-volume-mute');
            }
        });
    }

    play(type = 'click') {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            }
        } catch (e) {
            // Audio context silently handled
        }
    }
}
const sfx = new SoundFX();

// ==========================================
// 2. Multi-Theme Engine & Manager (6 Curated Themes)
// ==========================================
const themeNames = {
    cyber: 'Cyber Indigo',
    sapphire: 'Midnight Sapphire',
    emerald: 'Emerald Aurora',
    sunset: 'Sunset Pulse',
    matrix: 'Neon Matrix',
    amethyst: 'Amethyst Twilight'
};

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeSwitcher = document.getElementById('themeSwitcher');
const themeOpts = document.querySelectorAll('.theme-opt');
const themeCurrentName = document.querySelector('.theme-current-name');

function setTheme(themeName) {
    if (!themeNames[themeName]) themeName = 'cyber';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolioTheme', themeName);

    themeOpts.forEach(opt => {
        if (opt.getAttribute('data-theme') === themeName) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    if (themeCurrentName) {
        themeCurrentName.textContent = themeNames[themeName];
    }
}

// Load persisted theme
const savedTheme = localStorage.getItem('portfolioTheme') || 'cyber';
setTheme(savedTheme);

if (themeToggleBtn && themeSwitcher) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfx.play('click');
        themeSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        themeSwitcher.classList.remove('open');
    });

    themeOpts.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const chosen = opt.getAttribute('data-theme');
            setTheme(chosen);
            themeSwitcher.classList.remove('open');
            sfx.play('pop');
            showToast(`Theme switched to ${themeNames[chosen]}`, 'fas fa-palette');
        });
    });
}

// ==========================================
// 3. Scroll Progress Bar & Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }

    if (navbar) {
        navbar.classList.toggle('scrolled', scrollTop > 40);
    }

    // Active Section Tracking
    let currentId = '';
    sections.forEach(sec => {
        const secTop = sec.offsetTop - 140;
        const secHeight = sec.offsetHeight;
        if (scrollTop >= secTop && scrollTop < secTop + secHeight) {
            currentId = sec.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentId && link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// ==========================================
// 4. Mobile Menu Drawer
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
    sfx.play('pop');
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    sfx.play('click');
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// ==========================================
// 5. Scroll to Top Floating Action
// ==========================================
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 450);
    }
}, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        sfx.play('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 6. Interactive Canvas Particle Background
// ==========================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -2000;
    let mouseY = -2000;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.6 + 0.6;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 22), 65);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearest nodes
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse interaction node web
            const mdx = particles[i].x - mouseX;
            const mdy = particles[i].y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.28 * (1 - mdist / 130)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ==========================================
// 7. Dynamic Typing Effect in Hero Title
// ==========================================
const typingElement = document.getElementById('typingText');
if (typingElement) {
    const words = [
        "Modern Web Apps",
        "Finance Dashboards",
        "Student LMS Portals",
        "Scalable Cloud APIs",
        "AI Driven Solutions"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 120;

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 60;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 130;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeDelay = 1800; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 400;
        }

        setTimeout(typeEffect, typeDelay);
    }
    setTimeout(typeEffect, 800);
}

// ==========================================
// 8. 3D Card Tilt Engine
// ==========================================
function initTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}
initTilt();

// ==========================================
// 9. Hero Code Playground Tabs & Interactive Terminal
// ==========================================
const codeTabs = document.querySelectorAll('.code-tab');
const tabContents = document.querySelectorAll('.tab-content');

codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        sfx.play('click');
        const target = tab.getAttribute('data-tab');

        codeTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = document.getElementById(`tab-${target}`);
        if (targetContent) targetContent.classList.add('active');
    });
});

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
    });
}

termBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        executeCommand(cmd);
    });
});

// ==========================================
// 10. Project Filtering by Category
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sfx.play('click');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.35s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==========================================
// 11. Interactive Skills Search & Category Tabs
// ==========================================
const skillSearchInput = document.getElementById('skillSearchInput');
const clearSkillSearch = document.getElementById('clearSkillSearch');
const skillSearchBox = document.querySelector('.skills-search-box');
const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
const skillCards = document.querySelectorAll('.skill-card');

function filterSkills() {
    const query = skillSearchInput ? skillSearchInput.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.skill-tab-btn.active')?.getAttribute('data-category') || 'all';

    if (skillSearchBox) {
        skillSearchBox.classList.toggle('has-query', query.length > 0);
    }

    skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        const cardText = card.textContent.toLowerCase();

        const matchesCategory = (activeTab === 'all' || cardCat === activeTab);
        const matchesQuery = !query || cardText.includes(query);

        if (matchesCategory && matchesQuery) {
            card.classList.remove('filtered-out');
        } else {
            card.classList.add('filtered-out');
        }
    });
}

if (skillSearchInput) {
    skillSearchInput.addEventListener('input', filterSkills);
}

if (clearSkillSearch) {
    clearSkillSearch.addEventListener('click', () => {
        sfx.play('click');
        skillSearchInput.value = '';
        filterSkills();
        skillSearchInput.focus();
    });
}

skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sfx.play('click');
        skillTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterSkills();
    });
});

// Animate Skill Bars when Section is in viewport
const skillsSection = document.getElementById('skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            document.querySelectorAll('.meter-fill').forEach(fill => {
                const targetW = fill.style.getPropertyValue('--w') || '85%';
                fill.style.width = targetW;
            });
            skillsAnimated = true;
        }
    });
}, { threshold: 0.2 });

if (skillsSection) skillsObserver.observe(skillsSection);

// ==========================================
// 12. Journey Section Tab Switching
// ==========================================
const journeyTabBtns = document.querySelectorAll('.journey-tab-btn');
const journeyPanes = document.querySelectorAll('.journey-pane');

journeyTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sfx.play('click');
        const target = btn.getAttribute('data-tab');

        journeyTabBtns.forEach(b => b.classList.remove('active'));
        journeyPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const pane = document.getElementById(`pane-${target}`);
        if (pane) pane.classList.add('active');
    });
});

// ==========================================
// 13. Simulated GitHub Contribution Heatmap
// ==========================================
const heatmapGrid = document.getElementById('heatmapGrid');
if (heatmapGrid) {
    const totalCells = 52 * 7;
    const levels = ['l-0', 'l-1', 'l-2', 'l-3', 'l-4'];
    let html = '';

    for (let i = 0; i < totalCells; i++) {
        // Weighted random for natural git cadence
        const rand = Math.random();
        let level = 'l-0';
        if (rand > 0.45 && rand <= 0.7) level = 'l-1';
        else if (rand > 0.7 && rand <= 0.85) level = 'l-2';
        else if (rand > 0.85 && rand <= 0.95) level = 'l-3';
        else if (rand > 0.95) level = 'l-4';

        html += `<div class="heat-cell ${level}" title="Day ${i + 1}: Active code contributions"></div>`;
    }
    heatmapGrid.innerHTML = html;
}

// ==========================================
// 14. Interactive Project Details & Sandbox Modal
// ==========================================
const projectModalOverlay = document.getElementById('projectModalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

// Comprehensive Project Database
const projectData = {
    'finance-dashboard': {
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
        github: 'https://github.com/shivamsharmakr04/flight-booker'
    },
    'ibvap': {
        title: 'IBVAP — Intelligent Border Video Analytics Platform',
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

function openProjectModal(id) {
    sfx.play('pop');
    const data = projectData[id];
    if (!data || !modalContent || !projectModalOverlay) return;

    modalContent.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="modal-header-img" onerror="this.src='Profile.jpeg'">
        <h2 class="modal-title">${data.title}</h2>
        <span class="modal-subtitle">${data.subtitle}</span>
        <p class="modal-desc">${data.desc}</p>
        
        ${data.isSandbox ? renderSandbox(data.type) : ''}

        <div class="modal-features-list">
            <h4><i class="fas fa-star text-warning"></i> Key Architecture & Features:</h4>
            <ul>
                ${data.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-actions-row">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary">
                <i class="fab fa-github"></i> Inspect Source Code
            </a>
            <button class="btn btn-secondary" onclick="closeProjectModal()">
                <i class="fas fa-times"></i> Close Modal
            </button>
        </div>
    `;

    // Attach listeners for interactive sandbox widgets
    if (data.type === 'finance') {
        const tfBtns = modalContent.querySelectorAll('.tf-btn');
        const netWorth = modalContent.querySelector('#finNetWorth');
        const finReturn = modalContent.querySelector('#finReturn');
        const chartLine = modalContent.querySelector('#chartLine');
        const chartArea = modalContent.querySelector('#chartArea');

        const chartPaths = {
            '1d': { dLine: 'M 0 110 Q 120 70 240 90 T 380 50 T 500 30', dArea: 'M 0 110 Q 120 70 240 90 T 380 50 T 500 30 L 500 140 L 0 140 Z', val: '$148,250.00', ret: '+1.95% (+$2,840)' },
            '1w': { dLine: 'M 0 100 Q 80 50 160 80 T 320 40 T 500 20', dArea: 'M 0 100 Q 80 50 160 80 T 320 40 T 500 20 L 500 140 L 0 140 Z', val: '$148,250.00', ret: '+8.40% (+$12,180)' },
            '1m': { dLine: 'M 0 120 Q 90 90 200 60 T 350 30 T 500 10', dArea: 'M 0 120 Q 90 90 200 60 T 350 30 T 500 10 L 500 140 L 0 140 Z', val: '$153,400.00', ret: '+14.20% (+$19,050)' },
            '1y': { dLine: 'M 0 130 Q 100 100 220 80 T 360 40 T 500 5', dArea: 'M 0 130 Q 100 100 220 80 T 360 40 T 500 5 L 500 140 L 0 140 Z', val: '$162,800.00', ret: '+32.80% (+$40,250)' }
        };

        tfBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sfx.play('click');
                tfBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tf = btn.getAttribute('data-tf');
                if (chartPaths[tf]) {
                    netWorth.textContent = chartPaths[tf].val;
                    finReturn.textContent = chartPaths[tf].ret;
                    chartLine.setAttribute('d', chartPaths[tf].dLine);
                    chartArea.setAttribute('d', chartPaths[tf].dArea);
                }
            });
        });
    } else if (data.type === 'student') {
        const quizSlider = modalContent.querySelector('#quizSlider');
        const projSlider = modalContent.querySelector('#projSlider');
        const quizVal = modalContent.querySelector('#quizVal');
        const projVal = modalContent.querySelector('#projVal');
        const gpaResult = modalContent.querySelector('#gpaResult');

        function updateGPA() {
            const q = parseInt(quizSlider.value);
            const p = parseInt(projSlider.value);
            quizVal.textContent = q + '%';
            projVal.textContent = p + '%';
            const avg = (q * 0.4 + p * 0.6);
            let gpa = (avg / 100 * 4.0).toFixed(2);
            let grade = 'A';
            if (gpa < 3.0) grade = 'B';
            if (gpa < 2.0) grade = 'C';
            gpaResult.textContent = `${gpa} / 4.00 (Grade: ${grade})`;
        }

        if (quizSlider) quizSlider.addEventListener('input', updateGPA);
        if (projSlider) projSlider.addEventListener('input', updateGPA);

        const coursePills = modalContent.querySelectorAll('.course-tab-pill');
        coursePills.forEach(pill => {
            pill.addEventListener('click', () => {
                sfx.play('click');
                coursePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    }

    projectModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    sfx.play('click');
    if (projectModalOverlay) {
        projectModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (projectModalOverlay) {
    projectModalOverlay.addEventListener('click', (e) => {
        if (e.target === projectModalOverlay) closeProjectModal();
    });
}

// Attach modal openers to all action triggers
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.project-details-btn') || e.target.closest('.sandbox-trigger-btn');
    if (btn) {
        e.preventDefault();
        const pid = btn.getAttribute('data-project-id');
        if (pid) openProjectModal(pid);
    }
});

// ==========================================
// 15. Command Palette (Ctrl + K / Cmd + K)
// ==========================================
const cmdPaletteOverlay = document.getElementById('cmdPaletteOverlay');
const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
const cmdPaletteClose = document.getElementById('cmdPaletteClose');
const cmdPaletteInput = document.getElementById('cmdPaletteInput');
const cmdPaletteResults = document.getElementById('cmdPaletteResults');

function openCmdPalette() {
    sfx.play('pop');
    if (!cmdPaletteOverlay) return;
    cmdPaletteOverlay.classList.add('active');
    if (cmdPaletteInput) {
        cmdPaletteInput.value = '';
        cmdPaletteInput.focus();
        filterCmdItems('');
    }
    document.body.style.overflow = 'hidden';
}

function closeCmdPalette() {
    sfx.play('click');
    if (!cmdPaletteOverlay) return;
    cmdPaletteOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCmdPalette);
if (cmdPaletteClose) cmdPaletteClose.addEventListener('click', closeCmdPalette);
if (cmdPaletteOverlay) {
    cmdPaletteOverlay.addEventListener('click', (e) => {
        if (e.target === cmdPaletteOverlay) closeCmdPalette();
    });
}

// Global Keyboard shortcut listener
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdPaletteOverlay && cmdPaletteOverlay.classList.contains('active')) {
            closeCmdPalette();
        } else {
            openCmdPalette();
        }
    }
    if (e.key === 'Escape') {
        if (cmdPaletteOverlay && cmdPaletteOverlay.classList.contains('active')) closeCmdPalette();
        if (projectModalOverlay && projectModalOverlay.classList.contains('active')) closeProjectModal();
    }
});

function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    const items = cmdPaletteResults ? cmdPaletteResults.querySelectorAll('.cmd-item') : [];
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener('input', (e) => filterCmdItems(e.target.value));
}

// Execute Command Item Actions
if (cmdPaletteResults) {
    cmdPaletteResults.addEventListener('click', (e) => {
        const item = e.target.closest('.cmd-item');
        if (!item) return;
        const action = item.getAttribute('data-action');
        closeCmdPalette();

        if (action === 'goto') {
            const target = item.getAttribute('data-target');
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'sandbox') {
            const project = item.getAttribute('data-project');
            openProjectModal(project);
        } else if (action === 'resume') {
            window.open('Shivam_Kumar_Resume.pdf', '_blank');
            showToast('Opening Shivam Kumar Resume...', 'fas fa-file-pdf');
        } else if (action === 'copy-email') {
            navigator.clipboard.writeText('shivamsharmakr04@gmail.com');
            showToast('Email copied to clipboard: shivamsharmakr04@gmail.com', 'fas fa-check-circle');
        } else if (action === 'toggle-theme') {
            const keys = Object.keys(themeNames);
            const current = document.documentElement.getAttribute('data-theme') || 'cyber';
            const next = keys[(keys.indexOf(current) + 1) % keys.length];
            setTheme(next);
            showToast(`Theme switched to ${themeNames[next]}`, 'fas fa-palette');
        }
    });
}

// ==========================================
// 16. Toast Notifications Engine
// ==========================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, icon = 'fas fa-info-circle') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ==========================================
// 17. Copy to Clipboard Quick Helpers
// ==========================================
const copyBtns = document.querySelectorAll('.copy-btn');
copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                sfx.play('success');
                showToast(`Copied to clipboard: ${textToCopy}`, 'fas fa-check-circle');
            }).catch(() => {
                showToast('Failed to copy text', 'fas fa-exclamation-circle');
            });
        }
    });
});

// ==========================================
// 18. Intersection Observer for Scroll Animations
// ==========================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

// ==========================================
// 19. Animated Stats Numbers Counter
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 45));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    entry.target.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    entry.target.textContent = current;
                }
            }, 30);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ==========================================
// 20. Contact Form Submission (Web3Forms API)
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('contactSubmitBtn');
        const originalHtml = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            formData.append("access_key", "0d1f3610-56a3-4164-9257-c027e4501229");

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                sfx.play('success');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Dispatched!';
                submitBtn.style.background = 'var(--success)';
                showToast('Thank you! Your message has been dispatched successfully.', 'fas fa-check-circle');
                contactForm.reset();
            } else {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Delivery Failed';
                submitBtn.style.background = 'var(--warning)';
                showToast('Could not send message. Please email directly.', 'fas fa-exclamation-triangle');
            }
        } catch (err) {
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            submitBtn.style.background = 'var(--warning)';
            showToast('Network error connecting to mail server.', 'fas fa-exclamation-triangle');
        }

        setTimeout(() => {
            submitBtn.innerHTML = originalHtml;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3500);
    });
}