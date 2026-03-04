document.addEventListener("DOMContentLoaded", function () {
    
    // 1. On sélectionne tous les éléments qu'on veut animer à l'apparition
    const elementsToAnimate = document.querySelectorAll(`
        #a-propos .about-text, 
        #a-propos .skills-container, 
        .timeline-item, 
        .carte-projet, 
        .certif-card, 
        .contact-links,
    `);

    // 2. On leur ajoute la classe CSS 'fade-up' (qui les cache et les décale vers le bas)
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up');
    });

    // 3. On crée un Observer pour détecter le moment où ils apparaissent à l'écran
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dès que l'élément est visible, on ajoute la classe 'visible'
                entry.target.classList.add('visible');
                
                // On arrête de l'observer pour que l'animation ne se joue qu'une seule fois
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 4. On lance l'observation sur tous nos éléments
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});