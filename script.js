const ADMIN_MOBILE = '9000000000';
const ADMIN_PASSWORD = 'admin123';
const EMPLOYEE_KEY = 'aipl_employees';

const form = document.getElementById('login-form');
const forgotToggle = document.getElementById('forgot-toggle');
const resetPanel = document.getElementById('reset-password-panel');
const resetButton = document.getElementById('send-reset-link');
const resetEmailInput = document.getElementById('reset-email');

const getEmployees = () => {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_KEY) || '[]');
  } catch {
    return [];
  }
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const mobileInput = document.getElementById('mobile');
  const passwordInput = document.getElementById('password');
  const mobile = mobileInput?.value.trim() || '';
  const password = passwordInput?.value || '';

  if (!/^\d{10}$/.test(mobile)) {
    window.alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  if (mobile === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
    localStorage.setItem('aipl_current_user', JSON.stringify({ role: 'admin', mobile }));
    window.location.href = 'dashboard-admin.html';
    return;
  }

  const employee = getEmployees().find((item) => item.mobile === mobile);
  if (!employee) {
    window.alert('Employee not found. Please contact Admin for enrolment.');
    return;
  }

  if (employee.password !== password) {
    window.alert('Incorrect password.');
    return;
  }

  if (!employee.assignedProject) {
    window.alert('Project not assigned yet. Please contact Admin.');
    return;
  }

  localStorage.setItem(
    'aipl_current_user',
    JSON.stringify({ role: 'employee', mobile: employee.mobile, name: employee.name, assignedProject: employee.assignedProject })
  );

  window.location.href = `project-dashboard.html?project=${encodeURIComponent(employee.assignedProject)}`;
});

forgotToggle?.addEventListener('click', () => {
  const isHidden = resetPanel?.hasAttribute('hidden');
  if (!resetPanel) return;

  if (isHidden) {
    resetPanel.removeAttribute('hidden');
    forgotToggle.setAttribute('aria-expanded', 'true');
  } else {
    resetPanel.setAttribute('hidden', '');
    forgotToggle.setAttribute('aria-expanded', 'false');
  }
});

resetButton?.addEventListener('click', () => {
  const email = resetEmailInput?.value.trim() || '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    window.alert('Please enter a valid registered email address.');
    return;
  }

  window.alert(`Reset link sent to ${email}`);
});
