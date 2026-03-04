document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. ANIMATIONS AU SCROLL (Fade-up)
    // ==========================================
    const elementsToAnimate = document.querySelectorAll(`
        #a-propos .about-text, 
        #a-propos .skills-container, 
        .timeline-item, 
        .carte-projet, 
        .certif-card, 
        .contact-links
    `);

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up');
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 2. GESTION DU DARK MODE (Auto + Manuel)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Cible la balise <html>

    // On vérifie que le bouton existe bien pour ne pas faire planter le script
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('ion-icon');

        // On lit la mémoire et le système
        const currentTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Fonctions pour changer de thème
        const applyDarkTheme = () => {
            htmlElement.classList.add('dark-theme');
            if (themeIcon) themeIcon.setAttribute('name', 'sunny-outline');
        };

        const applyLightTheme = () => {
            htmlElement.classList.remove('dark-theme');
            if (themeIcon) themeIcon.setAttribute('name', 'moon-outline');
        };

        // Au démarrage : on applique le bon thème
        if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }

        // Quand on clique sur le bouton
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark-theme')) {
                applyLightTheme();
                localStorage.setItem('theme', 'light');
            } else {
                applyDarkTheme();
                localStorage.setItem('theme', 'dark');
            }
        });

        // Quand on change les réglages du Mac en direct
        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                e.matches ? applyDarkTheme() : applyLightTheme();
            }
        });

    } else {
        console.warn("Le bouton Dark Mode (id='theme-toggle') est introuvable dans le HTML.");
    }
});