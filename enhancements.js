// Interactive enhancements: scroll progress, counters, copy email, tilt, page fade
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll progress bar (case study pages) ---
    const progress = document.querySelector('.scroll-progress');
    if (progress) {
        const update = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            progress.style.width = max > 0 ? (doc.scrollTop / max) * 100 + '%' : '0%';
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // --- Animated counters ---
    // Elements with class "count-up" animate their leading number when scrolled into view.
    const counters = document.querySelectorAll('.count-up');
    if (counters.length && !reducedMotion) {
        const animate = (el) => {
            const text = el.textContent;
            const match = text.match(/^(\d+)(.*)$/);
            if (!match) return;
            const target = parseInt(match[1], 10);
            const suffix = match[2];
            const duration = 1200;
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        const seen = new WeakSet();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !seen.has(entry.target)) {
                    seen.add(entry.target);
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach((el) => observer.observe(el));
    }

    // --- Copy email ---
    const fallbackCopy = (text) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    };
    document.querySelectorAll('.copy-email').forEach((btn) => {
        btn.addEventListener('click', () => {
            const showFeedback = () => {
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 1600);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(btn.dataset.email)
                    .then(showFeedback)
                    .catch(() => { fallbackCopy(btn.dataset.email); showFeedback(); });
            } else {
                fallbackCopy(btn.dataset.email);
                showFeedback();
            }
        });
    });

    // --- Tilt hover on cards ---
    if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.work-card, .cert-badge').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Hamburger mobile menu ---
    const hamburger = document.querySelector('.hamburger');
    const navEl = document.querySelector('nav');
    if (hamburger && navEl) {
        const panel = document.createElement('div');
        panel.className = 'mobile-menu';
        document.querySelectorAll('.nav-links > a').forEach((a) => panel.appendChild(a.cloneNode(true)));
        navEl.appendChild(panel);
        hamburger.setAttribute('aria-expanded', 'false');
        const closeMenu = () => {
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        };
        hamburger.addEventListener('click', () => {
            const open = document.body.classList.toggle('menu-open');
            hamburger.setAttribute('aria-expanded', String(open));
        });
        panel.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    }

    // --- Page transition fade ---
    if (!reducedMotion) {
        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            const internal = href && !href.startsWith('http') && !href.startsWith('#') &&
                !href.startsWith('mailto:') && !link.hasAttribute('target') && href.indexOf('.pdf') === -1;
            if (!internal) return;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => { window.location.href = href; }, 220);
            });
        });
        // Restore state when returning via back/forward cache
        window.addEventListener('pageshow', () => document.body.classList.remove('page-exit'));
    }
})();
