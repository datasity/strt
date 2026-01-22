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
     PROJECT FILTER + PAGINATION
     SAFE FOR INDEX
  ========================= */

  const categoryButtons = document.querySelectorAll('.categories button');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));

  if (categoryButtons.length && projectCards.length) {

    const pagination = document.querySelector('.pagination');
    const paginationBtns = pagination ? pagination.querySelectorAll('button') : [];

    const ITEMS_PER_PAGE = 3;
    let currentPage = 1;
    let currentFilter = 'all';

    function getFilteredCards() {
      return projectCards.filter(card => {
        if (currentFilter === 'all') return true;

        const categories = card.dataset.category
          ?.toLowerCase()
          .split(' ')
          .map(c => c.trim());

        return categories && categories.includes(currentFilter);
      });
    }

    function renderProjects() {
      const filtered = getFilteredCards();
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

      if (pagination) {
        pagination.style.display =
          filtered.length > ITEMS_PER_PAGE ? 'flex' : 'none';
      }

      if (currentPage > totalPages) {
        currentPage = totalPages || 1;
      }

      projectCards.forEach(card => {
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

    categoryButtons.forEach(btn => {
      btn.onclick = () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentFilter = btn.dataset.filter.toLowerCase();
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
  }

  /* =========================
     TYPING EFFECT
     INDEX PAGE ONLY
  ========================= */

  const typingTexts = [
    "Into Real-World Impact",
    "Into Actionable Decisions",
    "Into Practical Solutions"
  ];

  let textIndex = 0;
  let charIndex = 0;
  const typingEl = document.getElementById("typing-text");

  function typeText() {
    if (!typingEl) return;

    if (charIndex < typingTexts[textIndex].length) {
      typingEl.textContent += typingTexts[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 80);
    } else {
      setTimeout(() => {
        typingEl.textContent = "";
        charIndex = 0;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeText();
      }, 1400);
    }
  }

  if (typingEl) {
    typeText();
  }

  /* =========================
     TEAM LOAD MORE
  ========================= */

  const loadBtn = document.getElementById('loadMoreTeam');
  const teamCards = document.querySelectorAll('.team-card');

  if (loadBtn && teamCards.length) {
    let visibleCount = 4;

    teamCards.forEach((card, index) => {
      if (index >= visibleCount) {
        card.style.display = 'none';
      }
    });

    loadBtn.addEventListener('click', () => {
      visibleCount += 4;

      teamCards.forEach((card, index) => {
        if (index < visibleCount) {
          card.style.display = 'block';
        }
      });

      if (visibleCount >= teamCards.length) {
        loadBtn.style.display = 'none';
      }
    });
  }

  /* =========================
     COUNTDOWN
  ========================= */

  const countdownEl = document.getElementById('countdown-timer');

  function getNextFirstOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  if (countdownEl) {
    const targetDate = getNextFirstOfMonth();

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.textContent = 'Starting today';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      countdownEl.textContent =
        days + 'd ' + hours + 'h ' + minutes + 'm';
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  /* =========================
     CONTRIBUTORS PAGE
     SEARCH, SORT, OVERLAY
  ========================= */

  const contributorPage = document.querySelector('.contributor-page');

  if (contributorPage) {

    const searchInput = document.getElementById('contributor-search');
    const sortSelect = document.getElementById('contributor-sort');
    const grid = document.getElementById('contributorGrid');
    const contributorCards = Array.from(
      contributorPage.querySelectorAll('.contributor-card')
    );

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
