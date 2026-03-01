const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');
const menuBackdrop = document.getElementById('menu-backdrop');

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

menuToggle?.addEventListener('click', openMenu);
closeMenu?.addEventListener('click', hideMenu);
menuBackdrop?.addEventListener('click', hideMenu);
