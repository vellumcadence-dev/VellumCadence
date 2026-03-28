/* ===== VellumCadence Client Portal ===== */

// ─── Client config (per-client, from backend in the future) ──────────────────
const CLIENT = {
  planName: 'Growth',   // matches packages.json name
  renewalDate: '15 апреля 2026',
};

// ─── Packages loaded from site data ──────────────────────────────────────────
let PACKAGES = [];

async function loadPackages() {
  try {
    const res = await fetch('/data/packages.json');
    PACKAGES = await res.json();
  } catch (e) {
    PACKAGES = [];
  }
  renderPackageSection();
  renderDashboardRenewal();
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CONTENT = [
  { id: 1, type: 'Reel',     title: 'Product Launch — Glow Serum',       status: 'review',     platform: 'Instagram', date: '2026-03-28', gradient: 'linear-gradient(135deg,rgba(139,92,246,.4),rgba(236,72,153,.3))' },
  { id: 2, type: 'Carousel', title: '5 Steps to Glass Skin Routine',      status: 'approved',   platform: 'Instagram', date: '2026-03-25', gradient: 'linear-gradient(135deg,rgba(6,182,212,.4),rgba(139,92,246,.3))' },
  { id: 3, type: 'Visual',   title: 'Hero Shot — Mineral Sunscreen',      status: 'scheduled',  platform: 'Instagram', date: '2026-03-30', gradient: 'linear-gradient(135deg,rgba(236,72,153,.4),rgba(6,182,212,.3))' },
  { id: 4, type: 'Reel',     title: 'Behind the Scenes — Product Making', status: 'review',     platform: 'Instagram', date: '2026-03-29', gradient: 'linear-gradient(135deg,rgba(139,92,246,.4),rgba(6,182,212,.3))' },
  { id: 5, type: 'Visual',   title: 'Brand Palette — Clean Beauty',       status: 'approved',   platform: 'Instagram', date: '2026-03-22', gradient: 'linear-gradient(135deg,rgba(236,72,153,.35),rgba(139,92,246,.3))' },
  { id: 6, type: 'Carousel', title: 'Ingredient Spotlight — Niacinamide', status: 'approved',   platform: 'Instagram', date: '2026-03-20', gradient: 'linear-gradient(135deg,rgba(6,182,212,.35),rgba(236,72,153,.25))' },
  { id: 7, type: 'Visual',   title: 'Spring Collection — Flat Lay',       status: 'scheduled',  platform: 'Instagram', date: '2026-04-02', gradient: 'linear-gradient(135deg,rgba(139,92,246,.3),rgba(6,182,212,.4))' },
];

const MESSAGES = [
  { from: 'manager', name: 'Dmitry', initials: 'DV', text: 'Hi Adrian! Welcome to your VellumCadence portal. Your first content batch for March is in progress.', time: '09:14', date: 'Mar 20' },
  { from: 'client',  name: 'Adrian', initials: 'AK', text: 'Great, looking forward to it. Can we focus more on product visuals this month?', time: '10:30', date: 'Mar 20' },
  { from: 'manager', name: 'Dmitry', initials: 'DV', text: 'Absolutely — added 3 extra AI product shots to the March plan. First drafts ready for your review on March 25.', time: '10:47', date: 'Mar 20' },
  { from: 'client',  name: 'Adrian', initials: 'AK', text: 'Perfect. For the Reels, please keep the tone premium and aspirational — our audience is 25–40 women.', time: '11:02', date: 'Mar 21' },
  { from: 'manager', name: 'Dmitry', initials: 'DV', text: 'Noted — premium, aspirational tone. Your April brief is ready to fill in whenever you have 5 minutes.', time: '09:33', date: 'Mar 26' },
];

const CALENDAR = [
  { date: '2026-03-28', weekday: 'Сб', day: 28, time: '10:00', title: 'Product Launch Teaser', platform: 'Instagram', type: 'Reel',     status: 'scheduled' },
  { date: '2026-03-30', weekday: 'Пн', day: 30, time: '14:00', title: 'Ingredient Spotlight Reel', platform: 'Instagram', type: 'Visual',   status: 'scheduled' },
  { date: '2026-04-02', weekday: 'Чт', day: 2,  time: '09:00', title: 'Spring Collection — Flat Lay', platform: 'Instagram', type: 'Visual',   status: 'scheduled' },
  { date: '2026-04-05', weekday: 'Вс', day: 5,  time: '11:00', title: 'April Content #1',         platform: 'Instagram', type: 'Reel',     status: 'pending' },
  { date: '2026-04-08', weekday: 'Ср', day: 8,  time: '10:00', title: 'April Content #2',         platform: 'LinkedIn',  type: 'Carousel', status: 'pending' },
  { date: '2026-04-12', weekday: 'Вс', day: 12, time: '12:00', title: 'April Content #3',         platform: 'Instagram', type: 'Visual',   status: 'pending' },
];

const INVOICES = [
  { id: 'INV-001', date: '2026-03-01', desc: 'Growth Package — март 2026', amount: 1490, status: 'paid' },
  { id: 'INV-002', date: '2026-04-01', desc: 'Growth Package — апрель 2026', amount: 1490, status: 'upcoming' },
];

// ─── Routing ─────────────────────────────────────────────────────────────────

const SECTIONS = ['dashboard','content','package','brief','messages','calendar','invoices','settings'];

function switchSection(id) {
  if (!SECTIONS.includes(id)) return;

  const fn = () => {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === id);
    });
    document.querySelectorAll('.section').forEach(el => {
      el.classList.toggle('active', el.id === `s-${id}`);
    });
    // Scroll top
    document.getElementById('portalMain').scrollTop = 0;
  };

  if (document.startViewTransition) {
    document.startViewTransition(fn);
  } else {
    fn();
  }

  // Close mobile sidebar
  closeSidebar();
}

// ─── Nav clicks (sidebar + dashboard quick links) ──────────────────────────

document.addEventListener('click', e => {
  const item = e.target.closest('[data-section]');
  if (item) {
    e.preventDefault();
    switchSection(item.dataset.section);
  }
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

function updateDashboardStats() {
  const approved  = CONTENT.filter(c => c.status === 'approved').length;
  const review    = CONTENT.filter(c => c.status === 'review').length;
  const scheduled = CONTENT.filter(c => c.status === 'scheduled').length;
  const cards = document.querySelectorAll('.stat-card');
  // cards[0] = usage (handled by renderPackageSection), 1=approved, 2=review, 3=scheduled
  if (cards[1]) cards[1].querySelector('.stat-value').textContent = approved;
  if (cards[2]) cards[2].querySelector('.stat-value').textContent = review;
  if (cards[3]) cards[3].querySelector('.stat-value').textContent = scheduled;
}

function initDashboard() {
  // Greeting
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dashGreeting').textContent = `${greet}, Adrian`;
  updateDashboardStats();

  // Upcoming content (first 3 by date)
  const upcoming = [...CONTENT]
    .filter(c => c.status === 'scheduled' || c.status === 'review')
    .slice(0, 3);

  const upcomingEl = document.getElementById('dashUpcoming');
  upcomingEl.innerHTML = upcoming.map(c => `
    <div class="upcoming-item">
      <div class="upcoming-thumb" style="background:${c.gradient}">${c.type.toUpperCase()}</div>
      <div class="upcoming-info">
        <div class="upcoming-title">${c.title}</div>
        <div class="upcoming-meta">${formatDate(c.date)} · ${c.platform}</div>
      </div>
      <span class="badge badge-${c.status}">${statusLabel(c.status)}</span>
    </div>
  `).join('');

  // Messages preview (last 2)
  const lastMsgs = MESSAGES.slice(-2);
  document.getElementById('dashMessages').innerHTML = `<div class="msg-preview">` +
    lastMsgs.map(m => `
      <div class="msg-prev-item">
        <div class="msg-prev-avatar ${m.from === 'client' ? 'client-av' : ''}">${m.initials}</div>
        <div class="msg-prev-body">
          <div class="msg-prev-name">${m.name}</div>
          <div class="msg-prev-text">${truncate(m.text, 72)}</div>
        </div>
      </div>
    `).join('') +
  `</div>`;
}

// ─── Content Section ─────────────────────────────────────────────────────────

let activeFilter = 'all';

function initContent() {
  // Count badges
  const counts = { all: CONTENT.length };
  ['review','approved','scheduled'].forEach(s => {
    counts[s] = CONTENT.filter(c => c.status === s).length;
  });
  Object.keys(counts).forEach(k => {
    const el = document.getElementById(`cnt-${k}`);
    if (el) el.textContent = counts[k];
  });

  // Review badge in nav
  const reviewBadge = document.getElementById('reviewBadge');
  if (counts.review > 0) {
    reviewBadge.textContent = counts.review;
    reviewBadge.style.display = '';
  }

  renderContent(activeFilter);

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderContent(activeFilter);
    });
  });
}

function renderContent(filter) {
  const items = filter === 'all' ? CONTENT : CONTENT.filter(c => c.status === filter);
  const grid = document.getElementById('contentGrid');
  if (!items.length) {
    grid.innerHTML = `<div style="color:var(--text-muted);font-size:.85rem;padding:20px 0">Нет контента в этой категории.</div>`;
    return;
  }
  grid.innerHTML = items.map(c => `
    <div class="content-card">
      <div class="content-thumb" style="background:${c.gradient}">
        <span style="position:relative;z-index:1">${c.type.toUpperCase()}</span>
      </div>
      <div class="content-body">
        <div class="content-top">
          <div class="content-title">${c.title}</div>
          <span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span>
        </div>
        <div class="content-meta">
          <span class="badge badge-${c.status}">${statusLabel(c.status)}</span>
          <span class="platform-badge">${c.platform}</span>
          <span class="content-date">${formatDate(c.date)}</span>
        </div>
        ${c.status === 'review' ? `
        <div class="content-actions">
          <button class="btn btn-approve" onclick="approveContent(${c.id})">Одобрить</button>
          <button class="btn btn-revision" onclick="requestRevision(${c.id})">Правки</button>
        </div>` : ''}
      </div>
    </div>
  `).join('');
}

function approveContent(id) {
  const item = CONTENT.find(c => c.id === id);
  if (!item) return;
  item.status = 'approved';
  renderContent(activeFilter);
  updateDashboardStats();
  // update filter tab counts
  const counts = { all: CONTENT.length };
  ['review','approved','scheduled'].forEach(s => { counts[s] = CONTENT.filter(c => c.status === s).length; });
  Object.keys(counts).forEach(k => { const el = document.getElementById(`cnt-${k}`); if (el) el.textContent = counts[k]; });
  // update review badge in nav
  const rb = document.getElementById('reviewBadge');
  if (rb) { rb.textContent = counts.review; rb.style.display = counts.review > 0 ? '' : 'none'; }
}

function requestRevision(id) {
  alert(`Запрос на правки отправлен менеджеру.`);
}

// ─── Brief ───────────────────────────────────────────────────────────────────

function initBrief() {
  const months = ['Март 2026', 'Апрель 2026', 'Май 2026'];
  const container = document.getElementById('briefMonths');
  container.innerHTML = months.map((m, i) => `
    <button class="brief-month-btn ${i === 0 ? 'active' : ''}" onclick="selectBriefMonth(this, '${m}')">${m}</button>
  `).join('');

  document.getElementById('briefForm').addEventListener('submit', e => {
    e.preventDefault();
    const hint = document.getElementById('briefHint');
    hint.textContent = 'Сохранено';
    hint.classList.add('visible');
    setTimeout(() => hint.classList.remove('visible'), 3000);
  });
}

function selectBriefMonth(btn, month) {
  document.querySelectorAll('.brief-month-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── Messages ────────────────────────────────────────────────────────────────

function initMessages() {
  renderMessages();

  const input = document.getElementById('msgInput');
  const sendBtn = document.getElementById('msgSend');

  function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    MESSAGES.push({ from: 'client', name: 'Adrian', initials: 'AK', text, time: nowTime(), date: 'сейчас' });
    input.value = '';
    renderMessages();

    // Auto-reply after 1.5s
    setTimeout(() => {
      MESSAGES.push({ from: 'manager', name: 'Dmitry', initials: 'DV', text: 'Принято! Отвечу в ближайшее время.', time: nowTime(), date: 'сейчас' });
      renderMessages();
    }, 1500);
  }

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
}

function renderMessages() {
  const list = document.getElementById('messagesList');
  list.innerHTML = MESSAGES.map(m => `
    <div class="msg-bubble from-${m.from}">
      <div class="msg-avatar ${m.from === 'client' ? 'client-av' : ''}">${m.initials}</div>
      <div class="msg-content">
        <div class="msg-name">${m.name} · ${m.date}</div>
        <div class="msg-text">${escapeHtml(m.text)}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>
  `).join('');
  list.scrollTop = list.scrollHeight;
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function initCalendar() {
  const view = document.getElementById('calendarView');
  const byMonth = {};
  CALENDAR.forEach(item => {
    const month = item.date.startsWith('2026-03') ? 'Март 2026' : 'Апрель 2026';
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(item);
  });

  view.innerHTML = Object.entries(byMonth).map(([month, items]) => `
    <div class="calendar-month-label">${month}</div>
    ${items.map(item => `
      <div class="cal-item">
        <div class="cal-date-block">
          <div class="cal-day">${item.day}</div>
          <div class="cal-weekday">${item.weekday}</div>
        </div>
        <div class="cal-info">
          <div class="cal-title">${item.title}</div>
          <div class="cal-meta">
            <span class="cal-time">${item.time}</span>
            <span class="cal-platform">${item.platform}</span>
            <span class="type-badge type-${item.type.toLowerCase()}">${item.type}</span>
          </div>
        </div>
        <div class="cal-status">
          <span class="badge badge-${item.status === 'pending' ? 'review' : 'scheduled'}">
            ${item.status === 'pending' ? 'Ожидает' : 'Запланировано'}
          </span>
        </div>
      </div>
    `).join('')}
  `).join('');
}

// ─── Invoices ────────────────────────────────────────────────────────────────

function initInvoices() {
  const plan = PACKAGES.find(p => p.name === CLIENT.planName);
  const planPrice = plan ? plan.price : INVOICES[0]?.amount ?? 0;
  const paid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  // sync upcoming invoice amount with real package price
  INVOICES.forEach(inv => { if (inv.status === 'upcoming') inv.amount = planPrice; });

  const view = document.getElementById('invoicesView');
  view.innerHTML = `
    <div class="invoice-summary">
      <div class="inv-summary-card">
        <div class="inv-summary-label">Всего оплачено</div>
        <div class="inv-summary-value green">$${paid.toLocaleString('en-US')}</div>
      </div>
      <div class="inv-summary-card">
        <div class="inv-summary-label">Следующий платёж</div>
        <div class="inv-summary-value yellow">$${planPrice.toLocaleString('en-US')}</div>
      </div>
      <div class="inv-summary-card">
        <div class="inv-summary-label">Дата renewal</div>
        <div class="inv-summary-value" style="font-size:1rem;padding-top:4px">${CLIENT.renewalDate}</div>
      </div>
    </div>
    <div class="invoice-table">
      <div class="inv-table-header">
        <span>Номер</span>
        <span>Описание</span>
        <span>Дата</span>
        <span>Сумма</span>
        <span></span>
      </div>
      ${INVOICES.map(inv => `
        <div class="inv-row">
          <span class="inv-id">${inv.id}</span>
          <span class="inv-desc">${inv.desc}</span>
          <span class="inv-date">${formatDate(inv.date)}</span>
          <span class="inv-amount inv-status-${inv.status}">$${inv.amount.toLocaleString('en-US')}</span>
          <span class="inv-actions">
            ${inv.status === 'paid'
              ? `<button class="btn-pdf" onclick="downloadInvoice('${inv.id}')">PDF ↓</button>`
              : `<span class="badge badge-review" style="font-size:.65rem">Ожидает</span>`
            }
          </span>
        </div>
      `).join('')}
    </div>
  `;
}

function downloadInvoice(id) {
  alert(`Скачивание ${id}.pdf...`);
}

// ─── Package Section (from packages.json) ────────────────────────────────────

function renderPackageSection() {
  if (!PACKAGES.length) return;

  const plan = PACKAGES.find(p => p.name === CLIENT.planName);
  if (!plan) return;

  // Compute totals from features
  const totalItems = plan.features
    .filter(f => f.val && !isNaN(Number(f.val)))
    .reduce((s, f) => s + Number(f.val), 0);

  const usedReels    = CONTENT.filter(c => c.type === 'Reel').length;
  const usedCarousel = CONTENT.filter(c => c.type === 'Carousel').length;
  const usedVisual   = CONTENT.filter(c => c.type === 'Visual').length;
  const usedTotal    = CONTENT.length;
  const pct = totalItems ? Math.round((usedTotal / totalItems) * 100) : 0;

  // Update stat card on dashboard
  const statVal = document.querySelector('.stat-card .stat-value');
  if (statVal) statVal.innerHTML = `${usedTotal}<span class="stat-of">/${totalItems}</span>`;
  const statFill = document.querySelector('.stat-fill');
  if (statFill) statFill.style.width = pct + '%';
  const statHint = document.querySelector('.stat-card .stat-hint');
  if (statHint) statHint.textContent = pct + '% пакета';

  // Package section header
  const usageTop = document.querySelector('.pkg-usage-top');
  if (usageTop) {
    usageTop.querySelector('.pkg-usage-name').textContent = plan.name + ' Package';
    usageTop.querySelector('.pkg-usage-desc').textContent = `${totalItems} единиц контента · март 2026`;
    usageTop.querySelector('.pkg-usage-price').innerHTML = `$${plan.price.toLocaleString('en-US')}<span class="pkg-per">/мес</span>`;
  }
  const pLabels = document.querySelector('.progress-labels');
  if (pLabels) {
    pLabels.children[0].textContent = `${usedTotal} использовано`;
    pLabels.children[1].textContent = `${totalItems - usedTotal} осталось`;
  }
  const pFill = document.querySelector('.progress-fill');
  if (pFill) pFill.style.width = pct + '%';

  // Breakdown
  const bd = document.querySelector('.pkg-breakdown');
  if (bd) {
    bd.querySelector('.breakdown-item:nth-child(1) .breakdown-count').textContent = usedReels;
    bd.querySelector('.breakdown-item:nth-child(2) .breakdown-count').textContent = usedCarousel;
    bd.querySelector('.breakdown-item:nth-child(3) .breakdown-count').textContent = usedVisual;
    bd.querySelector('.breakdown-remaining .breakdown-count').textContent = totalItems - usedTotal;
  }

  // Compare grid
  const grid = document.querySelector('.packages-compare');
  if (!grid) return;
  grid.innerHTML = PACKAGES.map(pkg => {
    const isCurrent = pkg.name === CLIENT.planName;
    return `
      <div class="pkg-card ${isCurrent ? 'pkg-current' : ''}">
        ${isCurrent ? `<div class="pkg-badge">Ваш план</div>` : ''}
        <div class="pkg-card-name">${pkg.name}</div>
        <div class="pkg-card-price">$${pkg.price.toLocaleString('en-US')}<span>/мес</span></div>
        <div class="pkg-card-units" style="font-size:.72rem;color:var(--text-dim);font-family:var(--mono);margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)">
          <span style="text-decoration:line-through;color:var(--text-muted)">$${pkg.originalPrice.toLocaleString('en-US')}</span>
        </div>
        <ul class="pkg-features">
          ${pkg.features.map(f => `<li>${f.val ? `<strong>${f.val}</strong> ` : ''}${f.label}</li>`).join('')}
        </ul>
        ${!isCurrent ? `<a href="mailto:hello@vellumcadence.com" class="btn btn-outline" style="margin-top:20px;display:block;text-align:center">Обсудить апгрейд</a>` : ''}
      </div>
    `;
  }).join('');
}

function renderDashboardRenewal() {
  const plan = PACKAGES.find(p => p.name === CLIENT.planName);
  if (!plan) return;
  const priceEl = document.querySelector('.renewal-price');
  if (priceEl) priceEl.textContent = '$' + plan.price.toLocaleString('en-US');
  const sub = document.querySelector('#s-dashboard .section-sub');
  if (sub) sub.textContent = `Март 2026 · ${plan.name} Package`;
  // sidebar user plan
  const userPlan = document.querySelector('.user-plan');
  if (userPlan) userPlan.textContent = `${plan.name} Package`;
}

// ─── Settings ────────────────────────────────────────────────────────────────

function initSettings() {
  document.getElementById('profileForm').addEventListener('submit', e => {
    e.preventDefault();
    showHint('profileHint', 'Сохранено');
  });
}

// ─── Mobile sidebar ──────────────────────────────────────────────────────────

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const burger  = document.getElementById('mobileBurger');

burger?.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('active');
});
overlay?.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusLabel(s) {
  return { review: 'На ревью', approved: 'Одобрено', scheduled: 'Запланировано' }[s] || s;
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showHint(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}

// ─── Init ────────────────────────────────────────────────────────────────────

initDashboard();
initContent();
initBrief();
initMessages();
initCalendar();
initInvoices();
initSettings();
loadPackages(); // async — обновит цены и пакеты после загрузки
