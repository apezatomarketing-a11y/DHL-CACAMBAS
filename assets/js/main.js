/* ============================================
   DHL CAÇAMBAS - MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initHamburger();
  initSmoothScroll();
  initAOS();
  initFAQ();
  initBackToTop();
  initActiveNavLinks();
  initGallery();
  initSupabaseForm();
});

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = 'https://ljroptaaillhjjpxbdhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqcm9wdGFhaWxsaGpqcHhiZGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDkwNjcsImV4cCI6MjA5OTE4NTA2N30.P5UVt-0I3rJXIYWPsY5mSpw3AhzUwt2yIvZE-884sqA';

function initSupabaseForm() {
  const form = document.getElementById('contatoForm');
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');

  if (!form) return;

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span>';
    status.className = 'form-status';
    status.style.display = 'none';

    const formData = new FormData(form);
    const data = {
      nome: formData.get('nome'),
      whatsapp: formData.get('whatsapp'),
      assunto: formData.get('assunto'),
      mensagem: formData.get('mensagem'),
      created_at: new Date().toISOString()
    };

    try {
      // Salvar no Supabase (Opcional, mas mantido para log)
      await supabase.from('contatos').insert([data]);

      // Formatar mensagem para WhatsApp
      const text = `Olá! Meu nome é ${data.nome}.%0A%0A*WhatsApp:* ${data.whatsapp}%0A*Assunto:* ${data.assunto}%0A*Mensagem:* ${data.mensagem}`;
      const waUrl = `https://wa.me/5512992143698?text=${text}`;

      status.textContent = 'Mensagem preparada! Redirecionando para o WhatsApp...';
      status.classList.add('success');
      status.style.display = 'block';

      // Pequeno delay para o usuário ver a mensagem de sucesso antes do redirect
      setTimeout(() => {
        window.open(waUrl, '_blank');
        btn.disabled = false;
        btn.innerHTML = '<span>Enviar Mensagem</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        form.reset();
      }, 1500);

    } catch (err) {
      console.error('Erro ao processar:', err);
      status.textContent = 'Ocorreu um erro. Por favor, tente novamente ou use o botão flutuante do WhatsApp.';
      status.classList.add('error');
      status.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = '<span>Enviar Mensagem</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    }
  });
}

// ---- HEADER GLASSMORPHISM ON SCROLL ----
function initHeader() {
  const header = document.getElementById('header');
  const topbar = document.getElementById('topbar');
  if (!header) return;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('at-top');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('at-top');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// ---- HAMBURGER MENU ----
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 72;
        const topbarH = document.getElementById('topbar')?.offsetHeight || 40;
        const offset = headerH + topbarH;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });
}

// ---- ACTIVE NAV LINKS ON SCROLL ----
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLinks() {
    const scrollY = window.scrollY;
    const headerH = (document.getElementById('header')?.offsetHeight || 72) +
                    (document.getElementById('topbar')?.offsetHeight || 40) + 20;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerH;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLinks, { passive: true });
  updateActiveLinks();
}

// ---- SIMPLE AOS (Animate On Scroll) ----
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('aos-animate');
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

// ---- FAQ ACCORDION ----
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ---- BACK TO TOP ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- GALLERY INFINITE SCROLL ----
function initGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  // Pause on hover is handled by CSS animation-play-state
  // Ensure the animation runs correctly
  track.addEventListener('mouseenter', function () {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', function () {
    track.style.animationPlayState = 'running';
  });
}

// ---- MODAL FUNCTIONS (global) ----
window.openModal = function (type) {
  const modal = document.getElementById('modal-' + type);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Close on overlay click
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal(type);
    }
  }, { once: true });

  // Close on Escape
  function onEscape(e) {
    if (e.key === 'Escape') {
      closeModal(type);
      document.removeEventListener('keydown', onEscape);
    }
  }
  document.addEventListener('keydown', onEscape);
};

window.closeModal = function (type) {
  const modal = document.getElementById('modal-' + type);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
};

// ---- LOGO CLICK TO TOP ----
document.querySelectorAll('.nav-logo, .footer-logo-link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    const href = el.getAttribute('href');
    if (href === '#inicio' || href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// ---- PERFORMANCE: Lazy load images ----
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
} else {
  // Fallback for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(function (img) {
    imageObserver.observe(img);
  });
}
