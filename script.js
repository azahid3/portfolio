/* ================================================
   SCROLL REVEAL
   ================================================ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.section-block, .work-card').forEach(el => {
    observer.observe(el);
});

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
