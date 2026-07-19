/* ============================================
   GOVERNMENT CITIZEN SERVICE PORTAL
   main.js - Interactive Features & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // Intercept navigation for smooth exit transition (instant, no delay)
  document.querySelectorAll('a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.getAttribute('target') === '_blank') {
      return;
    }
    if (href.endsWith('.html') || (href.startsWith('/') && !href.startsWith('//')) || (!href.includes(':') && !href.includes('//'))) {
      link.addEventListener('click', function (e) {
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
        e.preventDefault();
        document.body.classList.add('page-transition-out');
        // Navigate immediately — CSS opacity handles the fade
        window.location.href = href;
      });
    }
  });

  // ---- Throttled Scroll Effects (Navbar & Parallax) ----
  var navbar = document.querySelector('.navbar');
  var pageHeaders = document.querySelectorAll('.page-header');
  var heroVideo = document.querySelector('.hero-video');
  var scrollTicking = false;

  function handleScrollEffects() {
    var scrolled = window.scrollY;
    
    if (navbar) {
      if (scrolled > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    pageHeaders.forEach(function (header) {
      var limit = header.offsetTop + header.offsetHeight;
      if (scrolled <= limit) {
        var yPos = scrolled * 0.18;
        header.style.backgroundPositionY = 'calc(50% + ' + yPos + 'px)';
      }
    });
    
    if (heroVideo && scrolled < 800) {
      var yVideoPos = scrolled * 0.28;
      heroVideo.style.transform = 'translateY(' + yVideoPos + 'px)';
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      requestAnimationFrame(handleScrollEffects);
      scrollTicking = true;
    }
  });
  handleScrollEffects();

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll Animations ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .anim-fade, .anim-slide-up, .anim-zoom-in, .anim-slide-left, .anim-slide-right, .anim-slide-down, .anim-zoom-out').forEach(function (el) {
    scrollObserver.observe(el);
  });

  // ---- Counter Animation ----
  function animateCounter(element, target, duration) {
    duration = duration || 1600;
    var startTime = null;
    var suffix = element.getAttribute('data-suffix') || '';

    function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    }

    function updateCounter(currentTime) {
      if (!startTime) startTime = currentTime;
      var timeElapsed = currentTime - startTime;
      
      var progress = Math.min(timeElapsed, duration);
      var value = easeOutQuad(progress, 0, target, duration);
      
      element.textContent = Math.floor(value).toLocaleString() + suffix;

      if (timeElapsed < duration) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(updateCounter);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        var target = parseInt(entry.target.getAttribute('data-count')) || 0;
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var faqItem = this.parentElement;
      var isActive = faqItem.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // ---- Scroll to Top Button ----
  var scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.setAttribute('title', 'Back to top');
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);

  function handleScrollTopBtn() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(handleScrollTopBtn);
  });
  handleScrollTopBtn();

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Sidebar Toggle (Dashboard) ----
  var sidebarToggle = document.querySelector('.toggle-sidebar');
  var sidebar = document.querySelector('.sidebar');
  var sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('show');
    });

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', function () {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
      });
    }
  }

  // ---- Dashboard Sidebar Active Link ----
  var dashCurrentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-menu-item a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === dashCurrentPage) {
      link.classList.add('active');
    }
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ---- Form Validation Styles ----
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var isValid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
      if (!isValid) {
        e.preventDefault();
      }
    });

    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('input', function () {
        if (this.value.trim()) {
          this.classList.remove('is-invalid');
        }
      });
    });
  });

  // ---- Tooltip Init (Bootstrap) ----
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (el) {
    new bootstrap.Tooltip(el);
  });

  // ---- Password Toggle ----
  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = this.parentElement.querySelector('input');
      var icon = this.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // ---- Animated placeholder for search ----
  var searchInputs = document.querySelectorAll('.dashboard-search input');
  searchInputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement.style.borderColor = 'var(--primary)';
      this.parentElement.style.background = 'var(--white)';
    });
    input.addEventListener('blur', function () {
      this.parentElement.style.borderColor = '';
      this.parentElement.style.background = '';
    });
  });

  // ---- Charts (Dashboard) ----
  // Only init if Chart.js is loaded
  if (typeof Chart !== 'undefined') {
    initDashboardCharts();
  }

  function initDashboardCharts() {
    // Line Chart - Applications Over Time
    var lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
      new Chart(lineCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Applications',
            data: [65, 78, 90, 81, 96, 110, 120, 115, 130, 145, 155, 170],
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37,99,235,0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#2563EB',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }, {
            label: 'Resolved',
            data: [50, 62, 75, 70, 85, 95, 105, 100, 118, 130, 140, 155],
            borderColor: '#0F172A',
            backgroundColor: 'rgba(15,23,42,0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#0F172A',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Doughnut Chart - Service Distribution
    var doughnutCtx = document.getElementById('doughnutChart');
    if (doughnutCtx) {
      new Chart(doughnutCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Identity Services', 'Revenue', 'Social Welfare', 'Health', 'Education', 'Other'],
          datasets: [{
            data: [30, 22, 18, 14, 10, 6],
            backgroundColor: ['#2563EB', '#0F172A', '#10B981', '#3B82F6', '#0EA5E9', '#94A3B8'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
          }
        }
      });
    }

    // Bar Chart - Department Performance
    var barCtx = document.getElementById('barChart');
    if (barCtx) {
      new Chart(barCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Revenue', 'Health', 'Education', 'Transport', 'Housing', 'Agriculture'],
          datasets: [{
            label: 'Processed',
            data: [85, 72, 90, 68, 78, 65],
            backgroundColor: 'rgba(37,99,235,0.8)',
            borderRadius: 6
          }, {
            label: 'Pending',
            data: [15, 28, 10, 32, 22, 35],
            backgroundColor: 'rgba(15,23,42,0.5)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } }
          },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: function (v) { return v + '%'; } } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Admin Doughnut - Ticket Status
    var adminDoughnut = document.getElementById('adminDoughnutChart');
    if (adminDoughnut) {
      new Chart(adminDoughnut.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Pending', 'Rejected'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#10B981', '#3B82F6', '#2563EB', '#EF4444'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
          }
        }
      });
    }
  }

  // ---- Hero Typing Effect ----
  var typingEl = document.getElementById('heroTyping');
  if (typingEl) {
    var words = ['Government Services', 'Digital Certificates', 'Online Payments', 'Smart Governance', 'Your Future'];
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typeEffect() {
      var currentWord = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      var typeSpeed = isDeleting ? 40 : 90;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // ---- Hero Particles ----
  var particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    var particleCount = 30;
    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');
      particle.className = 'hero-particle';
      var size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      var colors = ['rgba(37,99,235,0.5)', 'rgba(15,23,42,0.4)', 'rgba(16,185,129,0.4)', 'rgba(59,130,246,0.4)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particleContainer.appendChild(particle);
    }
  }

  // ---- Ripple Effect on Buttons ----
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // Add ripple keyframe
  var rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0;}}';
  document.head.appendChild(rippleStyle);

});
