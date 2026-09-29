/* ============================================================
   MINSOPANHA DASHBOARD · Pro Login + Firebase + Backup
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     🔐 CREDENTIALS — CHANGE THESE
     ============================================================ */
  const AUTH_EMAIL = 'Minsopanha@gmail.com';
  const AUTH_PASSWORD = 'panhakh364';
  const AUTH_KEY = 'minsopanha_auth';       // localStorage key (persistent login)
  const AUTH_SESSION_KEY = 'minsopanha_auth_session'; // sessionStorage key (session-only)

  const firebaseConfig = {
    apiKey: "AIzaSyCy7tXWYrhHxtzLyvPifTHZAnxVvMcTS1c",
    authDomain: "minsopanha-portfolio.firebaseapp.com",
    projectId: "minsopanha-portfolio",
    storageBucket: "minsopanha-portfolio.firebasestorage.app",
    messagingSenderId: "438552399716",
    appId: "1:438552399716:web:ef1e0bb8de65c28d22b471",
    measurementId: "G-JX94HLHFVB"
  };

  const AUTO_BACKUP_KEY = 'minsopanha_auto_backup';
  const BACKUP_DATA_KEY = 'minsopanha_backup_snapshot';

  /* ============ THEME ============ */
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && sysDark)) htmlEl.classList.add('dark');
  else htmlEl.classList.remove('dark');

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  function syncIcon() {
    if (!themeIcon) return;
    themeIcon.className = htmlEl.classList.contains('dark') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  syncIcon();
  themeToggle?.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
    syncIcon();
    renderChart(currentData);
  });

  /* ============ TOAST ============ */
  let toastTimer = null;
  function showToast(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'error' ? ' error' : '');
    t.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}" style="color:${type === 'error' ? '#ef4444' : '#10b981'};"></i> ${msg}`;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 4000);
  }

  /* ============ STATUS BANNER ============ */
  const statusBanner = document.getElementById('statusBanner');
  const statusMsg = document.getElementById('statusMsg');
  function showStatus(msg, type = 'warn') {
    if (!statusBanner || !statusMsg) return;
    statusBanner.className = 'status-banner ' + type;
    statusMsg.innerHTML = msg;
    statusBanner.style.display = 'flex';
  }
  function hideStatus() {
    if (statusBanner) statusBanner.style.display = 'none';
  }

  /* ============ CONFIRM MODAL ============ */
  const confirmBackdrop = document.getElementById('confirmBackdrop');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmMsg = document.getElementById('confirmMsg');
  const confirmOk = document.getElementById('confirmOk');
  const confirmCancel = document.getElementById('confirmCancel');
  let confirmCallback = null;

  function confirmDialog(title, msg, cb) {
    confirmTitle.textContent = title;
    confirmMsg.textContent = msg;
    confirmCallback = cb;
    confirmBackdrop.style.display = 'flex';
  }
  function closeConfirm() {
    confirmBackdrop.style.display = 'none';
    confirmCallback = null;
  }
  confirmCancel?.addEventListener('click', closeConfirm);
  confirmBackdrop?.addEventListener('click', e => { if (e.target === confirmBackdrop) closeConfirm(); });
  confirmOk?.addEventListener('click', () => { if (confirmCallback) confirmCallback(); closeConfirm(); });

  /* ============================================================
     🔐 PRO LOGIN SYSTEM
     ============================================================ */
  const gate = document.getElementById('gate');
  const gateCard = document.getElementById('gateCard');
  const dash = document.getElementById('dash');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPass = document.getElementById('loginPass');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnText = document.getElementById('loginBtnText');
  const loginIcon = document.getElementById('loginIcon');
  const loginError = document.getElementById('loginError');
  const loginErrorText = document.getElementById('loginErrorText');
  const togglePass = document.getElementById('togglePass');
  const togglePassIcon = document.getElementById('togglePassIcon');
  const rememberMe = document.getElementById('rememberMe');
  const capsWarn = document.getElementById('capsWarn');
  const logoutBtn = document.getElementById('logoutBtn');

  /* -- Show / hide password -- */
  togglePass?.addEventListener('click', () => {
    const isPassword = loginPass.type === 'password';
    loginPass.type = isPassword ? 'text' : 'password';
    togglePassIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    togglePass.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });

  /* -- Caps Lock warning -- */
  loginPass?.addEventListener('keyup', e => {
    if (typeof e.getModifierState === 'function') {
      const caps = e.getModifierState('CapsLock');
      capsWarn.classList.toggle('show', caps);
    }
  });
  loginPass?.addEventListener('blur', () => capsWarn.classList.remove('show'));

  /* -- Error display -- */
  function showLoginError(msg) {
    loginErrorText.textContent = msg;
    loginError.classList.add('show');
    gateCard.classList.remove('shake');
    void gateCard.offsetWidth; // reflow
    gateCard.classList.add('shake');
    setTimeout(() => gateCard.classList.remove('shake'), 500);
  }
  function hideLoginError() {
    loginError.classList.remove('show');
  }
  loginEmail?.addEventListener('input', hideLoginError);
  loginPass?.addEventListener('input', hideLoginError);

  /* -- Auth state helpers -- */
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === '1' ||
           localStorage.getItem(AUTH_KEY) === '1';
  }
  function setAuthenticated(remember) {
    if (remember) {
      localStorage.setItem(AUTH_KEY, '1');
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      localStorage.removeItem(AUTH_KEY);
    }
  }
  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  /* -- Login submit -- */
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = (loginEmail.value || '').trim().toLowerCase();
    const pass = loginPass.value || '';
    const correctEmail = AUTH_EMAIL.trim().toLowerCase();

    // Disable button
    loginBtn.disabled = true;
    loginBtnText.textContent = 'Signing in…';
    loginIcon.className = 'fa-solid fa-circle-notch fa-spin';

    // Simulate small delay for pro feel
    setTimeout(() => {
      if (email === correctEmail && pass === AUTH_PASSWORD) {
        setAuthenticated(rememberMe.checked);
        gate.classList.add('hidden');
        dash.style.display = 'block';
        hideLoginError();
        showToast('Welcome back, Minsopanha ✓');
        init();
      } else {
        // Generic error — never reveal which field is wrong
        let msg = 'Invalid email or password';
        if (!email) msg = 'Please enter your email';
        else if (!pass) msg = 'Please enter your password';
        showLoginError(msg);

        // Re-enable button
        loginBtn.disabled = false;
        loginBtnText.textContent = 'Sign in';
        loginIcon.className = 'fa-solid fa-arrow-right-to-bracket';
        loginPass.value = '';
        loginPass.focus();
      }
    }, 400);
  });

  /* -- Logout -- */
  logoutBtn?.addEventListener('click', () => {
    confirmDialog('Sign out?', 'You will need to log in again to view the dashboard.', () => {
      clearAuth();
      location.reload();
    });
  });

  /* -- Auto-unlock if authenticated -- */
  if (isAuthenticated()) {
    gate.classList.add('hidden');
    dash.style.display = 'block';
    init();
  } else {
    setTimeout(() => loginEmail?.focus(), 300);
  }

  /* ============ STATE ============ */
  let currentData = null;
  let currentDays = 30;
  let refreshInterval = null;
  let lastRawData = null;

  /* ============ FIREBASE ============ */
  async function fetchFirebase() {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js');
    const { getFirestore, collection, getDocs, query, orderBy, limit }
      = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js');

    const app = initializeApp(firebaseConfig, 'dashboard-app');
    const db = getFirestore(app);

    const visitsSnap = await getDocs(query(collection(db, 'visits'), orderBy('ts', 'desc'), limit(1000)));
    const visits = [];
    visitsSnap.forEach(doc => {
      const d = doc.data();
      const date = d.ts?.toDate ? d.ts.toDate() : new Date();
      visits.push({
        id: doc.id,
        date,
        dateKey: date.toISOString().slice(0, 10),
        device: d.device || 'unknown',
        browser: d.browser || 'unknown',
        page: d.page || '/',
        sessionId: d.sessionId || ''
      });
    });

    const sessionsSnap = await getDocs(query(collection(db, 'sessions'), orderBy('start', 'desc'), limit(500)));
    const sessions = [];
    sessionsSnap.forEach(doc => {
      const d = doc.data();
      sessions.push({
        id: doc.id,
        start: d.start?.toDate ? d.start.toDate() : new Date(),
        device: d.device || 'unknown',
        browser: d.browser || 'unknown',
        duration: d.duration || 0,
        page: d.page || '/'
      });
    });

    return {
      visits, sessions,
      totalViews: visits.length,
      totalSessions: sessions.length,
      isLocal: false,
      fetchedAt: new Date().toISOString()
    };
  }

  /* ============ AGGREGATE ============ */
  function aggregate(data) {
    const today = new Date().toISOString().slice(0, 10);
    const devices = {}, browsers = {}, pages = {}, daily = {};
    let todayViews = 0;

    data.visits.forEach(v => {
      devices[v.device] = (devices[v.device] || 0) + 1;
      browsers[v.browser] = (browsers[v.browser] || 0) + 1;
      pages[v.page] = (pages[v.page] || 0) + 1;
      if (v.dateKey) daily[v.dateKey] = (daily[v.dateKey] || 0) + 1;
      if (v.dateKey === today) todayViews++;
    });

    const totalDur = data.sessions.reduce((a, s) => a + (s.duration || 0), 0);
    const avgDur = data.sessions.length ? Math.round(totalDur / data.sessions.length) : 0;

    return {
      totalViews: data.totalViews,
      totalSessions: data.totalSessions,
      avgDuration: avgDur,
      todayViews,
      devices, browsers, pages, daily,
      sessions: data.sessions,
      isLocal: data.isLocal
    };
  }

  /* ============ RENDER ============ */
  function setNum(id, value, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = value + (suffix ? `<span style="font-size:14px;">${suffix}</span>` : '');
  }
  function renderKPIs(a) {
    setNum('kpiViews', a.totalViews);
    setNum('kpiUnique', a.totalSessions);
    setNum('kpiDuration', a.avgDuration, 's');
    setNum('kpiToday', a.todayViews);
  }

  function renderBars(id, obj) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!entries.length) {
      wrap.innerHTML = `<div style="text-align:center;color:#94a3b8;font-family:'JetBrains Mono';font-size:11px;padding:24px 0;">No data yet</div>`;
      return;
    }
    const max = entries[0][1];
    wrap.innerHTML = entries.map(([k, v]) => {
      const pct = (v / max) * 100;
      return `
        <div class="bar-row">
          <span class="bar-label">${icon(k)} ${k}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <span class="bar-value">${v}</span>
        </div>`;
    }).join('');
  }

  function icon(key) {
    const m = {
      ios:'<i class="fa-brands fa-apple"></i>', android:'<i class="fa-brands fa-android"></i>',
      tablet:'<i class="fa-solid fa-tablet-screen-button"></i>', mobile:'<i class="fa-solid fa-mobile-screen"></i>',
      desktop:'<i class="fa-solid fa-desktop"></i>', mac:'<i class="fa-brands fa-apple"></i>',
      windows:'<i class="fa-brands fa-windows"></i>', Chrome:'<i class="fa-brands fa-chrome"></i>',
      Safari:'<i class="fa-brands fa-safari"></i>', Firefox:'<i class="fa-brands fa-firefox"></i>',
      Edge:'<i class="fa-brands fa-edge"></i>'
    };
    return m[key] || '<i class="fa-solid fa-circle"></i>';
  }

  function renderSessions(a) {
    const wrap = document.getElementById('sessionsList');
    if (!wrap) return;
    const list = (a.sessions || []).slice(0, 20);
    if (!list.length) {
      wrap.innerHTML = `<div style="text-align:center;color:#94a3b8;font-family:'JetBrains Mono';font-size:11px;padding:24px 0;">No sessions yet</div>`;
      return;
    }
    wrap.innerHTML = list.map(s => {
      const d = s.start instanceof Date ? s.start : new Date(s.start);
      const t = d.toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
      const dur = s.duration ? `${s.duration}s` : '< 1s';
      return `<div class="session-row">
        <span class="session-badge">${s.device || '?'}</span>
        <span style="flex:1;font-family:'JetBrains Mono';font-size:11px;">${s.browser || '?'}</span>
        <span style="font-family:'JetBrains Mono';font-size:11px;color:#94a3b8;">${t}</span>
        <span style="font-family:'JetBrains Mono';font-size:11px;font-weight:700;">${dur}</span>
      </div>`;
    }).join('');
  }

  /* ============ CHART ============ */
  let chart = null;
  function renderChart(a) {
    const canvas = document.getElementById('chartVisits');
    if (!canvas) return;
    const labels = [], values = [];
    const today = new Date();
    for (let i = currentDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      labels.push(d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }));
      values.push((a?.daily && a.daily[key]) || 0);
    }
    const isDark = htmlEl.classList.contains('dark');
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, 'rgba(249,115,22,0.45)');
    grad.addColorStop(0.5, 'rgba(236,72,153,0.2)');
    grad.addColorStop(1, 'rgba(6,182,212,0)');

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#f97316',
          borderWidth: 2.5,
          fill: true,
          backgroundColor: grad,
          tension: 0.4,
          pointRadius: values.length > 40 ? 0 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#0f172a',
            titleColor: '#fff', bodyColor: '#e2e8f0',
            padding: 12, cornerRadius: 10, displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b',
              font: { family: 'JetBrains Mono', size: 10 },
              maxRotation: 0, autoSkipPadding: 20
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: isDark ? 'rgba(148,163,184,.1)' : 'rgba(100,116,139,.08)' },
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b',
              font: { family: 'JetBrains Mono', size: 10 },
              precision: 0
            }
          }
        }
      }
    });
  }

  document.querySelectorAll('.range-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentDays = parseInt(b.dataset.days, 10);
      renderChart(currentData);
    });
  });

  /* ============ LOAD ============ */
  async function loadAll() {
    hideStatus();
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.disabled = true;

    let data;
    let firebaseError = null;

    try {
      data = await fetchFirebase();
    } catch (err) {
      console.error('[Dashboard] Firebase error:', err);
      firebaseError = err.message || String(err);
      data = null;
    }

    if (!data) {
      showStatus(
        `<strong>Can't load Firebase data.</strong><br>
         <span style="font-family:'JetBrains Mono';font-size:11px;">Reason: ${firebaseError || 'unknown'}</span><br><br>
         <strong>Check these:</strong><br>
         1. Firestore Rules must allow reads (<code>allow read, write: if true;</code>)<br>
         2. You must open the site via <code>http://localhost</code> or <code>https://</code> — NOT <code>file://</code><br>
         3. The <code>index.html</code> page must have been opened at least once to create data.`,
        'error'
      );
      renderKPIs({ totalViews:0, totalSessions:0, avgDuration:0, todayViews:0 });
      renderBars('devicesList', {});
      renderBars('browsersList', {});
      renderBars('pagesList', {});
      renderSessions({ sessions: [] });
      renderChart(null);
      if (refreshBtn) refreshBtn.disabled = false;
      return;
    }

    lastRawData = data;
    const agg = aggregate(data);
    currentData = agg;

    if (agg.totalViews === 0) {
      showStatus(
        `Firebase connected ✓ — but <strong>no visits recorded yet</strong>.<br>
         Open <a href="index.html" style="color:#991b1b;font-weight:700;">the main site</a> in another tab to record your first visit, then click Refresh.`,
        'warn'
      );
    }

    renderKPIs(agg);
    renderBars('devicesList', agg.devices);
    renderBars('browsersList', agg.browsers);
    renderBars('pagesList', agg.pages);
    renderSessions(agg);
    renderChart(agg);

    const src = document.getElementById('dataSource');
    if (src) src.innerHTML = '<i class="fa-solid fa-cloud"></i> Firebase · ' + agg.totalViews + ' events';

    if (refreshBtn) refreshBtn.disabled = false;
  }

  /* ============ BACKUP / EXPORT / RESTORE ============ */
  function exportJSON() {
    if (!lastRawData) { showToast('No data to backup', 'error'); return; }
    const payload = {
      app: 'minsopanha-portfolio',
      version: 1,
      exportedAt: new Date().toISOString(),
      totals: { views: lastRawData.totalViews, sessions: lastRawData.totalSessions },
      visits: lastRawData.visits.map(v => ({
        date: v.date instanceof Date ? v.date.toISOString() : v.date,
        dateKey: v.dateKey, device: v.device, browser: v.browser, page: v.page, sessionId: v.sessionId || ''
      })),
      sessions: lastRawData.sessions.map(s => ({
        start: s.start instanceof Date ? s.start.toISOString() : s.start,
        device: s.device, browser: s.browser, duration: s.duration || 0, page: s.page || '/'
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `minsopanha-analytics-${new Date().toISOString().slice(0,10)}.json`);
    showToast('Backup downloaded ✓');
  }

  function exportCSV() {
    if (!lastRawData) { showToast('No data to export', 'error'); return; }
    const rows = [['type','date','device','browser','page','duration_seconds','session_id']];
    lastRawData.visits.forEach(v => {
      const d = v.date instanceof Date ? v.date.toISOString() : v.date;
      rows.push(['visit', d, v.device, v.browser, v.page, '', v.sessionId || '']);
    });
    lastRawData.sessions.forEach(s => {
      const d = s.start instanceof Date ? s.start.toISOString() : s.start;
      rows.push(['session', d, s.device, s.browser, s.page || '/', s.duration || 0, s.id || '']);
    });
    const csv = rows.map(r => r.map(c => {
      const str = String(c ?? '');
      return /[",\n]/.test(str) ? '"' + str.replace(/"/g,'""') + '"' : str;
    }).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `minsopanha-analytics-${new Date().toISOString().slice(0,10)}.csv`);
    showToast('CSV exported ✓');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const restoreBtn = document.getElementById('restoreBtn');
  const restoreFile = document.getElementById('restoreFile');
  restoreBtn?.addEventListener('click', () => restoreFile?.click());
  restoreFile?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (!json.visits || !json.sessions) throw new Error('Invalid file');
      confirmDialog('Restore backup?', `Load ${json.visits.length} visits + ${json.sessions.length} sessions (local view only)?`, () => {
        const restored = {
          visits: json.visits.map(v => ({ ...v, date: new Date(v.date), dateKey: v.dateKey || new Date(v.date).toISOString().slice(0,10) })),
          sessions: json.sessions.map(s => ({ ...s, start: new Date(s.start) })),
          totalViews: json.visits.length,
          totalSessions: json.sessions.length,
          isLocal: true
        };
        const agg = aggregate(restored);
        currentData = agg; lastRawData = restored;
        renderKPIs(agg);
        renderBars('devicesList', agg.devices);
        renderBars('browsersList', agg.browsers);
        renderBars('pagesList', agg.pages);
        renderSessions(agg);
        renderChart(agg);
        showToast('Backup restored ✓');
      });
    } catch { showToast('Invalid backup file', 'error'); }
    restoreFile.value = '';
  });

  /* ============ AUTO BACKUP ============ */
  const autoBackupBtn = document.getElementById('autoBackupBtn');
  const autoBackupLabel = document.getElementById('autoBackupLabel');
  function isAutoOn() { return localStorage.getItem(AUTO_BACKUP_KEY) === '1'; }
  function updateAutoUI() {
    if (!autoBackupLabel) return;
    autoBackupLabel.textContent = 'Auto-backup: ' + (isAutoOn() ? 'ON' : 'OFF');
    autoBackupBtn.classList.toggle('success', isAutoOn());
  }
  updateAutoUI();
  autoBackupBtn?.addEventListener('click', () => {
    const on = isAutoOn();
    localStorage.setItem(AUTO_BACKUP_KEY, on ? '0' : '1');
    updateAutoUI();
    showToast(on ? 'Auto-backup disabled' : 'Auto-backup enabled ✓');
  });

  /* ============ CLEAR ============ */
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    confirmDialog('Clear local data?', 'Removes local backup cache. Firebase data stays safe.', () => {
      localStorage.removeItem(BACKUP_DATA_KEY);
      localStorage.removeItem('minsopanha_analytics');
      showToast('Local data cleared ✓');
    });
  });

  /* ============ BUTTONS ============ */
  document.getElementById('refreshBtn')?.addEventListener('click', loadAll);
  document.getElementById('exportJSONBtn')?.addEventListener('click', exportJSON);
  document.getElementById('exportCSVBtn')?.addEventListener('click', exportCSV);

  /* ============ INIT ============ */
  function init() {
    loadAll();
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(loadAll, 30000);
  }
})();