document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('[data-nav] a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro = document.querySelector('[data-intro]');
// Bei künftigen Änderungen lassen sich die beiden Profil-URLs hier aktualisieren.
const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/seraphin-scherer?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  instagram: 'https://www.instagram.com/seraphin_scherer?xtok=MTlwdHc0Ym5henZ0Zw==',
};

document.querySelector('[data-year]').textContent = new Date().getFullYear();

if (intro) {
  const finishIntro = () => {
    intro.classList.add('is-complete');
    document.body.classList.add('intro-finished');
  };
  if (reducedMotion) finishIntro();
  else {
    requestAnimationFrame(() => intro.classList.add('is-playing'));
    window.setTimeout(finishIntro, 2100);
  }
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  nav.classList.toggle('is-open', willOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('[data-social-link]').forEach((link) => {
  const url = socialLinks[link.dataset.socialLink];
  if (!url) return;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  link.classList.remove('pending-link');
  link.querySelector('small').textContent = 'Profil öffnen';
});

const visibilityObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
  if (reducedMotion) element.classList.add('is-visible');
  else visibilityObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const activeId = visible.target.id;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  header.classList.toggle('is-light', !['top', 'marienau', 'netzwerk', 'kontakt'].includes(activeId));
}, { threshold: [0.35, 0.55, 0.75] });

sections.forEach((section) => sectionObserver.observe(section));
