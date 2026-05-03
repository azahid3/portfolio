/* ================================================
   PROJECT FILTERING
   ================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Show/hide cards based on filter
        workCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
            } else {
                const category = card.getAttribute('data-category');
                if (category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

/* ================================================
   SCROLL REVEAL (reuse from main script)
   ================================================ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.work-card').forEach(el => {
    observer.observe(el);
});
