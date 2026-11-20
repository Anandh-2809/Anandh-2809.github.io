/**
 * ============================================================================
 * ANANDHA RAJ S - CINEMATIC CYBERPUNK PORTFOLIO JAVASCRIPT
 * Features:
 *   1. Canvas Particle Background Engine (Floating Crimson & Neon Particles)
 *   2. Mouse Spotlight / Radial Lighting Controller
 *   3. Typewriter Subtitle Text Engine
 *   4. Intersection Observer Scroll-Reveal
 *   5. Animated Counter Stats Engine
 *   6. Navbar Scroll Effects & Mobile Navigation Drawer
 *   7. Interactive Toast Notification & Click-to-Copy
 *   8. Contact Form Mailto Handler & Validation
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. PRELOADER CONTROLLER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  
  const dismissPreloader = () => {
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 650);
    }
  };

  // Dismiss either when all window resources load or after a safety 1.5s timeout
  window.addEventListener('load', () => {
    setTimeout(dismissPreloader, 400);
  });
  setTimeout(dismissPreloader, 1500);

  /* ==========================================================================
     2. MOUSE-FOLLOWING LIGHT EFFECT (RADIAL GLOW)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth interpolation for mouse lighting spotlight
  const updateCursorGlow = () => {
    mouseX += (targetX - mouseX) * 0.12;
    mouseY += (targetY - mouseY) * 0.12;

    document.documentElement.style.setProperty('--mouse-x', `${mouseX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY.toFixed(1)}px`);

    requestAnimationFrame(updateCursorGlow);
  };
  requestAnimationFrame(updateCursorGlow);

  /* ==========================================================================
     3. CANVAS PARTICLE SYSTEM (FLOATING RED PARTICLES & NEON NODES)
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = -Math.random() * 0.55 - 0.15; // Upward drift
        this.opacity = Math.random() * 0.65 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseVal = Math.random() * Math.PI;

        // Color variation: crimson, neon red, deep ruby
        const colors = [
          'rgba(255, 26, 64, ',
          'rgba(255, 0, 51, ',
          'rgba(204, 0, 0, ',
          'rgba(180, 0, 30, '
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulseVal += this.pulseSpeed;

        // Wrap around boundaries
        if (this.y < -10) {
          this.y = canvas.height + 10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;

        // Subtle proximity push from mouse
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      draw() {
        const currentOpacity = Math.max(0.1, this.opacity * (0.7 + 0.3 * Math.sin(this.pulseVal)));
        ctx.fillStyle = this.baseColor + currentOpacity + ')';
        ctx.shadowColor = 'rgba(255, 26, 64, 0.8)';
        ctx.shadowBlur = this.size * 3.5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset shadow for performance
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen area
      const particleCount = Math.floor((canvas.width * canvas.height) / 13000);
      const clampedCount = Math.min(Math.max(particleCount, 45), 110);

      for (let i = 0; i < clampedCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      const maxDistance = 90;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.strokeStyle = `rgba(255, 0, 51, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      drawConnections();
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      resizeCanvas();
      animateParticles();
    });

    resizeCanvas();
    animateParticles();
  }

  /* ==========================================================================
     4. TYPEWRITER SUBTITLE EFFECT
     ========================================================================== */
  const typedTextEl = document.getElementById('typed-text');
  const roles = [
    'Software Developer',
    'Java Developer',
    'Web Developer',
    'CSE Graduate'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const handleTypewriter = () => {
    if (!typedTextEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause on full word
      typingSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(handleTypewriter, typingSpeed);
  };

  handleTypewriter();

  /* ==========================================================================
     5. NAVBAR SCROLL & ACTIVE SECTION HIGHLIGHTING
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Sticky navbar state on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Hamburger Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     6. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     7. ANIMATED COUNTER FOR ACHIEVEMENTS SECTION
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter');
  const counterFloatElements = document.querySelectorAll('.counter-float');
  const achievementsSection = document.getElementById('achievements');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    // Integer counters (e.g. 150, 2)
    counterElements.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(step);
    });

    // Float counters (e.g. 8.23)
    counterFloatElements.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1800; // ms
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (easeOut * target).toFixed(2);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toFixed(2);
        }
      };

      requestAnimationFrame(step);
    });
  };

  if (achievementsSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(achievementsSection);
  }

  /* ==========================================================================
     8. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  const showToast = (message, duration = 3200, type = 'success') => {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) {
      const isError = type === 'error';
      toastIcon.className = (isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check') + ' toast-icon' + (isError ? ' toast-icon-error' : '');
    }
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  /* ==========================================================================
     9. CLICK-TO-COPY FOR CONTACT DETAILS
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');

      if (textToCopy) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Copied to clipboard: ${textToCopy}`);
          }).catch(() => {
            fallbackCopy(textToCopy);
          });
        } else {
          fallbackCopy(textToCopy);
        }
      }
    });
  });

  const fallbackCopy = (text) => {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`);
    } catch (err) {
      showToast('Could not copy automatically. Please select text manually.');
    }
    document.body.removeChild(tempInput);
  };

  /* ==========================================================================
     10. CONTACT FORM — EMAILJS (browser SDK v4)
     ==========================================================================
     Sends the form to anandharaj28032005@gmail.com through EmailJS.
     Only the PUBLIC key is used here (it is safe in browser code).
     Never put an EmailJS Private Key or any password in this file.
     Success is shown ONLY when EmailJS answers with status 200.
     Template variables: from_name, reply_to, subject, message
     ========================================================================== */
  const EMAILJS_CONFIG = {
    serviceId:  'service_8khck8e',
    templateId: 'template_u5vluae',
    publicKey:  '8yJQgWEEORVeEaGbw',   // Public Key (safe for browsers). Never put the Private Key here.
    timeoutMs:  20000
  };

  // Loads the EmailJS SDK from a backup CDN if the primary <script> tag was blocked or failed.
  const ensureEmailJS = () => new Promise((resolve) => {
    if (typeof emailjs !== 'undefined') return resolve(true);
    const backup = document.createElement('script');
    backup.src = 'https://unpkg.com/@emailjs/browser@5/dist/email.min.js';
    backup.onload  = () => resolve(typeof emailjs !== 'undefined');
    backup.onerror = () => resolve(false);
    document.head.appendChild(backup);
  });

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // Build a success state panel (injected once into the DOM)
    const successPanel = document.createElement('div');
    successPanel.className = 'form-success-panel';
    successPanel.setAttribute('role', 'status');
    successPanel.setAttribute('aria-live', 'polite');
    successPanel.innerHTML = `
      <div class="form-success-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h3 class="form-success-title">MESSAGE TRANSMITTED</h3>
      <p class="form-success-msg">Thank you for reaching out! I will get back to you as soon as possible.</p>
      <button type="button" class="btn btn-outline cyber-btn form-success-back" id="form-back-btn">
        <span class="btn-text">SEND ANOTHER</span>
        <span class="btn-icon"><i class="fa-solid fa-rotate-left"></i></span>
      </button>`;
    successPanel.style.display = 'none';
    contactForm.parentNode.insertBefore(successPanel, contactForm.nextSibling);

    // "Send another" shows the (already reset) form again
    document.getElementById('form-back-btn').addEventListener('click', () => {
      successPanel.style.display = 'none';
      contactForm.style.display = 'flex';
    });

    const submitBtn = document.getElementById('submit-btn');
    const setButton = (sending) => {
      submitBtn.disabled = sending;
      submitBtn.querySelector('.btn-text').textContent = sending ? 'TRANSMITTING…' : 'TRANSMIT MESSAGE';
      submitBtn.querySelector('.btn-icon i').className =
        sending ? 'fa-solid fa-circle-notch fa-spin' : 'fa-solid fa-paper-plane';
    };

    let isSending = false;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSending) return;                       // block duplicate submissions

      const nameInput    = document.getElementById('contact-name');
      const emailInput   = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // ── Validation ────────────────────────────────────────────────────────
      if (!name) {
        showToast('Please enter your full name.', 3200, 'error'); nameInput.focus(); return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 3200, 'error'); emailInput.focus(); return;
      }
      if (!subject) {
        showToast('Please enter a subject.', 3200, 'error'); subjectInput.focus(); return;
      }
      if (!message) {
        showToast('Please write your message.', 3200, 'error'); messageInput.focus(); return;
      }

      // ── Configuration / SDK checks (never fake a success) ─────────────────
      if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey.indexOf('PASTE_') === 0) {
        showToast('Contact form is not configured yet (EmailJS Public Key missing). Please email anandharaj28032005@gmail.com', 6000, 'error');
        console.error('EmailJS: Public Key not set in script.js (EMAILJS_CONFIG.publicKey).');
        return;
      }
      // ── Sending state ─────────────────────────────────────────────────────
      isSending = true;
      setButton(true);

      if (!(await ensureEmailJS())) {
        console.error('EmailJS SDK could not be loaded from jsDelivr or unpkg (network, firewall or ad blocker).');
        showToast('Email service could not load (blocked network or ad blocker). Please email anandharaj28032005@gmail.com', 7000, 'error');
        isSending = false; setButton(false);
        return;
      }
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

      try {
        const params = { from_name: name, reply_to: email, subject: subject, message: message };

        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject({ timedOut: true }), EMAILJS_CONFIG.timeoutMs));

        const res = await Promise.race([
          emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params,
                       { publicKey: EMAILJS_CONFIG.publicKey }),
          timeout
        ]);

        if (!res || res.status !== 200) {
          throw { status: res && res.status, text: res && res.text };
        }

        // ── Success: EmailJS confirmed acceptance ───────────────────────────
        contactForm.reset();
        contactForm.style.display = 'none';
        successPanel.style.display = 'flex';
        showToast('Message sent! I will reply soon.', 4000);

      } catch (err) {
        // ── Error ─────────────────────────────────────────────────────────
        // EmailJS puts the real reason in err.text (e.g. "The Public Key is invalid").
        console.error('EmailJS error → status:', err && err.status, '| text:', err && err.text, err);
        const reason = (err && typeof err.text === 'string') ? err.text : '';
        const low = reason.toLowerCase();
        let msg;
        if (err && err.timedOut) {
          msg = 'The request timed out. Please try again, or email anandharaj28032005@gmail.com';
        } else if (err && err.status === 429) {
          msg = 'Too many requests. Please wait a moment and try again.';
        } else if (err && typeof err.status === 'number') {
          let hint = '';
          if (low.includes('public key'))                   hint = ' (EmailJS Public Key is invalid)';
          else if (low.includes('service') && low.includes('not found')) hint = ' (EmailJS Service ID not found)';
          else if (low.includes('template') && low.includes('not found')) hint = ' (EmailJS Template ID not found)';
          else if (low.includes('recipient'))               hint = ' (template "To Email" is empty)';
          else if (low.includes('gmail') || low.includes('scope') || low.includes('grant')) hint = ' (Gmail service needs reconnecting)';
          else if (low.includes('dynamic variables'))       hint = ' (template variable problem)';
          else if (err.status === 403)                      hint = ' (domain not allowed in EmailJS security settings)';
          msg = 'Message was not sent (' + err.status + ')' + hint + '. Please try again, or email anandharaj28032005@gmail.com';
        } else {
          msg = 'Network problem — message was not sent. Please try again, or email anandharaj28032005@gmail.com';
        }
        showToast(msg, 7000, 'error');
      } finally {
        isSending = false;
        setButton(false);
      }
    });
  }


  /* ==========================================================================
     11. RESUME DOWNLOAD NOTICE
     ========================================================================== */
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // Check if resume.pdf is available; notify user only if it is missing
      fetch('resume.pdf', { method: 'HEAD' })
        .then((res) => {
          if (!res.ok) {
            e.preventDefault();
            showToast('Place your "resume.pdf" in the website folder to enable the download!');
          }
        })
        .catch(() => {
          e.preventDefault();
          showToast('Place your "resume.pdf" in the website folder to enable the download!');
        });
    });
  }
});