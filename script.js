/* ============================================================
   MINSOPANHA PORTFOLIO — JAVASCRIPT
   ============================================================ */
(function () {
  'use strict';

  /* ============ LOADER ============ */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 600);
  });

  /* ============ YEAR ============ */
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  const yearKhEl = document.getElementById('yearKh');
  if (yearEl) yearEl.textContent = y;
  if (yearKhEl) yearKhEl.textContent = y;

  /* ============ THEME ============ */
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function syncIcon() {
    if (html.classList.contains('dark')) {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }
  syncIcon();

  themeBtn.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    syncIcon();
  });

  /* ============ TIME (Phnom Penh) ============ */
  const timeEl = document.getElementById('liveTime');
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    const pp = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' }));
    timeEl.textContent = `${String(pp.getHours()).padStart(2, '0')}:${String(pp.getMinutes()).padStart(2, '0')} · PNH`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  /* ============ CURSOR (dot + ring) ============ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(min-width: 1025px)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card, .info-card, .edu-item, .cta-card, .contact-row, .stat-card, .filter-btn, .blog-card, .cmd-item, .tilt-card, .carousel-btn, .carousel-dot, .carousel-cta, .code-tab, .code-action').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.classList.add('hidden');
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.classList.remove('hidden');
    });
  } else {
    cursorRing.style.display = 'none';
    cursorDot.style.display = 'none';
  }

  /* ============ TYPING ============ */
  const typingEl = document.getElementById('typingText');
  const words = ['learner', 'builder', 'student', 'dreamer', 'creating'];
  let wI = 0, cI = 0, del = false;

  function type() {
    if (!typingEl) return;
    const w = words[wI];
    if (!del) {
      typingEl.textContent = w.slice(0, cI + 1);
      cI++;
      if (cI === w.length) { del = true; setTimeout(type, 1600); return; }
    } else {
      typingEl.textContent = w.slice(0, cI - 1);
      cI--;
      if (cI === 0) { del = false; wI = (wI + 1) % words.length; }
    }
    setTimeout(type, del ? 60 : 110);
  }
  type();

  /* ============ SCROLL PROGRESS + HEADER + SCROLL TOP ============ */
  const bar = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTop');
  const availBanner = document.getElementById('availBanner');

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h) * 100 + '%';
    header.classList.toggle('scrolled', window.scrollY > 40);
    const show = window.scrollY > 400;
    scrollTopBtn.classList.toggle('show', show);
    availBanner.classList.toggle('show', window.scrollY > 800);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ============ ACTIVE NAV / SECTION DOTS ============ */
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  const sectionDots = document.querySelectorAll('.section-dot');

  function setActive() {
    let current = 'hero';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
    sectionDots.forEach(d => d.classList.toggle('active', d.dataset.section === current));
    const indicator = document.getElementById('sectionIndicator');
    indicator.classList.toggle('show', window.scrollY > 300);
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  sectionDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const t = document.getElementById(dot.dataset.section);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuIcon.className = open ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
  });
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.className = 'fa-solid fa-bars';
    });
  });

  /* ============ SMOOTH SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============ SKILL BARS ============ */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-fill').forEach(el => skillObs.observe(el));

  /* ============ COUNTERS ============ */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        function tick(t) {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ============ FILTER ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags || '';
        card.classList.toggle('filtered-out', !(f === 'all' || tags.includes(f)));
      });
    });
  });

  /* ============ TOAST + COPY ============ */
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  function showToast(msg) {
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const icon = btn.querySelector('i');
        const orig = icon.className;
        icon.className = 'fa-solid fa-check';
        showToast('Copied: ' + text);
        setTimeout(() => {
          btn.classList.remove('copied');
          icon.className = orig;
        }, 2000);
      });
    });
  });

  /* ============ PROJECT MODAL ============ */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');

  const projectData = {
    todo: {
      number: 'PROJECT · 001',
      title: 'To-Do List',
      titleKh: 'បញ្ជីការងារត្រូវធ្វើ',
      desc: 'A simple, focused task manager. Add, check off, and delete tasks — all saved in your browser with localStorage so nothing is lost on refresh.',
      descKh: 'កម្មវិធីគ្រប់គ្រងការងារដ៏សាមញ្ញ។ បន្ថែម ធីក និងលុបការងារ — រក្សាទុកក្នុងកម្មវិធីរុករកដោយ localStorage។',
      features: ['Add, edit, complete, delete tasks', 'Persists across reloads via localStorage', 'Responsive layout, keyboard-accessible'],
      featuresKh: ['បន្ថែម កែ បញ្ចប់ និងលុបការងារ', 'រក្សាទុកឆ្លងកាត់ការផ្ទុកទំព័រឡើងវិញ', 'ឆ្លើយតប និងអាចប្រើក្តារចុចបាន'],
      tags: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
      icon: 'fa-solid fa-list-check',
      url: 'todo.app'
    },
    calc: {
      number: 'PROJECT · 002',
      title: 'Calculator',
      titleKh: 'ម៉ាស៊ីនគិតលេខ',
      desc: 'My first UI project. Handles basic arithmetic with a clean layout, keyboard support, and careful edge-case handling for divide-by-zero and decimals.',
      descKh: 'គម្រោង UI ដំបូងរបស់ខ្ញុំ។ ដោះស្រាយគណិតវិទ្យាមូលដ្ឋាន ជាមួយប្លង់ស្អាត និងការគាំទ្រក្តារចុច។',
      features: ['Basic operations: + − × ÷', 'Keyboard input support', 'Handles divide-by-zero and decimals'],
      featuresKh: ['ប្រតិបត្តិការមូលដ្ឋាន៖ + − × ÷', 'គាំទ្រការបញ្ចូលដោយក្តារចុច', 'ដោះស្រាយការចែកនឹងសូន្យ'],
      tags: ['HTML', 'CSS', 'JavaScript'],
      icon: 'fa-solid fa-calculator',
      url: 'calc.app'
    },
    weather: {
      number: 'PROJECT · 003',
      title: 'Weather App',
      titleKh: 'កម្មវិធីអាកាសធាតុ',
      desc: 'Search any city and see the current weather. My first project calling a real API with fetch and async/await, plus error handling for bad input.',
      descKh: 'ស្វែងរកទីក្រុងណាមួយ និងមើលអាកាសធាតុបច្ចុប្បន្ន។ គម្រោងដំបូងដែលហៅ API ពិតប្រាកដដោយ fetch និង async/await។',
      features: ['Live weather from OpenWeather API', 'Async/await with loading states', 'Graceful errors for unknown cities'],
      featuresKh: ['អាកាសធាតុផ្ទាល់ពី OpenWeather API', 'ប្រើ async/await ជាមួយស្ថានភាពផ្ទុក', 'ដោះស្រាយកំហុសសម្រាប់ទីក្រុងដែលមិនស្គាល់'],
      tags: ['JavaScript', 'Fetch API', 'Async/Await', 'CSS'],
      icon: 'fa-solid fa-cloud-sun',
      url: 'weather.app'
    }
  };

  function openModal(id) {
    const d = projectData[id];
    if (!d) return;
    modalContent.innerHTML = `
      <button class="modal-close" id="modalCloseBtn" aria-label="Close"
              style="position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:50%;background:#f1f5f9;border:1px solid rgba(249,115,22,.15);color:#1e293b;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;transition:.25s">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="project-num">${d.number}</div>
      <h3 class="font-display text-2xl font-extrabold mt-1 mb-1">${d.title}</h3>
      <p class="khmer text-ink-500 dark:text-ink-400 font-medium mb-5">${d.titleKh}</p>
      <div class="rounded-2xl p-6 mb-6" style="background:linear-gradient(145deg,rgba(249,115,22,.12),rgba(236,72,153,.06))">
        <div class="mock-window mx-auto max-w-xs">
          <div class="mock-bar"><span class="mock-dot red"></span><span class="mock-dot yellow"></span><span class="mock-dot green"></span><span class="mock-url">${d.url}</span></div>
          <div class="mock-body">
            <div class="mock-line w-60"></div>
            <div class="mock-block"><i class="${d.icon}"></i></div>
            <div class="mock-line w-90"></div>
            <div class="mock-line w-75"></div>
          </div>
        </div>
      </div>
      <div class="font-mono text-[11px] font-bold tracking-widest uppercase text-ink-400 mb-2">Overview · ទិដ្ឋភាពទូទៅ</div>
      <p class="text-sm text-ink-600 dark:text-ink-300 mb-2 leading-relaxed">${d.desc}</p>
      <p class="khmer text-[14px] text-ink-500 dark:text-ink-400 leading-relaxed mb-5">${d.descKh}</p>
      <div class="font-mono text-[11px] font-bold tracking-widest uppercase text-ink-400 mb-2">Key features</div>
      <ul class="flex flex-col gap-2 mb-5">
        ${d.features.map((f, i) => `
          <li class="flex gap-2.5 text-sm">
            <i class="fa-solid fa-circle-check text-brand-500 mt-1"></i>
            <div>
              <div>${f}</div>
              <div class="khmer text-[12.5px] text-ink-500 dark:text-ink-400 mt-0.5">${d.featuresKh[i]}</div>
            </div>
          </li>
        `).join('')}
      </ul>
      <div class="font-mono text-[11px] font-bold tracking-widest uppercase text-ink-400 mb-2">Tech stack</div>
      <div class="flex flex-wrap gap-1.5 mb-6">
        ${d.tags.map(t => `<span class="font-mono text-[11px] px-2.5 py-1 rounded bg-brand-500/10 text-brand-500 font-semibold">${t}</span>`).join('')}
      </div>
      <div class="flex gap-2.5 pt-5 border-t border-ink-200/60 dark:border-ink-800">
        <a href="#" class="btn-primary">Live demo <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        <a href="#" class="btn-ghost">Source <i class="fa-brands fa-github"></i></a>
      </div>
    `;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-link')) e.preventDefault();
      openModal(card.dataset.project);
    });
  });
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  /* ============ CAROUSEL ============ */
  const track = document.getElementById('carouselTrack');
  const slides = track ? track.querySelectorAll('.carousel-slide') : [];
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  const progress = document.getElementById('carouselProgress');
  let current = 0;
  let autoTimer = null;
  const AUTO_DELAY = 6000;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    function goTo(i) {
      if (i < 0) i = slides.length - 1;
      if (i >= slides.length) i = 0;
      current = i;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === current));
      if (progress) progress.style.width = ((current + 1) / slides.length * 100) + '%';
      resetAuto();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    function startAuto() { autoTimer = setInterval(next, AUTO_DELAY); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    const vp = document.getElementById('carouselViewport');
    vp.addEventListener('mouseenter', () => clearInterval(autoTimer));
    vp.addEventListener('mouseleave', startAuto);

    let tx = 0, ex = 0;
    vp.addEventListener('touchstart', e => tx = e.changedTouches[0].screenX, { passive: true });
    vp.addEventListener('touchend', e => {
      ex = e.changedTouches[0].screenX;
      const diff = tx - ex;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    }, { passive: true });

    startAuto();

    document.querySelectorAll('.carousel-cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn.dataset.project);
      });
    });
  }

  /* ============ CODE SHOWCASE ============ */
  const codeFiles = {
    'todo-js': {
      filename: 'todo.js',
      lang: 'js',
      content: `// ==============================
//  To-Do List · localStorage
//  Author: Minsopanha · RUPP
// ==============================

const STORAGE_KEY = 'minsopanha_todos';
let todos = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const list = document.getElementById('todo-list');
  list.innerHTML = todos.map((t, i) => \`
    <li class="todo-item \${t.done ? 'done' : ''}">
      <input type="checkbox" \${t.done ? 'checked' : ''}
             onchange="toggle(\${i})">
      <span>\${escapeHtml(t.text)}</span>
      <button onclick="remove(\${i})" aria-label="Delete">
        <i class="fa-solid fa-trash"></i>
      </button>
    </li>
  \`).join('');
}

function add(text) {
  if (!text.trim()) return;
  todos.unshift({ text: text.trim(), done: false, ts: Date.now() });
  save();
  render();
}

function toggle(i) {
  todos[i].done = !todos[i].done;
  save();
  render();
}

function remove(i) {
  todos.splice(i, 1);
  save();
  render();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Init
render();
document.getElementById('todo-form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    add(input.value);
    input.value = '';
  });`
    },
    'calc-js': {
      filename: 'calc.js',
      lang: 'js',
      content: `// ==============================
//  Calculator · Keyboard support
//  Author: Minsopanha · RUPP
// ==============================

const display = document.getElementById('display');
let buffer = '0';
let previous = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = buffer;
}

function input(digit) {
  if (shouldReset) {
    buffer = '0';
    shouldReset = false;
  }
  if (buffer === '0' && digit !== '.') {
    buffer = digit;
  } else {
    if (digit === '.' && buffer.includes('.')) return;
    buffer += digit;
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (operator && !shouldReset) compute();
  previous = parseFloat(buffer);
  operator = op;
  shouldReset = true;
}

function compute() {
  if (operator === null || previous === null) return;
  const current = parseFloat(buffer);
  let result = previous;

  switch (operator) {
    case '+': result = previous + current; break;
    case '−': result = previous - current; break;
    case '×': result = previous * current; break;
    case '÷':
      if (current === 0) {
        buffer = 'Error';
        shouldReset = true;
        operator = null;
        previous = null;
        updateDisplay();
        return;
      }
      result = previous / current;
      break;
  }
  buffer = String(Math.round(result * 1e10) / 1e10);
  previous = null;
  operator = null;
  shouldReset = true;
  updateDisplay();
}

function clear() {
  buffer = '0';
  previous = null;
  operator = null;
  shouldReset = false;
  updateDisplay();
}

// Keyboard
document.addEventListener('keydown', (e) => {
  if (/[0-9.]/.test(e.key)) input(e.key);
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('−');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
  else if (e.key === 'Escape') clear();
  else if (e.key === 'Backspace') {
    buffer = buffer.slice(0, -1) || '0';
    updateDisplay();
  }
});

updateDisplay();`
    },
    'weather-js': {
      filename: 'weather.js',
      lang: 'js',
      content: `// ==============================
//  Weather App · fetch + async/await
//  Author: Minsopanha · RUPP
// ==============================

const API_KEY = 'demo_key_replace_me';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.getElementById('weather-form');
const input = document.getElementById('city-input');
const card = document.getElementById('weather-card');
const errorBox = document.getElementById('error');

async function getWeather(city) {
  try {
    errorBox.textContent = '';
    card.classList.add('loading');

    const url = \`\${BASE_URL}?q=\${encodeURIComponent(city)}&appid=\${API_KEY}&units=metric\`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found');
      throw new Error('Request failed');
    }

    const data = await res.json();
    render(data);
  } catch (err) {
    errorBox.textContent = err.message || 'Something went wrong';
  } finally {
    card.classList.remove('loading');
  }
}

function render(data) {
  const { name, main, weather, wind } = data;
  document.getElementById('city-name').textContent = name;
  document.getElementById('temp').textContent = Math.round(main.temp) + '°C';
  document.getElementById('desc').textContent = weather[0].description;
  document.getElementById('humidity').textContent = main.humidity + '%';
  document.getElementById('wind').textContent = wind.speed + ' m/s';
  document.getElementById('icon').src =
    \`https://openweathermap.org/img/wn/\${weather[0].icon}@4x.png\`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});

// Load a default city on first visit
getWeather('Phnom Penh');`
    },
    'styles-css': {
      filename: 'styles.css',
      lang: 'css',
      content: `/* ==============================
   Custom styles — shared
   Author: Minsopanha · RUPP
   ============================== */

:root {
  --brand: #f97316;
  --pink:  #ec4899;
  --cyan:  #06b6d4;
  --gradient: linear-gradient(135deg, #f97316, #ec4899, #06b6d4);
}

/* Animated gradient text */
.gradient-text {
  background: var(--gradient);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-x 5s ease infinite;
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

/* Card with animated underline */
.card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  transition: transform .3s ease;
}

.card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient);
  background-size: 300% 100%;
  animation: gradient-x 3s linear infinite;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .5s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px -16px rgba(249,115,22,.35);
}

.card:hover::after { transform: scaleX(1); }

/* Custom cursor */
.cursor-dot {
  position: fixed;
  width: 10px; height: 10px;
  background: var(--brand);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width .2s, height .2s, background .2s;
  box-shadow: 0 0 12px var(--brand);
}

.cursor-dot.hover {
  width: 28px; height: 28px;
  background: var(--pink);
  box-shadow: 0 0 24px var(--pink);
}`
    }
  };

  const codeTabs = document.querySelectorAll('.code-tab');
  const codeBlock = document.getElementById('codeBlock');
  const codeFilename = document.getElementById('codeFilename');
  const codeCopyBtn = document.getElementById('codeCopyBtn');
  let currentCodeFile = 'todo-js';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Simple syntax highlighter (JS / CSS)
  function highlight(code, lang) {
    let html = escapeHtml(code);

    if (lang === 'js') {
      // comments
      html = html.replace(/(\/\/[^\n]*)/g, '<span class="tok-comment">$1</span>');
      // strings (single, double, backtick)
      html = html.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, '<span class="tok-string">$1</span>');
      // keywords
      html = html.replace(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|try|catch|finally|throw|async|await|class|extends|import|from|export|default|null|undefined|true|false|this|typeof|instanceof|delete|in|of)\b/g, '<span class="tok-keyword">$1</span>');
      // numbers
      html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-number">$1</span>');
      // functions
      html = html.replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, '<span class="tok-func">$1</span>');
    } else if (lang === 'css') {
      html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
      html = html.replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="tok-string">$1</span>');
      html = html.replace(/\b(\d+(\.\d+)?(px|em|rem|%|vh|vw|s|ms)?)\b/g, '<span class="tok-number">$1</span>');
      html = html.replace(/(--[\w-]+)/g, '<span class="tok-func">$1</span>');
    }

    // Build lines
    const lines = html.split('\n');
    return lines.map((line, i) =>
      `<div class="code-line"><span class="code-line-num">${i + 1}</span><span class="code-line-content">${line || ' '}</span></div>`
    ).join('');
  }

  function renderCode(fileKey) {
    const file = codeFiles[fileKey];
    if (!file) return;
    currentCodeFile = fileKey;
    codeFilename.textContent = file.filename;
    codeBlock.innerHTML = `<code class="code-content">${highlight(file.content, file.lang)}</code>`;
  }

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCode(tab.dataset.file);
    });
  });

  if (codeTabs.length) {
    renderCode('todo-js');
  }

  codeCopyBtn?.addEventListener('click', () => {
    const code = codeFiles[currentCodeFile]?.content || '';
    navigator.clipboard.writeText(code).then(() => {
      showToast('Code copied! · ចម្លងកូដ!');
    });
  });

  /* ============ COMMAND PALETTE ============ */
  const cmdBackdrop = document.getElementById('cmdBackdrop');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = document.querySelectorAll('.cmd-item');
  let selIdx = 0;
  let visItems = Array.from(cmdItems);

  function openCmd() {
    cmdBackdrop.classList.add('open');
    cmdInput.value = '';
    filterCmd('');
    setTimeout(() => cmdInput.focus(), 50);
  }
  function closeCmd() { cmdBackdrop.classList.remove('open'); }

  function filterCmd(q) {
    const query = q.trim().toLowerCase();
    visItems = [];
    cmdItems.forEach(item => {
      const txt = item.textContent.toLowerCase();
      const match = !query || txt.includes(query);
      item.style.display = match ? 'flex' : 'none';
      if (match) visItems.push(item);
    });
    selIdx = 0;
    updateSel();
  }
  function updateSel() {
    visItems.forEach((it, i) => it.classList.toggle('selected', i === selIdx));
    visItems[selIdx]?.scrollIntoView({ block: 'nearest' });
  }
  function runAction(item) {
    const a = item.dataset.action;
    if (a === 'goto') {
      document.querySelector(item.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
    } else if (a === 'toggle-theme') {
      themeBtn.click();
    } else if (a === 'copy-email') {
      navigator.clipboard.writeText('Minsopanha@gmail.com').then(() => showToast('Copied: Minsopanha@gmail.com'));
    } else if (a === 'open-telegram') {
      window.open('https://t.me/minsopanha', '_blank');
    } else if (a === 'scroll-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeCmd();
  }

  document.getElementById('cmdTrigger')?.addEventListener('click', openCmd);
  document.getElementById('heroCmdBtn')?.addEventListener('click', openCmd);

  cmdInput?.addEventListener('input', e => filterCmd(e.target.value));
  cmdInput?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visItems.length) { selIdx = (selIdx + 1) % visItems.length; updateSel(); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (visItems.length) { selIdx = (selIdx - 1 + visItems.length) % visItems.length; updateSel(); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visItems[selIdx]) runAction(visItems[selIdx]);
    } else if (e.key === 'Escape') {
      closeCmd();
    }
  });
  cmdItems.forEach(item => {
    item.addEventListener('click', () => runAction(item));
    item.addEventListener('mouseenter', () => {
      selIdx = visItems.indexOf(item);
      updateSel();
    });
  });
  cmdBackdrop.addEventListener('click', e => {
    if (e.target === cmdBackdrop) closeCmd();
  });

  /* ============ GLOBAL SHORTCUTS ============ */
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmd();
    }
    if (e.key === 'Escape') {
      if (modalBackdrop.classList.contains('open')) closeModal();
    }
    if (cmdBackdrop.classList.contains('open')) return;
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const map = { p: '#work', c: '#code', a: '#about', b: '#blog', e: '#education', s: '#skills', g: '#guestbook' };
    if (map[e.key.toLowerCase()]) {
      document.querySelector(map[e.key.toLowerCase()])?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key.toLowerCase() === 't') themeBtn.click();
  });

  /* ============ GUESTBOOK ============ */
  const gbForm = document.getElementById('guestbookForm');
  const gbName = document.getElementById('gbName');
  const gbMessage = document.getElementById('gbMessage');
  const gbCount = document.getElementById('gbCount');
  const gbList = document.getElementById('guestbookList');
  const GB_KEY = 'minsopanha_guestbook';

  const avatarColors = [
    'linear-gradient(135deg,#f97316,#ec4899)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#f59e0b,#f97316)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#10b981,#14b8a6)',
    'linear-gradient(135deg,#ef4444,#f97316)'
  ];

  function loadGB() {
    try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveGB(arr) {
    try { localStorage.setItem(GB_KEY, JSON.stringify(arr.slice(0, 50))); } catch (e) {}
  }
  function fmtTime(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now · ទើបនេះ';
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    if (d < 7) return d + 'd ago';
    return new Date(ts).toLocaleDateString();
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function renderGB() {
    const entries = loadGB();
    if (!entries.length) {
      gbList.innerHTML = `<div class="text-center text-ink-400 font-mono text-xs py-6">No entries yet · មិនទាន់មានធាតុ</div>`;
      return;
    }
    gbList.innerHTML = entries.map((e, i) => {
      const color = avatarColors[i % avatarColors.length];
      const init = (e.name || '?').charAt(0).toUpperCase();
      return `
        <div class="guestbook-entry flex gap-3.5 p-4 rounded-2xl bg-white/70 dark:bg-ink-800/50 backdrop-blur border border-brand-500/10 dark:border-pink-500/15 transition-all hover:translate-x-1.5 hover:border-brand-500/40" style="animation:slideIn .5s cubic-bezier(.34,1.56,.64,1)">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0" style="background:${color}">${init}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2.5 flex-wrap mb-1">
              <span class="font-bold text-sm">${esc(e.name)}</span>
              <span class="font-mono text-[10px] text-ink-400">${fmtTime(e.ts)}</span>
            </div>
            <div class="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">${esc(e.message)}</div>
          </div>
        </div>`;
    }).join('');
  }

  gbMessage?.addEventListener('input', () => {
    gbCount.textContent = gbMessage.value.length + ' / 280';
  });
  gbForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = gbName.value.trim();
    const msg = gbMessage.value.trim();
    if (!name || !msg) return;
    const arr = loadGB();
    arr.unshift({ name, message: msg, ts: Date.now() });
    saveGB(arr);
    gbForm.reset();
    gbCount.textContent = '0 / 280';
    renderGB();
    showToast('Thanks for signing! · អរគុណ!');
  });
  renderGB();

  /* ============ TILT CARDS ============ */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rx = (y - cy) / cy * -5;
      const ry = (x - cx) / cx * 5;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ============ RIPPLE ON CLICK ============ */
  document.querySelectorAll('.btn-primary, .btn-ghost, .filter-btn, .cta-card, .project-card, .info-card, .edu-item, .blog-card, .carousel-btn, .carousel-cta, .code-tab').forEach(el => {
    el.addEventListener('click', function (e) {
      const r = this.getBoundingClientRect();
      const rip = document.createElement('span');
      rip.className = 'ripple';
      const size = Math.max(r.width, r.height);
      rip.style.width = rip.style.height = size + 'px';
      rip.style.left = (e.clientX - r.left - size / 2) + 'px';
      rip.style.top = (e.clientY - r.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });
  });

  /* ============ SCROLL REVEAL ============ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ============ HERO GLOW FOLLOW ============ */
  const heroAvatar = document.querySelector('.hero-avatar');
  if (heroAvatar) {
    heroAvatar.addEventListener('mousemove', e => {
      const r = heroAvatar.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      heroAvatar.style.boxShadow = `
        0 24px 48px -16px rgba(249,115,22,.5),
        ${(x - 50) * 0.5}px ${(y - 50) * 0.5}px 60px -10px rgba(236,72,153,.6)
      `;
    });
    heroAvatar.addEventListener('mouseleave', () => {
      heroAvatar.style.boxShadow = '0 24px 48px -16px rgba(249,115,22,.5)';
    });
  }

})();