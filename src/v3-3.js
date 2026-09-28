  function openSheet(id) { $('#' + id).classList.add('open'); }
  function closeSheet(id) { $('#' + id).classList.remove('open'); if (id === 'sh-vinfo' && S.vSel) { S.vSel = null; if (current === 'vendor-kart') renderVendorMap(); } }

  /* ===== TEMA ===== */
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(function (b) { b.textContent = t === 'dark' ? '☀️' : '🌙'; b.setAttribute('aria-label', t === 'dark' ? 'Bytt til lys modus' : 'Bytt til mørk modus'); }); }
  function toggleTheme() { var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('messekart-theme', t); } catch (e) {} applyTheme(t); }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) { var saved = null; try { saved = localStorage.getItem('messekart-theme'); } catch (x) {} if (!saved) applyTheme(e.matches ? 'dark' : 'light'); });
  $$('.screen').forEach(function (sc) {
    var bar = document.createElement('header'); bar.className = 'topbar';
    bar.innerHTML = (sc.getAttribute('data-back') ? '<button class="icon-btn" data-back aria-label="Tilbake">←</button>' : '<span style="width:4px"></span>') +
      '<div class="t"><b data-t>' + esc(sc.getAttribute('data-title')) + '</b><small data-sub>' + esc(sc.getAttribute('data-sub')) + '</small></div>' +
      '<span class="demo-badge">Eksempeldata</span><button class="icon-btn" data-theme-btn></button>';
    sc.insertBefore(bar, sc.firstChild);
  });
  applyTheme(document.documentElement.getAttribute('data-theme'));

  /* ===== KART (SVG) ===== */
  function door(x, y, orient, label, lx, ly) {
    var s = '';
    if (orient === 'h') s += '<line class="doorgap" x1="' + (x - 22) + '" y1="' + y + '" x2="' + (x + 22) + '" y2="' + y + '"/><path class="door" d="M' + (x - 22) + ',' + y + ' a22,22 0 0,1 22,-22 M' + (x + 22) + ',' + y + ' a22,22 0 0,0 -22,-22"/>';
    else s += '<line class="doorgap" x1="' + x + '" y1="' + (y - 22) + '" x2="' + x + '" y2="' + (y + 22) + '"/><path class="door" d="M' + x + ',' + (y - 22) + ' a22,22 0 0,1 22,22 M' + x + ',' + (y + 22) + ' a22,22 0 0,0 22,-22"/>';
    return s + '<text class="door-l" x="' + lx + '" y="' + ly + '" text-anchor="middle">' + label + '</text>';
  }
  function zone(x, y, w, h, label) {
    var lines = label.split('|'), s = '<rect class="zone" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4"/>';
    lines.forEach(function (ln, i) { s += '<text class="zone-l" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4 + (i - (lines.length - 1) / 2) * 12) + '" text-anchor="middle">' + ln + '</text>'; });
    return s;
  }
  // o: { own, selected, target, clickable, pickAll, route, you:[x,y] }
  function mapSVG(o) {
    var W = 640, H = 500, z = S.zoom;
    var s = '<svg class="svg-map" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.round(W * z) + '" height="' + Math.round(H * z) + '" role="img" aria-label="Hallkart Oslo TCG Show">';
    s += '<rect class="floor" width="' + W + '" height="' + H + '"/><rect class="wall" x="20" y="16" width="600" height="458" rx="2"/>';
    s += zone(470, 34, 136, 80, 'SCENE') + zone(470, 132, 136, 46, 'INFO /|ARRANGØR') + zone(546, 250, 60, 76, 'WC') + zone(34, 404, 150, 56, 'TRADE|CORNER') + zone(380, 404, 226, 56, 'MAT / KAFÉ');
    s += door(273, 474, 'h', 'HOVEDINNGANG', 273, 492) + door(20, 228, 'v', 'UTGANG', 44, 262);
    s += '<line class="doorgap" x1="620" y1="368" x2="620" y2="412"/><path class="door" d="M620,368 a22,22 0 0,0 -22,22 M620,412 a22,22 0 0,1 -22,-22"/><text class="door-l" x="604" y="360" text-anchor="end">NØDUTGANG</text>';
    BLOCKS.forEach(function (b) { s += '<rect class="block" x="' + b.bx + '" y="' + b.by + '" width="' + BS + '" height="' + BS + '" rx="3"/><text class="block-l" x="' + (b.bx + BS / 2) + '" y="' + (b.by + BS / 2 + 5) + '" text-anchor="middle">' + b.start + '–' + (b.start + 11) + '</text>'; });
    s += '<text class="block-l" x="264" y="60" text-anchor="middle" style="font-size:9px">49–58 · VEGGBORD</text>';
    ALL_TABLES.forEach(function (n) {
      var t = TABLES[n], v = vByBooth(n), cls = 'tb';
      if (isActive(v)) cls += ' v';
      if (o.own === n || o.target === n) cls += ' hl';
      if (o.selected === n) cls += ' sel';
      if (o.pickAll || (o.clickable && isActive(v))) cls += ' click';
      s += '<g class="' + cls + '" data-booth="' + n + '"><title>Bord ' + n + (isActive(v) ? ' – ' + esc(v.name) : ' – ledig') + '</title><rect x="' + t.x + '" y="' + t.y + '" width="' + t.w + '" height="' + t.h + '" rx="1.5"/><text x="' + (t.x + t.w / 2) + '" y="' + (t.y + t.h / 2 + 2.5) + '" text-anchor="middle">' + n + '</text></g>';
    });
    if (o.route) { var pts = o.route.pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); s += '<polyline class="route-bg" points="' + pts + '"/><polyline class="route" id="route-line" points="' + pts + '"/>'; }
    if (o.target) { var h = TABLES[o.target]; s += '<circle class="pulse" cx="' + (h.x + h.w / 2) + '" cy="' + (h.y + h.h / 2) + '" r="14"><animate attributeName="r" values="12;24;12" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.15;1" dur="1.6s" repeatCount="indefinite"/></circle>'; }
    if (o.selected) { var q = TABLES[o.selected]; s += '<rect class="sel-ring" x="' + (q.x - 4) + '" y="' + (q.y - 4) + '" width="' + (q.w + 8) + '" height="' + (q.h + 8) + '" rx="4"/>'; }
    if (o.you) {
      var y = o.you;
      s += '<circle class="you" id="you-dot" cx="' + y[0] + '" cy="' + y[1] + '" r="7"/>';
      s += '<text class="you-l" x="' + (y[0] > 400 ? y[0] - 11 : y[0] + 11) + '" y="' + (y[1] + 4) + '" text-anchor="' + (y[0] > 400 ? 'end' : 'start') + '">Du er her</text>';
    }
    return s + '</svg>';
  }
  function centerOn(sc, pts) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var cx = (Math.min.apply(0, xs) + Math.max.apply(0, xs)) / 2, cy = (Math.min.apply(0, ys) + Math.max.apply(0, ys)) / 2;
    sc.scrollLeft = Math.max(0, cx * S.zoom - sc.clientWidth / 2); sc.scrollTop = Math.max(0, cy * S.zoom - sc.clientHeight / 2);
  }
  function tc(n) { var t = TABLES[n]; return [t.x + t.w / 2, t.y + t.h / 2]; }

  /* ===== NAVIGASJON ===== */
  var current = 'start';
  function go(h) { if (location.hash === '#' + h) render(); else location.hash = h; }
  function render() {
    var h = (location.hash || '#start').slice(1).split('/'), name = h[0] || 'start', arg = h[1] ? Number(h[1]) : null;
    if (!document.getElementById('s-' + name)) name = 'start';
    if (/^vendor-(home|kart|profil)$/.test(name) && !S.session) { go('vendor-login'); return; }
    if (current !== name) { $$('.sheet-bg.open').forEach(function (b) { b.classList.remove('open'); }); if (name !== 'vendor-kart') S.vSel = null; if (name !== 'kart') setPicking(false); }
    current = name;
    $$('.screen').forEach(function (s) { s.classList.remove('active'); });
    $('#s-' + name).classList.add('active');
    if (VIEWS[name]) VIEWS[name](arg);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
    if (e.target.closest('button[data-back]')) { var sc = e.target.closest('.screen'); go(sc.getAttribute('data-back-dyn') || sc.getAttribute('data-back')); return; }
    if (e.target.closest('[data-theme-btn]')) { toggleTheme(); return; }
    var cl = e.target.closest('[data-close]'); if (cl) { closeSheet(cl.closest('.sheet-bg').id); return; }
    if (e.target.classList && e.target.classList.contains('sheet-bg') && !e.target.classList.contains('peek')) { closeSheet(e.target.id); return; }
    var zb = e.target.closest('[data-zoom]');
    if (zb) { S.zoom = Math.min(2.4, Math.max(0.6, +(S.zoom + Number(zb.getAttribute('data-zoom')) * 0.3).toFixed(2))); if (current === 'vendor-kart') renderVendorMap(); else if (VIEWS[current]) VIEWS[current](S.target); }
  });

  function itemRow(it, opts) {
    var img = it.images && it.images.length ? '<img class="thumb" src="' + it.images[0] + '" alt="">' : '<div class="thumb ph">🃏</div>';
    var extra = '';
    if (opts.edit) extra = '<div class="acts"><button class="link-btn" data-edit="' + it.id + '">Rediger</button><button class="link-btn danger" data-del="' + it.id + '">Slett</button></div>';
    if (opts.links && it.link) extra += '<a class="ext" href="' + LINKS[it.link][1] + '" target="_blank" rel="noopener">Åpne på ' + LINKS[it.link][0] + ' ↗</a>';
    if (opts.allThumbs && it.images && it.images.length > 1) extra += '<div class="thumbs">' + it.images.slice(1).map(function (u) { return '<img src="' + u + '" alt="">'; }).join('') + '</div>';
    return '<div class="item">' + img + '<div class="body"><div class="nm">' + esc(it.name) + '</div><div class="cd">' + esc(condLine(it)) + '</div>' + extra + '</div><div class="pr">' + esc(price(it)) + '</div></div>';
  }
