/**
 * Modern Interactive Portfolio Scripts
 * Parth Dattani & PixelPerfect Apps
 */

(function () {
  'use strict';

  // --- Dynamic Current Year in Footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any nav link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Header Scrolled Background Effect ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(function (current) {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // --- Mouse Spotlight Glow Follower ---
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = -1000;
  let mouseY = -1000;

  if (cursorGlow) {
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.left = mouseX + 'px';
      cursorGlow.style.top = mouseY + 'px';
    });
  }

  // --- Interactive Constellation & Particle Canvas System ---
  const canvas = document.getElementById('bgCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const connectionDistance = 135;
    const mouseRadius = 160;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 1.8 + 1;
        
        // Color variation (Blue, Purple, Cyan)
        const colors = [
          'rgba(59, 130, 246, ',   // Electric Blue
          'rgba(139, 92, 246, ',   // Violet / Purple
          'rgba(6, 182, 212, '     // Cyan
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (gentle repel/attract)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.alpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.colorBase + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.22;
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        const dx = mouseX - particles[i].x;
        const dy = mouseY - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.35;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });
  }

  // --- Projects Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        const filterVal = this.getAttribute('data-filter');

        projectCards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category') || '';
          
          if (filterVal === 'all' || cardCategory.includes(filterVal)) {
            card.style.display = 'flex';
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // --- Toast Notification Helper ---
  const toastNotice = document.getElementById('toastNotice');
  function showToast(message) {
    if (!toastNotice) return;
    if (message) {
      const span = toastNotice.querySelector('span');
      if (span) span.textContent = message;
    }
    toastNotice.classList.add('show');
    setTimeout(function () {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      showToast('Thank you! Your message is being sent.');
    });
  }

  // --- Resume Button Toast Feedback ---
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function () {
      showToast('Opening Technical Portfolio / Deck on Google Drive...');
    });
  }

  // --- Hero Console Tab Switcher & Dynamic Telemetry (Agency Showcase) ---
  const consoleTabBtns = document.querySelectorAll('.console-tab-btn');
  const consoleTabContents = document.querySelectorAll('.console-tab-content');
  
  const telemetryLabel1 = document.getElementById('telemetryLabel1');
  const telemetryLabel2 = document.getElementById('telemetryLabel2');
  const telemetryLabel3 = document.getElementById('telemetryLabel3');
  const telemetryLabel4 = document.getElementById('telemetryLabel4');
  
  const fpsEl = document.getElementById('telemetryFps');
  const latencyEl = document.getElementById('telemetryLatency');
  const gpsEl = document.getElementById('telemetryGps');
  const ramEl = document.getElementById('telemetryRam');

  let activeTabKey = 'tab-furlink';

  const tabMetricsMap = {
    'tab-furlink': {
      label1: 'Render Engine', val1: '60.0 FPS',
      label2: 'BLE / MQTT Latency', val2: '12ms',
      label3: 'GPS Geofence', val3: '< 3.8m Lock',
      label4: 'Heap Memory', val4: '< 39MB Peak'
    },
    'tab-erp': {
      label1: 'Render Engine', val1: '60.0 FPS',
      label2: 'MySQL Sync Latency', val2: '35ms',
      label3: 'Active Modules', val3: '20+ Modules',
      label4: 'Driver GPS Tracking', val4: 'Live Stream'
    },
    'tab-gst': {
      label1: 'Render Engine', val1: '60.0 FPS',
      label2: 'PDF Generation', val2: '< 1.4s',
      label3: 'Cloud Sync Engine', val3: 'Google Sheets',
      label4: 'Billing Turnaround', val4: '-40% Time'
    },
    'tab-ecom': {
      label1: 'Performance Score', val1: '98/100',
      label2: 'Server TTFB', val2: '140ms',
      label3: 'Order Dispatch', val3: 'WhatsApp Bot',
      label4: 'Payment Gateway', val4: 'Stripe Live'
    }
  };

  if (consoleTabBtns.length > 0 && consoleTabContents.length > 0) {
    consoleTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        consoleTabBtns.forEach(function (b) { b.classList.remove('active'); });
        consoleTabContents.forEach(function (c) { c.style.display = 'none'; });

        this.classList.add('active');
        const targetId = this.getAttribute('data-tab');
        activeTabKey = targetId;
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.style.display = 'flex';
        }

        // Update telemetry labels & values for selected project
        const metrics = tabMetricsMap[targetId];
        if (metrics) {
          if (telemetryLabel1) telemetryLabel1.textContent = metrics.label1;
          if (fpsEl) fpsEl.textContent = metrics.val1;

          if (telemetryLabel2) telemetryLabel2.textContent = metrics.label2;
          if (latencyEl) latencyEl.textContent = metrics.val2;

          if (telemetryLabel3) telemetryLabel3.textContent = metrics.label3;
          if (gpsEl) gpsEl.textContent = metrics.val3;

          if (telemetryLabel4) telemetryLabel4.textContent = metrics.label4;
          if (ramEl) ramEl.textContent = metrics.val4;
        }
      });
    });
  }

  // --- Live Telemetry Heartbeat Simulation ---
  setInterval(function () {
    if (activeTabKey === 'tab-furlink') {
      if (fpsEl) {
        const fps = (59.8 + Math.random() * 0.2).toFixed(1);
        fpsEl.textContent = fps + ' FPS';
      }
      if (latencyEl) {
        const lat = Math.floor(10 + Math.random() * 4);
        latencyEl.textContent = lat + 'ms';
      }
      if (gpsEl) {
        const dist = (3.2 + Math.random() * 0.9).toFixed(1);
        gpsEl.textContent = '< ' + dist + 'm Lock';
      }
      if (ramEl) {
        const ram = (37.8 + Math.random() * 1.8).toFixed(1);
        ramEl.textContent = '< ' + ram + 'MB Peak';
      }
    } else if (activeTabKey === 'tab-erp') {
      if (latencyEl) {
        const lat = Math.floor(30 + Math.random() * 10);
        latencyEl.textContent = lat + 'ms';
      }
    }
  }, 2200);

  // --- FAQ Accordion Interactive Toggles ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const parentItem = this.closest('.faq-item');
        if (!parentItem) return;
        
        const wasActive = parentItem.classList.contains('active');
        // Close all items
        document.querySelectorAll('.faq-item').forEach(function (item) {
          item.classList.remove('active');
        });

        // Toggle clicked
        if (!wasActive) {
          parentItem.classList.add('active');
        }
      });
    });
  }

  // --- Smooth Scroll For All Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

