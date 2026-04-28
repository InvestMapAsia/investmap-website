(function () {
  const data = window.AlatauData || {};
  const STORAGE_KEYS = {
    lang: 'aci_lang',
    favorites: 'aci_favorites',
    compare: 'aci_compare',
    applications: 'aci_applications',
    ownerPlots: 'aci_owner_plots',
    legalAccept: 'aci_legal_accept',
    ownerPlan: 'aci_owner_plan',
    aiHistory: 'aci_ai_history'
  };

  const LEGAL_LABEL_KEYS = {
    a_plus: 'legal_a_plus',
    a: 'legal_a',
    b: 'legal_b',
    c: 'legal_c'
  };

  const NAV_LINKS = [
    { href: 'index.html', key: 'nav_home' },
    { href: 'map.html', key: 'nav_map' },
    { href: 'catalog.html', key: 'nav_catalog' },
    { href: 'pricing.html', key: 'nav_pricing' },
    { href: 'news.html', key: 'nav_news' },
    { href: 'faq.html', key: 'nav_faq' },
    { href: 'contacts.html', key: 'nav_contacts' }
  ];

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentLang() {
    const supported = Object.keys(data.translations || {});
    const saved = localStorage.getItem(STORAGE_KEYS.lang);
    if (saved && supported.includes(saved)) return saved;
    return 'ru';
  }

  function t(key) {
    const lang = currentLang();
    const dict = (data.translations && data.translations[lang]) || {};
    const fallback = (data.translations && data.translations.ru) || {};
    return dict[key] || fallback[key] || key;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(value, currency) {
    return new Intl.NumberFormat(currentLang() === 'en' ? 'en-US' : 'ru-RU', {
      maximumFractionDigits: 0
    }).format(value) + ' ' + (currency || 'USD');
  }

  function getFavorites() {
    return readStorage(STORAGE_KEYS.favorites, []);
  }

  function setFavorites(ids) {
    writeStorage(STORAGE_KEYS.favorites, ids);
  }

  function getCompare() {
    return readStorage(STORAGE_KEYS.compare, []);
  }

  function setCompare(ids) {
    writeStorage(STORAGE_KEYS.compare, ids);
  }

  function getApplications() {
    return readStorage(STORAGE_KEYS.applications, []);
  }

  function setApplications(items) {
    writeStorage(STORAGE_KEYS.applications, items);
  }

  function getOwnerPlots() {
    return readStorage(STORAGE_KEYS.ownerPlots, []);
  }

  function setOwnerPlots(items) {
    writeStorage(STORAGE_KEYS.ownerPlots, items);
  }

  function getOwnerPlan() {
    return readStorage(STORAGE_KEYS.ownerPlan, null);
  }

  function setOwnerPlan(plan) {
    writeStorage(STORAGE_KEYS.ownerPlan, plan);
  }

  function statusMeta(status) {
    return (data.statusMeta && data.statusMeta[status]) || data.statusMeta.available;
  }

  function legalLabel(grade) {
    return t(LEGAL_LABEL_KEYS[grade] || 'legal_c');
  }

  function statusBadge(status) {
    const meta = statusMeta(status);
    return '<span class="badge"><span class="dot" style="background:' + meta.color + '"></span>' + escapeHtml(t(meta.labelKey)) + '</span>';
  }

  function getAllPlots() {
    return (data.plots || []).concat(getOwnerPlots());
  }

  function notify(message) {
    let toast = document.getElementById('aciToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aciToast';
      toast.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;background:#17354a;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,0.25);opacity:0;transition:0.2s;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.style.opacity = '0';
    }, 2200);
  }

  function renderHeaderFooter() {
    const headerHost = document.querySelector('[data-component="header"]');
    const footerHost = document.querySelector('[data-component="footer"]');
    const currentFile = (location.pathname.split('/').pop() || 'index.html');

    if (headerHost) {
      const navHtml = NAV_LINKS.map(function (item) {
        const active = item.href === currentFile ? 'active' : '';
        return '<a class="' + active + '" href="' + item.href + '" data-i18n="' + item.key + '">' + escapeHtml(t(item.key)) + '</a>';
      }).join('');

      headerHost.innerHTML = '' +
        '<header class="site-header">' +
        '  <div class="container header-inner">' +
        '    <a class="brand" href="index.html">' +
        '      <span class="brand-badge">A</span>' +
        '      <span class="brand-text">' +
        '        <span class="brand-title">Alatau City Invest</span>' +
        '        <span class="brand-subtitle">Land Intelligence Platform</span>' +
        '      </span>' +
        '    </a>' +
        '    <nav class="main-nav">' + navHtml + '</nav>' +
        '    <div class="header-actions">' +
        '      <div class="lang-switch">' +
        '        <button type="button" class="lang-btn" data-lang="ru">RU</button>' +
        '        <button type="button" class="lang-btn" data-lang="kz">KZ</button>' +
        '        <button type="button" class="lang-btn" data-lang="en">EN</button>' +
        '      </div>' +
        '      <a class="btn btn-ghost" href="investor-cabinet.html">Избранное <span id="favCounter">0</span></a>' +
        '      <a class="btn btn-primary" href="owner-cabinet.html">Кабинет</a>' +
        '    </div>' +
        '  </div>' +
        '</header>';
    }

    if (footerHost) {
      footerHost.innerHTML = '' +
        '<footer class="site-footer">' +
        '  <div class="container footer-inner">' +
        '    <div>' +
        '      <strong>Alatau City Invest</strong>' +
        '      <p class="muted">Премиальная инвестиционная платформа для рынка земельных активов.</p>' +
        '    </div>' +
        '    <div class="footer-links">' +
        '      <a href="legal.html">Юридическая информация</a>' +
        '      <a href="faq.html">Помощь</a>' +
        '      <a href="contacts.html">Поддержка</a>' +
        '    </div>' +
        '  </div>' +
        '</footer>';
    }

    bindLanguageButtons();
    updateHeaderCounters();
  }

  function bindLanguageButtons() {
    const activeLang = currentLang();
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === activeLang);
      btn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEYS.lang, btn.getAttribute('data-lang'));
        applyTranslations();
      });
    });
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      const key = node.getAttribute('data-i18n');
      node.textContent = t(key);
    });
    bindLanguageButtons();
    updateHeaderCounters();
  }

  function updateHeaderCounters() {
    const counter = document.getElementById('favCounter');
    if (counter) counter.textContent = String(getFavorites().length);
  }

  function buildPlotCard(plot) {
    const fav = getFavorites().includes(plot.id);
    const cmp = getCompare().includes(plot.id);
    const tags = (plot.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="badge">' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="card plot-card">' +
      '  <div class="plot-top">' +
      '    <div>' +
      '      <div class="plot-id">' + escapeHtml(plot.id) + ' · ' + escapeHtml(plot.district || '') + '</div>' +
      '      <h3 class="card-title">' + escapeHtml(plot.title) + '</h3>' +
             statusBadge(plot.status) +
      '    </div>' +
      '    <div class="plot-price">' + escapeHtml(formatMoney(plot.price, plot.currency)) + '</div>' +
      '  </div>' +
      '  <div class="metric-line"><span class="muted">Площадь</span><strong>' + escapeHtml(plot.area + ' га') + '</strong></div>' +
      '  <div class="metric-line"><span class="muted">ROI</span><strong>' + escapeHtml(plot.roi + '%') + '</strong></div>' +
      '  <div class="metric-line"><span class="muted">Риск</span><strong>' + escapeHtml(plot.riskScore + '/100') + '</strong></div>' +
      '  <div class="metric-line"><span class="muted">Юр. уровень</span><strong>' + escapeHtml(legalLabel(plot.legalGrade)) + '</strong></div>' +
      '  <div class="plot-tags">' + tags + '</div>' +
      '  <div class="plot-actions">' +
      '    <a class="btn btn-primary" href="plot.html?id=' + encodeURIComponent(plot.id) + '">Подробнее</a>' +
      '    <button class="btn btn-ghost" data-action="favorite" data-id="' + escapeHtml(plot.id) + '">' + (fav ? 'В избранном' : 'В избранное') + '</button>' +
      '    <button class="btn btn-ghost" data-action="compare" data-id="' + escapeHtml(plot.id) + '">' + (cmp ? 'Убрать сравнение' : 'Сравнить') + '</button>' +
      '    <a class="btn btn-accent" href="invest.html?plot=' + encodeURIComponent(plot.id) + '">' + escapeHtml(t('cta_invest')) + '</a>' +
      '  </div>' +
      '</article>';
  }

  function filterMatch(plot, f) {
    const purposeOk = !f.purpose || f.purpose === 'all' || String(plot.purpose).toLowerCase() === String(f.purpose).toLowerCase();
    const statusOk = !f.status || f.status === 'all' || plot.status === f.status;
    let priceOk = true;
    if (f.price === 'lt300') priceOk = plot.price < 300000;
    if (f.price === '300to600') priceOk = plot.price >= 300000 && plot.price <= 600000;
    if (f.price === 'gt600') priceOk = plot.price > 600000;
    let riskOk = true;
    if (f.risk === 'low') riskOk = plot.riskScore <= 30;
    if (f.risk === 'medium') riskOk = plot.riskScore > 30 && plot.riskScore <= 45;
    if (f.risk === 'high') riskOk = plot.riskScore > 45;
    return purposeOk && statusOk && priceOk && riskOk;
  }

  function getPurposeOptions() {
    return ['all'].concat(Array.from(new Set(getAllPlots().map(function (x) { return x.purpose; }))));
  }

  function fillSelect(id, values, labelFn) {
    const node = document.getElementById(id);
    if (!node) return;
    node.innerHTML = values.map(function (value) {
      const label = labelFn ? labelFn(value) : value;
      return '<option value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</option>';
    }).join('');
  }

  function initHomePage() {
    const top = document.getElementById('homeTopPlots');
    const kpi = document.getElementById('homeKpi');
    const available = getAllPlots().filter(function (p) { return p.status === 'available'; });

    if (top) {
      const topPlots = available.sort(function (a, b) { return b.roi - a.roi; }).slice(0, 3);
      top.innerHTML = topPlots.map(buildPlotCard).join('');
    }

    if (kpi) {
      const all = getAllPlots();
      const avgRoi = Math.round(all.reduce(function (s, p) { return s + p.roi; }, 0) / Math.max(all.length, 1));
      kpi.innerHTML = '' +
        '<div class="kpi"><span class="muted">Активных лотов</span><strong>' + available.length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Всего участков</span><strong>' + all.length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Средний ROI</span><strong>' + avgRoi + '%</strong></div>' +
        '<div class="kpi"><span class="muted">Заявки в работе</span><strong>' + getApplications().length + '</strong></div>';
    }
  }

  function initMapPage() {
    const board = document.getElementById('mapBoard');
    const list = document.getElementById('mapList');
    const preview = document.getElementById('mapPreview');
    const legend = document.getElementById('mapLegend');
    if (!board || !list) return;

    fillSelect('mapPurpose', getPurposeOptions(), function (v) { return v === 'all' ? 'Любое назначение' : v; });
    fillSelect('mapPrice', (data.pricePresets || []).map(function (p) { return p.key; }), function (v) {
      const preset = (data.pricePresets || []).find(function (p) { return p.key === v; });
      return preset ? preset.label : v;
    });

    function filters() {
      return {
        purpose: document.getElementById('mapPurpose').value,
        price: document.getElementById('mapPrice').value,
        status: document.getElementById('mapStatus').value,
        risk: document.getElementById('mapRisk').value
      };
    }

    function renderLegend() {
      legend.innerHTML = Object.keys(data.statusMeta || {}).map(function (key) {
        const meta = statusMeta(key);
        return '<span class="badge"><span class="dot" style="background:' + meta.color + '"></span>' + escapeHtml(t(meta.labelKey)) + '</span>';
      }).join('');
    }

    function showPreview(plot) {
      preview.innerHTML = '' +
        '<h3 class="card-title">' + escapeHtml(plot.title) + '</h3>' +
        '<p class="muted">' + escapeHtml(plot.id + ' · ' + plot.district) + '</p>' +
        '<div class="metric-line"><span class="muted">Цена</span><strong>' + escapeHtml(formatMoney(plot.price, plot.currency)) + '</strong></div>' +
        '<div class="metric-line"><span class="muted">Площадь</span><strong>' + escapeHtml(plot.area + ' га') + '</strong></div>' +
        '<div class="metric-line"><span class="muted">ROI</span><strong>' + escapeHtml(plot.roi + '%') + '</strong></div>' +
        '<div class="plot-actions">' +
        '  <a class="btn btn-primary" href="plot.html?id=' + encodeURIComponent(plot.id) + '">Открыть участок</a>' +
        '  <a class="btn btn-accent" href="invest.html?plot=' + encodeURIComponent(plot.id) + '">Подать заявку</a>' +
        '</div>';
    }

    function render() {
      const filtered = getAllPlots().filter(function (plot) { return filterMatch(plot, filters()); });
      board.innerHTML = '';
      list.innerHTML = '';

      if (!filtered.length) {
        list.innerHTML = '<div class="empty-state">По фильтрам ничего не найдено.</div>';
        if (preview) preview.innerHTML = '<div class="empty-state">Выберите другие фильтры.</div>';
        return;
      }

      filtered.forEach(function (plot, index) {
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = 'map-marker';
        marker.style.left = plot.x + '%';
        marker.style.top = plot.y + '%';
        marker.style.background = statusMeta(plot.status).color;
        marker.title = plot.title;
        marker.addEventListener('click', function () { showPreview(plot); });
        board.appendChild(marker);

        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = '' +
          '<strong>' + escapeHtml(plot.id + ' · ' + plot.title) + '</strong>' +
          '<span class="muted">' + escapeHtml(formatMoney(plot.price, plot.currency) + ' · ROI ' + plot.roi + '%') + '</span>' +
          statusBadge(plot.status);
        item.querySelector('strong').addEventListener('click', function () {
          location.href = 'plot.html?id=' + encodeURIComponent(plot.id);
        });
        list.appendChild(item);

        if (index === 0) showPreview(plot);
      });
    }

    ['mapPurpose', 'mapPrice', 'mapStatus', 'mapRisk'].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) node.addEventListener('change', render);
    });

    renderLegend();
    render();
  }

  function initCatalogPage() {
    const grid = document.getElementById('catalogGrid');
    const compareBar = document.getElementById('compareBar');
    const compareList = document.getElementById('compareList');
    if (!grid) return;

    fillSelect('catPurpose', getPurposeOptions(), function (v) { return v === 'all' ? 'Любое назначение' : v; });
    fillSelect('catPrice', (data.pricePresets || []).map(function (p) { return p.key; }), function (v) {
      const preset = (data.pricePresets || []).find(function (p) { return p.key === v; });
      return preset ? preset.label : v;
    });

    function currentFilters() {
      return {
        purpose: document.getElementById('catPurpose').value,
        price: document.getElementById('catPrice').value,
        status: document.getElementById('catStatus').value,
        risk: document.getElementById('catRisk').value
      };
    }

    function sortItems(items) {
      const mode = document.getElementById('catSort').value;
      const copy = items.slice();
      if (mode === 'roi_desc') copy.sort(function (a, b) { return b.roi - a.roi; });
      if (mode === 'price_asc') copy.sort(function (a, b) { return a.price - b.price; });
      if (mode === 'price_desc') copy.sort(function (a, b) { return b.price - a.price; });
      if (mode === 'risk_asc') copy.sort(function (a, b) { return a.riskScore - b.riskScore; });
      return copy;
    }

    function renderCompareBar() {
      const selected = getCompare();
      if (!selected.length) {
        compareBar.classList.add('hidden');
      } else {
        compareBar.classList.remove('hidden');
        compareList.textContent = selected.join(', ');
      }
    }

    function render() {
      const filtered = sortItems(getAllPlots().filter(function (plot) {
        return filterMatch(plot, currentFilters());
      }));

      grid.innerHTML = filtered.length ? filtered.map(buildPlotCard).join('') : '<div class="empty-state">Нет объектов по выбранным фильтрам.</div>';
      renderCompareBar();
    }

    document.getElementById('compareOpen').addEventListener('click', function () {
      const ids = getCompare();
      const rows = getAllPlots().filter(function (plot) { return ids.includes(plot.id); });
      const body = document.getElementById('compareModalBody');
      if (!rows.length) {
        notify('Добавьте участки в сравнение.');
        return;
      }
      body.innerHTML = rows.map(function (plot) {
        return '' +
          '<div class="card">' +
          '  <h4>' + escapeHtml(plot.id + ' · ' + plot.title) + '</h4>' +
          '  <div class="metric-line"><span>Цена</span><strong>' + escapeHtml(formatMoney(plot.price, plot.currency)) + '</strong></div>' +
          '  <div class="metric-line"><span>Площадь</span><strong>' + escapeHtml(plot.area + ' га') + '</strong></div>' +
          '  <div class="metric-line"><span>ROI</span><strong>' + escapeHtml(plot.roi + '%') + '</strong></div>' +
          '  <div class="metric-line"><span>Риск</span><strong>' + escapeHtml(plot.riskScore + '/100') + '</strong></div>' +
          '  <div class="metric-line"><span>Юр. уровень</span><strong>' + escapeHtml(legalLabel(plot.legalGrade)) + '</strong></div>' +
          '</div>';
      }).join('');
      document.getElementById('compareModal').classList.remove('hidden');
    });

    document.getElementById('compareClose').addEventListener('click', function () {
      document.getElementById('compareModal').classList.add('hidden');
    });

    document.getElementById('compareClear').addEventListener('click', function () {
      setCompare([]);
      render();
      notify('Сравнение очищено.');
    });

    ['catPurpose', 'catPrice', 'catStatus', 'catRisk', 'catSort'].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) node.addEventListener('change', render);
    });

    render();
  }

  function initPlotPage() {
    const query = new URLSearchParams(location.search);
    const selectedId = query.get('id');
    const plot = getAllPlots().find(function (x) { return x.id === selectedId; }) || getAllPlots()[0];
    if (!plot) return;

    const title = document.getElementById('plotTitle');
    const subtitle = document.getElementById('plotSubtitle');
    const badges = document.getElementById('plotBadges');
    const metrics = document.getElementById('plotMetrics');
    const docs = document.getElementById('plotDocs');
    const timeline = document.getElementById('plotTimeline');
    const riskNode = document.getElementById('aiRiskScore');
    const similar = document.getElementById('similarPlots');

    if (title) title.textContent = plot.title;
    if (subtitle) subtitle.textContent = plot.id + ' · ' + plot.district + ' · ' + plot.purpose;
    if (badges) badges.innerHTML = statusBadge(plot.status) + ' <span class="badge">' + escapeHtml(legalLabel(plot.legalGrade)) + '</span>';

    if (metrics) {
      metrics.innerHTML = '' +
        '<div class="metric-line"><span class="muted">Цена</span><strong>' + escapeHtml(formatMoney(plot.price, plot.currency)) + '</strong></div>' +
        '<div class="metric-line"><span class="muted">Площадь</span><strong>' + escapeHtml(plot.area + ' га') + '</strong></div>' +
        '<div class="metric-line"><span class="muted">ROI</span><strong>' + escapeHtml(plot.roi + '%') + '</strong></div>' +
        '<div class="metric-line"><span class="muted">IRR</span><strong>' + escapeHtml(plot.irr + '%') + '</strong></div>' +
        '<div class="metric-line"><span class="muted">Риск</span><strong>' + escapeHtml(plot.riskScore + '/100') + '</strong></div>' +
        '<div class="metric-line"><span class="muted">Удаленность</span><strong>' + escapeHtml(plot.distanceCenterKm + ' км') + '</strong></div>';
    }

    if (docs) docs.innerHTML = (plot.docs || []).map(function (d) { return '<li>' + escapeHtml(d) + '</li>'; }).join('');
    if (timeline) timeline.innerHTML = (plot.timeline || []).map(function (d) { return '<li>' + escapeHtml(d) + '</li>'; }).join('');

    if (riskNode) {
      if (plot.riskScore <= 30) riskNode.textContent = 'Низкий риск. Рекомендуется стандартный due diligence.';
      if (plot.riskScore > 30 && plot.riskScore <= 45) riskNode.textContent = 'Средний риск. Проверьте сроки инженерных подключений и рыночный сценарий.';
      if (plot.riskScore > 45) riskNode.textContent = 'Высокий риск. Нужна углубленная юридическая проверка и стресс-тест финансовой модели.';
    }

    const investBtn = document.getElementById('plotInvestBtn');
    if (investBtn) investBtn.href = 'invest.html?plot=' + encodeURIComponent(plot.id);

    if (similar) {
      const related = getAllPlots().filter(function (x) { return x.id !== plot.id && x.purpose === plot.purpose; }).slice(0, 3);
      similar.innerHTML = related.length ? related.map(buildPlotCard).join('') : '<div class="empty-state">Похожие участки не найдены.</div>';
    }

    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(function (x) { x.classList.remove('active'); });
        document.querySelectorAll('.tab-pane').forEach(function (x) { x.classList.remove('active'); });
        btn.classList.add('active');
        const pane = document.querySelector('.tab-pane[data-tab="' + tab + '"]');
        if (pane) pane.classList.add('active');
      });
    });
  }

  function initInvestPage() {
    const form = document.getElementById('investForm');
    if (!form) return;

    const query = new URLSearchParams(location.search);
    const plotId = query.get('plot');
    const select = document.getElementById('investPlot');
    const result = document.getElementById('investResult');

    select.innerHTML = getAllPlots().filter(function (p) { return p.status !== 'sold'; }).map(function (p) {
      const selected = p.id === plotId ? 'selected' : '';
      return '<option value="' + escapeHtml(p.id) + '" ' + selected + '>' + escapeHtml(p.id + ' · ' + p.title) + '</option>';
    }).join('');

    let step = 0;
    const steps = Array.from(document.querySelectorAll('.step'));
    const panes = Array.from(document.querySelectorAll('.step-pane'));

    function showStep(index) {
      step = index;
      steps.forEach(function (node, i) { node.classList.toggle('active', i <= step); });
      panes.forEach(function (node, i) { node.classList.toggle('active', i === step); });
      document.getElementById('investPrev').classList.toggle('hidden', step === 0);
      document.getElementById('investNext').classList.toggle('hidden', step === panes.length - 1);
      document.getElementById('investSubmit').classList.toggle('hidden', step !== panes.length - 1);
    }

    document.getElementById('investNext').addEventListener('click', function () {
      showStep(Math.min(step + 1, panes.length - 1));
    });

    document.getElementById('investPrev').addEventListener('click', function () {
      showStep(Math.max(step - 1, 0));
    });

    document.getElementById('saveDraft').addEventListener('click', function () {
      notify('Черновик заявки сохранен.');
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const payload = {
        id: 'APP-' + Math.floor(Math.random() * 90000 + 10000),
        createdAt: new Date().toISOString(),
        status: 'На проверке',
        plotId: document.getElementById('investPlot').value,
        name: document.getElementById('investName').value,
        investorType: document.getElementById('investType').value,
        amount: Number(document.getElementById('investAmount').value || 0),
        phone: document.getElementById('investPhone').value,
        email: document.getElementById('investEmail').value,
        sourceOfFunds: document.getElementById('investSource').value
      };
      const items = getApplications();
      items.unshift(payload);
      setApplications(items);

      result.classList.remove('hidden');
      result.innerHTML = '' +
        '<strong>Заявка ' + escapeHtml(payload.id) + ' отправлена.</strong>' +
        '<p>Статус: ' + escapeHtml(payload.status) + '. Проверка KYC/AML стартовала.</p>' +
        '<a class="btn btn-primary" href="investor-cabinet.html">Перейти в кабинет инвестора</a>';

      form.reset();
      showStep(0);
    });

    showStep(0);
  }

  function aiResponse(text) {
    const q = text.toLowerCase();
    if (q.includes('roi') || q.includes('доход')) {
      const top = getAllPlots().filter(function (x) { return x.status === 'available'; }).sort(function (a, b) { return b.roi - a.roi; }).slice(0, 2);
      return top.length ? 'Лидеры по ROI: ' + top.map(function (x) { return x.id + ' (' + x.roi + '%)'; }).join(', ') + '.' : 'Сейчас нет доступных участков.';
    }
    if (q.includes('риск')) {
      const low = getAllPlots().filter(function (x) { return x.riskScore <= 30 && x.status === 'available'; }).map(function (x) { return x.id; }).slice(0, 3);
      return low.length ? 'Низкий риск у: ' + low.join(', ') + '. Проверьте юридический блок перед сделкой.' : 'Низкорисковые участки временно недоступны.';
    }
    if (q.includes('логист')) {
      const items = getAllPlots().filter(function (x) { return String(x.purpose).toLowerCase().includes('логист'); });
      return items.length ? 'Для логистики подходят: ' + items.map(function (x) { return x.id + ' (' + formatMoney(x.price, x.currency) + ')'; }).join(', ') : 'Подходящих логистических лотов пока нет.';
    }
    if (q.includes('добавить') || q.includes('разместить')) {
      return 'Собственник проходит 4 шага: данные участка, документы, тариф, модерация. Я могу подсказать оптимальный тариф.';
    }
    return 'Уточните бюджет, риск-профиль и горизонт инвестирования. Подберу объекты и покажу сравнение.';
  }

  function initAIPage() {
    const chat = document.getElementById('aiChat');
    const input = document.getElementById('aiInput');
    const send = document.getElementById('aiSend');
    if (!chat || !input || !send) return;

    const history = readStorage(STORAGE_KEYS.aiHistory, []);

    function push(role, text) {
      history.push({ role: role, text: text });
      writeStorage(STORAGE_KEYS.aiHistory, history);
    }

    function render() {
      chat.innerHTML = history.map(function (msg) {
        return '<div class="bubble ' + msg.role + '">' + escapeHtml(msg.text) + '</div>';
      }).join('');
      chat.scrollTop = chat.scrollHeight;
    }

    function onSend(text) {
      if (!text.trim()) return;
      push('user', text.trim());
      push('ai', aiResponse(text));
      render();
    }

    if (!history.length) {
      push('ai', 'Здравствуйте. Я AI-ассистент платформы. Опишите вашу инвестиционную цель.');
    }

    send.addEventListener('click', function () {
      onSend(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        send.click();
      }
    });

    document.querySelectorAll('[data-prompt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        onSend(btn.getAttribute('data-prompt'));
      });
    });

    render();
  }

  function initInvestorCabinetPage() {
    const apps = getApplications();
    const favIds = getFavorites();
    const plots = getAllPlots();

    const kpi = document.getElementById('investorKpi');
    if (kpi) {
      const sum = apps.reduce(function (s, a) { return s + Number(a.amount || 0); }, 0);
      kpi.innerHTML = '' +
        '<div class="kpi"><span class="muted">Заявок</span><strong>' + apps.length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Pipeline</span><strong>' + escapeHtml(formatMoney(sum, 'USD')) + '</strong></div>' +
        '<div class="kpi"><span class="muted">Избранных участков</span><strong>' + favIds.length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Ожидают проверки</span><strong>' + apps.filter(function (x) { return x.status === 'На проверке'; }).length + '</strong></div>';
    }

    const table = document.getElementById('appTableBody');
    if (table) {
      table.innerHTML = apps.length ? apps.map(function (app) {
        return '' +
          '<tr>' +
          '<td>' + escapeHtml(app.id) + '</td>' +
          '<td>' + escapeHtml(app.plotId) + '</td>' +
          '<td>' + escapeHtml(app.investorType) + '</td>' +
          '<td>' + escapeHtml(formatMoney(app.amount, 'USD')) + '</td>' +
          '<td>' + escapeHtml(app.status) + '</td>' +
          '<td>' + escapeHtml(new Date(app.createdAt).toLocaleDateString('ru-RU')) + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="6">Пока нет заявок.</td></tr>';
    }

    const favGrid = document.getElementById('favoriteGrid');
    if (favGrid) {
      const favPlots = plots.filter(function (x) { return favIds.includes(x.id); });
      favGrid.innerHTML = favPlots.length ? favPlots.map(buildPlotCard).join('') : '<div class="empty-state">Нет избранных участков.</div>';
    }
  }

  function initOwnerCabinetPage() {
    const demo = {
      id: 'OWN-900',
      title: 'Owner Prime Corner',
      district: 'Central Arc',
      area: 1.6,
      price: 305000,
      currency: 'USD',
      roi: 15.1,
      riskScore: 36,
      legalGrade: 'b',
      status: 'moderation'
    };
    const list = [demo].concat(getOwnerPlots());

    const body = document.getElementById('ownerPlotsBody');
    if (body) {
      body.innerHTML = list.length ? list.map(function (plot) {
        const views = 120 + Math.round((plot.area || 1) * 40);
        const leads = Math.max(1, Math.round((plot.roi || 10) / 4));
        return '' +
          '<tr>' +
          '<td>' + escapeHtml(plot.id) + '</td>' +
          '<td>' + escapeHtml(plot.title) + '</td>' +
          '<td>' + escapeHtml(formatMoney(plot.price, plot.currency)) + '</td>' +
          '<td>' + statusBadge(plot.status) + '</td>' +
          '<td>' + views + '</td>' +
          '<td>' + leads + '</td>' +
          '<td><a class="btn btn-ghost" href="plot.html?id=' + encodeURIComponent(plot.id) + '">Открыть</a></td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="7">Нет участков.</td></tr>';
    }

    const plan = getOwnerPlan();
    const badge = document.getElementById('ownerPlanBadge');
    if (badge) badge.textContent = plan ? 'Тариф: ' + plan.name + ' до ' + plan.until : 'Тариф не подключен';

    const hint = document.getElementById('ownerQualityHint');
    if (hint) {
      const moderationCount = list.filter(function (x) { return x.status === 'moderation'; }).length;
      hint.textContent = moderationCount ? 'Есть лоты на модерации. Дозагрузите документы для ускорения публикации.' : 'Все лоты обработаны, можно масштабировать продвижение.';
    }
  }

  function scoreForm(fd) {
    let score = 0;
    ['title', 'cadastral', 'district', 'purpose', 'area', 'price', 'legalOwner', 'description'].forEach(function (f) {
      if (fd.get(f)) score += 10;
    });
    if (fd.get('hasUtilities') === 'yes') score += 10;
    if (fd.get('documents')) score += 10;
    return Math.min(100, score);
  }

  function initAddPlotPage() {
    const form = document.getElementById('ownerAddForm');
    if (!form) return;

    const scoreNode = document.getElementById('qualityScore');
    const result = document.getElementById('ownerAddResult');

    function recalc() {
      scoreNode.textContent = String(scoreForm(new FormData(form)));
    }

    form.addEventListener('input', recalc);
    document.getElementById('ownerSaveDraft').addEventListener('click', function () { notify('Черновик сохранен.'); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const fd = new FormData(form);
      const score = scoreForm(fd);
      const id = 'OWN-' + Math.floor(Math.random() * 9000 + 1000);
      const item = {
        id: id,
        title: fd.get('title') || 'Новый участок',
        district: fd.get('district') || 'Не указан',
        purpose: fd.get('purpose') || 'Коммерция',
        area: Number(fd.get('area') || 1),
        price: Number(fd.get('price') || 100000),
        currency: 'USD',
        roi: Number(fd.get('roi') || 12),
        irr: Number(fd.get('irr') || 15),
        riskScore: score >= 80 ? 34 : 48,
        legalGrade: score >= 80 ? 'b' : 'c',
        status: 'moderation',
        x: Math.floor(Math.random() * 75 + 10),
        y: Math.floor(Math.random() * 70 + 15),
        distanceCenterKm: Number(fd.get('distance') || 9),
        docs: ['Пакет владельца'],
        timeline: ['Ожидание модерации'],
        tags: ['Self-service'],
        ownerType: fd.get('legalOwner') || 'Физ. лицо',
        updatedAt: new Date().toISOString().slice(0, 10)
      };

      const items = getOwnerPlots();
      items.unshift(item);
      setOwnerPlots(items);

      result.classList.remove('hidden');
      result.innerHTML = '' +
        '<strong>Участок ' + escapeHtml(id) + ' отправлен на модерацию.</strong>' +
        '<p>Качество карточки: ' + score + '/100.</p>' +
        '<a class="btn btn-primary" href="owner-cabinet.html">Открыть кабинет владельца</a>';
      form.reset();
      recalc();
    });

    recalc();
  }

  function initPricingPage() {
    const cards = Array.from(document.querySelectorAll('[data-plan]'));
    const selectedName = document.getElementById('selectedPlanName');
    const form = document.getElementById('planPaymentForm');
    const result = document.getElementById('planResult');
    let selected = null;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (x) { x.style.outline = ''; });
        card.style.outline = '2px solid #0f5a73';
        selected = { name: card.getAttribute('data-plan'), price: card.getAttribute('data-price') };
        selectedName.textContent = selected.name + ' · ' + selected.price + ' USD';
      });
    });

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!selected) {
          notify('Сначала выберите тариф.');
          return;
        }
        const date = new Date();
        const until = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        setOwnerPlan({ name: selected.name, price: selected.price, paidAt: date.toISOString(), until: until });
        result.classList.remove('hidden');
        result.innerHTML = '<strong>Тариф активирован: ' + escapeHtml(selected.name) + '</strong><p>Действует до ' + escapeHtml(until) + '.</p>';
      });
    }
  }

  function initNewsPage() {
    const grid = document.getElementById('newsGrid');
    const select = document.getElementById('newsCategory');
    if (!grid || !select) return;

    const categories = ['Все'].concat(Array.from(new Set((data.news || []).map(function (n) { return n.category; }))));
    select.innerHTML = categories.map(function (cat) { return '<option value="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</option>'; }).join('');

    function render() {
      const value = select.value;
      const items = (data.news || []).filter(function (n) { return value === 'Все' || n.category === value; });
      grid.innerHTML = items.length ? items.map(function (n) {
        return '' +
          '<article class="card">' +
          '<span class="badge">' + escapeHtml(n.category) + '</span>' +
          '<h3 class="card-title" style="margin-top:8px">' + escapeHtml(n.title) + '</h3>' +
          '<p class="muted">' + escapeHtml(new Date(n.date).toLocaleDateString('ru-RU')) + '</p>' +
          '<p style="margin-top:8px">' + escapeHtml(n.excerpt) + '</p>' +
          '<div class="plot-actions" style="margin-top:12px"><a class="btn btn-ghost" href="catalog.html">Смотреть связанные участки</a></div>' +
          '</article>';
      }).join('') : '<div class="empty-state">По этой категории публикаций нет.</div>';
    }

    select.addEventListener('change', render);
    render();
  }

  function initFaqPage() {
    const search = document.getElementById('faqSearch');
    const list = document.getElementById('faqList');
    if (!search || !list) return;

    function render() {
      const term = search.value.toLowerCase();
      const items = (data.faqs || []).filter(function (f) {
        return f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term);
      });

      list.innerHTML = items.length ? items.map(function (item, i) {
        return '' +
          '<article class="card">' +
          '  <button type="button" class="btn btn-ghost" style="width:100%;justify-content:space-between" data-faq-open="' + i + '">' +
          '    <span>' + escapeHtml(item.q) + '</span><span>+</span>' +
          '  </button>' +
          '  <p class="muted hidden" id="faqAnswer' + i + '" style="margin-top:10px">' + escapeHtml(item.a) + '</p>' +
          '</article>';
      }).join('') : '<div class="empty-state">Ответов не найдено.</div>';

      list.querySelectorAll('[data-faq-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-faq-open');
          const answer = document.getElementById('faqAnswer' + id);
          if (answer) answer.classList.toggle('hidden');
        });
      });
    }

    search.addEventListener('input', render);
    render();
  }

  function initLegalPage() {
    const btn = document.getElementById('legalAcceptBtn');
    const status = document.getElementById('legalStatus');
    if (!btn || !status) return;

    function renderStatus() {
      const saved = readStorage(STORAGE_KEYS.legalAccept, null);
      status.textContent = saved ? 'Согласие зафиксировано: ' + new Date(saved.acceptedAt).toLocaleString('ru-RU') : 'Согласие не зафиксировано.';
    }

    btn.addEventListener('click', function () {
      const checks = Array.from(document.querySelectorAll('[data-legal-check]'));
      const allChecked = checks.every(function (ch) { return ch.checked; });
      if (!allChecked) {
        notify('Подтвердите все обязательные согласия.');
        return;
      }
      writeStorage(STORAGE_KEYS.legalAccept, { acceptedAt: new Date().toISOString(), version: '2026.03.1' });
      renderStatus();
      notify('Юридические согласия сохранены.');
    });

    renderStatus();
  }

  function initContactsPage() {
    const form = document.getElementById('contactForm');
    const result = document.getElementById('contactResult');
    if (!form || !result) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const ticket = 'T-' + Math.floor(Math.random() * 90000 + 10000);
      result.classList.remove('hidden');
      result.innerHTML = '<strong>Заявка ' + ticket + ' зарегистрирована.</strong><p>Ответим в течение 2 часов.</p>';
      form.reset();
    });
  }

  function updateOwnerPlotStatus(id, status) {
    const items = getOwnerPlots();
    let changed = false;
    const next = items.map(function (item) {
      if (item.id === id) {
        changed = true;
        return Object.assign({}, item, { status: status, updatedAt: new Date().toISOString().slice(0, 10) });
      }
      return item;
    });
    if (changed) setOwnerPlots(next);
    return changed;
  }

  function initAdminPage() {
    const body = document.getElementById('adminQueueBody');
    const kpi = document.getElementById('adminKpi');
    if (!body || !kpi) return;

    function render() {
      const all = getAllPlots();
      const queue = all.filter(function (x) { return x.status === 'moderation' || x.status === 'legal_issue'; });
      kpi.innerHTML = '' +
        '<div class="kpi"><span class="muted">Очередь модерации</span><strong>' + queue.length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Self-service лотов</span><strong>' + getOwnerPlots().length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Заявки инвесторов</span><strong>' + getApplications().length + '</strong></div>' +
        '<div class="kpi"><span class="muted">Юр. инциденты</span><strong>' + all.filter(function (x) { return x.status === 'legal_issue'; }).length + '</strong></div>';

      if (!queue.length) {
        body.innerHTML = '<tr><td colspan="8">Очередь пустая.</td></tr>';
        return;
      }

      body.innerHTML = queue.map(function (plot) {
        const editable = plot.id.indexOf('OWN-') === 0;
        return '' +
          '<tr>' +
          '<td>' + escapeHtml(plot.id) + '</td>' +
          '<td>' + escapeHtml(plot.title) + '</td>' +
          '<td>' + escapeHtml(plot.ownerType || 'Не указан') + '</td>' +
          '<td>' + escapeHtml(legalLabel(plot.legalGrade)) + '</td>' +
          '<td>' + statusBadge(plot.status) + '</td>' +
          '<td>' + escapeHtml(plot.updatedAt || '-') + '</td>' +
          '<td>' +
          '  <select data-admin-status="' + escapeHtml(plot.id) + '">' +
          '    <option value="moderation">На модерации</option>' +
          '    <option value="available">Одобрить</option>' +
          '    <option value="legal_issue">Юр. ограничение</option>' +
          '    <option value="reserved">Забронировать</option>' +
          '    <option value="sold">Закрыть</option>' +
          '  </select>' +
          '</td>' +
          '<td>' + (editable ? '<button class="btn btn-primary" data-admin-save="' + escapeHtml(plot.id) + '">Сохранить</button>' : '<span class="muted">Только чтение</span>') + '</td>' +
          '</tr>';
      }).join('');

      body.querySelectorAll('[data-admin-save]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-admin-save');
          const select = body.querySelector('[data-admin-status="' + id + '"]');
          if (!select) return;
          if (updateOwnerPlotStatus(id, select.value)) {
            notify('Статус ' + id + ' обновлен.');
            render();
          } else {
            notify('Демо-лот недоступен для изменения.');
          }
        });
      });
    }

    render();
  }

  function rerenderSimplePages() {
    const page = document.body.getAttribute('data-page');
    if (page === 'home') initHomePage();
    if (page === 'catalog') initCatalogPage();
    if (page === 'plot') initPlotPage();
    if (page === 'investor') initInvestorCabinetPage();
  }

  function initGlobalActions() {
    document.body.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');
      if (!action || !id) return;

      if (action === 'favorite') {
        event.preventDefault();
        const fav = getFavorites();
        if (fav.includes(id)) {
          setFavorites(fav.filter(function (x) { return x !== id; }));
          notify('Удалено из избранного.');
        } else {
          fav.push(id);
          setFavorites(Array.from(new Set(fav)));
          notify('Добавлено в избранное.');
        }
        updateHeaderCounters();
        rerenderSimplePages();
      }

      if (action === 'compare') {
        event.preventDefault();
        const cmp = getCompare();
        if (cmp.includes(id)) {
          setCompare(cmp.filter(function (x) { return x !== id; }));
          notify('Удалено из сравнения.');
        } else {
          if (cmp.length >= 4) {
            notify('Максимум 4 участка в сравнении.');
            return;
          }
          cmp.push(id);
          setCompare(Array.from(new Set(cmp)));
          notify('Добавлено в сравнение.');
        }
        rerenderSimplePages();
      }
    });
  }

  function initByPage() {
    const page = document.body.getAttribute('data-page');
    if (page === 'home') initHomePage();
    if (page === 'map') initMapPage();
    if (page === 'catalog') initCatalogPage();
    if (page === 'plot') initPlotPage();
    if (page === 'invest') initInvestPage();
    if (page === 'ai') initAIPage();
    if (page === 'investor') initInvestorCabinetPage();
    if (page === 'owner') initOwnerCabinetPage();
    if (page === 'add-plot') initAddPlotPage();
    if (page === 'pricing') initPricingPage();
    if (page === 'news') initNewsPage();
    if (page === 'faq') initFaqPage();
    if (page === 'legal') initLegalPage();
    if (page === 'contacts') initContactsPage();
    if (page === 'admin') initAdminPage();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHeaderFooter();
    applyTranslations();
    initGlobalActions();
    initByPage();
  });
})();
