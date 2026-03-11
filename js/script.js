/* ============================================================
   ICONIC BUSINESS SOLUTION — MAIN JS (FULLY FIXED)
   ============================================================ */

(function () {
  'use strict';

  /* ── Tell CSS that JS has loaded → enables reveal animations ── */
  document.body.classList.add('js-ready');

  /* ── Scroll Progress Bar ── */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }

  /* ── Sticky Navbar ── */
  const navbar = document.querySelector('.navbar');
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  /* ── Back-to-top button ── */
  const backTopBtn = document.querySelector('.fl-top');
  function updateBackTop() {
    if (!backTopBtn) return;
    backTopBtn.classList.toggle('show', window.scrollY > 500);
  }
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Unified scroll handler ── */
  window.addEventListener('scroll', function () {
    updateProgress();
    updateNavbar();
    updateBackTop();
  }, { passive: true });

  /* Initial calls */
  updateProgress();
  updateNavbar();
  updateBackTop();

  /* ── Mobile Nav Toggle ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active Nav Link ── */
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Hero Typing Animation ── */
  var typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    var phrases = [
      'Business Process Outsourcing',
      'Recruitment & Talent Solution',
      'Corporate Training Programs',
      'Customer Experience Management',
      'HR & Workforce Consulting',
      'Strategic Business Advisory'
    ];
    var pi = 0, ci = 0, deleting = false;
    function typeLoop() {
      var phrase = phrases[pi];
      if (!deleting) {
        typingEl.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        typingEl.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 68);
    }
    typeLoop();
  }

  /* ── Counter Animation ── */
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    var target   = parseInt(el.dataset.target, 10);
    var duration = 2000;
    var step     = 16;
    var increments = target / (duration / step);
    var current  = 0;
    var timer = setInterval(function () {
      current += increments;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
        return;
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, step);
  }

  var counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) animateCounter(entry.target);
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObs.observe(el); });
  } else {
    /* Fallback: animate immediately */
    counterEls.forEach(function (el) { animateCounter(el); });
  }

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    /* Fallback: make everything visible immediately */
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── Testimonials Slider ── */
  var track  = document.querySelector('.testimonials-track');
  var dotsEl = document.querySelector('.testi-dots');
  if (track) {
    var cards  = track.querySelectorAll('.testi-card');
    var total  = cards.length;
    var perView = window.innerWidth <= 768 ? 1 : 2;
    var maxSlide = Math.max(0, total - perView);
    var current  = 0;
    var autoInterval;

    /* Build dots */
    if (dotsEl) {
      dotsEl.innerHTML = '';
      var dotCount = maxSlide + 1;
      for (var d = 0; d < dotCount; d++) {
        var dot = document.createElement('div');
        dot.className = 'testi-dot' + (d === 0 ? ' active' : '');
        dot.dataset.idx = d;
        dot.addEventListener('click', function () { goTo(parseInt(this.dataset.idx)); });
        dotsEl.appendChild(dot);
      }
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxSlide));
      var cardWidth = cards[0] ? cards[0].offsetWidth + 22 : 0;
      track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
      document.querySelectorAll('.testi-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    var prevBtn = document.querySelector('.testi-prev');
    var nextBtn = document.querySelector('.testi-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    function startAuto() {
      autoInterval = setInterval(function () { goTo(current >= maxSlide ? 0 : current + 1); }, 5000);
    }
    function resetAuto() {
      clearInterval(autoInterval); startAuto();
    }
    track.addEventListener('mouseenter', function () { clearInterval(autoInterval); });
    track.addEventListener('mouseleave', function () { startAuto(); });
    window.addEventListener('resize', function () {
      perView   = window.innerWidth <= 768 ? 1 : 2;
      maxSlide  = Math.max(0, total - perView);
      goTo(0);
    });
    goTo(0);
    startAuto();
  }

  /* ── Contact Form ── */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var successEl = document.querySelector('.form-success');
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        var origHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #1a7a40, #25c060)';
        if (successEl) { successEl.style.display = 'block'; }
        setTimeout(function () {
          submitBtn.innerHTML = origHtml;
          submitBtn.style.background = '';
          contactForm.reset();
          if (successEl) { successEl.style.display = 'none'; }
        }, 3500);
      }
    });
  }

  /* ── CHATBOT ── */
  var chatToggle = document.querySelector('.chat-toggle');
  var chatWindow = document.querySelector('.chat-window');
  var chatClose  = document.querySelector('.chat-close');
  var chatMsgs   = document.querySelector('.chat-msgs');
  var chatInput  = document.querySelector('.chat-input');
  var chatSend   = document.querySelector('.chat-send');
  var chatNotif  = document.querySelector('.chat-notif');

  if (!chatToggle || !chatWindow) return; /* Safety guard */

  var botReplies = {
    greet:     'Welcome to Iconic Business Solution! 👋\n\nI\'m your virtual assistant. How can I help you today?\n\nYou can ask about our services, recruitment, training, BPO, or contact information.',
    services:  'We offer 6 core services:\n\n• Recruitment & Talent Acquisition\n• Business Process Outsourcing (BPO)\n• Corporate Training & Development\n• Customer Experience Management\n• HR & Workforce Consulting\n• Strategic Business Advisory\n\nWhich service interests you most?',
    recruitment:'Our Recruitment Services include:\n\n• Executive & C-suite search\n• Volume & RPO hiring\n• Candidate screening & assessment\n• Psychometric testing\n• Onboarding support\n• Contract & permanent staffing\n\nWe have a vast network across India & SEA.',
    bpo:       'Our BPO Solution include:\n\n• Customer support operations\n• Technical helpdesk\n• Back-office processing\n• Data entry & management\n• Finance & accounting BPO\n• 24/7 SLA-driven operations\n\nClients typically see 30–40% cost reduction.',
    training:  'Our Training Programs cover:\n\n• Leadership Development\n• Communication & Soft Skills\n• Customer Service Excellence\n• Sales & Negotiation\n• Compliance & Risk\n• Digital Literacy\n\nAll programs are fully customized to your needs.',
    cx:        'Our Customer Experience services include:\n\n• CX Strategy Design\n• Omnichannel Support Setup\n• NPS & CSAT Improvement\n• Voice of Customer Programs\n• CX Team Training\n\nWe\'ve helped clients improve NPS scores by 30+ points.',
    hr:        'Our HR & Workforce Consulting covers:\n\n• HR Transformation\n• Workforce Planning\n• Performance Management\n• HR Policy Development\n• Compensation & Benefits Review\n\nWe align your people strategy with business goals.',
    contact:   'Reach us through:\n\n📞 +91 9226449358\n📧 info@iconicbusinesssolution.com\n📍 Iconic Business Solution, White Square, 304, Hinjewadi - Wakad Rd, Hinjawadi, Pimpri-Chinchwad, Maharashtra 411057\n⏰ Mon–Fri: 10:00 AM – 6:00 PM IST\n💬 WhatsApp button on this page!\n\nWe typically respond within 2 business hours.',
    about:     'Iconic Business Solution is India\'s premier corporate consultancy, founded in 2022.\n\nWe specialize in BPO, recruitment, training, and CX management.\n\n✅ 500+ clients served\n✅ 4+ years of excellence\n✅ 15+ industries covered\n✅ 98% client satisfaction rate',
    clients:   'We proudly serve clients across:\n\n• Technology & Fintech\n• Banking & Finance\n• Telecommunications\n• Retail & E-Commerce\n• Healthcare\n• Logistics & Supply Chain\n• Hospitality\n• Government-linked companies\n\nIncludes Singtel, DBS, Grab, and many more.',
    careers:   'Looking for a job? We place candidates in roles across India and SEA.\n\nSend your CV to: info@iconicbusinesssolution.com\n\nOr call us at +91 9226449358 to speak with our recruitment team.',
    default:   'Thank you for your message! 😊\n\nFor detailed enquiries, please reach us:\n📧 info@iconicbusinesssolution.com\n📞 +91 9226449358\n\nOr click the WhatsApp button to chat instantly with our team!'
  };

  var quickOpts = [
    { label: 'Our Services',    key: 'services'    },
    { label: 'Recruitment',     key: 'recruitment' },
    { label: 'BPO Solution',   key: 'bpo'         },
    { label: 'Contact Info',    key: 'contact'     }
  ];

  function addMsg(text, type, showOpts) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    msg.textContent = text;
    chatMsgs.appendChild(msg);
    if (showOpts) {
      var opts = document.createElement('div');
      opts.className = 'chat-opts';
      quickOpts.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'chat-opt';
        btn.textContent = opt.label;
        btn.addEventListener('click', function () { handleBotReply(opt.key, opt.label); });
        opts.appendChild(btn);
      });
      chatMsgs.appendChild(opts);
    }
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<div class="td"></div><div class="td"></div><div class="td"></div>';
    chatMsgs.appendChild(t);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return t;
  }

  function handleBotReply(key, userText) {
    addMsg(userText, 'user', false);
    var typing = showTyping();
    setTimeout(function () {
      typing.remove();
      var reply = botReplies[key] || botReplies.default;
      addMsg(reply, 'bot', key === 'greet');
    }, 700 + Math.random() * 500);
  }

  function handleUserInput() {
    var text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    var lower = text.toLowerCase();
    var key = 'default';
    if (/hi|hello|hey|greet|start/i.test(lower))               key = 'greet';
    else if (/service|offer|provide|what do you do/i.test(lower)) key = 'services';
    else if (/recruit|hire|talent|job|candidate|cv|resume/i.test(lower)) key = 'recruitment';
    else if (/bpo|outsourc|back.?office|process/i.test(lower))  key = 'bpo';
    else if (/train|develop|learn|program|workshop/i.test(lower)) key = 'training';
    else if (/customer|cx|experience|satisfaction/i.test(lower)) key = 'cx';
    else if (/hr|human resource|workforce|staffing/i.test(lower)) key = 'hr';
    else if (/contact|phone|email|reach|address|location|office/i.test(lower)) key = 'contact';
    else if (/about|company|who are|history|founded/i.test(lower)) key = 'about';
    else if (/client|customer|partner|who do you serve/i.test(lower)) key = 'clients';
    else if (/job|career|apply|vacancy|work with/i.test(lower)) key = 'careers';
    addMsg(text, 'user', false);
    var typing = showTyping();
    setTimeout(function () {
      typing.remove();
      addMsg(botReplies[key], 'bot', false);
    }, 700 + Math.random() * 500);
  }


  

  chatToggle.addEventListener('click', function () {
    chatWindow.classList.toggle('open');
    if (chatNotif) chatNotif.style.display = 'none';
    if (chatWindow.classList.contains('open') && chatMsgs.children.length === 0) {
      setTimeout(function () {
        addMsg('Welcome to Iconic Business Solution! 👋\n\nI\'m your virtual assistant. How can I help you today?', 'bot', true);
      }, 400);
    }
  });

  if (chatClose)  chatClose.addEventListener('click', function () { chatWindow.classList.remove('open'); });
  if (chatSend)   chatSend.addEventListener('click', handleUserInput);
  if (chatInput)  chatInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') handleUserInput(); });

})();
