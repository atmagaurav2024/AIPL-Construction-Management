const punchButton = document.getElementById('punch-toggle');
const punchStatus = document.getElementById('punch-status');
const punchMeta = document.getElementById('punch-meta');
const attendanceLog = document.getElementById('attendance-log');
const menuToggle = document.getElementById('menu-toggle');
const allMenusPanel = document.getElementById('all-menus-panel');
const bottomMore = document.getElementById('bottom-more');

let isPunchedIn = false;

const toTimestamp = (date) =>
  `${date.toLocaleDateString('en-IN')} ${date.toLocaleTimeString('en-IN', { hour12: true })}`;

const getCoordinates = () =>
  new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve('Location unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      () => resolve('Location permission denied'),
      { enableHighAccuracy: true, timeout: 7000 }
    );
  });

const addLog = (action, timestamp, coordinates) => {
  const item = document.createElement('li');
  item.textContent = `${action} • ${timestamp} • ${coordinates}`;
  attendanceLog.prepend(item);
};

const toggleAllMenus = () => {
  const isHidden = allMenusPanel.hasAttribute('hidden');
  if (isHidden) {
    allMenusPanel.removeAttribute('hidden');
    menuToggle?.setAttribute('aria-expanded', 'true');
  } else {
    allMenusPanel.setAttribute('hidden', '');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
};

menuToggle?.addEventListener('click', toggleAllMenus);
bottomMore?.addEventListener('click', toggleAllMenus);

punchButton?.addEventListener('click', async () => {
  punchButton.disabled = true;
  const now = new Date();
  const timestamp = toTimestamp(now);
  const coordinates = await getCoordinates();

  if (!isPunchedIn) {
    isPunchedIn = true;
    punchButton.classList.remove('is-in');
    punchButton.classList.add('is-out');
    punchButton.textContent = 'Punch Out';
    punchStatus.textContent = 'Punched In';
    punchMeta.textContent = `Punch In recorded at ${timestamp} (${coordinates})`;
    addLog('Punch In', timestamp, coordinates);
  } else {
    isPunchedIn = false;
    punchButton.classList.remove('is-out');
    punchButton.classList.add('is-in');
    punchButton.textContent = 'Punch In';
    punchStatus.textContent = 'Punched Out';
    punchMeta.textContent = `Punch Out recorded at ${timestamp} (${coordinates})`;
    addLog('Punch Out', timestamp, coordinates);
  }

  punchButton.disabled = false;
});
