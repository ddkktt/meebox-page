// ——— EmailJS Setup ———
// TODO: Replace these with your EmailJS credentials
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (Gmail) → copy the Service ID
// 3. Create an Email Template → copy the Template ID
// 4. Go to Account → copy your Public Key
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

emailjs.init(EMAILJS_PUBLIC_KEY);

// ——— Navbar scroll effect ———
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ——— Demos video section ———
const demoVideos = [
  {
    file: 'WhatsApp Video 2026-03-02 at 21.10.46.mp4',
    title: 'Escaparate Principal',
    desc: 'El demo estelar para ver color intenso y contraste limpio en movimiento.',
  },
  {
    file: 'WhatsApp Video 2026-03-02 at 21.10.47.mp4',
    title: 'Claridad En Detalle',
    desc: 'Nitidez uniforme para contenido de marca e información en pantalla.',
  },
  {
    file: 'WhatsApp Video 2026-03-02 at 21.10.48.mp4',
    title: 'Impacto Continuo',
    desc: 'Transiciones fluidas y alto brillo sostenido para espacios de alto tráfico.',
  },
];

const demosGrid = document.getElementById('demos-grid');
if (demosGrid) {
  demosGrid.innerHTML = demoVideos.map((demo, idx) => {
    const src = `demos/${encodeURIComponent(demo.file)}`;
    const cardClass = idx === 0 ? 'demo-card demo-card-featured' : 'demo-card';
    const badge = idx === 0 ? 'Demo estelar' : `Demo ${idx + 1}`;
    return `
      <article class="${cardClass}" data-animate>
        <div class="demo-video-wrap">
          <div class="video-placeholder">
            <svg viewBox="0 0 24 24" class="play-icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="1.5"/>
              <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
            </svg>
          </div>
          <video controls preload="metadata" playsinline>
            <source src="${src}" type="video/mp4">
            Tu navegador no soporta video HTML5.
          </video>
        </div>
        <div class="demo-meta">
          <span class="demo-eyebrow">${badge}</span>
          <h3>${demo.title}</h3>
          <p>${demo.desc}</p>
        </div>
      </article>
    `;
  }).join('');

  // Show video and hide placeholder when loaded
  document.querySelectorAll('.demo-video-wrap video').forEach(video => {
    const placeholder = video.previousElementSibling;

    const showVideo = () => {
      if (video.readyState >= 2) {
        video.classList.add('loaded');
        if (placeholder) {
          placeholder.style.opacity = '0';
        }
      }
    };

    video.addEventListener('loadeddata', showVideo);
    video.addEventListener('canplay', showVideo);

    // Check if already loaded
    if (video.readyState >= 2) {
      showVideo();
    }
  });
}

// ——— Intersection Observer for scroll animations ———
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      const idx = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ——— Counter animation ———
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));

// ——— Textarea character count ———
const textarea = document.getElementById('info-textarea');
const charDisplay = document.getElementById('char-current');
textarea.addEventListener('input', () => {
  charDisplay.textContent = textarea.value.length;
});

// ——— Form submission via EmailJS ———
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.btn-submit');
  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const params = {
    nombre: form.querySelector('[name="nombre"]').value,
    apellido: form.querySelector('[name="apellido"]').value,
    empresa: form.querySelector('[name="empresa"]').value || 'No especificada',
    correo: form.querySelector('[name="correo"]').value,
    telefono: form.querySelector('[name="telefono"]').value,
    informacion: form.querySelector('[name="informacion"]').value || 'Sin información adicional',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => {
      btn.textContent = '¡Enviado! ✓';
      btn.style.background = '#1a8f3c';
      form.reset();
      charDisplay.textContent = '0';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      btn.textContent = 'Error — Intenta de nuevo';
      btn.style.background = '#c0392b';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    });
});

// ——— Smooth scroll for anchor links ———
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
