/**
 * ATTARIK — Luxury Fragrance Brand
 * Main JavaScript · Production Build
 * ──────────────────────────────────
 * Vanilla ES6+ · No frameworks
 */
;(function () {
  'use strict';

  /* ──────────────────────────────────────────────
   * Utility helpers
   * ────────────────────────────────────────────── */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const isMobile = () => window.innerWidth <= 768;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const easeOutQuad = (t) => t * (2 - t);

  /* ──────────────────────────────────────────────
   * Boot
   * ────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursorGlow();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initParticleCanvas();
    initScrollAnimations();
    initCounterAnimation();
    initTestimonialSlider();
    initScentFinder();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
    initWhatsAppFloat();
    initParallax();
    initLazyImages();
  });

  /* ──────────────────────────────────────────────
   * 1. Preloader
   * ────────────────────────────────────────────── */

  function initPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    window.addEventListener('load', handleLoad);

    // Fallback in case 'load' already fired before DOMContentLoaded listener
    if (document.readyState === 'complete') {
      handleLoad();
    }

    function handleLoad() {
      window.removeEventListener('load', handleLoad);
      setTimeout(() => {
        document.body.classList.add('loaded');

        const onEnd = () => {
          preloader.removeEventListener('transitionend', onEnd);
          preloader.remove();
        };
        preloader.addEventListener('transitionend', onEnd);

        // Safety net: remove after 1.5 s even if transitionend never fires
        setTimeout(() => {
          if (preloader.parentNode) preloader.remove();
        }, 1500);
      }, 2000);
    }
  }

  /* ──────────────────────────────────────────────
   * 2. Custom Cursor Glow
   * ────────────────────────────────────────────── */

  function initCursorGlow() {
    const cursor = $('#cursor-glow');
    if (!cursor) return;

    // Hide on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursor.style.display = 'none';
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const ease = 0.15; // smoothing factor

    const size = cursor.offsetWidth || 30;
    const half = size / 2;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function tick() {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      cursor.style.left = `${currentX - half}px`;
      cursor.style.top = `${currentY - half}px`;

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    // Hide when cursor leaves window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  /* ──────────────────────────────────────────────
   * 3. Navbar Scroll Effect
   * ────────────────────────────────────────────── */

  function initNavbarScroll() {
    const navbar = $('#navbar');
    if (!navbar) return;

    const navLinks = $$('#nav-links a[href^="#"]');
    const sections = navLinks
      .map((a) => $(a.getAttribute('href')))
      .filter(Boolean);

    // Scroll class
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once

    // Active section highlighting via IntersectionObserver
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ──────────────────────────────────────────────
   * 4. Mobile Menu Toggle
   * ────────────────────────────────────────────── */

  function initMobileMenu() {
    const toggle = $('#nav-toggle');
    const navLinks = $('#nav-links');
    if (!toggle || !navLinks) return;

    const links = $$('a', navLinks);

    function openMenu() {
      toggle.classList.add('active');
      navLinks.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ──────────────────────────────────────────────
   * 5. Smooth Scroll
   * ────────────────────────────────────────────── */

  function initSmoothScroll() {
    const OFFSET = 80; // fixed navbar height

    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const top =
        target.getBoundingClientRect().top + window.pageYOffset - OFFSET;

      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL without jumping
      history.pushState(null, '', href);
    });
  }

  /* ──────────────────────────────────────────────
   * 6. Gold Particle Canvas
   * ────────────────────────────────────────────── */

  function initParticleCanvas() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 80;
    const COLOR = 'rgb(201, 169, 110)';
    let particles = [];
    let animId = null;

    function resize() {
      canvas.width = canvas.parentElement
        ? canvas.parentElement.offsetWidth
        : window.innerWidth;
      canvas.height = canvas.parentElement
        ? canvas.parentElement.offsetHeight
        : window.innerHeight;
    }

    function createParticle(randomY) {
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + Math.random() * 40,
        size: Math.random() * 2 + 1,          // 1‑3 px
        speedY: Math.random() * 0.6 + 0.2,    // upward speed
        speedX: (Math.random() - 0.5) * 0.3,  // gentle horizontal drift
        opacity: Math.random() * 0.5 + 0.1,   // 0.1‑0.6
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(true));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y -= p.speedY;
        p.x += p.speedX;

        // Reset when off-screen
        if (p.y + p.size < 0 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = createParticle(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = COLOR;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
      }, 200);
    });
  }

  /* ──────────────────────────────────────────────
   * 7. Scroll Animations
   * ────────────────────────────────────────────── */

  function initScrollAnimations() {
    const items = $$('[data-animate]');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = el.getAttribute('data-delay');

          if (delay) {
            el.style.transitionDelay = delay;
          }

          el.classList.add('animate-in');
          obs.unobserve(el); // trigger once
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
   * 8. Counter Animation
   * ────────────────────────────────────────────── */

  function initCounterAnimation() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const DURATION = 2000; // ms

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          obs.unobserve(el);

          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          const start = performance.now();

          function step(now) {
            const elapsed = now - start;
            const progress = clamp(elapsed / DURATION, 0, 1);
            const value = Math.round(easeOutQuad(progress) * target);

            el.textContent = value.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toLocaleString();
            }
          }

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
   * 9. Testimonial Slider
   * ────────────────────────────────────────────── */

  function initTestimonialSlider() {
    const track = $('#testimonial-track');
    const prevBtn = $('#testimonial-prev');
    const nextBtn = $('#testimonial-next');
    const dotsContainer = $('#testimonial-dots');

    if (!track) return;

    const cards = $$('.testimonial-card', track);
    if (!cards.length) return;

    let currentIndex = 0;
    let autoSlideId = null;
    const AUTO_INTERVAL = 5000;

    function getPerView() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 600) return 2;
      return 1;
    }

    function getTotalSlides() {
      const perView = getPerView();
      return Math.max(1, cards.length - perView + 1);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getTotalSlides();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = $$('.testimonial-dot', dotsContainer);
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
      const total = getTotalSlides();
      currentIndex = clamp(index, 0, total - 1);

      const perView = getPerView();
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      const cardWidth = cards[0].offsetWidth + gap;
      const offset = -(currentIndex * cardWidth);

      track.style.transform = `translateX(${offset}px)`;
      updateDots();
    }

    function next() {
      const total = getTotalSlides();
      goTo(currentIndex >= total - 1 ? 0 : currentIndex + 1);
    }

    function prev() {
      const total = getTotalSlides();
      goTo(currentIndex <= 0 ? total - 1 : currentIndex - 1);
    }

    function startAuto() {
      stopAuto();
      autoSlideId = setInterval(next, AUTO_INTERVAL);
    }

    function stopAuto() {
      if (autoSlideId) {
        clearInterval(autoSlideId);
        autoSlideId = null;
      }
    }

    // Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    // Pause on hover
    const wrapper = track.closest('.testimonial-slider') || track.parentElement;
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAuto);
      wrapper.addEventListener('mouseleave', startAuto);
    }

    // Resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        currentIndex = clamp(currentIndex, 0, getTotalSlides() - 1);
        buildDots();
        goTo(currentIndex);
      }, 200);
    });

    // Init
    buildDots();
    goTo(0);
    startAuto();
  }

  /* ──────────────────────────────────────────────
   * 10. Scent Finder Quiz
   * ────────────────────────────────────────────── */

  function initScentFinder() {
    const step1 = $('#finder-step-1');
    const step2 = $('#finder-step-2');
    const step3 = $('#finder-step-3');
    const resultPanel = $('#finder-result');
    const restartBtn = $('#finder-restart');

    if (!step1) return;

    const answers = { mood: '', occasion: '', family: '' };

    const scents = {
      'Noir Absolu': {
        image: 'images/bottle-noir.png',
        desc: 'A commanding blend of oud, rose, and saffron. Bold, intense, and unforgettable.',
        link: 'https://wa.me/918787088432?text=Hi%2C%20I\'m%20interested%20in%20ATTARIK%20Noir%20Absolu',
      },
      'Rose Elixir': {
        image: 'images/bottle-rose.png',
        desc: 'An elegant symphony of Damask rose and peony. Graceful and timelessly feminine.',
        link: 'https://wa.me/918787088432?text=Hi%2C%20I\'m%20interested%20in%20ATTARIK%20Rose%20Elixir',
      },
      'Royal Oud': {
        image: 'images/bottle-oud.png',
        desc: 'A deep journey through Assam oud and incense. Mysterious, regal, and captivating.',
        link: 'https://wa.me/918787088432?text=Hi%2C%20I\'m%20interested%20in%20ATTARIK%20Royal%20Oud',
      },
      'White Musk': {
        image: 'images/bottle-musk.png',
        desc: 'A clean embrace of white musk and jasmine. Fresh, pure, and effortlessly elegant.',
        link: 'https://wa.me/918787088432?text=Hi%2C%20I\'m%20interested%20in%20ATTARIK%20White%20Musk',
      },
    };

    function getResult() {
      const { mood, family } = answers;

      if (mood === 'bold' || family === 'oriental') return 'Noir Absolu';
      if (mood === 'romantic' || family === 'floral') return 'Rose Elixir';
      if (mood === 'mysterious' || family === 'woody') return 'Royal Oud';
      if (mood === 'fresh' || family === 'clean') return 'White Musk';

      return 'Noir Absolu'; // default
    }

    function transitionStep(from, to) {
      if (from) {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';
        setTimeout(() => {
          from.style.display = 'none';
          if (to) {
            to.style.display = '';
            to.style.opacity = '0';
            to.style.pointerEvents = 'auto';
            // Force reflow
            void to.offsetHeight;
            to.style.opacity = '1';
          }
        }, 400);
      } else if (to) {
        to.style.display = '';
        to.style.opacity = '0';
        to.style.pointerEvents = 'auto';
        void to.offsetHeight;
        to.style.opacity = '1';
      }
    }

    function showResult() {
      const name = getResult();
      const scent = scents[name];
      if (!scent || !resultPanel) return;

      const img = resultPanel.querySelector('.result-image, img');
      const title = resultPanel.querySelector('.result-name, h3');
      const desc = resultPanel.querySelector('.result-desc, p');
      const link = resultPanel.querySelector('.result-link, a');

      if (img) { img.src = scent.image; img.alt = name; }
      if (title) title.textContent = name;
      if (desc) desc.textContent = scent.desc;
      if (link) link.href = scent.link;

      transitionStep(step3, resultPanel);
    }

    // Step 1 options
    $$('.finder-option', step1).forEach((opt) => {
      opt.addEventListener('click', () => {
        answers.mood = opt.getAttribute('data-value') || opt.dataset.value || '';
        transitionStep(step1, step2);
      });
    });

    // Step 2 options
    if (step2) {
      $$('.finder-option', step2).forEach((opt) => {
        opt.addEventListener('click', () => {
          answers.occasion = opt.getAttribute('data-value') || opt.dataset.value || '';
          transitionStep(step2, step3);
        });
      });
    }

    // Step 3 options
    if (step3) {
      $$('.finder-option', step3).forEach((opt) => {
        opt.addEventListener('click', () => {
          answers.family = opt.getAttribute('data-value') || opt.dataset.value || '';
          showResult();
        });
      });
    }

    // Restart
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        answers.mood = '';
        answers.occasion = '';
        answers.family = '';

        [step2, step3, resultPanel].forEach((el) => {
          if (el) {
            el.style.display = 'none';
            el.style.opacity = '0';
          }
        });

        if (step1) {
          step1.style.display = '';
          step1.style.pointerEvents = 'auto';
          void step1.offsetHeight;
          step1.style.opacity = '1';
        }
      });
    }
  }

  /* ──────────────────────────────────────────────
   * 11. Contact Form
   * ────────────────────────────────────────────── */

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const status = $('#form-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"], .submit-btn');
      const btnText = btn ? btn.querySelector('.btn-text') : null;
      const btnLoader = btn ? btn.querySelector('.btn-loader') : null;

      // Show loading
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline-block';
      if (btn) btn.disabled = true;

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        if (status) {
          status.textContent = 'Thank you! Your message has been sent successfully.';
          status.className = 'form-status success';
        }
        form.reset();
      } catch (err) {
        console.error('Contact form error:', err);
        if (status) {
          status.textContent = 'Something went wrong. Please try again later.';
          status.className = 'form-status error';
        }
      } finally {
        // Reset button
        if (btnText) btnText.style.display = '';
        if (btnLoader) btnLoader.style.display = 'none';
        if (btn) btn.disabled = false;
      }
    });
  }

  /* ──────────────────────────────────────────────
   * 12. Newsletter Form
   * ────────────────────────────────────────────── */

  function initNewsletterForm() {
    const form = $('#newsletter-form');
    if (!form) return;

    const status = $('#newsletter-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"], input[name="email"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email) {
        if (status) {
          status.textContent = 'Please enter a valid email address.';
          status.className = 'newsletter-status error';
        }
        return;
      }

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        if (status) {
          status.textContent = 'You\'re in! Welcome to the ATTARIK family.';
          status.className = 'newsletter-status success';
        }
        form.reset();
      } catch (err) {
        console.error('Newsletter error:', err);
        if (status) {
          status.textContent = 'Subscription failed. Please try again.';
          status.className = 'newsletter-status error';
        }
      }
    });
  }

  /* ──────────────────────────────────────────────
   * 13. Back to Top
   * ────────────────────────────────────────────── */

  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        btn.classList.toggle('visible', window.scrollY > 500);
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
   * 14. WhatsApp Float
   * ────────────────────────────────────────────── */

  function initWhatsAppFloat() {
    const el = $('#whatsapp-float');
    if (!el) return;

    // Ensure hidden initially
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';

    window.addEventListener(
      'scroll',
      () => {
        const show = window.scrollY > 300;
        el.style.opacity = show ? '1' : '0';
        el.style.pointerEvents = show ? 'auto' : 'none';
      },
      { passive: true }
    );
  }

  /* ──────────────────────────────────────────────
   * 15. Parallax Effect
   * ────────────────────────────────────────────── */

  function initParallax() {
    const bgs = $$('.parallax-bg');
    if (!bgs.length) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;

          bgs.forEach((bg) => {
            const rect = bg.getBoundingClientRect();
            // Only update if near viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
              const offset = (scrollY - bg.offsetTop) * 0.4;
              bg.style.backgroundPosition = `center ${offset}px`;
            }
          });

          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ──────────────────────────────────────────────
   * 16. Image Lazy Loading
   * ────────────────────────────────────────────── */

  function initLazyImages() {
    const images = $$('img:not([loading])');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }
})();
