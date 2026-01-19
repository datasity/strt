/* ===== MOBILE MENU ===== */

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const close = document.querySelector('.close-menu');

toggle.onclick = () => menu.classList.add('open');
close.onclick = () => menu.classList.remove('open');


/* ===== PROJECT FILTER + PAGINATION ===== */

const buttons = document.querySelectorAll('.categories button');
const cards = Array.from(document.querySelectorAll('.project-card'));
const paginationBtns = document.querySelectorAll('.pagination button');

const ITEMS_PER_PAGE = 3;
let currentPage = 1;
let currentFilter = 'all';

function getFilteredCards() {
  return cards.filter(card =>
    currentFilter === 'all' || card.dataset.category === currentFilter
  );
}

function renderProjects() {
  const filtered = getFilteredCards();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (currentPage > totalPages) currentPage = totalPages || 1;

  cards.forEach(card => (card.style.display = 'none'));

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  filtered.slice(start, end).forEach(card => {
    card.style.display = 'block';
  });

  paginationBtns.forEach(btn => btn.classList.remove('active'));
  paginationBtns.forEach(btn => {
    if (btn.dataset.page == currentPage) btn.classList.add('active');
  });
}

/* CATEGORY FILTER */
buttons.forEach(btn => {
  btn.onclick = () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    currentPage = 1;
    renderProjects();
  };
});

/* PAGINATION */
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

/* INITIAL LOAD */
renderProjects();


/* ===== TYPING EFFECT (UNCHANGED) ===== */

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

document.addEventListener("DOMContentLoaded", typeText);
