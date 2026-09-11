// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 500);
});

// ==========================================
// Theme Engine & LocalStorage Manager
// ==========================================
const themeNames = {
    cyber: 'Cyber Indigo',
    emerald: 'Emerald Aurora',
    sunset: 'Sunset Pulse',
    matrix: 'Neon Matrix'
};

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeSwitcher = document.getElementById('themeSwitcher');
const themeDropdown = document.getElementById('themeDropdown');
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

// Load saved theme
const savedTheme = localStorage.getItem('portfolioTheme') || 'cyber';
setTheme(savedTheme);

if (themeToggleBtn && themeSwitcher) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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
            showToast(`Theme switched to ${themeNames[chosen]}`, 'fas fa-palette');
        });
    });
}

// ==========================================
// Scroll Progress Bar & Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }

    if (navbar) {
        navbar.classList.toggle('scrolled', scrollTop > 50);
    }
});

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// ==========================================
// Scroll to Top Button
// ==========================================
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// HTML5 Canvas Particle Background
// ==========================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;

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
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 1.8 + 0.6;
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
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            // Connect to mouse
            const mdx = particles[i].x - mouseX;
            const mdy = particles[i].y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 140) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - mdist / 140)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ==========================================
// 3D Card Tilt Effect
// ==========================================
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// ==========================================
// Hero Code Window Tabs & Interactive Terminal
// ==========================================
const codeTabs = document.querySelectorAll('.code-tab');
const tabContents = document.querySelectorAll('.tab-content');

codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        codeTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = document.getElementById(`tab-${target}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Terminal Commands Logic
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const termBtns = document.querySelectorAll('.term-btn');

const terminalCommands = {
    help: 'Available commands: <span class="term-cmd">skills</span>, <span class="term-cmd">projects</span>, <span class="term-cmd">contact</span>, <span class="term-cmd">about</span>, <span class="term-cmd">theme [cyber|emerald|sunset|matrix]</span>, <span class="term-cmd">clear</span>',
    skills: '⚡ Skills: React.js, Node.js, Python, TypeScript, Next.js, MongoDB, PostgreSQL, Docker, AWS, AI/ML',
    projects: '🚀 Featured Projects: Job Portal, Finance Dashboard, Flight Booker, Certificate Verification System',
    contact: '📧 Email: shivamsharmakr04@gmail.com | 📞 Phone: +91 9771050501 | 📍 Location: Dehradun',
    about: '👨‍💻 Shivam | Full Stack Developer passionate about crafting seamless digital experiences & AI integration.',
    whoami: '👋 Welcome guest visitor! Explore the portfolio and feel free to connect.',
    clear: 'CLEAR'
};

function executeCommand(cmdRaw) {
    const cmdClean = cmdRaw.trim().toLowerCase();
    if (!cmdClean) return;

    if (cmdClean === 'clear') {
        if (terminalOutput) terminalOutput.innerHTML = '';
        return;
    }

    let response = terminalCommands[cmdClean];

    // Theme command check
    if (cmdClean.startsWith('theme')) {
        const parts = cmdClean.split(' ');
        if (parts.length > 1 && themeNames[parts[1]]) {
            setTheme(parts[1]);
            response = `Theme changed to <span class="term-cmd">${themeNames[parts[1]]}</span>!`;
        } else {
            response = `Usage: theme [cyber | emerald | sunset | matrix]`;
        }
    }

    if (!response) {
        response = `Command not found: "${cmdClean}". Type <span class="term-cmd">help</span> for available commands.`;
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
// Project Category Filtering
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ==========================================
// Project Details Modal
// ==========================================
const projectData = {
    'job-portal': {
        title: 'Job Portal Platform',
        subtitle: 'Full Stack Web Application',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        desc: 'A feature-rich job listing and recruitment portal built with React and Node.js. Incorporates AI-powered candidate resume matching, real-time application status notifications, and advanced filtering algorithms.',
        features: [
            'AI-assisted resume screening and candidate ranking',
            'Real-time messaging & application tracking via Socket.io',
            'Recruiter dashboard with posting analytics and applicant management',
            'Secure authentication and role-based access controls'
        ],
        github: 'https://github.com/himanshu9771/job-listing-app'
    },
    'finance-dashboard': {
        title: 'Finance Analytics Dashboard',
        subtitle: 'Real-time Analytics & AI Predictions',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
        desc: 'Interactive financial analytics dashboard enabling users to monitor stock trends, track portfolio performance, and view predictive AI market insights visually.',
        features: [
            'Dynamic chart visualizations powered by D3.js & Chart.js',
            'Python ML model integration for market trend forecasting',
            'Multi-currency support and real-time exchange rate updates',
            'Responsive financial reports exportable to PDF/CSV'
        ],
        github: 'https://github.com/himanshu9771/finance-Dashboard'
    },
    'flight-booking': {
        title: 'Flight Booking System',
        subtitle: 'End-to-End Travel Reservation System',
        img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop',
        desc: 'Comprehensive flight reservation system supporting live seat maps, multi-city route search, dynamic seat pricing, and automated email confirmation tickets.',
        features: [
            'Interactive airplane seat layout selector',
            'Stripe payment gateway integration with webhooks',
            'Redis cache layer for ultra-fast flight availability lookups',
            'Booking management portal for updates and cancellations'
        ],
        github: 'https://github.com/himanshu9771/flight-booker'
    },
    'certificate-verification': {
        title: 'Certificate Verification System',
        subtitle: 'Blockchain Credentials Validation',
        img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop',
        desc: 'Blockchain-backed academic certificate verification platform preventing forgery by storing cryptographic hashes on decentralized ledgers with QR code verification.',
        features: [
            'Cryptographic hash generation and IPFS decentralized storage',
            'QR code generation for instant mobile certificate validation',
            'Institution admin portal for bulk certificate issuance',
            'Public verification search portal for employers'
        ],
        github: 'https://github.com/himanshu9771/Certificate-verification-system'
    }
};

const projectModalOverlay = document.getElementById('projectModalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

function openProjectModal(id) {
    const data = projectData[id];
    if (!data || !modalContent || !projectModalOverlay) return;

    modalContent.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="modal-header-img">
        <h2 class="modal-title">${data.title}</h2>
        <span class="modal-subtitle">${data.subtitle}</span>
        <p class="modal-desc">${data.desc}</p>
        <div class="modal-features">
            <h4>Key Features & Technical Architecture:</h4>
            <ul>
                ${data.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
            </ul>
        </div>
        <div class="modal-links-row">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fab fa-github"></i> Source Code</a>
            <button class="btn btn-secondary" onclick="closeProjectModal()"><i class="fas fa-times"></i> Close</button>
        </div>
    `;

    projectModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
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

document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-project-id');
        openProjectModal(pid);
    });
});

// ==========================================
// Toast Notification Engine
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
    }, 3000);
}

// ==========================================
// Copy to Clipboard Helpers
// ==========================================
const copyBtns = document.querySelectorAll('.copy-btn');
copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied to clipboard: ${textToCopy}`, 'fas fa-check-circle');
            }).catch(err => {
                showToast('Failed to copy text', 'fas fa-exclamation-circle');
            });
        }
    });
});

// ==========================================
// Scroll Animations (IntersectionObserver)
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ==========================================
// Number Counter Animation
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 40));
            const timer = setInterval(() => {
                current += increment;
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
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ==========================================
// Contact Form Submit Handler
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const formData = new FormData(e.target);
            formData.append("access_key", "0d1f3610-56a3-4164-9257-c027e4501229");

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = 'var(--success)';
                showToast('Thank you! Your message has been sent successfully.', 'fas fa-check-circle');
                e.target.reset();
            } else {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                btn.style.background = 'var(--warning)';
                showToast('Could not send message. Please try again.', 'fas fa-exclamation-triangle');
            }
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            btn.style.background = 'var(--warning)';
            showToast('Error connecting to server. Please try again.', 'fas fa-exclamation-triangle');
        }

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

// ==========================================
// Technical Skill Progress Loader Animation
// ==========================================
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const fills = card.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
            const target = fill.style.getPropertyValue('--progress') || fill.getAttribute('style')?.match(/--progress:\s*([^;]+)/)?.[1] || '85%';
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = target.trim();
            }, 60);
        });
    });
});