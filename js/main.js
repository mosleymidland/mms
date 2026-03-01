/* ===== Blossom Buffet — Main JavaScript ===== */

(function () {
  'use strict';

  /* --- Mobile Navigation --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Menu / Gallery Tabs --- */
  document.querySelectorAll('.menu-tabs').forEach(function (tabContainer) {
    const tabs = tabContainer.querySelectorAll('.menu-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Deactivate all tabs in this container
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        // Activate clicked tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        var targetId = tab.getAttribute('data-tab');
        // Find sibling panels (categories at same level)
        var parent = tabContainer.parentElement;
        var categories = parent.querySelectorAll('.menu-category');
        categories.forEach(function (cat) {
          cat.classList.remove('active');
        });
        var target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');
          // Re-trigger fade-up animations for newly visible items
          target.querySelectorAll('.fade-up').forEach(function (el) {
            el.classList.remove('visible');
            void el.offsetWidth; // force reflow
            el.classList.add('visible');
          });
        }
      });
    });
  });

  /* --- Scroll Animations (Intersection Observer) --- */
  var fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Falling Petals (Hero Section) --- */
  var petalsContainer = document.getElementById('petals');

  if (petalsContainer) {
    var petalCount = 18;
    for (var i = 0; i < petalCount; i++) {
      var petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.width = (10 + Math.random() * 14) + 'px';
      petal.style.height = petal.style.width;
      petal.style.animationDuration = (6 + Math.random() * 10) + 's';
      petal.style.animationDelay = (Math.random() * 12) + 's';
      petal.style.opacity = (0.3 + Math.random() * 0.4).toString();
      petalsContainer.appendChild(petal);
    }
  }

  /* --- Gallery Lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var lightboxDisplay = document.getElementById('lightbox-display');
  var lightboxCaption = document.getElementById('lightbox-caption');

  if (lightbox) {
    var galleryItems = document.querySelectorAll('.gallery-item');
    var currentIndex = 0;
    var itemsArray = Array.from(galleryItems);

    function openLightbox(index) {
      currentIndex = index;
      var item = itemsArray[index];
      lightboxDisplay.textContent = item.textContent.trim().charAt(0) === '' ?
        item.textContent.trim() : item.childNodes[0].textContent.trim();
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + itemsArray.length) % itemsArray.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click', function () {
        openLightbox(idx);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });

    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate(1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* --- Form Handling (demo — shows success message) --- */
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var requiredFields = form.querySelectorAll('[required]');
      var valid = true;
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Show success (in production, this would submit to a server)
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sent! We\'ll be in touch.';
      btn.style.background = '#6b8e6b';
      btn.style.borderColor = '#6b8e6b';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  });

  /* --- Navbar shrink on scroll --- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        nav.style.boxShadow = '';
      }
    });
  }

})();
