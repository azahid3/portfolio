/* ================================================
   HERO CANVAS — Cyber / Tech Background
   ================================================ */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

/* --- Particles --- */
let particles = [];

function initParticles() {
    const count = Math.min(55, Math.floor((W * H) / 16000));
    particles = Array.from({ length: count }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.22,
        vy:    (Math.random() - 0.5) * 0.22,
        r:     Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.35 + 0.08,
    }));
}
initParticles();

/* --- Glowing orbs --- */
const glows = [
    { bx: 0.15, by: 0.28, size: 0.52, phase: 0.0, spd: 0.35, r: 0,   g: 204, b: 255 },
    { bx: 0.82, by: 0.60, size: 0.42, phase: 2.1, spd: 0.28, r: 50,  g: 80,  b: 255 },
    { bx: 0.50, by: 0.88, size: 0.38, phase: 4.2, spd: 0.42, r: 0,   g: 204, b: 255 },
    { bx: 0.72, by: 0.12, size: 0.28, phase: 1.5, spd: 0.38, r: 100, g: 50,  b: 255 },
    { bx: 0.30, by: 0.72, size: 0.32, phase: 3.3, spd: 0.31, r: 0,   g: 160, b: 255 },
];

function drawFrame(t) {
    /* background */
    ctx.fillStyle = '#060c14';
    ctx.fillRect(0, 0, W, H);

    /* grid */
    const gs = 72;
    ctx.strokeStyle = 'rgba(0, 204, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* glowing orbs */
    glows.forEach(g => {
        const x = (g.bx + Math.sin(t * g.spd * 0.0004 + g.phase) * 0.13) * W;
        const y = (g.by + Math.cos(t * g.spd * 0.0003 + g.phase) * 0.09) * H;
        const r = g.size * Math.min(W, H) * 0.75;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0,   `rgba(${g.r},${g.g},${g.b},0.10)`);
        grad.addColorStop(0.4, `rgba(${g.r},${g.g},${g.b},0.04)`);
        grad.addColorStop(1,   `rgba(${g.r},${g.g},${g.b},0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    });

    /* particles */
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 204, 255, ${p.alpha})`;
        ctx.fill();
    });

    /* connections */
    const MAX_D = 130;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < MAX_D) {
                ctx.strokeStyle = `rgba(0, 204, 255, ${(1 - d / MAX_D) * 0.1})`;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    /* vignette */
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 1.0);
    vig.addColorStop(0, 'rgba(6,12,20,0)');
    vig.addColorStop(1, 'rgba(6,12,20,0.88)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawFrame);
}
requestAnimationFrame(drawFrame);

/* ================================================
   TYPEWRITER — hero cycling phrases
   ================================================ */
(function () {
    const phrases = ['solutions engineer.', 'builder.', 'growth operator.'];
    const el      = document.querySelector('.typewriter-text');
    if (!el) return;

    let pIdx      = 0;
    let cIdx      = 0;
    let deleting  = false;

    // typing speed (ms), delete speed, pause after full word, pause before next
    const TYPE_SPD   = 85;
    const DEL_SPD    = 45;
    const PAUSE_END  = 1600;
    const PAUSE_NEXT = 380;

    function tick() {
        const word = phrases[pIdx];

        if (deleting) {
            cIdx--;
            el.textContent = word.slice(0, cIdx);
        } else {
            cIdx++;
            el.textContent = word.slice(0, cIdx);
        }

        let delay = deleting ? DEL_SPD : TYPE_SPD;

        if (!deleting && cIdx === word.length) {
            delay    = PAUSE_END;
            deleting = true;
        } else if (deleting && cIdx === 0) {
            deleting = false;
            pIdx     = (pIdx + 1) % phrases.length;
            delay    = PAUSE_NEXT;
        }

        setTimeout(tick, delay);
    }

    // start after hero fade-in completes
    setTimeout(tick, 1400);
})();

/* ================================================
   NAVBAR — scroll behaviour
   ================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ================================================ */
const scrollObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* clear delay after enter so hover isn't sluggish */
            setTimeout(() => {
                entry.target.style.transitionDelay = '0s';
            }, 900);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-scroll], .exp-card, .project-card').forEach(el => {
    scrollObs.observe(el);
});

/* stagger project cards */
document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
});

/* stagger exp cards */
document.querySelectorAll('.exp-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
});

/* passion cards — trigger when their container enters view */
const passionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.passion-card').forEach(card => {
                card.classList.add('visible');
            });
            passionObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

const aboutRight = document.querySelector('.about-right');
if (aboutRight) passionObs.observe(aboutRight);

/* ================================================
   SMOOTH SCROLL — anchor links
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ================================================
   CURSOR TRAIL — fading glow trail (desktop only)
   ================================================ */
if (window.matchMedia('(pointer: fine)').matches) {
    const cc = document.createElement('canvas');
    Object.assign(cc.style, {
        position: 'fixed', inset: '0',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '9998',
    });
    document.body.appendChild(cc);
    const cx = cc.getContext('2d');

    function resizeCC() {
        cc.width  = window.innerWidth;
        cc.height = window.innerHeight;
    }
    resizeCC();
    window.addEventListener('resize', resizeCC, { passive: true });

    const trail = [];
    const TRAIL_LEN = 28;
    const FADE_MS   = 500;
    let mouse = { x: -999, y: -999 };

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (trail.length > TRAIL_LEN) trail.shift();
    }, { passive: true });

    function drawTrail() {
        cx.clearRect(0, 0, cc.width, cc.height);
        const now = performance.now();

        /* fading trail dots */
        trail.forEach(pt => {
            const age      = now - pt.t;
            if (age > FADE_MS) return;
            const progress = 1 - age / FADE_MS;
            const r        = 4 * progress;

            const g = cx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 5);
            g.addColorStop(0, `rgba(0, 204, 255, ${progress * 0.35})`);
            g.addColorStop(1, `rgba(0, 204, 255, 0)`);
            cx.fillStyle = g;
            cx.beginPath();
            cx.arc(pt.x, pt.y, r * 5, 0, Math.PI * 2);
            cx.fill();

            /* tiny bright core dot */
            cx.beginPath();
            cx.arc(pt.x, pt.y, r * 0.7, 0, Math.PI * 2);
            cx.fillStyle = `rgba(0, 220, 255, ${progress * 0.55})`;
            cx.fill();
        });

        /* cursor glow halo */
        if (mouse.x > 0) {
            const halo = cx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 52);
            halo.addColorStop(0, 'rgba(0, 204, 255, 0.13)');
            halo.addColorStop(1, 'rgba(0, 204, 255, 0)');
            cx.fillStyle = halo;
            cx.beginPath();
            cx.arc(mouse.x, mouse.y, 52, 0, Math.PI * 2);
            cx.fill();

            /* sharp center dot */
            cx.beginPath();
            cx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
            cx.fillStyle = 'rgba(0, 230, 255, 0.9)';
            cx.fill();
        }

        requestAnimationFrame(drawTrail);
    }
    drawTrail();
}
