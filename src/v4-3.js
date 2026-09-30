  /* ===== ark ===== */
  function openSheet(id) { $('#' + id).classList.add('open'); }
  function closeSheet(id) { $('#' + id).classList.remove('open'); }
  /* ===== tema ===== */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $$('[data-theme-btn]').forEach(function (b) { b.innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 16) + (t === 'dark' ? 'Lys' : 'Mørk'); });
  }
  function toggleTheme() { var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('messekart-theme', t); } catch (e) {} applyTheme(t); }
  $$('[data-ic]').forEach(function (e) { e.innerHTML = ic(e.getAttribute('data-ic')); });
  applyTheme(document.documentElement.getAttribute('data-theme'));

  /* ===== KART (SVG) – Fjellhamarhallen, forenklet utkast ===== */
  function zoneR(x0, y0, x1, y1, label) {
    return '<rect class="m-zone" x="' + X(x0) + '" y="' + Y(y0) + '" width="' + (x1 - x0) * U + '" height="' + (y1 - y0) * U + '"/>' +
      '<text class="m-zl" x="' + X((x0 + x1) / 2) + '" y="' + (Y((y0 + y1) / 2) + 5) + '">' + label + '</text>';
  }
  function doorSVG(xm, ym, orient, label) {
    var x = X(xm), y = Y(ym), s;
    if (orient === 'h') s = '<line x1="' + (x - 34) + '" y1="' + y + '" x2="' + (x + 34) + '" y2="' + y + '" stroke="var(--bg)" stroke-width="8"/>';
    else s = '<line x1="' + x + '" y1="' + (y - 34) + '" x2="' + x + '" y2="' + (y + 34) + '" stroke="var(--bg)" stroke-width="8"/>';
    return s;
  }
  function baseMap() {
    var s = '<rect class="m-page" width="' + MW + '" height="' + MH + '"/>';
    s += '<rect class="m-hall" x="' + X(0) + '" y="' + Y(0) + '" width="' + HW * U + '" height="' + HH * U + '"/>';
    s += zoneR(22, 0.7, 38, 4.4, 'SCENE') + zoneR(2.5, 0.7, 16, 4.4, 'KAFÉ') + zoneR(44, 0.7, 57.5, 4.4, 'ARRANGØR / INFO');
    s += zoneR(2.5, 33.2, 17, 38.6, 'KAFÉ / SITTEPLASS') + zoneR(43, 33.2, 51, 38.6, 'WC') + zoneR(35, 33.2, 42, 38.6, 'GARDEROBE');
    s += '<rect class="m-wall" x="' + X(0) + '" y="' + Y(0) + '" width="' + HW * U + '" height="' + HH * U + '"/>';
    s += doorSVG(30, 40, 'h') + doorSVG(0, 22, 'v') + doorSVG(60, 22, 'v') + doorSVG(30, 0, 'h');
    s += '<text class="m-door" x="' + X(30) + '" y="' + (Y(40) + 30) + '">INNGANG</text>';
    s += '<text class="m-door" x="' + (X(0) - 8) + '" y="' + (Y(22) + 62) + '" transform="rotate(-90 ' + (X(0) - 8) + ' ' + (Y(22) + 62) + ')" style="font-size:13px">UTGANG</text>';
    s += '<text class="m-door" x="' + (X(60) + 22) + '" y="' + (Y(22) + 62) + '" transform="rotate(-90 ' + (X(60) + 22) + ' ' + (Y(22) + 62) + ')" style="font-size:13px">UTGANG</text>';
    s += '<text class="m-door" x="' + X(30) + '" y="' + (Y(0) - 12) + '" style="font-size:13px">NØDUTGANG</text>';
    s += '<text class="m-dim" x="' + X(4) + '" y="' + (Y(0) - 26) + '" style="text-anchor:start">Fjellhamarhallen · 60 × 40 m · forenklet utkast</text>';
    var by = Y(40) + 62;
    s += '<path class="m-scale" d="M' + X(0) + ',' + (by - 6) + ' v12 M' + X(0) + ',' + by + ' h' + 10 * U + ' M' + X(10) + ',' + (by - 6) + ' v12"/><text class="m-dim" x="' + (X(0) + 5 * U) + '" y="' + (by - 12) + '">10 m</text>';
    return s;
  }
  var BASE = baseMap();
  // o: { zoom, own, selected, target, mode: 'buyer'|'vendor'|'pick', chosen, route, you:[x,y], fit }
  function mapSVG(o) {
    var s = '<svg class="svg-map" viewBox="0 0 ' + MW + ' ' + MH + '" width="' + MW + '" height="' + MH + '" role="img" aria-label="Forenklet plan av Fjellhamarhallen, 60 × 40 meter">' + BASE;
    var ly = Y(40) + 62;
    s += '<g class="m-tb v"><rect x="' + X(30) + '" y="' + (ly - 9) + '" width="22" height="16"/></g><text class="m-dim" x="' + (X(30) + 30) + '" y="' + (ly + 5) + '" style="text-anchor:start;font-size:14px">Vendor</text>';
    s += '<g class="m-tb"><rect x="' + X(37) + '" y="' + (ly - 9) + '" width="22" height="16"/></g><text class="m-dim" x="' + (X(37) + 30) + '" y="' + (ly + 5) + '" style="text-anchor:start;font-size:14px">Ledig</text>';
    s += '<g class="m-tb sel"><rect x="' + X(43) + '" y="' + (ly - 9) + '" width="22" height="16"/></g><text class="m-dim" x="' + (X(43) + 30) + '" y="' + (ly + 5) + '" style="text-anchor:start;font-size:14px">Valgt</text>';
    ALL_TABLES.forEach(function (n) {
      var t = TABLES[n], v = vByBooth(n), cls = 'm-tb';
      if (o.mode === 'pick') {
        if (reservedBy(n)) cls += ' taken'; else cls += ' click pick';
        if (o.chosen === n) cls += ' sel';
      } else {
        if (isActive(v)) cls += ' v';
        if (o.own === n) cls += ' own';
        if (o.selected === n || o.target === n) cls += ' sel';
        cls += ' click';
      }
      s += '<g class="' + cls + '" data-booth="' + n + '"><title>Bord ' + n + (isActive(v) ? ' – ' + esc(v.name) : ' – ledig') + '</title><rect x="' + t.x + '" y="' + t.y + '" width="' + t.w + '" height="' + t.h + '"/><text x="' + (t.x + t.w / 2) + '" y="' + (t.y + t.h / 2 + 6) + '">' + n + '</text></g>';
    });
    if (o.route) { var pts = o.route.pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); s += '<polyline class="m-route-c" points="' + pts + '"/><polyline class="m-route" id="route-line" points="' + pts + '"/>'; }
    if (o.target) { var h = TABLES[o.target]; s += '<rect x="' + (h.x - 4) + '" y="' + (h.y - 4) + '" width="' + (h.w + 8) + '" height="' + (h.h + 8) + '" fill="none" stroke="var(--ac)" stroke-width="3"/>'; }
    if (o.you) {
      var y = o.you, right = y[0] < MW - 260, lx = right ? y[0] + 16 : y[0] - 16 - 98;
      s += '<circle class="m-you-r" cx="' + y[0] + '" cy="' + y[1] + '" r="13"/><circle class="m-you" id="you-dot" cx="' + y[0] + '" cy="' + y[1] + '" r="9"/>';
      s += '<g class="m-youl"><rect x="' + lx + '" y="' + (y[1] - 14) + '" width="98" height="28" rx="3"/><text x="' + (lx + 49) + '" y="' + (y[1] + 5) + '">Du er her</text></g>';
    }
    return s + '</svg>';
  }
  /* Kartet tegnes i fast størrelse (MW x MH) og skaleres med CSS transform (.mz-t). Pan = vanlig scroll i .mapscroll. */
  var ZMIN = 0.25, ZMAX = 3;
  function clampZ(z) { return Math.min(ZMAX, Math.max(ZMIN, z)); }
  function mapInto(sc, html, panelEl, z, o) {
    o = o || {}; z = z || S.zoom;
    var ph = panelEl && panelEl.style.display !== 'none' ? panelEl.offsetHeight : 0, top = o.top == null ? 70 : o.top, bot = o.bottom == null ? ph + 10 : o.bottom;
    sc.innerHTML = '<div class="mz-pad" style="padding:' + top + 'px 0 ' + bot + 'px"><div class="mz-size" style="width:' + Math.round(MW * z) + 'px;height:' + Math.round(MH * z) + 'px"><div class="mz-t" style="width:' + MW + 'px;height:' + MH + 'px;transform:scale(' + z + ')">' + html + '</div></div></div>';
    sc.setAttribute('data-zoom', z.toFixed(3)); sc._top = top;
    updZoomBtns(sc, z);
  }
  function zoomOf(sc) { return sc._zget ? sc._zget() : S.zoom; }
  function updZoomBtns(sc, z) {
    var w = sc.closest('.mapwrap,.pickmap'); if (!w) return;
    $$('[data-zoom]', w).forEach(function (b) { var d = Number(b.getAttribute('data-zoom')), off = d > 0 ? z >= ZMAX - 1e-6 : z <= ZMIN + 1e-6; b.disabled = off; b.style.opacity = off ? '.4' : ''; });
  }
  // Setter zoom z slik at innholdspunktet (cx,cy) havner på skjermpunkt (fx,fy) relativt til .mapscroll. cx/cy utelatt => punktet som ligger der nå.
  function applyZoom(sc, z, fx, fy, cx, cy) {
    var el = $('.mz-size', sc), t = $('.mz-t', sc); if (!el) return;
    z = clampZ(z); var old = zoomOf(sc), sr = sc.getBoundingClientRect();
    if (fx == null) { fx = sc.clientWidth / 2; fy = sc.clientHeight / 2; }
    if (cx == null) { var r0 = el.getBoundingClientRect(); cx = (sr.left + fx - r0.left) / old; cy = (sr.top + fy - r0.top) / old; }
    el.style.width = Math.round(MW * z) + 'px'; el.style.height = Math.round(MH * z) + 'px'; t.style.transform = 'scale(' + z + ')';
    var r1 = el.getBoundingClientRect();
    sc.scrollLeft += r1.left + cx * z - (sr.left + fx); sc.scrollTop += r1.top + cy * z - (sr.top + fy);
    if (sc._zset) sc._zset(z); else S.zoom = z;
    sc.setAttribute('data-zoom', z.toFixed(3)); updZoomBtns(sc, z);
  }
  function zoomBy(sc, factor, fx, fy) { applyZoom(sc, zoomOf(sc) * factor, fx, fy); }
  // Ekte pinch (to fingre), Ctrl+hjul/styreflate-pinch. Én finger = vanlig scroll/pan.
  function attachZoom(sc, get, set) {
    if (get) { sc._zget = get; sc._zset = set; }
    var st = null, rect;
    function pt(e) { var a = e.touches[0], b = e.touches[1]; return { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1, x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }; }
    function end() { if (st) { sc.style.overflow = ''; st = null; sc._pinchAt = Date.now(); } }
    sc.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 2) { if (st) end(); return; }
      var p = pt(e), z = zoomOf(sc), sr = sc.getBoundingClientRect(), el = $('.mz-size', sc); if (!el) return;
      var r0 = el.getBoundingClientRect();
      st = { d: p.d, z: z, cx: (p.x - r0.left) / z, cy: (p.y - r0.top) / z };
      sc.style.overflow = 'hidden'; sc._pinchAt = Date.now();
    }, { passive: true });
    sc.addEventListener('touchmove', function (e) {
      if (!st || e.touches.length !== 2) return;
      if (e.cancelable) e.preventDefault();
      var p = pt(e), sr = sc.getBoundingClientRect();
      applyZoom(sc, st.z * p.d / st.d, p.x - sr.left, p.y - sr.top, st.cx, st.cy); sc._pinchAt = Date.now();
    }, { passive: false });
    sc.addEventListener('touchend', function (e) { if (e.touches.length < 2) end(); }, { passive: true });
    sc.addEventListener('touchcancel', end, { passive: true });
    sc.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return; e.preventDefault();
      var sr = sc.getBoundingClientRect(); zoomBy(sc, Math.exp(-e.deltaY * 0.01), e.clientX - sr.left, e.clientY - sr.top);
    }, { passive: false });
    // ikke la avslutningen på en pinch slå ut som trykk på et bord
    sc.addEventListener('click', function (e) { if (sc._pinchAt && Date.now() - sc._pinchAt < 350) { e.stopPropagation(); e.preventDefault(); } }, true);
  }
  function centerOn(sc, pts, panelEl) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var cx = (Math.min.apply(0, xs) + Math.max.apply(0, xs)) / 2, cy = (Math.min.apply(0, ys) + Math.max.apply(0, ys)) / 2;
    var z = zoomOf(sc), ph = panelEl && panelEl.style.display !== 'none' ? panelEl.offsetHeight : 0, top = 70, vis = sc.clientHeight - top - ph;
    var el = $('.mz-size', sc), off = el ? el.offsetLeft : 0;
    sc.scrollLeft = Math.max(0, off + cx * z - sc.clientWidth / 2);
    sc.scrollTop = Math.max(0, cy * z + top - (top + vis / 2));
  }
  function tc(n) { var t = TABLES[n]; return [t.x + t.w / 2, t.y + t.h / 2]; }

  /* ===== NAVIGASJON ===== */
  var current = 'start';
  var TABS = {
    buyer: [['kart', 'Kart', 'map'], ['sok', 'Søk', 'search']],
    vendor: [['vendor-home', 'Mitt bord', 'store'], ['vendor-kart', 'Kart', 'map'], ['vendor-profil', 'Profil', 'user']],
    arr: [['arr', 'Søknader', 'inbox'], ['arr-bord', 'Bord', 'list'], ['arr-messe', 'Messe', 'pin']]
  };
  var TABSET = { kart: 'buyer', sok: 'buyer', 'vendor-home': 'vendor', 'vendor-kart': 'vendor', 'vendor-profil': 'vendor', arr: 'arr', 'arr-bord': 'arr', 'arr-messe': 'arr' };
  function renderTabs(name) {
    var tb = $('#tabbar'), set = TABSET[name];
    if (!set) { tb.className = 'tabbar'; tb.innerHTML = ''; return; }
    tb.className = 'tabbar show';
    tb.innerHTML = TABS[set].map(function (t) { return '<button class="tab' + (t[0] === name ? ' on' : '') + '" data-go="' + t[0] + '" ' + (t[0] === name ? 'aria-current="page"' : '') + '>' + ic(t[2]) + '<span>' + t[1] + '</span></button>'; }).join('');
  }
  function go(h) { if (location.hash === '#' + h) render(); else location.hash = h; }
  function render() {
    var h = (location.hash || '#start').slice(1).split('/'), name = h[0] || 'start', arg = h[1] ? Number(h[1]) : null;
    if (!document.getElementById('s-' + name)) name = 'start';
    if (/^vendor-(home|kart|profil)$/.test(name) && !S.session) { go('vendor-login'); return; }
    if (current !== name) { $$('.scrim.open').forEach(function (b) { b.classList.remove('open'); }); if (name !== 'kart') setPicking(false); if (name !== 'vendor-kart') S.vSel = null; }
    current = name;
    $$('.screen').forEach(function (s) { s.classList.remove('active'); });
    $('#s-' + name).classList.add('active');
    renderTabs(name);
    if (VIEWS[name]) VIEWS[name](arg);
    var sc = $('#s-' + name + ' .scroll'); if (sc) sc.scrollTop = 0;
  }
  window.addEventListener('hashchange', render);
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
    if (e.target.closest('button[data-back]')) { var sc = e.target.closest('.screen'); go(sc.getAttribute('data-back-dyn') || sc.getAttribute('data-back')); return; }
    if (e.target.closest('[data-theme-btn]')) { toggleTheme(); return; }
    var cl = e.target.closest('[data-close]'); if (cl) { closeSheet(cl.closest('.scrim').id); return; }
    if (e.target.classList && e.target.classList.contains('scrim')) { closeSheet(e.target.id); return; }
    var zb = e.target.closest('[data-zoom]');
    if (zb) { var scr = $('.mapscroll', zb.closest('.mapwrap,.pickmap')); zoomBy(scr, Math.pow(1.3, Number(zb.getAttribute('data-zoom')))); }
  });
  ['#k-scroll', '#vk-scroll'].forEach(function (id) { attachZoom($(id)); });
  $('#btn-role').addEventListener('click', function () { go('start'); });

  function itemRow(it, opts) {
    var img = it.images && it.images.length ? '<img class="th" src="' + it.images[0] + '" alt="">' : '<div class="th">' + ic('card') + '</div>';
    var extra = '';
    if (opts.links && it.link) extra += '<a class="ext" href="' + LINKS[it.link][1] + '" target="_blank" rel="noopener">Åpne på ' + LINKS[it.link][0] + '</a>';
    if (opts.allThumbs && it.images && it.images.length > 1) extra += '<div class="imgedit" style="margin:8px 0 0">' + it.images.slice(1).map(function (u) { return '<div class="im" style="width:48px;height:64px"><img src="' + u + '" alt=""></div>'; }).join('') + '</div>';
    var tag = opts.edit ? 'button' : 'div', at = opts.edit ? ' data-edit="' + it.id + '"' : '';
    return '<' + tag + ' class="item"' + at + '>' + img + '<div class="g"><div class="nm">' + esc(it.name) + '</div><div class="cd">' + esc(condLine(it)) + '</div>' + extra + '</div><div class="pr">' + esc(price(it)) + '</div></' + tag + '>';
  }
