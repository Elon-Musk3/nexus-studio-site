const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const showcaseTrack = document.querySelector('.showcase-track');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (reduceMotion.matches && showcaseTrack) {
  showcaseTrack.style.animation = 'none';
}

const internalLinks = document.querySelectorAll('a[href^="#"]');

const easeInOutCubic = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const getScrollTarget = (target) => {
  const nav = document.querySelector('.nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  const extraOffset = 20;
  return Math.max(target.getBoundingClientRect().top + window.scrollY - navHeight - extraOffset, 0);
};

const animateScrollTo = (targetY, duration = 720) => {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  let startTime = null;

  const step = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const targetY = getScrollTarget(target);

    if (reduceMotion.matches) {
      window.scrollTo(0, targetY);
      return;
    }

    animateScrollTo(targetY, 720);
  });
});
