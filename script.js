const form = document.getElementById('login-form');
const forgotToggle = document.getElementById('forgot-toggle');
const resetPanel = document.getElementById('reset-password-panel');
const resetButton = document.getElementById('send-reset-link');
const resetEmailInput = document.getElementById('reset-email');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const mobileInput = document.getElementById('mobile');
  const mobile = mobileInput?.value.trim() || '';

  if (!/^\d{10}$/.test(mobile)) {
    window.alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  window.location.href = 'dashboard-admin.html';
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
