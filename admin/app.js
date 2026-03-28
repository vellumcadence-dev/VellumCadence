/* ===== VellumCadence Admin Panel ===== */

// ─── Auth ─────────────────────────────────────────────────────────────────────
const DEFAULT_PASS = 'VC-admin-2026';
const PASS_KEY = 'vc_admin_pass';
const SESSION_KEY = 'vc_admin_session';

function getPass() { return localStorage.getItem(PASS_KEY) || DEFAULT_PASS; }
function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }

function login(pass) {
  if (pass === getPass()) {
    sessionStorage.setItem(SESSION_KEY, '1');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const pass = document.getElementById('loginPass').value;
  if (login(pass)) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = '';
    initAdmin();
  } else {
    document.getElementById('loginError').textContent = 'Неверный пароль';
  }
});

document.getElementById('logoutBtn').addEventListener('click', logout);

if (isLoggedIn()) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminApp').style.display = '';
  initAdmin();
}

// ─── Data storage ─────────────────────────────────────────────────────────────
function getData(key, def) {
  try { return JSON.parse(localStorage.getItem('vc_' + key)) ?? def; }
  catch { return def; }
}
function setData(key, val) {
  localStorage.setItem('vc_' + key, JSON.stringify(val));
}

// ─── Default leads (pre-seeded from CRM) ─────────────────────────────────────
const DEFAULT_LEADS = [
  { id: 1, company: 'Geurwolkje', contact: '', email: 'info@geurwolkje.nl', channel: 'email', niche: 'ecom', status: 'followup', date: '2026-03-26', notes: 'Follow-up до 01.04' },
  { id: 2, company: 'Passiesport', contact: '', email: 'info@passiecenter.nl', channel: 'email', niche: 'ecom', status: 'followup', date: '2026-03-26', notes: 'Follow-up до 01.04' },
  { id: 3, company: 'Nail House Amsterdam', contact: '', email: 'info@nailhouseamsterdam.nl', channel: 'email', niche: 'other', status: 'outreach', date: '2026-03-26', notes: 'Beauty NL — низкий ICP' },
  { id: 4, company: "Kim's Nail Studio", contact: '', email: 'info@kimsnailstudio.com', channel: 'email', niche: 'other', status: 'outreach', date: '2026-03-26', notes: '' },
  { id: 5, company: 'Nails by Day', contact: '', email: 'info@nailsbyday.com', channel: 'email', niche: 'other', status: 'outreach', date: '2026-03-26', notes: '' },
  { id: 6, company: 'impetus Personalberatung', contact: 'Hannes Klausner', email: 'hannes.klausner@impetus-personal.at', channel: 'email', niche: 'other', status: 'followup', date: '2026-03-27', notes: 'DE/AT — не наш ICP. Follow-up до 31.03, потом архив' },
  { id: 7, company: 'agentex gmbh', contact: '', email: 'office@agentex.at', channel: 'email', niche: 'other', status: 'followup', date: '2026-03-27', notes: 'DE/AT — не наш ICP. Follow-up до 31.03' },
  { id: 8, company: 'Amsterdam Nail Art Studio', contact: '', email: '@amsterdamnail', channel: 'instagram', niche: 'other', status: 'outreach', date: '2026-03-28', notes: 'Instagram DM отправлен' },
  { id: 9, company: 'RD Recruitment B.V.', contact: 'Reinout Camphuijsen', email: '', channel: 'linkedin', niche: 'other', status: 'outreach', date: '2026-03-27', notes: 'LinkedIn инвайт' },
  { id: 10, company: 'Kummer Consulting', contact: 'Adrian Kummer', email: '', channel: 'linkedin', niche: 'other', status: 'outreach', date: '2026-03-28', notes: 'LinkedIn инвайт' },
  { id: 11, company: 'High Quality Recruitment', contact: 'Gerard Zwart', email: '', channel: 'linkedin', niche: 'other', status: 'outreach', date: '2026-03-27', notes: 'LinkedIn инвайт' },
];

// ─── Default portfolio ────────────────────────────────────────────────────────
const DEFAULT_PORTFOLIO = [
  { id: 1, title: 'Content Strategy', tag: 'Content', image: '/portfolio/showcase-content.jpg' },
  { id: 2, title: 'Brand Direction', tag: 'Branding', image: '/portfolio/showcase-brands.jpg' },
  { id: 3, title: 'Service Overview', tag: 'Service', image: '/portfolio/showcase-packages.jpg' },
];

// ─── Init ─────────────────────────────────────────────────────────────────────
function initAdmin() {
  const leads = getData('leads', DEFAULT_LEADS);
  if (!localStorage.getItem('vc_leads')) setData('leads', DEFAULT_LEADS);
  if (!localStorage.getItem('vc_portfolio')) setData('portfolio', DEFAULT_PORTFOLIO);

  initDashboard();
  initLeads();
  initClients();
  initPortfolio();
  initPackages();
  initSiteEditor();
  initAgents();
  initSettings();
  initNav();
  initMobile();

  // set date
  document.getElementById('dashDate').textContent =
    new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

// ─── Routing ──────────────────────────────────────────────────────────────────
const SECTIONS = ['dashboard','leads','clients','portfolio','packages','site','agents','settings'];

function switchSection(id) {
  if (!SECTIONS.includes(id)) return;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === id);
  });
  document.querySelectorAll('#portalMain .section').forEach(el => {
    el.classList.toggle('active', el.id === `s-${id}`);
  });
  document.getElementById('portalMain').scrollTop = 0;
  closeSidebar();
}

function initNav() {
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-section]');
    if (item && item.closest('#adminApp')) {
      e.preventDefault();
      switchSection(item.dataset.section);
    }
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function initDashboard() {
  const leads    = getData('leads', []);
  const clients  = getData('clients', []);
  const active   = clients.filter(c => c.status === 'active');
  const mrr      = active.reduce((s, c) => s + (c.price || 0), 0);
  const followup = leads.filter(l => l.status === 'followup').length;
  const week     = leads.filter(l => {
    const d = new Date(l.date);
    return (Date.now() - d.getTime()) < 7 * 864e5;
  }).length;

  document.getElementById('statMrr').textContent = '$' + mrr.toLocaleString('en-US');
  document.getElementById('statClients').textContent = active.length;
  document.getElementById('statLeads').textContent = leads.length;
  document.getElementById('statNewLeads').textContent = week;
  document.getElementById('statFollowup').textContent = followup;
  document.getElementById('statConv').textContent =
    leads.length ? Math.round(leads.filter(l => l.status === 'won').length / leads.length * 100) + '%' : '0%';

  // Funnel
  const stages = [
    { key: 'new',      label: 'Новые' },
    { key: 'outreach', label: 'Outreach' },
    { key: 'followup', label: 'Follow-up' },
    { key: 'meeting',  label: 'Meeting' },
    { key: 'won',      label: 'Won' },
  ];
  const max = Math.max(...stages.map(s => leads.filter(l => l.status === s.key).length), 1);
  document.getElementById('dashFunnel').innerHTML = stages.map(s => {
    const cnt = leads.filter(l => l.status === s.key).length;
    const pct = Math.round(cnt / max * 100);
    return `<div class="funnel-row">
      <div class="funnel-label">${s.label}</div>
      <div class="funnel-bar-wrap"><div class="funnel-bar" style="width:${pct}%"></div></div>
      <div class="funnel-count">${cnt}</div>
    </div>`;
  }).join('');

  // Recent leads
  const recent = [...leads].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const colorMap = { new:'#06b6d4', outreach:'#8b5cf6', followup:'#f59e0b', meeting:'#3b82f6', won:'#10b981', lost:'#6b7280' };
  document.getElementById('dashRecentLeads').innerHTML = recent.length
    ? recent.map(l => `<div class="lead-preview-item">
        <div class="lead-preview-dot" style="background:${colorMap[l.status]||'#6b7280'}"></div>
        <div class="lead-preview-name">${l.company}</div>
        <div class="lead-preview-date">${formatDate(l.date)}</div>
      </div>`).join('')
    : '<div style="color:var(--text-muted);font-size:.83rem;padding:12px 0">Нет лидов</div>';

  // Badge
  const nb = document.getElementById('newLeadsBadge');
  const newCount = leads.filter(l => l.status === 'new').length;
  if (newCount > 0) { nb.textContent = newCount; nb.style.display = ''; }
}

// ─── Leads CRM ────────────────────────────────────────────────────────────────
let leadFilter = 'all';
let editLeadId = null;

function initLeads() {
  renderLeads();

  document.querySelectorAll('[id^="lcnt-"]').forEach(() => {});
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.section');
      if (!parent || parent.id !== 's-leads') return;
      parent.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      leadFilter = btn.dataset.filter;
      renderLeads();
    });
  });

  document.getElementById('addLeadBtn').addEventListener('click', () => openLeadModal());
  document.getElementById('leadForm').addEventListener('submit', e => {
    e.preventDefault();
    saveLead();
  });
}

function renderLeads() {
  const leads = getData('leads', []);
  const stages = ['new','outreach','followup','meeting','won','lost'];

  // Update counts
  stages.forEach(s => {
    const el = document.getElementById(`lcnt-${s}`);
    if (el) el.textContent = leads.filter(l => l.status === s).length;
  });
  const allEl = document.getElementById('lcnt-all');
  if (allEl) allEl.textContent = leads.length;

  const filtered = leadFilter === 'all' ? leads : leads.filter(l => l.status === leadFilter);
  const labels = { new:'Новый', outreach:'Outreach', followup:'Follow-up', meeting:'Meeting', won:'Won', lost:'Lost' };

  document.getElementById('leadsTableBody').innerHTML = filtered.length
    ? filtered.map(l => `
      <tr>
        <td>
          <div class="crm-company">${escapeHtml(l.company)}</div>
          ${l.contact ? `<div class="crm-contact">${escapeHtml(l.contact)}</div>` : ''}
          ${l.email ? `<div class="crm-contact" style="color:var(--accent)">${escapeHtml(l.email)}</div>` : ''}
        </td>
        <td><span style="font-family:var(--mono);font-size:.72rem">${l.channel}</span></td>
        <td><span style="font-size:.75rem;color:var(--text-dim)">${nicheLabel(l.niche)}</span></td>
        <td><span class="badge status-${l.status}">${labels[l.status]||l.status}</span></td>
        <td style="font-size:.75rem;color:var(--text-muted)">${formatDate(l.date)}</td>
        <td>
          <div class="crm-actions">
            <button class="btn-icon" onclick="editLead(${l.id})">✏</button>
            <button class="btn-icon danger" onclick="deleteLead(${l.id})">✕</button>
          </div>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="6" style="padding:32px;text-align:center;color:var(--text-muted);font-size:.83rem">Нет лидов в этой категории</td></tr>`;
}

function openLeadModal(lead = null) {
  editLeadId = lead ? lead.id : null;
  document.getElementById('leadModalTitle').textContent = lead ? 'Редактировать лид' : 'Добавить лид';
  document.getElementById('lCompany').value  = lead?.company  || '';
  document.getElementById('lContact').value  = lead?.contact  || '';
  document.getElementById('lEmail').value    = lead?.email    || '';
  document.getElementById('lChannel').value  = lead?.channel  || 'email';
  document.getElementById('lNiche').value    = lead?.niche    || 'skincare';
  document.getElementById('lStatus').value   = lead?.status   || 'new';
  document.getElementById('lNotes').value    = lead?.notes    || '';
  document.getElementById('leadModal').style.display = 'flex';
}

function closeLeadModal() { document.getElementById('leadModal').style.display = 'none'; }

function saveLead() {
  const leads = getData('leads', []);
  const lead = {
    id: editLeadId || Date.now(),
    company:  document.getElementById('lCompany').value.trim(),
    contact:  document.getElementById('lContact').value.trim(),
    email:    document.getElementById('lEmail').value.trim(),
    channel:  document.getElementById('lChannel').value,
    niche:    document.getElementById('lNiche').value,
    status:   document.getElementById('lStatus').value,
    notes:    document.getElementById('lNotes').value.trim(),
    date:     new Date().toISOString().slice(0,10),
  };
  if (editLeadId) {
    const idx = leads.findIndex(l => l.id === editLeadId);
    if (idx !== -1) leads[idx] = lead;
  } else {
    leads.unshift(lead);
  }
  setData('leads', leads);
  closeLeadModal();
  renderLeads();
  initDashboard();
}

function editLead(id) {
  const lead = getData('leads', []).find(l => l.id === id);
  if (lead) openLeadModal(lead);
}

function deleteLead(id) {
  if (!confirm('Удалить лид?')) return;
  const leads = getData('leads', []).filter(l => l.id !== id);
  setData('leads', leads);
  renderLeads();
  initDashboard();
}

// ─── Clients ──────────────────────────────────────────────────────────────────
function initClients() {
  const clients = getData('clients', []);
  const empty = document.getElementById('clientsEmpty');
  const grid = document.getElementById('clientsGrid');
  if (!clients.length) {
    empty.style.display = '';
    grid.style.display = 'none';
  } else {
    empty.style.display = 'none';
    grid.style.display = '';
    grid.innerHTML = clients.map(c => `
      <div class="content-card">
        <div class="content-thumb" style="background:linear-gradient(135deg,rgba(139,92,246,.4),rgba(6,182,212,.3))">
          <span style="position:relative;z-index:1;font-weight:700">${c.name.slice(0,2).toUpperCase()}</span>
        </div>
        <div class="content-body">
          <div class="content-top">
            <div class="content-title">${escapeHtml(c.name)}</div>
            <span class="badge badge-approved">${c.package}</span>
          </div>
          <div class="content-meta" style="margin-top:6px">
            <span style="font-family:var(--mono);font-size:.72rem;color:var(--accent)">$${c.price}/мес</span>
            <span class="content-date">${formatDate(c.since)}</span>
          </div>
        </div>
      </div>`).join('');
  }

  document.getElementById('addClientBtn').addEventListener('click', () => {
    const name    = prompt('Имя клиента / компания:');
    if (!name) return;
    const pkg     = prompt('Пакет (Lite / Pro / Premium):') || 'Lite';
    const price   = Number(prompt('Цена $/мес:')) || 590;
    const clients = getData('clients', []);
    clients.push({ id: Date.now(), name, package: pkg, price, status: 'active', since: new Date().toISOString().slice(0,10) });
    setData('clients', clients);
    initClients();
    initDashboard();
  });
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
let editPortfolioId = null;

function initPortfolio() {
  renderPortfolio();
  document.getElementById('addPortfolioBtn').addEventListener('click', () => openPortfolioModal());
  document.getElementById('portfolioForm').addEventListener('submit', e => {
    e.preventDefault();
    savePortfolioItem();
  });
}

function renderPortfolio() {
  const items = getData('portfolio', DEFAULT_PORTFOLIO);
  const grid = document.getElementById('portfolioAdminGrid');
  grid.innerHTML = items.map(item => `
    <div class="portfolio-admin-card">
      ${item.image
        ? `<img src="${escapeHtml(item.image)}" class="portfolio-admin-img" alt="${escapeHtml(item.title)}" onerror="this.style.display='none'">`
        : `<div class="portfolio-admin-placeholder">🖼</div>`
      }
      <div class="portfolio-admin-body">
        <div class="portfolio-admin-tag">${escapeHtml(item.tag)}</div>
        <div class="portfolio-admin-title">${escapeHtml(item.title)}</div>
        <div class="portfolio-admin-actions">
          <button class="btn-icon" onclick="editPortfolio(${item.id})">✏ Изменить</button>
          <button class="btn-icon danger" onclick="deletePortfolio(${item.id})">✕</button>
        </div>
      </div>
    </div>`).join('');
}

function openPortfolioModal(item = null) {
  editPortfolioId = item ? item.id : null;
  document.getElementById('portfolioModalTitle').textContent = item ? 'Редактировать кейс' : 'Добавить кейс';
  document.getElementById('pTitle').value = item?.title || '';
  document.getElementById('pTag').value   = item?.tag   || 'Reel';
  document.getElementById('pImage').value = item?.image || '';
  document.getElementById('pFile').value  = '';
  document.getElementById('portfolioModal').style.display = 'flex';
}

function closePortfolioModal() { document.getElementById('portfolioModal').style.display = 'none'; }

function savePortfolioItem() {
  const items = getData('portfolio', []);
  const file  = document.getElementById('pFile').value.trim();
  const image = file ? `/portfolio/${file}` : document.getElementById('pImage').value.trim();
  const item = {
    id:    editPortfolioId || Date.now(),
    title: document.getElementById('pTitle').value.trim(),
    tag:   document.getElementById('pTag').value,
    image,
  };
  if (editPortfolioId) {
    const idx = items.findIndex(i => i.id === editPortfolioId);
    if (idx !== -1) items[idx] = item;
  } else {
    items.push(item);
  }
  setData('portfolio', items);
  closePortfolioModal();
  renderPortfolio();
}

function editPortfolio(id) {
  const item = getData('portfolio', []).find(i => i.id === id);
  if (item) openPortfolioModal(item);
}

function deletePortfolio(id) {
  if (!confirm('Удалить кейс?')) return;
  setData('portfolio', getData('portfolio', []).filter(i => i.id !== id));
  renderPortfolio();
}

// ─── Packages editor ──────────────────────────────────────────────────────────
let PACKAGES = [];

async function initPackages() {
  try {
    const res = await fetch('/data/packages.json');
    PACKAGES = await res.json();
  } catch {
    PACKAGES = [
      { name: 'Lite',    price: 590,  originalPrice: 890,  currency: '€', popular: false, features: [{val:'5',label:'Reels (10-25 sec)'},{val:'7',label:'Static visuals'},{val:'1',label:'Carousel set'},{val:'',label:'Basic content calendar'},{val:'',label:'1 round of revisions'}] },
      { name: 'Pro',     price: 1090, originalPrice: 1590, currency: '€', popular: true,  features: [{val:'10',label:'Reels (10-25 sec)'},{val:'16',label:'Static visuals'},{val:'3',label:'Carousel sets'},{val:'',label:'Full content strategy'},{val:'',label:'2 rounds of revisions'},{val:'',label:'Publishing calendar'}] },
      { name: 'Premium', price: 1990, originalPrice: 2890, currency: '€', popular: false, features: [{val:'12',label:'Reels (10-30 sec)'},{val:'20',label:'Static visuals'},{val:'5',label:'Carousel sets'},{val:'',label:'Full brand identity kit'},{val:'',label:'Unlimited revisions'},{val:'',label:'Dedicated manager'},{val:'',label:'Priority support'}] },
    ];
  }
  renderPackagesEditor();
}

function renderPackagesEditor() {
  document.getElementById('packagesEditor').innerHTML = PACKAGES.map((pkg, pi) => `
    <div class="pkg-editor-card">
      <div class="pkg-editor-header">
        <div class="pkg-editor-name">${pkg.name}</div>
      </div>
      <div class="pkg-editor-fields">
        <div class="form-group" style="margin:0">
          <label class="form-label">Название</label>
          <input type="text" class="form-input" value="${pkg.name}" onchange="updatePkg(${pi},'name',this.value)">
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Цена (€/$)</label>
          <input type="number" class="form-input" value="${pkg.price}" onchange="updatePkg(${pi},'price',+this.value)">
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Зачёркнутая цена</label>
          <input type="number" class="form-input" value="${pkg.originalPrice}" onchange="updatePkg(${pi},'originalPrice',+this.value)">
        </div>
      </div>
      <div class="form-label" style="margin-bottom:8px">Фичи</div>
      <div class="feature-list" id="features-${pi}">
        ${pkg.features.map((f,fi) => `
          <div class="feature-item">
            <input type="text" class="form-input" style="max-width:60px" value="${f.val||''}" placeholder="кол-во" onchange="updateFeature(${pi},${fi},'val',this.value)">
            <input type="text" class="form-input" value="${f.label}" placeholder="описание" onchange="updateFeature(${pi},${fi},'label',this.value)">
            <button class="btn-icon danger" onclick="removeFeature(${pi},${fi})">✕</button>
          </div>`).join('')}
      </div>
      <button class="add-feature-btn" onclick="addFeature(${pi})">+ Добавить строку</button>
    </div>`).join('');

  document.getElementById('savePackagesBtn').onclick = downloadPackagesJson;
}

function updatePkg(pi, key, val) { PACKAGES[pi][key] = val; }
function updateFeature(pi, fi, key, val) { PACKAGES[pi].features[fi][key] = val; }
function removeFeature(pi, fi) { PACKAGES[pi].features.splice(fi, 1); renderPackagesEditor(); }
function addFeature(pi) { PACKAGES[pi].features.push({val:'',label:''}); renderPackagesEditor(); }

function downloadPackagesJson() {
  const blob = new Blob([JSON.stringify(PACKAGES, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'packages.json';
  a.click();
  showGlobalHint('packages.json скачан — залейте его в /data/packages.json на сервере');
}

// ─── Site Editor ──────────────────────────────────────────────────────────────
function initSiteEditor() {
  // Load saved
  const hero = getData('siteHero', {});
  if (hero.title) document.getElementById('heroTitle').value = hero.title;
  if (hero.sub)   document.getElementById('heroSub').value   = hero.sub;
  if (hero.cta)   document.getElementById('heroCta').value   = hero.cta;

  const video = getData('siteVideo', {});
  if (video.url)      document.getElementById('videoUrl').value      = video.url;
  if (video.poster)   document.getElementById('videoPoster').value   = video.poster;
  if (video.type)     document.getElementById('videoType').value     = video.type;
  if (video.position) document.getElementById('videoPosition').value = video.position;

  document.getElementById('heroForm').addEventListener('submit', e => {
    e.preventDefault();
    setData('siteHero', {
      title: document.getElementById('heroTitle').value,
      sub:   document.getElementById('heroSub').value,
      cta:   document.getElementById('heroCta').value,
    });
    showHint('heroHint', 'Сохранено локально');
    showGlobalHint('Текст сохранён. Чтобы применить на сайт — передайте Клоду значения через чат.');
  });

  document.getElementById('videoForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = {
      url:      document.getElementById('videoUrl').value.trim(),
      poster:   document.getElementById('videoPoster').value.trim(),
      type:     document.getElementById('videoType').value,
      position: document.getElementById('videoPosition').value,
    };
    setData('siteVideo', v);
    showHint('videoHint', 'Сохранено');
    showGlobalHint(`Видео готово к добавлению. Позиция: ${v.position}. URL: ${v.url || 'не указан'}. Скажите Клоду "добавь видео на сайт" — он применит эти настройки.`);
  });

  document.getElementById('seoForm').addEventListener('submit', e => {
    e.preventDefault();
    setData('siteSeo', {
      title: document.getElementById('seoTitle').value,
      desc:  document.getElementById('seoDesc').value,
    });
    showHint('seoHint', 'Сохранено');
  });
}

// ─── Agents ───────────────────────────────────────────────────────────────────
function initAgents() {
  const agents = [
    { name: 'Tony',          role: 'Координатор',  model: 'claude-sonnet-4-6', workspace: '/workspace/' },
    { name: 'Sales Agent',   role: 'Продажи',      model: 'claude-sonnet-4-6', workspace: '/SALES/' },
    { name: 'LeadGen Agent', role: 'Лидогенерация',model: 'claude-haiku-4-5',  workspace: '/SALES/LEADGEN/' },
    { name: 'Content Agent', role: 'Контент',       model: 'claude-sonnet-4-6', workspace: '/PRODUCTION/' },
    { name: 'Trend Agent',   role: 'Тренды',        model: 'claude-haiku-4-5',  workspace: '/PRODUCTION/' },
    { name: 'Scheduler',     role: 'Планировщик',   model: 'claude-haiku-4-5',  workspace: '/PRODUCTION/SCHEDULER/' },
    { name: 'Analytics',     role: 'Аналитика',     model: 'claude-haiku-4-5',  workspace: '/OPERATIONS/' },
    { name: 'Client Success',role: 'Клиенты',       model: 'claude-sonnet-4-6', workspace: '/CLIENT_SUCCESS/' },
    { name: 'Onboarding',    role: 'Онбординг',     model: 'claude-haiku-4-5',  workspace: '/SALES/' },
  ];

  document.getElementById('agentsGrid').innerHTML = agents.map(a => `
    <div class="agent-card">
      <div class="agent-card-header">
        <div class="agent-dot"></div>
        <div>
          <div class="agent-name">${a.name}</div>
          <div class="agent-model">${a.model}</div>
        </div>
      </div>
      <div class="agent-workspace" style="font-size:.72rem;color:var(--text-muted)">
        ~/.openclaw/workspace${a.workspace}
      </div>
      <div style="margin-top:6px;font-size:.75rem;color:var(--text-dim)">${a.role}</div>
    </div>`).join('');
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function initSettings() {
  document.getElementById('passForm').addEventListener('submit', e => {
    e.preventDefault();
    const old = document.getElementById('passOld').value;
    const n1  = document.getElementById('passNew').value;
    const n2  = document.getElementById('passNew2').value;
    if (old !== getPass()) return showHint('passHint', 'Неверный текущий пароль');
    if (n1 !== n2)         return showHint('passHint', 'Пароли не совпадают');
    if (n1.length < 6)     return showHint('passHint', 'Минимум 6 символов');
    localStorage.setItem(PASS_KEY, n1);
    showHint('passHint', 'Пароль изменён');
  });
}

function exportData() {
  const data = {
    leads:     getData('leads', []),
    clients:   getData('clients', []),
    portfolio: getData('portfolio', []),
    siteHero:  getData('siteHero', {}),
    siteVideo: getData('siteVideo', {}),
    siteSeo:   getData('siteSeo', {}),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `vc-admin-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.leads)     setData('leads',     data.leads);
      if (data.clients)   setData('clients',   data.clients);
      if (data.portfolio) setData('portfolio', data.portfolio);
      if (data.siteHero)  setData('siteHero',  data.siteHero);
      if (data.siteVideo) setData('siteVideo', data.siteVideo);
      if (data.siteSeo)   setData('siteSeo',   data.siteSeo);
      alert('Данные импортированы. Перезагрузите страницу.');
    } catch { alert('Ошибка: неверный JSON'); }
  };
  reader.readAsText(file);
}

function clearData() {
  if (!confirm('Удалить все данные? Это действие необратимо.')) return;
  ['leads','clients','portfolio','siteHero','siteVideo','siteSeo'].forEach(k => localStorage.removeItem('vc_' + k));
  location.reload();
}

// ─── Global hint banner ───────────────────────────────────────────────────────
function showGlobalHint(msg) {
  let el = document.getElementById('globalHint');
  if (!el) {
    el = document.createElement('div');
    el.id = 'globalHint';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e1b4b;border:1px solid #8b5cf6;color:#e2d9f3;padding:12px 20px;border-radius:10px;font-size:.8rem;z-index:9999;max-width:480px;text-align:center;line-height:1.4';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 6000);
}

// ─── Mobile sidebar ───────────────────────────────────────────────────────────
function initMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const burger  = document.getElementById('mobileBurger');
  burger?.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('active'); });
  overlay?.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function showHint(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}
function nicheLabel(n) {
  return { skincare:'Skincare', jewelry:'Jewelry', fashion:'Fashion', medspa:'Med Spa', ecom:'E-commerce', other:'Other' }[n] || n;
}
