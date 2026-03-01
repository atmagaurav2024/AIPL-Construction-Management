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
const addKpiButton = document.getElementById('add-kpi');
const summaryGrid = document.getElementById('summary-grid');

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

const wireKpiActions = (card) => {
  const editBtn = card.querySelector('.kpi-edit');
  const deleteBtn = card.querySelector('.kpi-delete');

  editBtn?.addEventListener('click', () => {
    const titleEl = card.querySelector('h3');
    const subEl = card.querySelector('.sub-kpi');
    const valueEl = card.querySelector('.value');

    const newTitle = window.prompt('Edit KPI title', titleEl?.textContent || '');
    if (newTitle === null) return;
    const newSub = window.prompt('Edit KPI subtitle', subEl?.textContent || '');
    if (newSub === null) return;
    const newValue = window.prompt('Edit KPI value', valueEl?.textContent || '0');
    if (newValue === null) return;

    titleEl.textContent = newTitle || titleEl.textContent;
    subEl.textContent = newSub || subEl.textContent;
    valueEl.textContent = newValue || valueEl.textContent;
    updateStamp();
  });

  deleteBtn?.addEventListener('click', () => {
    if (window.confirm('Delete this KPI?')) {
      card.remove();
      updateStamp();
    }
  });
};

summaryGrid?.querySelectorAll('.summary-card').forEach(wireKpiActions);

addKpiButton?.addEventListener('click', () => {
  const title = window.prompt('New KPI title', 'NEW KPI');
  if (!title) return;
  const sub = window.prompt('New KPI subtitle', 'PENDING ↗') || 'PENDING ↗';
  const value = window.prompt('New KPI value', '0') || '0';

  const card = document.createElement('article');
  card.className = 'summary-card';
  card.innerHTML = `
    <div class="kpi-top-row">
      <h3>${title}</h3>
      <div class="kpi-actions">
        <button class="kpi-edit" type="button">✎</button>
        <button class="kpi-delete" type="button">🗑</button>
      </div>
    </div>
    <p class="sub-kpi">${sub}</p>
    <p class="value">${value}</p>
  `;
  summaryGrid?.append(card);
  wireKpiActions(card);
  updateStamp();
});

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
  updateStamp();
});

updateStamp();
