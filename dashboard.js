const EMPLOYEE_KEY = 'aipl_employees';

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
const kpiPeriodSelect = document.getElementById('kpi-period');
const customPeriodFields = document.getElementById('custom-period-fields');
const customPeriodStart = document.getElementById('custom-period-start');
const customPeriodEnd = document.getElementById('custom-period-end');
const applyCustomPeriod = document.getElementById('apply-custom-period');
const periodNote = document.getElementById('period-note');
const menuProjects = document.getElementById('menu-projects');
const menuEmployees = document.getElementById('menu-employees');
const adminHome = document.getElementById('admin-home');
const projectsSection = document.getElementById('projects-section');
const employeesSection = document.getElementById('employees-section');
const backToDashboard = document.getElementById('back-to-dashboard');

const projectModal = document.getElementById('project-modal');
const closeProjectModal = document.getElementById('close-project-modal');
const createProjectForm = document.getElementById('create-project-form');
const projectNameInput = document.getElementById('project-name-input');
const clientNameInput = document.getElementById('client-name-input');
const costTenderInput = document.getElementById('cost-tender-input');
const contractPriceInput = document.getElementById('contract-price-input');
const percentAboveBelow = document.getElementById('percent-above-below');
const workOrderDate = document.getElementById('work-order-date');
const scheduleDate = document.getElementById('schedule-date');
const constructionPeriod = document.getElementById('construction-period');

const employeeModal = document.getElementById('employee-modal');
const addEmployeeButton = document.getElementById('add-employee');
const closeEmployeeModal = document.getElementById('close-employee-modal');
const employeeForm = document.getElementById('employee-form');
const employeeList = document.getElementById('employee-list');
const employeeProject = document.getElementById('emp-project');

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

const getEmployees = () => {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_KEY) || '[]');
  } catch {
    return [];
  }
};

const setEmployees = (employees) => {
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employees));
};

const getProjectsFromUI = () =>
  [...(projectList?.querySelectorAll('.project-card h3') || [])].map((el) => el.textContent.trim()).filter(Boolean);

const refreshEmployeeProjectOptions = () => {
  const projects = getProjectsFromUI();
  employeeProject.innerHTML = '<option value="">Select Project</option>';
  projects.forEach((project) => {
    const opt = document.createElement('option');
    opt.value = project;
    opt.textContent = project;
    employeeProject.append(opt);
  });
};

const renderEmployees = () => {
  const employees = getEmployees();
  if (!employees.length) {
    employeeList.innerHTML = '<p class="empty-state">No employees enrolled yet.</p>';
    return;
  }

  employeeList.innerHTML = '';
  employees.forEach((emp) => {
    const card = document.createElement('article');
    card.className = 'employee-card';
    card.innerHTML = `
      <h4>${emp.name}</h4>
      <p>Mobile: ${emp.mobile}</p>
      <p>Project Access: ${emp.assignedProject || 'Not assigned'}</p>
      <p>Password: ${emp.password}</p>
    `;
    employeeList.append(card);
  });
};

const showAdminHome = () => {
  adminHome?.removeAttribute('hidden');
  employeesSection?.setAttribute('hidden', '');
};

const showEmployeesPage = () => {
  adminHome?.setAttribute('hidden', '');
  employeesSection?.removeAttribute('hidden');
};

const calculatePercent = () => {
  const cost = Number(costTenderInput?.value || 0);
  const contract = Number(contractPriceInput?.value || 0);

  if (!cost || !contract) {
    percentAboveBelow.value = '';
    return;
  }

  const pct = (1 - (contract / cost)) * 100;
  const relation = pct > 100 ? 'Above' : pct < 100 ? 'Below' : 'At Par';
  percentAboveBelow.value = `${pct.toFixed(2)}% (${relation})`;
};

const periodLabelMap = {
  'this-month': 'This Month',
  'this-year': 'This Year',
  'current-financial-year': 'Current Financial Year',
  'till-date': 'Till Date',
  custom: 'Custom Period',
};

const updatePeriodNote = () => {
  const value = kpiPeriodSelect?.value || 'this-month';
  const label = periodLabelMap[value] || 'This Month';

  if (value === 'custom') {
    const from = customPeriodStart?.value;
    const to = customPeriodEnd?.value;
    if (from && to) {
      periodNote.textContent = `Showing KPI for: ${label} (${from} to ${to})`;
      updateStamp();
      return;
    }
    periodNote.textContent = 'Showing KPI for: Custom Period (select dates and tap Apply)';
    return;
  }

  periodNote.textContent = `Showing KPI for: ${label}`;
  updateStamp();
};

const calculateConstructionPeriod = () => {
  const start = workOrderDate?.value ? new Date(workOrderDate.value) : null;
  const end = scheduleDate?.value ? new Date(scheduleDate.value) : null;

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    constructionPeriod.value = '';
    return;
  }

  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  constructionPeriod.value = diffDays >= 0 ? `${diffDays} days` : 'Invalid dates';
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

menuProjects?.addEventListener('click', (event) => {
  event.preventDefault();
  showAdminHome();
  projectsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  hideMenu();
});

menuEmployees?.addEventListener('click', (event) => {
  event.preventDefault();
  showEmployeesPage();
  employeesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  hideMenu();
});

backToDashboard?.addEventListener('click', () => {
  showAdminHome();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

searchToggle?.addEventListener('click', () => {
  searchWrap.hidden = !searchWrap.hidden;
});

kpiPeriodSelect?.addEventListener('change', () => {
  const isCustom = kpiPeriodSelect.value === 'custom';
  if (isCustom) {
    customPeriodFields?.removeAttribute('hidden');
  } else {
    customPeriodFields?.setAttribute('hidden', '');
  }
  updatePeriodNote();
});

applyCustomPeriod?.addEventListener('click', () => {
  if (!customPeriodStart?.value || !customPeriodEnd?.value) {
    window.alert('Please select From and To dates for custom period.');
    return;
  }

  if (new Date(customPeriodStart.value) > new Date(customPeriodEnd.value)) {
    window.alert('From date cannot be greater than To date.');
    return;
  }

  updatePeriodNote();
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
  projectModal?.showModal();
});

closeProjectModal?.addEventListener('click', () => {
  projectModal?.close();
});

[costTenderInput, contractPriceInput].forEach((el) => el?.addEventListener('input', calculatePercent));
[workOrderDate, scheduleDate].forEach((el) => el?.addEventListener('change', calculateConstructionPeriod));

createProjectForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const projectName = projectNameInput.value.trim();
  const clientName = clientNameInput.value.trim();
  if (!projectName || !clientName) return;

  const card = document.createElement('a');
  const encoded = encodeURIComponent(projectName);
  card.className = 'project-card';
  card.href = `project-dashboard.html?project=${encoded}`;
  card.innerHTML = `<h3>${projectName}</h3><p>${clientName} • Completion: 0%</p>`;
  projectList?.prepend(card);

  projectModal?.close();
  createProjectForm.reset();
  percentAboveBelow.value = '';
  constructionPeriod.value = '';
  refreshEmployeeProjectOptions();
  updateStamp();
});

addEmployeeButton?.addEventListener('click', () => {
  refreshEmployeeProjectOptions();
  employeeModal?.showModal();
});

closeEmployeeModal?.addEventListener('click', () => {
  employeeModal?.close();
});

employeeForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById('emp-name')?.value.trim(),
    mobile: document.getElementById('emp-mobile')?.value.trim(),
    email: document.getElementById('emp-email')?.value.trim(),
    dob: document.getElementById('emp-dob')?.value,
    salary: document.getElementById('emp-salary')?.value,
    address: document.getElementById('emp-address')?.value.trim(),
    aadhar: document.getElementById('emp-aadhar')?.value.trim(),
    pan: document.getElementById('emp-pan')?.value.trim(),
    bank: document.getElementById('emp-bank')?.value.trim(),
    account: document.getElementById('emp-account')?.value.trim(),
    ifsc: document.getElementById('emp-ifsc')?.value.trim(),
    assignedProject: employeeProject?.value,
  };

  if (!payload.name || !/^\d{10}$/.test(payload.mobile) || !payload.assignedProject) {
    window.alert('Please fill employee details with valid mobile and project assignment.');
    return;
  }

  const employees = getEmployees();
  if (employees.some((item) => item.mobile === payload.mobile)) {
    window.alert('Employee with this mobile already exists.');
    return;
  }

  payload.password = payload.mobile.slice(-4);
  employees.push(payload);
  setEmployees(employees);
  renderEmployees();

  employeeModal?.close();
  employeeForm.reset();
  updateStamp();
  window.alert(`Employee created. Login password is ${payload.password}`);
});

refreshEmployeeProjectOptions();
renderEmployees();
showAdminHome();
updatePeriodNote();
updateStamp();
