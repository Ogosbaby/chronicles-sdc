/**
 * CHRONICLES SDC — OFFICIAL CLIENT SCRIPT
 * Pure Vanilla JavaScript
 * Ed-Tech & Software Engineering · Ikeja GRA, Lagos
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO SLIDER CONTROLLER (Staged 12s sequence for Slide 1, then product slides)
     ========================================================================== */
  const heroSlider = document.querySelector('.hero-slider-container');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideTimeout = null;

    // Slide 1 has a fast, punchy staged text/button entrance (~1.8s) + full display hold = 6s
    // SuccessTAB (Slide 2) and SuccessBox (Slide 3) each display for 6s
    const slideDurations = [6000, 6000, 6000];


    function showSlide(index) {
      const isLoopingToFirst =
        currentSlide === slides.length - 1 && index === 0;

      const prevSlide = slides[currentSlide];
      const nextSlideEl = slides[index];

      if (isLoopingToFirst) {
        // Hide Slide 3 immediately, without an exit animation.
        if (prevSlide && prevSlide !== nextSlideEl) {
          prevSlide.classList.remove(
            'active',
            'animating',
            'slide-out-left',
            'no-entrance'
          );

          prevSlide.classList.add('instant-hide');
          prevSlide.setAttribute('aria-hidden', 'true');
        }

        // Show Slide 1 immediately, without a slide entrance transition.
        nextSlideEl.classList.remove(
          'slide-out-left',
          'instant-hide',
          'animating'
        );

        nextSlideEl.classList.add('no-entrance', 'active');
        nextSlideEl.setAttribute('aria-hidden', 'false');

        // Force the browser to apply the visible state.
        void nextSlideEl.offsetWidth;

        // Restart the staged text animation independently.
        nextSlideEl.classList.add('animating');

        // Remove temporary classes after the browser has applied the state.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            nextSlideEl.classList.remove('no-entrance');

            if (prevSlide && prevSlide !== nextSlideEl) {
              prevSlide.classList.remove('instant-hide');
            }
          });
        });

        // Reset any other inactive slides.
        slides.forEach((slide, i) => {
          if (i !== index && i !== currentSlide) {
            slide.classList.remove(
              'active',
              'animating',
              'slide-out-left',
              'no-entrance',
              'instant-hide'
            );
            slide.setAttribute('aria-hidden', 'true');
          }
        });

      } else {
        // Normal transitions between slides.
        slides.forEach((slide, i) => {
          if (i === currentSlide && i !== index) {
            slide.classList.remove(
              'active',
              'animating',
              'no-entrance',
              'instant-hide'
            );

            slide.classList.add('slide-out-left');
            slide.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
              slide.classList.remove('slide-out-left');
            }, 750);

          } else if (i === index) {
            slide.classList.remove(
              'slide-out-left',
              'no-entrance',
              'instant-hide'
            );

            slide.classList.add('active');
            slide.setAttribute('aria-hidden', 'false');

            if (i === 0) {
              slide.classList.remove('animating');
              void slide.offsetWidth;
              slide.classList.add('animating');
            }

          } else {
            slide.classList.remove(
              'active',
              'animating',
              'slide-out-left',
              'no-entrance',
              'instant-hide'
            );

            slide.setAttribute('aria-hidden', 'true');
          }
        });
      }

      currentSlide = index;
      scheduleNextSlide();
    }


    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }

    function scheduleNextSlide() {
      if (slideTimeout) clearTimeout(slideTimeout);
      const duration = slideDurations[currentSlide] || 4000;
      slideTimeout = setTimeout(nextSlide, duration);
    }

    // Initialize first slide and start automatic timed rotation
    if (slides.length > 0) {
      showSlide(0);

      // Support subtle left/right arrow keys when focused
      heroSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(prevIndex);
        }
      });
    }
  }

  /* ==========================================================================
     2. PRODUCTS MEGA DROPDOWN (NVIDIA STYLE)
     ========================================================================== */
  const btnProductsDropdown = document.getElementById('btnProductsDropdown');
  const productsMegaMenu = document.getElementById('productsMegaMenu');
  const isProductsPage = window.location.pathname.endsWith('products.html') ||
                         window.location.pathname.endsWith('/products') ||
                         window.location.pathname.endsWith('/products/');

  // Store initial base URL for reverting when closing
  let basePageUrl = window.location.pathname;
  if (basePageUrl.endsWith('/products') || basePageUrl.endsWith('/products/')) {
    basePageUrl = window.location.pathname.replace(/\/products\/?$/, '') || '/';
  }

  // Track original active nav link (e.g. Home on index.html) so Home and Products are NEVER active simultaneously
  let originalActiveNavLink = document.querySelector('.main-nav .nav-link.active:not(#btnProductsDropdown)');

  // Background Dim Backdrop Overlay
  let dropdownBackdrop = document.getElementById('dropdownBackdrop');
  if (!dropdownBackdrop) {
    dropdownBackdrop = document.createElement('div');
    dropdownBackdrop.id = 'dropdownBackdrop';
    dropdownBackdrop.className = 'dropdown-backdrop';
    dropdownBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dropdownBackdrop);
  }

  function setBackgroundDim(active) {
    if (active) {
      document.body.classList.add('dropdown-dimmed');
      if (dropdownBackdrop) dropdownBackdrop.classList.add('active');
    } else {
      document.body.classList.remove('dropdown-dimmed');
      if (!document.body.classList.contains('mobile-nav-open')) {
        if (dropdownBackdrop) dropdownBackdrop.classList.remove('active');
      }
    }
  }

  function openProductsMegaMenu(updateHistory = true) {
    if (!productsMegaMenu || !btnProductsDropdown) return;
    productsMegaMenu.classList.add('show', 'stay-open');
    btnProductsDropdown.classList.add('open', 'stay-open', 'active');
    btnProductsDropdown.setAttribute('aria-expanded', 'true');

    // Dim the background
    setBackgroundDim(true);

    // Deselect Home (or any other active nav link) so Home and Products are NEVER active together
    if (!originalActiveNavLink) {
      originalActiveNavLink = document.querySelector('.main-nav .nav-link.active:not(#btnProductsDropdown)');
    }
    if (originalActiveNavLink) {
      originalActiveNavLink.classList.remove('active');
      originalActiveNavLink.removeAttribute('aria-current');
    }

    if (exploreMenu) {
      exploreMenu.classList.remove('show');
      if (btnExplore) btnExplore.classList.remove('open');
    }
    if (supportMenu) {
      supportMenu.classList.remove('show');
      if (btnSupport && !isContactPage) btnSupport.classList.remove('active');
    }

    if (updateHistory) {
      try {
        if (!window.location.pathname.endsWith('/products') && !window.location.pathname.endsWith('/products/')) {
          const targetUrl = window.location.protocol === 'file:' ? '#products' : '/products';
          window.history.pushState({ megaMenu: 'products' }, 'Products | Chronicles SDC', targetUrl);
        }
      } catch (err) {
        window.location.hash = 'products';
      }
    }
  }

  function closeProductsMegaMenu(updateHistory = true) {
    if (!productsMegaMenu || !btnProductsDropdown) return;
    productsMegaMenu.classList.remove('show', 'stay-open');
    btnProductsDropdown.classList.remove('open', 'stay-open');

    // Clear background dim
    setBackgroundDim(false);

    if (!isProductsPage) {
      btnProductsDropdown.classList.remove('active');
      // Restore Home or original active nav link when Products is closed
      if (originalActiveNavLink) {
        originalActiveNavLink.classList.add('active');
        originalActiveNavLink.setAttribute('aria-current', 'page');
      }
    }
    btnProductsDropdown.setAttribute('aria-expanded', 'false');

    if (updateHistory) {
      try {
        if (window.location.pathname.endsWith('/products') || window.location.pathname.endsWith('/products/')) {
          const fallback = basePageUrl || '/';
          window.history.pushState({ megaMenu: null }, document.title, fallback);
        } else if (window.location.hash === '#products') {
          window.history.replaceState(null, document.title, window.location.pathname);
        }
      } catch (err) {
        if (window.location.hash === '#products') {
          window.location.hash = '';
        }
      }
    }
  }

  /* ==========================================================================
     3. SUPPORT BUTTON & FLYOUT DESK
     ========================================================================== */
  const btnSupport = document.getElementById('btnSupport');
  const supportMenu = document.getElementById('supportMenu');
  const isContactPage = window.location.pathname.endsWith('contact.html') || document.body.classList.contains('contact-page');

  /* ==========================================================================
     4. EXPLORE DROPDOWN CONTROLLER
     ========================================================================== */
  const btnExplore = document.getElementById('btnExplore');
  const exploreMenu = document.getElementById('exploreMenu');

  // Wire up Products Mega Dropdown (Stay when clicked & /products routing)
  if (btnProductsDropdown && productsMegaMenu) {
    btnProductsDropdown.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isStaying = productsMegaMenu.classList.contains('stay-open');
      if (isStaying) {
        closeProductsMegaMenu(true);
      } else {
        openProductsMegaMenu(true);
      }
    });

    // Sidebar Tab Switching ONLY on Click (Category stays until another category is clicked)
    const megaSidebarBtns = productsMegaMenu.querySelectorAll('.mega-sidebar-btn');
    const megaTabPanels = productsMegaMenu.querySelectorAll('.mega-tab-panel');

    function switchMegaTab(targetId) {
      megaSidebarBtns.forEach((btn) => {
        const isActive = btn.getAttribute('data-tab') === targetId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      megaTabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    }

    megaSidebarBtns.forEach((btn) => {
      // Category stays active until another category is clicked
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = btn.getAttribute('data-tab');
        if (targetId) switchMegaTab(targetId);
      });
    });

    productsMegaMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeProductsMegaMenu(true);
      });
    });

    // Sync with browser back/forward history
    window.addEventListener('popstate', () => {
      const atProducts = window.location.pathname.endsWith('/products') ||
                         window.location.pathname.endsWith('/products/') ||
                         window.location.hash === '#products';
      if (atProducts) {
        openProductsMegaMenu(false);
      } else {
        closeProductsMegaMenu(false);
      }
    });

    // Automatically stay open if loaded directly on /products, products.html, or #products
    const shouldStayOpenOnLoad = window.location.pathname.endsWith('/products') ||
                                 window.location.pathname.endsWith('/products/') ||
                                 window.location.pathname.endsWith('products.html') ||
                                 window.location.hash === '#products';
    if (shouldStayOpenOnLoad) {
      openProductsMegaMenu(false);
    }
  }

  // Handle desktop hover background dimming
  const productsDropdownWrap = document.getElementById('productsDropdownWrap');
  if (productsDropdownWrap) {
    productsDropdownWrap.addEventListener('mouseenter', () => {
      setBackgroundDim(true);
    });
    productsDropdownWrap.addEventListener('mouseleave', () => {
      if (!productsMegaMenu || !productsMegaMenu.classList.contains('stay-open')) {
        setBackgroundDim(false);
      }
    });
  }

  // Dismiss dropdown & mobile nav when clicking on the dimmed background backdrop
  if (dropdownBackdrop) {
    dropdownBackdrop.addEventListener('click', () => {
      closeProductsMegaMenu(true);
      closeMobileNav();
    });
  }

  // 'View more' button in Products section -> scrolls to top & opens mega dropdown
  const btnViewMoreProducts = document.getElementById('btnViewMoreProducts');
  if (btnViewMoreProducts) {
    btnViewMoreProducts.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      openProductsMegaMenu(true);
    });
  }

  // Explore button in header -> Smooth scroll to 'Our Products' section on index
  document.querySelectorAll('.btn-explore-nav').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetHash = btn.getAttribute('href');
      if (targetHash === '#flagship-products' || (targetHash && targetHash.endsWith('#flagship-products') && window.location.pathname.endsWith('index.html'))) {
        const targetEl = document.getElementById('flagship-products');
        if (targetEl) {
          e.preventDefault();
          closeProductsMegaMenu(true);
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ==========================================================================
     3. SITE-WIDE SEARCH SYSTEM (SEARCHES WHOLE WEBSITE)
     ========================================================================== */
  const siteIndex = [
    {
      title: 'SuccessBox',
      category: 'Software',
      categoryClass: 'software',
      desc: '50,000+ past questions & mock exam engine for WAEC, JAMB, UTME & BECE candidates with AI analytics.',
      url: 'https://successbox.net',
      external: true,
      keywords: ['exam', 'cbt', 'jamb', 'waec', 'bece', 'practice', 'mock', 'questions', 'secondary', 'primary', 'test']
    },
    {
      title: 'SuccessTAB',
      category: 'Hardware',
      categoryClass: 'hardware',
      desc: 'Rugged 10-inch educational tablet preloaded with NERDC curriculum textbooks, video lessons, and offline tests.',
      url: 'https://successtabs.com',
      external: true,
      keywords: ['tablet', 'offline', 'hardware', 'device', 'nerdc', 'textbooks', 'videos', 'screen', 'kids']
    },
    {
      title: 'ClassBeam',
      category: 'Hardware',
      categoryClass: 'hardware',
      desc: 'Smart interactive classroom projector and digital whiteboard casting solution for dynamic collaboration.',
      url: 'https://classbeam.com',
      external: true,
      keywords: ['projector', 'smart classroom', 'interactive', 'whiteboard', 'screen casting', 'hardware', 'multimedia']
    },
    {
      title: 'AI Academy',
      category: 'Academy',
      categoryClass: 'academy',
      desc: 'Applied AI literacy, Python programming, machine learning, and robotics labs for students.',
      url: 'https://aiacademy.ng',
      external: true,
      keywords: ['ai', 'artificial intelligence', 'coding', 'python', 'robotics', 'stem', 'academy', 'students', 'machine learning']
    },
    {
      title: 'IGCSE Master Prep',
      category: 'Software',
      categoryClass: 'software',
      desc: 'Cambridge international curriculum practice, mock tests, and diagnostic analytics.',
      url: 'https://igcsemasterprep.com',
      external: true,
      keywords: ['igcse', 'cambridge', 'international', 'british curriculum', 'prep', 'mock', 'exam']
    },
    {
      title: 'Eko Test Centre',
      category: 'Software',
      categoryClass: 'software',
      desc: 'Statewide secondary school assessment engine and WAEC predictive modeling platform for Lagos State.',
      url: 'https://ekotestcentre.com',
      external: true,
      keywords: ['eko', 'lagos', 'statewide', 'predictive modeling', 'secondary school', 'assessment']
    },
    {
      title: 'SuccessBox Enterprise',
      category: 'Software',
      categoryClass: 'software',
      desc: 'All-in-one digital school learning platform aligned to 2025 NERDC curriculum with teacher LMS.',
      url: 'https://successbox.net/enterprise',
      external: true,
      keywords: ['enterprise', 'school lms', 'curriculum', 'teacher platform', 'nerdc 2025', 'institution']
    },
    {
      title: 'Educators Tech Academy',
      category: 'Academy',
      categoryClass: 'academy',
      desc: 'Digital pedagogy, modern classroom tech certification, LMS management, and teacher upskilling.',
      url: 'https://educatorstechacademy.com',
      external: true,
      keywords: ['teachers', 'educators', 'training', 'cpd', 'pedagogy', 'certification', 'lms management']
    },
    {
      title: 'School Management System',
      category: 'Enterprise',
      categoryClass: 'enterprise',
      desc: 'Attendance tracking, gradebooks, fees invoicing, and secure parent portal administration.',
      url: 'contact.html',
      external: false,
      keywords: ['school management', 'fees', 'attendance', 'gradebook', 'parent portal', 'admin', 'sms']
    },
    {
      title: 'School CBT Center Setup',
      category: 'Enterprise',
      categoryClass: 'enterprise',
      desc: 'Turnkey digital examination infrastructure, local offline servers, and exam lab deployment.',
      url: 'contact.html',
      external: false,
      keywords: ['cbt setup', 'exam infrastructure', 'local server', 'offline server', 'computer lab', 'networking']
    },
    {
      title: 'Custom Software Engineering',
      category: 'Enterprise',
      categoryClass: 'enterprise',
      desc: 'Bespoke web, mobile, and cloud software engineering built for organizations and financial institutions.',
      url: 'contact.html',
      external: false,
      keywords: ['custom software', 'bespoke', 'engineering', 'web app', 'mobile app', 'cloud platform', 'consulting']
    },
    {
      title: 'About Chronicles SDC',
      category: 'Page',
      categoryClass: 'page',
      desc: '15+ years of EdTech innovation, 10M+ learners impacted, our leadership, history, and pan-African mission.',
      url: 'about.html',
      external: false,
      keywords: ['about', 'history', 'story', 'company', 'lagos', 'ikeja', 'mission', 'vision', 'learners', 'founders']
    },
    {
      title: 'Our Core Pillars & Philosophy',
      category: 'Page',
      categoryClass: 'page',
      desc: 'Research-driven pedagogy, offline-first engineering, accessible technology, and reliable client support.',
      url: 'about.html#pillars',
      external: false,
      keywords: ['pillars', 'values', 'philosophy', 'pedagogy', 'offline first', 'accessibility']
    },
    {
      title: 'Contact & Support Desk',
      category: 'Page',
      categoryClass: 'page',
      desc: 'Get in touch with our team in Ikeja GRA Lagos, phone (+234 803 769 9362), WhatsApp, or direct inquiry.',
      url: 'contact.html',
      external: false,
      keywords: ['contact', 'support', 'help', 'phone', 'email', 'ikeja', 'lagos', 'hotline', 'address', 'whatsapp']
    },
    {
      title: 'Our Products Bento Grid',
      category: 'Page',
      categoryClass: 'page',
      desc: 'Explore our flagship solutions on the landing page: SuccessBox, SuccessTAB, and ClassBeam.',
      url: 'index.html#flagship-products',
      external: false,
      keywords: ['products', 'showcase', 'flagship', 'hardware', 'software', 'bento']
    },

    /* ── MANAGEMENT / LEADERSHIP ── */
    {
      title: 'Oluwakoyejo Oluwatosin',
      category: 'Leadership',
      categoryClass: 'page',
      desc: 'CEO / Managing Director — Leads Chronicles SDC and drives our pan-African EdTech mission from Ikeja GRA, Lagos.',
      url: 'about.html#team',
      external: false,
      keywords: ['ceo', 'managing director', 'oluwatosin', 'leadership', 'management', 'founder', 'team']
    },
    {
      title: 'Adekunbi Ogunsola',
      category: 'Leadership',
      categoryClass: 'page',
      desc: 'Executive Director — Oversees strategic direction and institutional partnerships at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['executive director', 'ogunsola', 'adekunbi', 'leadership', 'management', 'team']
    },
    {
      title: 'Solomon Ilori',
      category: 'Leadership',
      categoryClass: 'page',
      desc: 'Group Head, Solutions — Leads engineering and software architecture across all Chronicles SDC products.',
      url: 'about.html#team',
      external: false,
      keywords: ['solomon', 'ilori', 'group head', 'solutions', 'engineering', 'software architect', 'lead', 'tech lead', 'leadership', 'management', 'team']
    },
    {
      title: 'Oghenekaro Okporua',
      category: 'Leadership',
      categoryClass: 'page',
      desc: 'Operations Manager — Coordinates daily operations and delivery across all departments at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['operations', 'manager', 'oghenekaro', 'okporua', 'leadership', 'management', 'team']
    },

    /* ── DEPARTMENT TEAM ── */
    {
      title: 'Aliu Adedigba',
      category: 'Team',
      categoryClass: 'page',
      desc: 'App Dev Team Lead — Heads the Application Development department building Chronicles SDC software products.',
      url: 'about.html#team',
      external: false,
      keywords: ['aliu', 'adedigba', 'app dev', 'application development', 'team lead', 'developer', 'team']
    },
    {
      title: 'Taiye Kadiri',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Web Developer in the Application Development department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['taiye', 'kadiri', 'web developer', 'app dev', 'application development', 'team']
    },
    {
      title: 'Seun Odufisan',
      category: 'Team',
      categoryClass: 'page',
      desc: 'ML / AI Engineer in the Application Development department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['seun', 'odufisan', 'ml', 'ai engineer', 'machine learning', 'application development', 'team']
    },
    {
      title: 'Emujede Hilary',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Web Developer in the Application Development department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['emujede', 'hilary', 'web developer', 'app dev', 'application development', 'team']
    },
    {
      title: 'Abisola Dawodu',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Product Designer in the Application Development department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['abisola', 'dawodu', 'product designer', 'design', 'ui ux', 'application development', 'team']
    },
    {
      title: 'Olaoluwa Oluwadun',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Project Manager in the Corporate Strategy department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['olaoluwa', 'oluwadun', 'project manager', 'corporate strategy', 'strategy', 'team']
    },
    {
      title: 'Abraham Udoh',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Innovation Team Lead — Leads the Digital Innovation department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['abraham', 'udoh', 'innovation team lead', 'digital innovation', 'innovation', 'team']
    },
    {
      title: 'Oyindamola Salami',
      category: 'Team',
      categoryClass: 'page',
      desc: 'Sales Executive in the Sales & Business Development department at Chronicles SDC.',
      url: 'about.html#team',
      external: false,
      keywords: ['oyindamola', 'salami', 'sales executive', 'sales', 'business development', 'team']
    }
  ];

  const btnSiteSearch = document.getElementById('btnSiteSearch');
  const btnMobileSearch = document.getElementById('btnMobileSearch');
  const siteSearchModal = document.getElementById('siteSearchModal');
  const searchBackdrop = document.getElementById('searchBackdrop');
  const btnSearchClose = document.getElementById('btnSearchClose');
  const siteSearchInput = document.getElementById('siteSearchInput');
  const searchResultsList = document.getElementById('searchResultsList');
  const searchSuggestions = document.getElementById('searchSuggestions');
  let activeResultIndex = -1;

  function openSearchModal() {
    if (!siteSearchModal) return;
    siteSearchModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeProductsMegaMenu(true);
    if (siteSearchInput) {
      siteSearchInput.value = '';
      setTimeout(() => siteSearchInput.focus(), 60);
    }
    renderSearchResults('');
  }

  function closeSearchModal() {
    if (!siteSearchModal) return;
    siteSearchModal.style.display = 'none';
    document.body.style.overflow = '';
    activeResultIndex = -1;
  }

  function highlightMatches(text, query) {
    if (!query) return text;
    const tokens = query.split(/\s+/).filter(Boolean);
    let result = text;
    tokens.forEach((token) => {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      result = result.replace(regex, '<span class="search-highlight">$1</span>');
    });
    return result;
  }

  function renderSearchResults(query) {
    if (!searchResultsList) return;
    const trimmed = query.trim().toLowerCase();
    activeResultIndex = -1;

    if (!trimmed) {
      if (searchSuggestions) searchSuggestions.style.display = 'block';
      searchResultsList.innerHTML = '';
      return;
    }

    if (searchSuggestions) searchSuggestions.style.display = 'none';

    // Tokenize query so "Solomon Ilori" matches items that contain both tokens
    const tokens = trimmed.split(/\s+/).filter(Boolean);

    function itemMatchesToken(item, token) {
      return (
        item.title.toLowerCase().includes(token) ||
        item.desc.toLowerCase().includes(token) ||
        item.category.toLowerCase().includes(token) ||
        item.keywords.some((k) => k.toLowerCase().includes(token))
      );
    }

    const matches = siteIndex.filter((item) =>
      tokens.every((token) => itemMatchesToken(item, token))
    );

    if (matches.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <p>No results found for "<strong>${trimmed}</strong>"</p>
          <small style="color:#94A3B8;">Try searching for <em>SuccessBox</em>, <em>tablet</em>, <em>AI Academy</em>, or <em>contact</em>.</small>
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = matches.map((item, idx) => `
      <a href="${item.url}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="search-result-item" data-index="${idx}" role="option">
        <div class="search-result-info">
          <div class="search-result-top">
            <span class="search-result-title">${highlightMatches(item.title, trimmed)}</span>
            <span class="search-result-badge ${item.categoryClass}">${item.category}</span>
          </div>
          <p class="search-result-desc">${highlightMatches(item.desc, trimmed)}</p>
        </div>
        <span class="search-result-arrow">→</span>
      </a>
    `).join('');

    searchResultsList.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        closeSearchModal();
      });
    });
  }

  if (siteSearchInput) {
    siteSearchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });

    siteSearchInput.addEventListener('keydown', (e) => {
      const items = searchResultsList ? searchResultsList.querySelectorAll('.search-result-item') : [];
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeResultIndex = (activeResultIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle('selected', i === activeResultIndex));
        items[activeResultIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeResultIndex = (activeResultIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle('selected', i === activeResultIndex));
        items[activeResultIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (activeResultIndex >= 0 && items[activeResultIndex]) {
          e.preventDefault();
          items[activeResultIndex].click();
        }
      }
    });
  }

  if (siteSearchModal) {
    siteSearchModal.querySelectorAll('.search-tag-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query') || chip.textContent.trim();
        if (siteSearchInput) {
          siteSearchInput.value = q;
          renderSearchResults(q);
          siteSearchInput.focus();
        }
      });
    });
  }

  if (btnSiteSearch) btnSiteSearch.addEventListener('click', () => {
    closeMobileNav();
    openSearchModal();
  });
  if (btnMobileSearch) btnMobileSearch.addEventListener('click', () => {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    if (mobileNavMenu) mobileNavMenu.classList.remove('open');
    openSearchModal();
  });
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearchModal);
  if (btnSearchClose) btnSearchClose.addEventListener('click', closeSearchModal);

  // Global Outside Click Dismissal
  document.addEventListener('click', (e) => {
    if (productsMegaMenu && btnProductsDropdown) {
      if (!productsMegaMenu.contains(e.target) && !btnProductsDropdown.contains(e.target)) {
        if (productsMegaMenu.classList.contains('show') || productsMegaMenu.classList.contains('stay-open')) {
          closeProductsMegaMenu(true);
        }
      }
    }
    if (mobileNavMenu && mobileNavMenu.classList.contains('open') && mobileNavToggle) {
      const siteHeader = document.getElementById('siteHeader');
      if (siteHeader && !siteHeader.contains(e.target)) {
        closeMobileNav();
      }
    }
  });

  // Global Keyboard Shortcuts (Escape to close, Ctrl+K or Cmd+K or / to open search)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (siteSearchModal && siteSearchModal.style.display !== 'none') {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === '/' && document.activeElement !== siteSearchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      if (siteSearchModal && siteSearchModal.style.display !== 'none') {
        closeSearchModal();
      }
      if (productsMegaMenu && (productsMegaMenu.classList.contains('show') || productsMegaMenu.classList.contains('stay-open'))) {
        closeProductsMegaMenu(true);
      }
      if (mobileNavMenu && mobileNavMenu.classList.contains('open')) {
        closeMobileNav();
      }
    }
  });

  /* ==========================================================================
     5. MOBILE NAVIGATION DRAWER & ACCORDIONS (DIMMED BACKGROUND ON MOBILE/TABLET)
     ========================================================================== */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileProductsToggle = document.getElementById('mobileProductsToggle');
  const mobileMegaPanel = document.getElementById('mobileMegaPanel');
  const mobileSupportLink = document.getElementById('mobileSupportLink');

  function openMobileNav() {
    if (!mobileNavMenu) return;
    closeProductsMegaMenu(true);
    mobileNavMenu.classList.add('open');
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      const icon = mobileNavToggle.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />';
      }
    }
    document.body.classList.add('mobile-nav-open');
    if (dropdownBackdrop) dropdownBackdrop.classList.add('active');
  }

  function closeMobileNav() {
    if (!mobileNavMenu) return;
    mobileNavMenu.classList.remove('open');
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      const icon = mobileNavToggle.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />';
      }
    }
    document.body.classList.remove('mobile-nav-open');
    if (!document.body.classList.contains('dropdown-dimmed')) {
      if (dropdownBackdrop) dropdownBackdrop.classList.remove('active');
    }
  }

  function toggleMobileNav() {
    if (!mobileNavMenu) return;
    if (mobileNavMenu.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });

    if (mobileProductsToggle && mobileMegaPanel) {
      mobileProductsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMegaPanel.classList.toggle('open');
        mobileProductsToggle.classList.toggle('open', isOpen);
        mobileProductsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    if (mobileSupportLink) {
      mobileSupportLink.addEventListener('click', () => {
        closeMobileNav();
        if (isContactPage) {
          const contactHeading = document.querySelector('.curved-page-hero') || document.querySelector('#contactPageForm');
          if (contactHeading) contactHeading.scrollIntoView({ behavior: 'smooth' });
        } else {
          if (supportMenu && btnSupport) {
            supportMenu.classList.add('show');
            btnSupport.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.location.href = 'contact.html';
          }
        }
      });
    }

    // Close mobile nav when any link inside it is clicked
    mobileNavMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // Auto-close mobile nav when viewport expands beyond tablet breakpoint (1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mobileNavMenu && mobileNavMenu.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ==========================================================================
     4. HEADER SCROLL SHADOW EFFECT
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     5. STATS ANIMATED COUNTERS
     ========================================================================== */
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (statElements.length > 0) {
    let countersStarted = false;

    const animateCounters = () => {
      statElements.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(target * easeProgress);
          el.textContent = currentVal + (progress >= 1 ? suffix : '');

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target + suffix;
          }
        };

        requestAnimationFrame(updateCount);
      });
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            animateCounters();
            counterObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });

      const statsSection = document.querySelector('.stats-banner');
      if (statsSection) {
        counterObserver.observe(statsSection);
      }
    } else {
      animateCounters();
    }
  }

  /* ==========================================================================
     6. DYNAMIC TYPEWRITER TEXT EFFECTS (HEADINGS, BADGES & TICKER)
     ========================================================================== */
  function initTypewriter(el, customWords = null, typeSpeed = 75, deleteSpeed = 42, holdTime = 2000) {
    if (!el) return;

    let words = customWords;
    if (!words) {
      const rawWords = el.getAttribute('data-typewriter-words');
      if (rawWords) {
        try {
          words = JSON.parse(rawWords);
        } catch (e) {
          words = rawWords.split(',').map((w) => w.trim());
        }
      }
    }

    if (!words || words.length === 0) return;

    let wordIndex = 0;
    let charIndex = el.textContent.length || words[0].length;
    let isDeleting = true;

    function typeStep() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        el.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        nextDelay = holdTime; // Pause after word typed out
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        nextDelay = 350; // Pause before typing next word
      }

      setTimeout(typeStep, nextDelay);
    }

    // Start with a gentle initial pause on the default rendered word
    setTimeout(typeStep, holdTime);
  }

  // Auto-initialize all typewriter elements across all pages
  document.querySelectorAll('[data-typewriter-words]').forEach((el) => {
    initTypewriter(el);
  });

  // Code ticker typewriter on Home Hero
  const typedTarget = document.getElementById('typedTarget');
  if (typedTarget) {
    initTypewriter(
      typedTarget,
      ['"SuccessTAB"', '"JAMB CBT"', '"WAEC SSCE"', '"IGCSE"', '"Anywhere"'],
      85,
      45,
      1600
    );
  }

  /* ==========================================================================
     7. PRODUCT FILTERING (On products.html)
     ========================================================================== */
  const productFilterBtns = document.querySelectorAll('.product-filter-btn');
  const productCards = document.querySelectorAll('.product-detail-card');

  if (productFilterBtns.length > 0 && productCards.length > 0) {
    productFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        productFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        productCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     8. TEAM DEPARTMENT FILTERING (On about.html)
     ========================================================================== */
  const deptFilterBtns = document.querySelectorAll('.dept-filter-btn');
  const memberCards = document.querySelectorAll('.member-card');

  if (deptFilterBtns.length > 0 && memberCards.length > 0) {
    deptFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        deptFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const dept = btn.getAttribute('data-dept');

        memberCards.forEach((card) => {
          const cardDept = card.getAttribute('data-dept');
          if (dept === 'all' || cardDept === dept) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     9. FAQ ACCORDION (On contact.html)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all other FAQs
          faqItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
              const t = other.querySelector('.faq-trigger');
              if (t) t.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          item.classList.toggle('open', !isOpen);
          trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });
      }
    });
  }

  /* ==========================================================================
     10. MODAL DIALOG CONTROLLER (Request a Demo / Quote)
     ========================================================================== */
  const demoModal = document.getElementById('demoModal');
  const demoSubjectInput = document.getElementById('demoSubjectInput');
  const demoCloseBtn = document.getElementById('demoCloseBtn');
  const demoForm = document.getElementById('demoForm');
  const demoSuccessBox = document.getElementById('demoSuccessBox');
  const demoModalTitle = document.getElementById('demoModalTitle');

  function openDemoModal(subject) {
    if (!demoModal) return;
    if (demoSubjectInput) demoSubjectInput.value = subject || 'General Inquiry';
    if (demoModalTitle) {
      demoModalTitle.textContent = subject && !subject.startsWith('General')
        ? `Request: ${subject}`
        : 'Request a Demo';
    }
    if (demoForm) demoForm.style.display = 'block';
    if (demoSuccessBox) demoSuccessBox.style.display = 'none';

    demoModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = demoModal.querySelector('input:not([readonly])');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind all buttons with [data-demo]
  document.addEventListener('click', (e) => {
    const demoTrigger = e.target.closest('[data-demo]');
    if (demoTrigger) {
      e.preventDefault();
      const subject = demoTrigger.getAttribute('data-demo');
      openDemoModal(subject);
    }
  });

  if (demoCloseBtn) demoCloseBtn.addEventListener('click', closeDemoModal);
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeDemoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal && demoModal.classList.contains('open')) {
      closeDemoModal();
    }
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredInputs = demoForm.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (!isValid) return;

      const submitBtn = demoForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting request...';
      }

      setTimeout(() => {
        if (demoForm) demoForm.style.display = 'none';
        if (demoSuccessBox) demoSuccessBox.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Request';
        }
        demoForm.reset();
      }, 650);
    });
  }

  /* ==========================================================================
     11. CONTACT FORM HANDLER (On contact.html)
     ========================================================================== */
  const contactForm = document.getElementById('contactPageForm');
  const contactSuccessState = document.getElementById('contactPageSuccess');
  const btnSendAnother = document.getElementById('btnSendAnother');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('[required]');
      let formValid = true;

      inputs.forEach((input) => {
        const val = input.value.trim();
        if (!val || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))) {
          input.classList.add('is-invalid');
          formValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      const errFeedback = document.getElementById('contactFormError');
      if (!formValid) {
        if (errFeedback) errFeedback.style.display = 'block';
        return;
      }
      if (errFeedback) errFeedback.style.display = 'none';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending message...';
      }

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (contactSuccessState) contactSuccessState.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="arrow">→</span>';
        }
        contactForm.reset();
      }, 700);
    });

    contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  if (btnSendAnother && contactForm && contactSuccessState) {
    btnSendAnother.addEventListener('click', () => {
      contactSuccessState.style.display = 'none';
      contactForm.style.display = 'block';
    });
  }

  /* ==========================================================================
     12. NEWSLETTER FORM HANDLER
     ========================================================================== */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      const emailVal = emailInput.value.trim();
      const successDiv = document.createElement('div');
      successDiv.style.cssText = 'background: rgba(253, 224, 71, 0.2); border: 1px solid #FDE047; padding: 1rem 1.5rem; border-radius: 1rem; color: #FDE047; font-weight: 600;';
      const strong = document.createElement('strong');
      strong.textContent = emailVal;
      successDiv.textContent = '✓ Thank you! We\'ve added ';
      successDiv.appendChild(strong);
      successDiv.appendChild(document.createTextNode(' to our VIP education newsletter.'));
      form.innerHTML = '';
      form.appendChild(successDiv);
    });
  });

});
