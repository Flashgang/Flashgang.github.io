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

    // ==========================================
    // 3. MOTEUR MULTILINGUE (i18n)
    // ==========================================
    const langSwitch = document.getElementById('lang-switch');

    // Le dictionnaire (On commence par FR et EN pour tester)
    const translations = {
        fr: {
            nav_accueil: "Accueil",
            nav_apropos: "À propos",
            nav_parcours: "Parcours",
            nav_projets: "Projets",
            nav_certifs: "Certifications",
            nav_contact: "Contact",
            
            hero_bonjour: "Bonjour, je suis <span>Théo le Bastard</span>",
            hero_titre: "Étudiant en BUT Informatique & Développeur",
            hero_desc: "Allier logique, technique et créativité pour concevoir des solutions innovantes.",
            btn_projets: "Voir mes projets",
            btn_cv: "Mon CV",

            titre_apropos: "À propos de moi",
            titre_parcours: "Expériences & Parcours",
            titre_projets: "Mes Projets",
            titre_certifs: "Certifications",
            titre_contact: "Me Contacter",

            apropos_soustitre1: "Un profil atypique et déterminé",
            apropos_p1: "Mon parcours est ma plus grande force. Initialement diplômé en <strong>Maintenance des Véhicules</strong>, j'ai choisi de me réorienter pour suivre ma véritable passion : l'informatique et le développement web. Ce passé technique m'a forgé un esprit d'analyse rigoureux et une forte capacité de résolution de problèmes.",
            apropos_p2: "Aujourd'hui en <strong>3ème année de BUT Informatique</strong> (en alternance chez Procter & Gamble), mon objectif est d'intégrer un <strong>Master MIAGE en 2026</strong>. Mon but ? Allier logique et créativité pour concevoir des solutions innovantes.",
            apropos_soustitre2: "Mes centres d'intérêt",
            apropos_p3: "En dehors de mes lignes de code, je suis un grand passionné du milieu <strong>Automobile</strong> et de <strong>Musique</strong>. Je pratique également le <strong>Golf</strong>, un sport qui m'apprend la patience et la précision — deux qualités indispensables pour un développeur !",
            qualites: "<span>Ponctuel</span> • <span>Esprit d'équipe</span> • <span>À l'écoute</span> • <span>Management</span>",
            tech_titre: "Technologies principales",
            outils_titre: "Outils & Environnement",
            // PARCOURS
            parcours_1_titre: "Alternance Software Engineer IT/OT - Procter & Gamble",
            parcours_1_desc1: "- Développement de scripts d'automatisation (Python, Node-RED) pour optimiser la collecte de données industrielles. Gestion et requêtage de bases de données SQL pour le monitoring en temps réel.",
            parcours_1_desc2: "- Création d'un système alerte SMS (Node-red / commandes AT)",
            parcours_2_titre: "BUT Informatique 3ème année en alternance",
            parcours_ecole_desc: "IUT Amiens - Conception d'applications, administration de bases de données, gestion de projets.",
            parcours_3_titre: "BUT Informatique 2ème année",
            parcours_4_titre: "Stage Développeur Web",
            parcours_4_desc: "Amiens - Ajout de fonctionnalités sur un site web de mise en ligne de cours en architecture MVC (PHP), cloud privé pour les élèves.",
            parcours_5_titre: "Stage Développeur Web",
            parcours_5_desc: "Gournay-en-Bray - Création d'un site web vitrine pour un club de football.",
            parcours_6_titre: "BTS Services Informatiques aux Organisations (SLAM)",
            parcours_7_titre: "Bac professionnel - Maintenance des véhicules automobiles",
            parcours_8_titre: "CAP - Maintenance des véhicules automobiles",

            // PROJETS
            projet_1_titre: "Site E-commerce",
            projet_1_desc: "Création d'un site de dropshipping complet avec gestion de base de données et panel administrateur.",
            projet_2_titre: "Application CDE",
            projet_2_desc: "Développement d'une application mobile de covoiturage dédiée aux étudiants.",
            projet_3_titre: "Carte Défibrillateurs",
            projet_3_desc: "Projet SAE : Conception d'une carte interactive recensant les défibrillateurs disponibles en France.",
            btn_voir_projet: "Voir le projet →",
            projet_4_desc: "Développement d'une plateforme e-commerce complète. Gestion du catalogue, panier et espace client.",
            projet_5_desc: "Création d'un application bancaire logicielle permettant la gestion des comptes et des transactions.",

            // CERTIFS & CONTACT
            certif_1: "MOOC RGPD (CNIL)",
            certif_2: "Certification PIX",
            certif_3: "Sauveteur secouriste du travail",
            contact_desc: "Un projet ? Une opportunité ? Discutons-en !",
            btn_email: "Email",
            footer_text: "© 2026 Théo le Bastard - Tous droits réservés."
        },
        en: {
            nav_accueil: "Home",
            nav_apropos: "About",
            nav_parcours: "Journey",
            nav_projets: "Projects",
            nav_certifs: "Certifications",
            nav_contact: "Contact",
            
            hero_bonjour: "Hello, I am <span>Théo le Bastard</span>",
            hero_titre: "IT Degree Student & Software Developer",
            hero_desc: "Combining logic, technique, and creativity to design innovative solutions.",
            btn_projets: "View my projects",
            btn_cv: "My Resume",

            titre_apropos: "About me",
            titre_parcours: "Experience & Journey",
            titre_projets: "My Projects",
            titre_certifs: "Certifications",
            titre_contact: "Contact Me",

            apropos_soustitre1: "An atypical and determined profile",
            apropos_p1: "My background is my greatest strength. Originally holding a degree in <strong>Vehicle Maintenance</strong>, I chose to redirect my career to follow my true passion: IT and web development. This technical past has forged a rigorous analytical mind and strong problem-solving skills.",
            apropos_p2: "Currently in my <strong>3rd year of a Bachelor in IT</strong> (work-study at Procter & Gamble), my goal is to join a <strong>Master's in IT & Business Management (MIAGE) in 2026</strong>. My objective? Combining logic and creativity to design innovative solutions.",
            apropos_soustitre2: "My interests",
            apropos_p3: "Outside of coding, I am a huge enthusiast of the <strong>Automotive</strong> industry and <strong>Music</strong>. I also play <strong>Golf</strong>, a sport that teaches me patience and precision — two essential qualities for a developer!",
            qualites: "<span>Punctual</span> • <span>Team Spirit</span> • <span>Good Listener</span> • <span>Management</span>",
            tech_titre: "Main Technologies",
            outils_titre: "Tools & Environment",

            // PARCOURS
            parcours_1_titre: "IT/OT Software Engineer Work-Study - Procter & Gamble",
            parcours_1_desc1: "- Development of automation scripts (Python, Node-RED) to optimize industrial data collection. Management and querying of SQL databases for real-time monitoring.",
            parcours_1_desc2: "- Creation of an SMS alert system (Node-RED / AT commands)",
            parcours_2_titre: "Bachelor in IT - 3rd year (Work-Study)",
            parcours_ecole_desc: "Amiens IUT - Application design, database administration, project management.",
            parcours_3_titre: "Bachelor in IT - 2nd year",
            parcours_4_titre: "Web Developer Internship",
            parcours_4_desc: "Amiens - Added features to an e-learning website using MVC architecture (PHP), private cloud for students.",
            parcours_5_titre: "Web Developer Internship",
            parcours_5_desc: "Gournay-en-Bray - Creation of a showcase website for a football club.",
            parcours_6_titre: "Higher National Diploma in IT Services (Software Solutions)",
            parcours_7_titre: "Vocational Baccalaureate - Automotive Maintenance",
            parcours_8_titre: "Vocational Training Certificate - Automotive Maintenance",

            // PROJETS
            projet_1_titre: "E-commerce Website",
            projet_1_desc: "Creation of a complete dropshipping website with database management and admin panel.",
            projet_2_titre: "CDE Application",
            projet_2_desc: "Development of a mobile carpooling application dedicated to students.",
            projet_3_titre: "Defibrillators Map",
            projet_3_desc: "SAE Project: Design of an interactive map listing available defibrillators in France.",
            btn_voir_projet: "View project →",
            projet_4_desc: "Development of a complete e-commerce platform. Catalog management, cart, and customer area.",
            projet_5_desc: "Creation of a banking software application allowing account and transaction management.",

            // CERTIFS & CONTACT
            certif_1: "GDPR MOOC (CNIL)",
            certif_2: "PIX Certification",
            certif_3: "First Aid at Work",
            contact_desc: "A project? An opportunity? Let's talk!",
            btn_email: "Email",
            footer_text: "© 2026 Théo le Bastard - All rights reserved."
        },
        es: {
            nav_accueil: "Inicio",
            nav_apropos: "Sobre mí",
            nav_parcours: "Trayectoria",
            nav_projets: "Proyectos",
            nav_certifs: "Certificaciones",
            nav_contact: "Contacto",
            
            hero_bonjour: "Hola, soy <span>Théo le Bastard</span>",
            hero_titre: "Estudiante de Informática y Desarrollador",
            hero_desc: "Combinando lógica, técnica y creatividad para diseñar soluciones innovadoras.",
            btn_projets: "Ver mis proyectos",
            btn_cv: "Mi CV",

            titre_apropos: "Sobre mí",
            titre_parcours: "Experiencia y Trayectoria",
            titre_projets: "Mis Proyectos",
            titre_certifs: "Certificaciones",
            titre_contact: "Contáctame",

            apropos_soustitre1: "Un perfil atípico y decidido",
            apropos_p1: "Mi trayectoria es mi mayor fortaleza. Inicialmente graduado en <strong>Mantenimiento de Vehículos</strong>, decidí reorientar mi carrera para seguir mi verdadera pasión: la informática y el desarrollo web. Este pasado técnico me ha forjado una mente analítica rigurosa y una gran capacidad para resolver problemas.",
            apropos_p2: "Actualmente en mi <strong>tercer año de Grado en Informática</strong> (en alternancia en Procter & Gamble), mi objetivo es ingresar a un <strong>Máster MIAGE en 2026</strong>. ¿Mi meta? Combinar lógica y creatividad para diseñar soluciones innovadoras.",
            apropos_soustitre2: "Mis intereses",
            apropos_p3: "Fuera de la programación, soy un gran apasionado del sector <strong>Automotriz</strong> y de la <strong>Música</strong>. También practico <strong>Golf</strong>, un deporte que me enseña paciencia y precisión, ¡dos cualidades indispensables para un desarrollador!",
            qualites: "<span>Puntual</span> • <span>Trabajo en equipo</span> • <span>Saber escuchar</span> • <span>Gestión</span>",
            tech_titre: "Tecnologías principales",
            outils_titre: "Herramientas y Entorno",

            // PARCOURS
            parcours_1_titre: "Alternancia Ingeniero de Software IT/OT - Procter & Gamble",
            parcours_1_desc1: "- Desarrollo de scripts de automatización (Python, Node-RED) para optimizar la recopilación de datos industriales. Gestión y consulta de bases de datos SQL para monitoreo en tiempo real.",
            parcours_1_desc2: "- Creación de un sistema de alerta SMS (Node-RED / comandos AT)",
            parcours_2_titre: "Grado en Informática 3er año en alternancia",
            parcours_ecole_desc: "IUT Amiens - Diseño de aplicaciones, administración de bases de datos, gestión de proyectos.",
            parcours_3_titre: "Grado en Informática 2do año",
            parcours_4_titre: "Prácticas Desarrollador Web",
            parcours_4_desc: "Amiens - Adición de funcionalidades en un sitio web de cursos en línea en arquitectura MVC (PHP), nube privada para estudiantes.",
            parcours_5_titre: "Prácticas Desarrollador Web",
            parcours_5_desc: "Gournay-en-Bray - Creación de un sitio web corporativo para un club de fútbol.",
            parcours_6_titre: "Técnico Superior en Servicios Informáticos (SLAM)",
            parcours_7_titre: "Bachillerato Profesional - Mantenimiento de vehículos",
            parcours_8_titre: "Certificado de Aptitud Profesional - Mantenimiento de vehículos",

            // PROYECTOS
            projet_1_titre: "Sitio E-commerce",
            projet_1_desc: "Creación de un sitio de dropshipping completo con gestión de base de datos y panel de administrador.",
            projet_2_titre: "Aplicación CDE",
            projet_2_desc: "Desarrollo de una aplicación móvil de viaje compartido dedicada a estudiantes.",
            projet_3_titre: "Mapa de Desfibriladores",
            projet_3_desc: "Proyecto SAE: Diseño de un mapa interactivo que enumera los desfibriladores disponibles en Francia.",
            btn_voir_projet: "Ver el proyecto →",
            projet_4_desc: "Desarrollo de una plataforma e-commerce completa. Gestión de catálogo, carrito y área de clientes.",
            projet_5_desc: "Creación de una aplicación de software bancario que permite la gestión de cuentas y transacciones.",

            // CERTIFICACIONES Y CONTACTO
            certif_1: "MOOC RGPD (CNIL)",
            certif_2: "Certificación PIX",
            certif_3: "Socorrista en el trabajo (SST)",
            contact_desc: "¿Un proyecto? ¿Una oportunidad? ¡Hablemos!",
            btn_email: "Email",
            footer_text: "© 2026 Théo le Bastard - Todos los derechos reservados."
        },
        it: {
            nav_accueil: "Home",
            nav_apropos: "Chi sono",
            nav_parcours: "Percorso",
            nav_projets: "Progetti",
            nav_certifs: "Certificazioni",
            nav_contact: "Contatti",
            
            hero_bonjour: "Ciao, sono <span>Théo le Bastard</span>",
            hero_titre: "Studente di Informatica e Sviluppatore",
            hero_desc: "Unire logica, tecnica e creatività per progettare soluzioni innovative.",
            btn_projets: "Vedi i miei progetti",
            btn_cv: "Il mio CV",

            titre_apropos: "Chi sono",
            titre_parcours: "Esperienza e Percorso",
            titre_projets: "I miei Progetti",
            titre_certifs: "Certificazioni",
            titre_contact: "Contattami",

            apropos_soustitre1: "Un profilo atipico e determinato",
            apropos_p1: "Il mio percorso è il mio punto di forza. Inizialmente diplomato in <strong>Manutenzione dei Veicoli</strong>, ho scelto di cambiare strada per seguire la mia vera passione: l'informatica e lo sviluppo web. Questo passato tecnico mi ha fornito un rigoroso spirito analitico e forti capacità di problem-solving.",
            apropos_p2: "Attualmente al <strong>3° anno di Laurea in Informatica</strong> (in apprendistato presso Procter & Gamble), il mio obiettivo è iscrivermi a un <strong>Master MIAGE nel 2026</strong>. Il mio scopo? Unire logica e creatività per progettare soluzioni innovative.",
            apropos_soustitre2: "I miei interessi",
            apropos_p3: "Oltre alla programmazione, sono un grande appassionato del settore <strong>Automobilistico</strong> e della <strong>Musica</strong>. Gioco anche a <strong>Golf</strong>, uno sport che mi insegna pazienza e precisione — due qualità indispensabili per uno sviluppatore!",
            qualites: "<span>Puntuale</span> • <span>Spirito di squadra</span> • <span>Buon ascoltatore</span> • <span>Management</span>",
            tech_titre: "Tecnologie principali",
            outils_titre: "Strumenti e Ambiente",

            // PARCOURS
            parcours_1_titre: "Apprendistato Software Engineer IT/OT - Procter & Gamble",
            parcours_1_desc1: "- Sviluppo di script di automazione (Python, Node-RED) per ottimizzare la raccolta di dati industriali. Gestione e interrogazione di database SQL per il monitoraggio in tempo reale.",
            parcours_1_desc2: "- Creazione di un sistema di allarme SMS (Node-RED / comandi AT)",
            parcours_2_titre: "Laurea in Informatica 3° anno (Apprendistato)",
            parcours_ecole_desc: "IUT Amiens - Progettazione di applicazioni, amministrazione di database, gestione di progetti.",
            parcours_3_titre: "Laurea in Informatica 2° anno",
            parcours_4_titre: "Stage Sviluppatore Web",
            parcours_4_desc: "Amiens - Aggiunta di funzionalità su un sito web di e-learning con architettura MVC (PHP), cloud privato per gli studenti.",
            parcours_5_titre: "Stage Sviluppatore Web",
            parcours_5_desc: "Gournay-en-Bray - Creazione di un sito vetrina per una squadra di calcio.",
            parcours_6_titre: "Diploma Tecnico Superiore in Servizi Informatici (SLAM)",
            parcours_7_titre: "Maturità Professionale - Manutenzione dei veicoli",
            parcours_8_titre: "Certificato di Formazione Professionale - Manutenzione dei veicoli",

            // PROJETTI
            projet_1_titre: "Sito E-commerce",
            projet_1_desc: "Creazione di un sito di dropshipping completo con gestione del database e pannello di amministrazione.",
            projet_2_titre: "Applicazione CDE",
            projet_2_desc: "Sviluppo di un'applicazione mobile di carpooling dedicata agli studenti.",
            projet_3_titre: "Mappa Defibrillatori",
            projet_3_desc: "Progetto SAE: Progettazione di una mappa interattiva dei defibrillatori disponibili in Francia.",
            btn_voir_projet: "Vedi il progetto →",
            projet_4_desc: "Sviluppo di una piattaforma e-commerce completa. Gestione del catalogo, carrello e area clienti.",
            projet_5_desc: "Creazione di un'applicazione software bancaria per la gestione di conti e transazioni.",

            // CERTIFICAZIONI E CONTATTI
            certif_1: "MOOC GDPR (CNIL)",
            certif_2: "Certificazione PIX",
            certif_3: "Primo Soccorso sul Lavoro (SST)",
            contact_desc: "Un progetto? Un'opportunità? Parliamone!",
            btn_email: "Email",
            footer_text: "© 2026 Théo le Bastard - Tutti i diritti riservati."
        },
        zh: {
            nav_accueil: "首页",
            nav_apropos: "关于我",
            nav_parcours: "历程",
            nav_projets: "项目",
            nav_certifs: "证书",
            nav_contact: "联系我",
            
            hero_bonjour: "你好，我是 <span>Théo le Bastard</span>",
            hero_titre: "计算机专业学生 & 软件开发者",
            hero_desc: "结合逻辑、技术与创意，设计创新解决方案。",
            btn_projets: "查看我的项目",
            btn_cv: "我的简历",

            titre_apropos: "关于我",
            titre_parcours: "经验与历程",
            titre_projets: "我的项目",
            titre_certifs: "证书",
            titre_contact: "联系我",

            apropos_soustitre1: "一个与众不同且坚定的背景",
            apropos_p1: "我的经历是我最大的优势。最初毕业于<strong>汽车维修专业</strong>，我选择转行追随我真正的热情：计算机科学和Web开发。这段技术背景为我培养了严谨的分析头脑和强大的解决问题的能力。",
            apropos_p2: "目前我是<strong>计算机学士三年级学生</strong>（在宝洁公司半工半读），我的目标是在2026年攻读<strong>MIAGE硕士学位</strong>。我的目标是什么？结合逻辑与创造力来设计创新的解决方案。",
            apropos_soustitre2: "我的兴趣",
            apropos_p3: "在写代码之外，我非常热爱<strong>汽车工业</strong>和<strong>音乐</strong>。我也打<strong>高尔夫</strong>，这项运动教会了我耐心和精确——这是开发者不可或缺的两个品质！",
            qualites: "<span>守时</span> • <span>团队精神</span> • <span>善于倾听</span> • <span>管理能力</span>",
            tech_titre: "主要技术",
            outils_titre: "工具与环境",

            // PARCOURS
            parcours_1_titre: "IT/OT 软件工程师实习 (半工半读) - Procter & Gamble",
            parcours_1_desc1: "- 开发自动化脚本 (Python, Node-RED) 以优化工业数据收集。管理和查询SQL数据库以进行实时监控。",
            parcours_1_desc2: "- 创建短信警报系统 (Node-RED / AT命令)",
            parcours_2_titre: "计算机学士 3年级 (半工半读)",
            parcours_ecole_desc: "亚眠 IUT - 应用程序设计，数据库管理，项目管理。",
            parcours_3_titre: "计算机学士 2年级",
            parcours_4_titre: "Web开发实习生",
            parcours_4_desc: "亚眠 - 使用MVC架构 (PHP) 为在线课程网站添加功能，为学生提供私有云。",
            parcours_5_titre: "Web开发实习生",
            parcours_5_desc: "Gournay-en-Bray - 为足球俱乐部创建展示网站。",
            parcours_6_titre: "高级国家IT服务文凭 (SLAM)",
            parcours_7_titre: "职业高中毕业 - 汽车维修",
            parcours_8_titre: "职业资格证书 - 汽车维修",

            // PROJETS
            projet_1_titre: "电子商务网站",
            projet_1_desc: "创建一个带有数据库管理和管理面板的完整代发货(dropshipping)网站。",
            projet_2_titre: "CDE 应用程序",
            projet_2_desc: "开发一款专为学生设计的拼车移动应用程序。",
            projet_3_titre: "除颤器地图",
            projet_3_desc: "SAE项目：设计一个列出法国可用除颤器的交互式地图。",
            btn_voir_projet: "查看项目 →",
            projet_4_desc: "开发一个完整的电子商务平台。目录管理，购物车和客户区。",
            projet_5_desc: "创建一个允许管理账户和交易的银行软件应用程序。",

            // CERTIFS & CONTACT
            certif_1: "GDPR MOOC (CNIL)",
            certif_2: "PIX 认证",
            certif_3: "职场急救员 (SST)",
            contact_desc: "有项目？有机会？我们聊聊吧！",
            btn_email: "电子邮件",
            footer_text: "© 2026 Théo le Bastard - 保留所有权利。"
        },
        ja: {
            nav_accueil: "ホーム",
            nav_apropos: "私について",
            nav_parcours: "経歴",
            nav_projets: "プロジェクト",
            nav_certifs: "資格",
            nav_contact: "連絡先",
            
            hero_bonjour: "こんにちは、<span>Théo le Bastard</span>です",
            hero_titre: "情報学の学生 ＆ ソフトウェア開発者",
            hero_desc: "論理、技術、創造性を組み合わせて、革新的なソリューションを設計します。",
            btn_projets: "プロジェクトを見る",
            btn_cv: "履歴書",

            titre_apropos: "私について",
            titre_parcours: "経験と経歴",
            titre_projets: "マイプロジェクト",
            titre_certifs: "資格",
            titre_contact: "お問い合わせ",

            apropos_soustitre1: "異色で決意に満ちたプロフィール",
            apropos_p1: "私の経歴は最大の強みです。元々は<strong>自動車整備</strong>の学位を取得していましたが、真の情熱であるITとWeb開発を追求するためにキャリアの方向転換を決意しました。この技術的な背景が、厳密な分析力と強力な問題解決能力を養ってくれました。",
            apropos_p2: "現在、<strong>情報学学士の3年生</strong>（Procter & Gambleでのワークスタディ）であり、目標は2026年に<strong>MIAGE修士課程</strong>に進学することです。私の目標は？論理と創造性を組み合わせて革新的なソリューションを設計することです。",
            apropos_soustitre2: "私の趣味",
            apropos_p3: "コーディング以外では、<strong>自動車業界</strong>と<strong>音楽</strong>の大ファンです。また、<strong>ゴルフ</strong>もプレイしています。このスポーツは忍耐力と正確さを教えてくれます。これは開発者にとって不可欠な2つの資質です！",
            qualites: "<span>時間厳守</span> • <span>チームワーク</span> • <span>傾聴力</span> • <span>マネジメント</span>",
            tech_titre: "主な技術",
            outils_titre: "ツールと環境",

            // PARCOURS
            parcours_1_titre: "IT/OT ソフトウェアエンジニア研修 - Procter & Gamble",
            parcours_1_desc1: "- 産業データの収集を最適化するための自動化スクリプト（Python、Node-RED）の開発。リアルタイム監視のためのSQLデータベースの管理とクエリ。",
            parcours_1_desc2: "- SMSアラートシステムの作成（Node-RED / ATコマンド）",
            parcours_2_titre: "情報学学士 3年目（ワークスタディ）",
            parcours_ecole_desc: "アミアン IUT - アプリケーション設計、データベース管理、プロジェクト管理。",
            parcours_3_titre: "情報学学士 2年目",
            parcours_4_titre: "Web開発インターン",
            parcours_4_desc: "アミアン - MVCアーキテクチャ（PHP）を使用したオンラインコースWebサイトへの機能追加、学生向けプライベートクラウド。",
            parcours_5_titre: "Web開発インターン",
            parcours_5_desc: "Gournay-en-Bray - サッカークラブのショーケースWebサイトの作成。",
            parcours_6_titre: "ITサービス高等技術資格（SLAM）",
            parcours_7_titre: "職業バカロレア - 自動車整備",
            parcours_8_titre: "職業適性証 - 自動車整備",

            // PROJETS
            projet_1_titre: "Eコマースサイト",
            projet_1_desc: "データベース管理と管理パネルを備えた完全なドロップシッピングWebサイトの作成。",
            projet_2_titre: "CDE アプリケーション",
            projet_2_desc: "学生向けのカープールモバイルアプリケーションの開発。",
            projet_3_titre: "AED（除細動器）マップ",
            projet_3_desc: "SAEプロジェクト：フランスで利用可能なAEDをリストアップするインタラクティブマップの設計。",
            btn_voir_projet: "プロジェクトを見る →",
            projet_4_desc: "完全なEコマースプラットフォームの開発。カタログ管理、カート、顧客エリア。",
            projet_5_desc: "口座と取引の管理を可能にする銀行ソフトウェアアプリケーションの作成。",

            // CERTIFS & CONTACT
            certif_1: "GDPR MOOC（CNIL）",
            certif_2: "PIX 認定",
            certif_3: "職場における応急救護員（SST）",
            contact_desc: "プロジェクト？機会？ぜひお話ししましょう！",
            btn_email: "Eメール",
            footer_text: "© 2026 Théo le Bastard - 無断転載を禁じます。"
        },
        ar: {
            nav_accueil: "الرئيسية",
            nav_apropos: "نبذة عني",
            nav_parcours: "المسار",
            nav_projets: "المشاريع",
            nav_certifs: "الشهادات",
            nav_contact: "اتصل بي",
            
            hero_bonjour: "مرحباً، أنا <span>ثيو لو باستارد</span>",
            hero_titre: "طالب في تكنولوجيا المعلومات ومطور برامج",
            hero_desc: "الجمع بين المنطق والتقنية والإبداع لتصميم حلول مبتكرة.",
            btn_projets: "عرض مشاريعي",
            btn_cv: "سيرتي الذاتية",

            titre_apropos: "نبذة عني",
            titre_parcours: "الخبرة والمسار",
            titre_projets: "مشاريعي",
            titre_certifs: "الشهادات",
            titre_contact: "اتصل بي",

            apropos_soustitre1: "مسار استثنائي وعزيمة قوية",
            apropos_p1: "مساري هو أكبر نقاط قوتي. بعد حصولي في البداية على دبلوم في <strong>صيانة المركبات</strong>، اخترت تغيير مساري المهني لمتابعة شغفي الحقيقي: تكنولوجيا المعلومات وتطوير الويب. لقد صقلت هذه الخلفية التقنية عقلي التحليلي القوي وقدرتي الكبيرة على حل المشكلات.",
            apropos_p2: "أنا حاليًا في <strong>السنة الثالثة من البكالوريوس في تكنولوجيا المعلومات</strong> (تدريب مهني في شركة بروكتر آند جامبل)، وهدفي هو الالتحاق ببرنامج <strong>الماجستير MIAGE في عام 2026</strong>. هدفي؟ الجمع بين المنطق والإبداع لتصميم حلول مبتكرة.",
            apropos_soustitre2: "اهتماماتي",
            apropos_p3: "خارج مجال البرمجة، أنا شغوف جدًا بقطاع <strong>السيارات</strong> و<strong>الموسيقى</strong>. أمارس أيضًا <strong>الجولف</strong>، وهي رياضة تعلمني الصبر والدقة — وهما صفتان لا غنى عنهما لأي مطور برامج!",
            qualites: "<span>دقيق في المواعيد</span> • <span>روح الفريق</span> • <span>مستمع جيد</span> • <span>الإدارة</span>",
            tech_titre: "التقنيات الرئيسية",
            outils_titre: "الأدوات وبيئة العمل",

            // PARCOURS
            parcours_1_titre: "مهندس برمجيات IT/OT (تدريب مهني) - بروكتر آند جامبل",
            parcours_1_desc1: "- تطوير نصوص الأتمتة (Python, Node-RED) لتحسين جمع البيانات الصناعية. إدارة والاستعلام عن قواعد بيانات SQL للمراقبة في الوقت الفعلي.",
            parcours_1_desc2: "- إنشاء نظام تنبيه عبر الرسائل القصيرة SMS (Node-RED / أوامر AT)",
            parcours_2_titre: "بكالوريوس في تكنولوجيا المعلومات - السنة الثالثة (تدريب مهني)",
            parcours_ecole_desc: "معهد التكنولوجيا الجامعي (IUT) أميان - تصميم التطبيقات، إدارة قواعد البيانات، إدارة المشاريع.",
            parcours_3_titre: "بكالوريوس في تكنولوجيا المعلومات - السنة الثانية",
            parcours_4_titre: "متدرب مطور ويب",
            parcours_4_desc: "أميان - إضافة ميزات إلى موقع ويب تعليمي باستخدام بنية MVC (PHP)، سحابة خاصة للطلاب.",
            parcours_5_titre: "متدرب مطور ويب",
            parcours_5_desc: "غورناي أون براي - إنشاء موقع إلكتروني تعريفي لنادي كرة قدم.",
            parcours_6_titre: "الدبلوم التقني العالي في خدمات تكنولوجيا المعلومات (SLAM)",
            parcours_7_titre: "البكالوريا المهنية - صيانة السيارات",
            parcours_8_titre: "شهادة الكفاءة المهنية - صيانة السيارات",

            // PROJETS
            projet_1_titre: "موقع تجارة إلكترونية",
            projet_1_desc: "إنشاء موقع دروبشيبينغ متكامل مع إدارة قاعدة البيانات ولوحة تحكم للمسؤول.",
            projet_2_titre: "تطبيق CDE",
            projet_2_desc: "تطوير تطبيق جوال لمشاركة السيارات مخصص للطلاب.",
            projet_3_titre: "خريطة أجهزة تنظيم ضربات القلب",
            projet_3_desc: "مشروع SAE: تصميم خريطة تفاعلية تسرد أجهزة تنظيم ضربات القلب المتاحة في فرنسا.",
            btn_voir_projet: "عرض المشروع ←",
            projet_4_desc: "تطوير منصة تجارة إلكترونية متكاملة. إدارة الكتالوج، سلة التسوق، ومنطقة العملاء.",
            projet_5_desc: "إنشاء تطبيق برمجي مصرفي يسمح بإدارة الحسابات والمعاملات.",

            // CERTIFS & CONTACT
            certif_1: "دورة مكثفة (MOOC) لحماية البيانات (CNIL)",
            certif_2: "شهادة PIX",
            certif_3: "مسعف أولي في العمل (SST)",
            contact_desc: "هل لديك مشروع؟ فرصة؟ دعنا نتحدث!",
            btn_email: "البريد الإلكتروني",
            footer_text: "© 2026 ثيو لو باستارد - جميع الحقوق محفوظة."
        }
        
    };

    // Fonction qui met à jour les textes
    const setLanguage = (lang) => {
        // Sauvegarde le choix
        localStorage.setItem('lang', lang);
        langSwitch.value = lang;

        // Gérer le sens de lecture pour l'Arabe
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }

        // On cherche tous les éléments qui ont un attribut data-i18n
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            // Si la traduction existe dans la langue choisie, on remplace le HTML
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    };

    // Au chargement, on regarde s'il y a déjà une langue sauvegardée (sinon on met 'fr')
    const savedLang = localStorage.getItem('lang') || 'fr';
    setLanguage(savedLang);

    // Quand on change le menu déroulant
    if (langSwitch) {
        langSwitch.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

});