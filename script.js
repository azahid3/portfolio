/* ================================================
   SCROLL REVEAL — Intersection Observer
   ================================================ */
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once element is visible for better performance
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all animatable elements
const animatableElements = document.querySelectorAll(
    '.section-block, .work-card, .project-section, .story-section, ' +
    '.meta-item, .timeline-entry, h1, h2, h3'
);
animatableElements.forEach(el => {
    scrollObserver.observe(el);
});

/* ================================================
   SCROLL PROGRESS INDICATOR
   ================================================ */
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    let indicator = document.querySelector('.scroll-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
    }
    indicator.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress(); // Initial call

/* ================================================
   SMOOTH SCROLL
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ================================================
   TYPEWRITER
   ================================================ */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    "i'm a recent grad & engineer...",
    "i'm a solutions engineer.",
    "i'm a builder.",
    "i'm a growth operator."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 60;
const deleteSpeed = 35;
const pauseEnd = 1800;
const pauseStart = 400;

function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
        typewriterEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(type, pauseEnd);
            return;
        }
        setTimeout(type, typeSpeed);
    } else {
        typewriterEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, pauseStart);
            return;
        }
        setTimeout(type, deleteSpeed);
    }
}

type();
