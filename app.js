// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const projectsContainer = document.getElementById('projects');
    const profileContainer = document.getElementById('profile-container');
    const currentYearElement = document.getElementById('current-year');
    
    // Portfolio data
    let portfolioData = null;
    let projectCards = [];

    // Load data from JSON file
    async function loadPortfolioData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to load portfolio data');
            }
            portfolioData = await response.json();
            renderPortfolio();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to default content or show error message
            document.body.innerHTML = '<div class="error-message">Failed to load portfolio content. Please try again later.</div>';
        }
    }

    // Render all portfolio content
    function renderPortfolio() {
        if (!portfolioData) return;
        
        renderProfile();
        renderFilterButtons();
        renderProjects();
        updateCurrentYear();
    }

    // Render profile section
    function renderProfile() {
        if (!portfolioData.profile) return;
        
        const profile = portfolioData.profile;
        
        profileContainer.innerHTML = `
            <div class="profile-image">
                <img src="${profile.image}" alt="${profile.name}" />
            </div>
            <div class="profile-content">
                <h1 class="profile-name">${profile.name}</h1>
                <p class="profile-title">${profile.title}</p>
                <p class="profile-bio">${profile.bio}</p>
                
                <div class="social-links">
                    ${profile.socialLinks.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.platform}">
                            <i class="${link.icon}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Render filter buttons
    function renderFilterButtons() {
        if (!portfolioData.filterCategories) return;
        
        filterButtonsContainer.innerHTML = portfolioData.filterCategories.map(category => `
            <button class="filter-btn ${category.value === 'all' ? 'active' : ''}" 
                    data-filter="${category.value}">
                ${category.name}
            </button>
        `).join('');
    }

    // Render projects
    function renderProjects() {
        if (!portfolioData.projects) return;
        
        projectsContainer.innerHTML = portfolioData.projects.map(project => `
            <article class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" />
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.links.map(link => `
                                <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.type}">
                                    <i class="${link.icon}"></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </article>
        `).join('');
        
        // Update projectCards reference after rendering
        projectCards = document.querySelectorAll('.project-card');
    }

    // Update current year in footer
    function updateCurrentYear() {
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.className = theme + '-theme';
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Project Filtering
    function initFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filter = btn.getAttribute('data-filter');
                
                // Filter projects
                filterProjects(filter);
                
                // Close mobile menu if open
                closeMobileMenu();
            });
        });
    }

    function filterProjects(filter) {
        projectCards.forEach(function(card) {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                // Show card
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                // Hide card
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
    }

    // Mobile Menu
    let mobileMenuOpen = false;

    function initMobileMenu() {
        if (mobileMenuToggle && filterButtonsContainer) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (mobileMenuOpen && 
                    !mobileMenuToggle.contains(e.target) && 
                    !filterButtonsContainer.contains(e.target)) {
                    closeMobileMenu();
                }
            });
        }
    }

    function toggleMobileMenu() {
        if (mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenuOpen = true;
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.add('active');
        }
        if (filterButtonsContainer) {
            filterButtonsContainer.classList.add('show');
        }
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        if (filterButtonsContainer) {
            filterButtonsContainer.classList.remove('show');
        }
    }

    // Link Handling
    function initLinks() {
        // Handle all external links
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            // Check if it's an external link or email
            if (href.startsWith('http') || href.startsWith('mailto:')) {
                e.preventDefault();
                
                if (href.startsWith('mailto:')) {
                    window.location.href = href;
                } else {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            }
        });
    }

    // Project Card Hover Effects
    function initHoverEffects() {
        projectCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                if (!card.classList.contains('hidden')) {
                    card.style.transform = 'translateY(-4px)';
                }
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Keyboard Navigation
    function initKeyboardNavigation() {
        // Filter buttons keyboard support
        document.addEventListener('keydown', function(e) {
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            filterBtns.forEach(function(btn) {
                if (document.activeElement === btn && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    btn.click();
                }
            });

            // Mobile menu keyboard support
            if (mobileMenuToggle && document.activeElement === mobileMenuToggle && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                mobileMenuToggle.click();
            }

            // Escape key to close mobile menu
            if (e.key === 'Escape' && mobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Initialize all functionality
    function init() {
        console.log('Initializing portfolio app...');
        
        loadPortfolioData().then(() => {
            initTheme();
            initFiltering();
            initMobileMenu();
            initLinks();
            initHoverEffects();
            initKeyboardNavigation();
            
            console.log('Portfolio app initialized successfully');
            
            // Show all projects by default
            filterProjects('all');
        });
    }

    // Start the application
    init();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // Handle page visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });
});