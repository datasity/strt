document.addEventListener("DOMContentLoaded", () => {

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

    if (pagination) {
      pagination.style.display =
        filtered.length > ITEMS_PER_PAGE ? 'flex' : 'none';
    }

    if (currentPage > totalPages) currentPage = totalPages || 1;

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
});
