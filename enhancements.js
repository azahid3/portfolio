// Interactive enhancements: scroll progress, counters, copy email, tilt, page fade
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll progress bar (case study pages) ---
    const progress = document.querySelector('.scroll-progress');
    if (progress) {
        let animationId = null;
        const update = () => {
            animationId = null;
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            progress.style.width = max > 0 ? (doc.scrollTop / max) * 100 + '%' : '0%';
        };
        window.addEventListener('scroll', () => {
            if (!animationId) animationId = requestAnimationFrame(update);
        }, { passive: true });
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
        panel.id = 'mobile-menu';
        document.querySelectorAll('.nav-links > a').forEach((a) => panel.appendChild(a.cloneNode(true)));
        navEl.appendChild(panel);
        hamburger.setAttribute('aria-controls', 'mobile-menu');
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
        // Tapping anywhere outside the nav closes the dropdown
        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('menu-open') && !navEl.contains(e.target)) closeMenu();
        });
        // The dropdown only exists on phones; close it if the window grows past that
        window.matchMedia('(min-width: 641px)').addEventListener('change', (e) => { if (e.matches) closeMenu(); });
    }

    // --- Vendor tabs (Arrow page) ---
    // The buttons carry data-panel (panel id) and data-hash (shareable #link, e.g. #nutanix).
    const vendorSwitch = document.querySelector('.vendor-switch');
    if (vendorSwitch) {
        const tabs = [...vendorSwitch.querySelectorAll('.vendor-tab')];
        const panels = tabs.map((tab) => document.getElementById(tab.dataset.panel));
        vendorSwitch.setAttribute('role', 'tablist');
        vendorSwitch.setAttribute('aria-label', 'Vendors I support');
        tabs.forEach((tab, i) => {
            tab.id = 'tab-' + tab.dataset.hash;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', panels[i].id);
            panels[i].setAttribute('role', 'tabpanel');
            panels[i].setAttribute('aria-labelledby', tab.id);
            panels[i].removeAttribute('aria-label');
            panels[i].tabIndex = 0;
        });
        const select = (index, { focus = false, updateHash = false } = {}) => {
            tabs.forEach((tab, i) => {
                const active = i === index;
                tab.setAttribute('aria-selected', String(active));
                tab.tabIndex = active ? 0 : -1;
                panels[i].hidden = !active;
            });
            if (focus) tabs[index].focus();
            if (updateHash) history.replaceState(null, '', '#' + tabs[index].dataset.hash);
        };
        const indexFromHash = () => tabs.findIndex((tab) => '#' + tab.dataset.hash === location.hash);
        select(Math.max(indexFromHash(), 0));
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => select(i, { updateHash: true }));
            tab.addEventListener('keydown', (e) => {
                const moves = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
                if (!(e.key in moves)) return;
                e.preventDefault();
                select((moves[e.key] + tabs.length) % tabs.length, { focus: true, updateHash: true });
            });
        });
        window.addEventListener('hashchange', () => {
            const i = indexFromHash();
            if (i >= 0) select(i);
        });
    }

    // --- Spinning khatam: an 8-point star drawn in text characters next to the name ---
    const navName = document.querySelector('.nav-name');
    if (navName) {
        const art = document.createElement('pre');
        art.className = 'khatam';
        art.setAttribute('aria-hidden', 'true');
        navName.prepend(art);

        const COLS = 20;
        const ROWS = 11;
        const CHAR_W = 0.6;          // monospace glyph width relative to the line height
        const RAMP = '.:-=+*#%@';    // light to dense
        const TIP = Math.SQRT2;      // tip radius of a square unioned with its 45° turn
        const scale = TIP / ((Math.min(COLS * CHAR_W, ROWS) / 2) * 0.98);

        const draw = (t) => {
            const turn = Math.cos(t * 0.9);             // 3D spin around the vertical axis
            const light = 0.35 + 0.65 * Math.abs(turn); // dimmer as it turns edge-on
            const cos = Math.cos(t * 0.3);              // slow rotation within the plane
            const sin = Math.sin(t * 0.3);
            const rows = [];
            for (let row = 0; row < ROWS; row++) {
                let line = '';
                for (let col = 0; col < COLS; col++) {
                    const u = (col - (COLS - 1) / 2) * CHAR_W * scale;
                    const v = (row - (ROWS - 1) / 2) * scale;
                    if (Math.abs(turn) < 0.08) {
                        line += Math.abs(u) < 0.2 && Math.abs(v) < TIP ? ':' : ' ';
                        continue;
                    }
                    const pu = u / turn;
                    const x = pu * cos + v * sin;
                    const y = -pu * sin + v * cos;
                    const inset = Math.max(
                        1 - Math.max(Math.abs(x), Math.abs(y)),
                        1 - (Math.abs(x) + Math.abs(y)) / Math.SQRT2
                    );
                    const r = Math.hypot(x, y);
                    if (inset < 0 || r < 0.3) { line += ' '; continue; }
                    // bright ring around the hollow center, then denser toward the middle of each point
                    const shade = r < 0.46 ? 0.95 : 0.2 + 0.75 * Math.min(1, inset * 2.5);
                    line += RAMP[Math.min(RAMP.length - 1, Math.floor(shade * light * RAMP.length))];
                }
                rows.push(line);
            }
            art.textContent = rows.join('\n');
        };

        if (reducedMotion) {
            draw(0.4);
        } else {
            let last = 0;
            const tick = (now) => {
                if (now - last > 50) { draw(now / 1000); last = now; } // ~20fps is plenty for text art
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
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
