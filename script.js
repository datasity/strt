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
    const filtered = getFilteredCards();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    /* ===== HIDE / SHOW PAGINATION ===== */
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

  /* =========================
     CATEGORY FILTER
  ========================= */

  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.dataset.filter.toLowerCase();
      currentPage = 1;
      renderProjects();
    };
  });

  /* =========================
     PAGINATION BUTTONS
  ========================= */

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
     TYPING EFFECT
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
     COUNTDOWN TO FIRST OF MONTH
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

});
