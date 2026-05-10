document.addEventListener('DOMContentLoaded', () => {
    // === Theme Engine ===
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const setTheme = (theme) => {
        body.className = theme;
        themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    themeBtn.addEventListener('click', () => setTheme(body.classList.contains('light') ? 'dark' : 'light'));

    // === Hash Router ===
    const app = document.getElementById('app-content');
    const routes = {
        '#home': renderHome,
        '#portfolio': renderPortfolio,
    };

    function handleRoute() {
        const hash = window.location.hash || '#home';
        const renderFunc = routes[hash] || routes['#home'];
        renderFunc();
        window.scrollTo(0, 0);
        setupFadeInObserver();
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Load pertama

    // === RENDER FUNCTIONS ===
    function renderHome() {
        app.innerHTML = `
            <div class="hero fade-in">
                <h1>Halo, Saya <span style="color: var(--md-sys-color-primary)">Asad Labib Al Muzir</span></h1>
                <p>Seorang Developer, Worldbuilder, dan Desainer. Selamat datang di protofolio saya.</p>
            </div>
            <!-- About Me Section -->
            <div class="about section fade-in">
                <div class "about-avatar">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div class="about section">
                <div class="about content">
                <h2>About Me</h2>
                <p>Saya adalah pengembang perangkat lunak dan kreator dunia yang menggabungkan logika kode dengan imajinasi naratif. Dengan latar belakang di bidang teknik komputer dan hasrat mendalam pada desain interaktif, saya menciptakan pengalaman digital yang tidak hanya fungsional tetapi juga bermakna.</p>
                </div>
            </div>
        </div>
        `;
    }

    function renderPortfolio() {
        let currentFilter = 'all'; // 'all', 'coding', 'worldbuilding', 'design'

       function renderGrid() {
           const filtered = currentFilter === 'all' 
               ? PROJECTS 
               : PROJECTS.filter(p => p.type === currentFilter);
        
           const gridContainer = document.getElementById('portfolio-grid');
           if (gridContainer) {
              gridContainer.innerHTML = filtered.map(createCardHTML).join('');
              setupFadeInObserver();
            }
        }

        app.innerHTML = `
           <div class="hero fade-in">
               <h1>Proyek</h1>
               <p>${currentFilter === 'all' ? 'Semua proyek' : PROJECTS.filter(p => p.type === currentFilter).length} proyek</p>
           </div>
           <div style="display:flex; gap:1rem; justify-content:center; margin-bottom:2rem; flex-wrap:wrap;">
               <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Semua</button>
               <button class="filter-btn ${currentFilter === 'coding' ? 'active' : ''}" data-filter="coding">Coding</button>
               <button class="filter-btn ${currentFilter === 'worldbuilding' ? 'active' : ''}" data-filter="worldbuilding">Worldbuilding</button>
               <button class="filter-btn ${currentFilter === 'design' ? 'active' : ''}" data-filter="design">Desain</button>
           </div>
           <div id="portfolio-grid" class="card-grid fade-in">
               <!-- akan diisi oleh JavaScript -->
           </div>
   `;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = btn.getAttribute('data-filter');
            if (filterValue === 'all') {
                currentFilter = 'all';
            } else if (filterValue === 'coding' || filterValue === 'worldbuilding' || filterValue === 'design') {
                currentFilter = filterValue;
            }
            // Update tampilan tombol aktif
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Update judul hero
            const heroP = document.querySelector('.hero p');
            if (heroP) {
                const count = currentFilter === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.type === currentFilter).length;
                heroP.textContent = `${count} proyek`;
            }
            // Render ulang grid
            renderGrid();
        });
    });

    // Render grid pertama kali
    renderGrid();
}

    function renderFilteredProjects(type) {
        const filtered = PROJECTS.filter(p => p.type === type);
        app.innerHTML = `
            <div class="hero fade-in">
                <h1>${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
                <p>${filtered.length} proyek</p>
            </div>
            <div class="card-grid">
                ${filtered.map(createCardHTML).join('')}
            </div>
        `;
    }

    function createCardHTML(project) {
        return `
            <a href="${project.url}" target="_blank" rel="noopener nofollow" class="card fade-in">
                <div class="card-visual">${project.title.charAt(0)}${project.title.charAt(1)}</div>
                <h3>${project.title}</h3>
                <p>${project.desc}</p>
                <div class="tags">
                    ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </a>
        `;
    }

    // === INTERSECTION OBSERVER ===
    function setupFadeInObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });
        fadeElements.forEach(el => observer.observe(el));
    }

    // === HOVER PARALLAX (Vanilla) ===
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.card:hover');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Efek tilt ringan, maksimum 6 derajat
            card.style.transform = `perspective(1000px) rotateX(${deltaY * -3}deg) rotateY(${deltaX * 3}deg) translateY(-4px)`;
        });
    });

    document.addEventListener('mouseleave', (e) => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    }, true);
});