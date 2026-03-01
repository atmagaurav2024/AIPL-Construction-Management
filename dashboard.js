const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');
const menuBackdrop = document.getElementById('menu-backdrop');
const searchInput = document.getElementById('project-search');
const addProjectButton = document.getElementById('add-project');
const projectList = document.getElementById('project-list');
const updatedStamp = document.getElementById('updated-stamp');
const searchToggle = document.getElementById('search-toggle');
const searchWrap = document.getElementById('search-wrap');

const openMenu = () => {
  sideMenu?.classList.add('open');
  menuBackdrop?.removeAttribute('hidden');
  sideMenu?.setAttribute('aria-hidden', 'false');
  menuToggle?.setAttribute('aria-expanded', 'true');
};

const hideMenu = () => {
  sideMenu?.classList.remove('open');
  menuBackdrop?.setAttribute('hidden', '');
  sideMenu?.setAttribute('aria-hidden', 'true');
  menuToggle?.setAttribute('aria-expanded', 'false');
};

const updateStamp = () => {
  const now = new Date();
  updatedStamp.textContent = `Updated: ${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN')}`;
};

menuToggle?.addEventListener('click', openMenu);
closeMenu?.addEventListener('click', hideMenu);
menuBackdrop?.addEventListener('click', hideMenu);
searchToggle?.addEventListener('click', () => {
  searchWrap.hidden = !searchWrap.hidden;
});

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const cards = projectList?.querySelectorAll('.project-card') || [];

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
});

addProjectButton?.addEventListener('click', () => {
  const name = window.prompt('Enter new project name');
  if (!name) return;

  const city = window.prompt('Enter city/location', 'Maharashtra') || 'Maharashtra';
  const card = document.createElement('a');
  const encoded = encodeURIComponent(name);
  card.className = 'project-card';
  card.href = `project-dashboard.html?project=${encoded}`;
  card.innerHTML = `<h3>${name}</h3><p>${city} • Completion: 0%</p>`;
  projectList?.prepend(card);
});

updateStamp();
