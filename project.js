const currentUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('aipl_current_user') || '{}');
  } catch {
    return {};
  }
})();

const nameEl = document.getElementById('project-name');
const timeEl = document.getElementById('live-time');
const dateEl = document.getElementById('live-date');
const coordsEl = document.getElementById('live-coords');
const punchBtn = document.getElementById('project-punch');
const statusEl = document.getElementById('project-punch-status');

let punchedIn = false;

const params = new URLSearchParams(window.location.search);
const projectName = params.get('project') || 'Project Dashboard';

if (currentUser.role === 'employee' && currentUser.assignedProject && currentUser.assignedProject !== projectName) {
  window.alert('You can access only your assigned project.');
  window.location.href = `project-dashboard.html?project=${encodeURIComponent(currentUser.assignedProject)}`;
}

nameEl.textContent = projectName;

autoClock();
setInterval(autoClock, 1000);

function autoClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('en-IN', { hour12: true });
  dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      coordsEl.textContent = `Location: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
    },
    () => {
      coordsEl.textContent = 'Location: Permission denied';
    }
  );
} else {
  coordsEl.textContent = 'Location: Not supported';
}

punchBtn?.addEventListener('click', () => {
  const stamp = `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`;

  if (!punchedIn) {
    punchedIn = true;
    punchBtn.classList.remove('is-in');
    punchBtn.classList.add('is-out');
    punchBtn.textContent = 'Punch Out';
    statusEl.textContent = `Punch In recorded for ${projectName} at ${stamp}`;
  } else {
    punchedIn = false;
    punchBtn.classList.remove('is-out');
    punchBtn.classList.add('is-in');
    punchBtn.textContent = 'Punch In';
    statusEl.textContent = `Punch Out recorded for ${projectName} at ${stamp}`;
  }
});
