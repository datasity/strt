document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     MOBILE MENU
  ========================= */

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.close-menu');

  if (toggle && menu && close) {
    toggle.onclick = () => menu.classList.add('open');
    close.onclick = () => menu.classList.remove('open');
  }

  /* =========================
     EXISTING PROJECT FILTER + PAGINATION
     HOMEPAGE SAFE
  ========================= */

  const buttons = document.querySelectorAll('.categories button');
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const pagination = document.querySelector('.pagination');
  const paginationBtns = pagination ? pagination.querySelectorAll('button') : [];

  const ITEMS_PER_PAGE = 3;
  let currentPage = 1;
  let currentFilter = 'all';

  function getFilteredCards() {
    return cards.filter(card => {
      if (currentFilter === 'all') return true;

      const categories = card.dataset.category
        ?.toLowerCase()
        .split(' ')
        .map(c => c.trim());

      return categories && categories.includes(currentFilter);
    });
  }

  function renderProjects() {
    if (!cards.length) return;

    const filtered = getFilteredCards();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    if (pagination) {
      pagination.style.display =
        filtered.length > ITEMS_PER_PAGE ? 'flex' : 'none';
    }

    if (currentPage > totalPages) {
      currentPage = totalPages || 1;
    }

    cards.forEach(card => {
      card.style.display = 'none';
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    filtered.slice(start, end).forEach(card => {
      card.style.display = 'block';
    });

    paginationBtns.forEach(btn => btn.classList.remove('active'));
    paginationBtns.forEach(btn => {
      if (btn.dataset.page == currentPage) {
        btn.classList.add('active');
      }
    });
  }

  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.dataset.filter?.toLowerCase() || 'all';
      currentPage = 1;
      renderProjects();
    };
  });

  paginationBtns.forEach(btn => {
    btn.onclick = () => {
      const filtered = getFilteredCards();
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

      if (btn.dataset.page === 'next' && currentPage < totalPages) {
        currentPage++;
      } else if (btn.dataset.page === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (!isNaN(btn.dataset.page)) {
        currentPage = Number(btn.dataset.page);
      }

      renderProjects();
    };
  });

  renderProjects();

  /* =========================
     NEW PROJECTS PAGE LOGIC
     ISOLATED AND SAFE
  ========================= */

  const projectsPage = document.querySelector('.projects-page');

  if (projectsPage) {

    const projectCards = Array.from(
      projectsPage.querySelectorAll('.project-card')
    );

    const categoryBtns = projectsPage.querySelectorAll(
      '[data-category-filter]'
    );

    const statusBtns = projectsPage.querySelectorAll(
      '[data-status-filter]'
    );

    const contributorSwitch = projectsPage.querySelector(
      '#filter-contributors'
    );

    const sortSelect = projectsPage.querySelector(
      '#projects-sort-select'
    );

    const projectsPagination = projectsPage.querySelector(
      '.projects-pagination'
    );

    const paginationButtons = projectsPagination
      ? projectsPagination.querySelectorAll('button')
      : [];

    const PROJECTS_PER_PAGE = 9;
    let projectsPageIndex = 1;
    let activeCategory = 'all';
    let activeStatuses = ['ongoing'];
    let onlyContributors = false;
    let sortOrder = 'newest';

    function filterProjects() {
      let filtered = projectCards.filter(card => {

        if (activeCategory !== 'all') {
          if (card.dataset.category !== activeCategory) return false;
        }

        if (activeStatuses.length) {
          if (!activeStatuses.includes(card.dataset.status)) return false;
        }

        if (onlyContributors) {
          if (card.dataset.contributors !== 'yes') return false;
        }

        return true;
      });

      if (sortOrder === 'newest') {
        filtered.sort((a, b) =>
          new Date(b.dataset.date) - new Date(a.dataset.date)
        );
      } else {
        filtered.sort((a, b) =>
          new Date(a.dataset.date) - new Date(b.dataset.date)
        );
      }

      return filtered;
    }

    function renderProjectsPage() {
      const filtered = filterProjects();
      const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);

      if (projectsPagination) {
        projectsPagination.style.display =
          filtered.length > PROJECTS_PER_PAGE ? 'flex' : 'none';
      }

      if (projectsPageIndex > totalPages) {
        projectsPageIndex = totalPages || 1;
      }

      projectCards.forEach(card => {
        card.style.display = 'none';
      });

      const start = (projectsPageIndex - 1) * PROJECTS_PER_PAGE;
      const end = start + PROJECTS_PER_PAGE;

      filtered.slice(start, end).forEach(card => {
        card.style.display = 'block';
      });

      paginationButtons.forEach(btn => btn.classList.remove('active'));
      paginationButtons.forEach(btn => {
        if (btn.dataset.page == projectsPageIndex) {
          btn.classList.add('active');
        }
      });
    }

    categoryBtns.forEach(btn => {
      btn.onclick = () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = btn.dataset.categoryFilter;
        projectsPageIndex = 1;
        renderProjectsPage();
      };
    });

    statusBtns.forEach(btn => {
      btn.onclick = () => {
        btn.classList.toggle('active');
        activeStatuses = Array.from(statusBtns)
          .filter(b => b.classList.contains('active'))
          .map(b => b.dataset.statusFilter);

        projectsPageIndex = 1;
        renderProjectsPage();
      };
    });

    if (contributorSwitch) {
      contributorSwitch.onchange = () => {
        onlyContributors = contributorSwitch.checked;
        projectsPageIndex = 1;
        renderProjectsPage();
      };
    }

    if (sortSelect) {
      sortSelect.onchange = () => {
        sortOrder = sortSelect.value;
        renderProjectsPage();
      };
    }

    paginationButtons.forEach(btn => {
      btn.onclick = () => {
        const filtered = filterProjects();
        const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);

        if (btn.dataset.page === 'next' && projectsPageIndex < totalPages) {
          projectsPageIndex++;
        } else if (btn.dataset.page === 'prev' && projectsPageIndex > 1) {
          projectsPageIndex--;
        } else if (!isNaN(btn.dataset.page)) {
          projectsPageIndex = Number(btn.dataset.page);
        }

        renderProjectsPage();
      };
    });

    renderProjectsPage();
  }

  /* =========================
     CONTRIBUTORS PAGE LOGIC
     FULLY ISOLATED
  ========================= */

  const contributorPage = document.querySelector('.contributor-page');

  if (contributorPage) {

    const searchInput = document.getElementById('contributor-search');
    const contributorCards = Array.from(
      contributorPage.querySelectorAll('.contributor-card')
    );

    const sortSelect = document.getElementById('contributor-sort');
    const grid = document.getElementById('contributorGrid');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        contributorCards.forEach(card => {
          const name = card.querySelector('h3').textContent.toLowerCase();
          card.style.display = name.includes(query) ? 'block' : 'none';
        });
      });
    }

    if (sortSelect && grid) {
      sortSelect.onchange = () => {
        const sorted = [...contributorCards].sort((a, b) => {
          const d1 = new Date(a.dataset.date);
          const d2 = new Date(b.dataset.date);
          return sortSelect.value === 'newest' ? d2 - d1 : d1 - d2;
        });

        sorted.forEach(card => grid.appendChild(card));
      };
    }

    /* =========================
       CONTRIBUTOR OVERLAY
    ========================= */

    const overlay = document.getElementById('contributorOverlay');
    const closeOverlay = document.getElementById('closeContributorOverlay');

    if (overlay) {
      setTimeout(() => {
        overlay.classList.add('show');
      }, 1200);

      if (closeOverlay) {
        closeOverlay.onclick = () => {
          overlay.classList.remove('show');
        };
      }

      overlay.onclick = e => {
        if (e.target === overlay) {
          overlay.classList.remove('show');
        }
      };
    }
  }

});
