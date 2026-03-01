const form = document.getElementById('login-form');
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

resetButton?.addEventListener('click', () => {
  const email = resetEmailInput?.value.trim() || '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    window.alert('Please enter a valid registered email address.');
    return;
  }

  window.alert(`Reset link sent to ${email}`);
});
