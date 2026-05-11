document.addEventListener('DOMContentLoaded', () => {
    // === THEME ENGINE dengan pengecekan null ===
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const setTheme = (theme) => {
        if (!body) return;
        body.className = theme;
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        }
        localStorage.setItem('theme', theme);
    };

    if (themeBtn) {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        themeBtn.addEventListener('click', () => setTheme(body.classList.contains('light') ? 'dark' : 'light'));
    }

    // === HASH ROUTER ===
    const app = document.getElementById('app-content');
    if (!app) return;

    const routes = {
        '#home': renderHome,
        '#portfolio': renderPortfolio,
    };

    function handleRoute() {
        const hash = window.location.hash || '#home';
        const renderFunc = routes[hash] || routes['#home'];
        renderFunc();
        window.scrollTo(0, 0);
        setTimeout(() => setupFadeInObserver(), 50);
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // === RENDER HOME ===
    function renderHome() {
        app.innerHTML = `
            <div class="hero fade-in">
                <h1>Halo, Saya <span style="color: var(--md-sys-color-primary)">Asad Labib Al Muzir</span></h1>
                <p>Developer, Worldbuilder, dan Desainer. Selamat datang di portofolio saya.</p>
            </div>
            <div class="about fade-in">
                <div class="about-avatar">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div class="about-content">
                    <h2>About Me</h2>
                    <p>Saya adalah pengembang perangkat lunak dan kreator dunia yang menggabungkan logika kode dengan imajinasi naratif. Dengan latar belakang di bidang teknik komputer dan hasrat mendalam pada desain interaktif, saya menciptakan pengalaman digital yang tidak hanya fungsional tetapi juga bermakna.</p>
                </div>
            </div>
        `;
    }

    // === RENDER PORTFOLIO ===
    function renderPortfolio() {
        let currentFilter = 'all';

        const renderGrid = () => {
            const filtered = currentFilter === 'all' 
                ? PROJECTS 
                : PROJECTS.filter(p => p.type === currentFilter);
            const gridContainer = document.getElementById('portfolio-grid');
            if (gridContainer) {
                gridContainer.innerHTML = filtered.map(createCardHTML).join('');
                setupFadeInObserver();
                attachCardParallax();
            }
        };

        app.innerHTML = `
            <div class="hero fade-in">
                <h1>Proyek Kreatif</h1>
                <p>${currentFilter === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.type === currentFilter).length} proyek</p>
            </div>
            <div class="filter-bar">
                <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Semua</button>
                <button class="filter-btn ${currentFilter === 'coding' ? 'active' : ''}" data-filter="coding">Coding</button>
                <button class="filter-btn ${currentFilter === 'worldbuilding' ? 'active' : ''}" data-filter="worldbuilding">Worldbuilding</button>
            </div>
            <div id="portfolio-grid" class="card-grid fade-in"></div>
        `;

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterVal = btn.getAttribute('data-filter');
                currentFilter = filterVal;
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const heroP = document.querySelector('.hero p');
                if (heroP) {
                    const count = currentFilter === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.type === currentFilter).length;
                    heroP.textContent = `${count} proyek`;
                }
                renderGrid();
            });
        });
        renderGrid();
    }

    function createCardHTML(project) {
        return `
            <a href="${project.url || '#'}" target="${project.url ? '_blank' : '_self'}" rel="noopener noreferrer" class="card fade-in">
                <div class="card-visual">${project.title.charAt(0)}${project.title.charAt(1)}</div>
                <h3>${project.title}</h3>
                <p>${project.desc}</p>
                <div class="tags">
                    ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </a>
        `;
    }

    // === OBSERVER FADE-IN ===
    function setupFadeInObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeElements.forEach(el => observer.observe(el));
    }

    // === PARALLAX TILT EFFECT ===
    function attachCardParallax() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                card.style.transform = `perspective(1000px) rotateX(${deltaY * -2}deg) rotateY(${deltaX * 2}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});