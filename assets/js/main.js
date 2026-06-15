// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.9)';
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
let navOpen = false;

navToggle?.addEventListener('click', () => {
  navOpen = !navOpen;
  if (navOpen) {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(10,10,15,0.98)';
    navLinks.style.padding = '1rem 2rem';
    navLinks.style.borderBottom = '1px solid #2a2a40';
    navLinks.style.zIndex = '99';
  } else {
    navLinks.style.display = 'none';
  }
});

// Animate skill bars when section enters viewport
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const target = fill.getAttribute('data-width') || fill.style.width;
        fill.style.width = '0';
        setTimeout(() => { fill.style.width = target; }, 50);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// Store data-width on skill fills for animation
document.querySelectorAll('.skill-fill').forEach(fill => {
  fill.setAttribute('data-width', fill.style.width);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navOpen) {
        navLinks.style.display = 'none';
        navOpen = false;
      }
    }
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#6c63ff' : '';
  });
});
