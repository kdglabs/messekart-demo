  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function find(arr, fn) { for (var i = 0; i < arr.length; i++) if (fn(arr[i])) return arr[i]; return null; }

  /* ===== Linjeikoner (ett sett, 24px, 1.8 strek) ===== */
  var IC = {
    back: '<path d="M15 5l-7 7 7 7"/>', chev: '<path d="M9 5l7 7-7 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    map: '<path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    store: '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v0a3 3 0 01-5.3 1.9A3 3 0 0112 12a3 3 0 01-2.7-1.1A3 3 0 014 9z"/><path d="M5.5 13v7h13v-7"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.6-3.8 3.6-6 7.5-6s6.9 2.2 7.5 6"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    inbox: '<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5l1 2.5h4l1-2.5h5"/>',
    cam: '<path d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    img: '<rect x="4" y="5" width="16" height="14"/><path d="M4 16l4.5-4.5 4 4 3-3L20 16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>', card: '<rect x="6" y="3.5" width="12" height="17" rx="1.5"/>',
    pin: '<path d="M12 21s6-5.6 6-11a6 6 0 10-12 0c0 5.4 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>'
  };
  function ic(n, sz) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"' + (sz ? ' style="width:' + sz + 'px;height:' + sz + 'px"' : '') + '>' + IC[n] + '</svg>'; }

  /* ===== GEOMETRI: Fjellhamarhallen 60 x 40 m (forenklet utkast) ===== */
  var U = 24, MG = { l: 48, t: 56, r: 48, b: 96 }, HW = 60, HH = 40;
  var MW = HW * U + MG.l + MG.r, MH = HH * U + MG.t + MG.b;
  function X(m) { return MG.l + m * U; } function Y(m) { return MG.t + m * U; }
  var COLX = [4.5, 24.1, 43.7], ROWC = [10, 18, 26], HY = [6, 14, 22, 30], VX = [2.25, 20.3, 39.9, 57.85], TWm = 3.8, THm = 1.5;
  var TABLES = {};
  ROWC.forEach(function (rc, r) {
    COLX.forEach(function (cx0, c) {
      var n0 = (r * 3 + c) * 6 + 1;
      for (var i = 0; i < 3; i++) {
        var xm = cx0 + 4 * i + 0.1, cxm = xm + TWm / 2;
        var a = n0 + i, b = n0 + 3 + i;
        TABLES[a] = { n: a, x: X(xm), y: Y(rc - THm), w: TWm * U, h: THm * U, k: r, acc: [X(cxm), Y(HY[r])], edge: [X(cxm), Y(rc - THm)] };
        TABLES[b] = { n: b, x: X(xm), y: Y(rc), w: TWm * U, h: THm * U, k: r + 1, acc: [X(cxm), Y(HY[r + 1])], edge: [X(cxm), Y(rc + THm)] };
      }
    });
  });
  var ALL_TABLES = Object.keys(TABLES).map(Number).sort(function (a, b) { return a - b; });
  var NTAB = ALL_TABLES.length;
  var NODES = {}, EDGES = {}, LINEX = [];
  function nk(xm, k) { return xm + ',' + k; }
  HY.forEach(function (hy, k) {
    var xs = VX.slice(); if (k === 3) xs.splice(2, 0, 30.1); LINEX[k] = xs;
    xs.forEach(function (xm) { NODES[nk(xm, k)] = [X(xm), Y(hy)]; });
  });
  NODES.E = [X(30.1), Y(HH)];
  function dist(p, q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]); }
  function link(a, b) { var d = dist(NODES[a], NODES[b]); (EDGES[a] = EDGES[a] || []).push([b, d]); (EDGES[b] = EDGES[b] || []).push([a, d]); }
  LINEX.forEach(function (xs, k) { for (var i = 0; i < xs.length - 1; i++) link(nk(xs[i], k), nk(xs[i + 1], k)); });
  VX.forEach(function (xm) { for (var k = 0; k < 3; k++) link(nk(xm, k), nk(xm, k + 1)); });
  link('E', nk(30.1, 3));

  function dijkstra(src) {
    var d = {}, prev = {}, left = Object.keys(NODES);
    left.forEach(function (k) { d[k] = Infinity; }); d[src] = 0;
    while (left.length) {
      left.sort(function (a, b) { return d[a] - d[b]; });
      var u = left.shift();
      (EDGES[u] || []).forEach(function (e) { if (d[u] + e[1] < d[e[0]]) { d[e[0]] = d[u] + e[1]; prev[e[0]] = u; } });
    }
    return { d: d, prev: prev };
  }
  function segEnds(t) {
    var xs = LINEX[t.k], xm = (t.acc[0] - MG.l) / U;
    for (var i = 0; i < xs.length - 1; i++) if (xm >= xs[i] - 1e-6 && xm <= xs[i + 1] + 1e-6) return [nk(xs[i], t.k), nk(xs[i + 1], t.k)];
    return null;
  }
  // Rute langs gangene: fromBooth == null => fra inngangen. Returnerer { pts, len } (len i svg-enheter)
  function route(fromBooth, n) {
    var t = TABLES[n], tEnds = segEnds(t), starts;
    if (fromBooth == null) starts = [{ k: 'E', pre: [], c: 0 }];
    else {
      var s = TABLES[fromBooth];
      if (fromBooth === n) return { pts: [s.edge, s.edge], len: 0 };
      var sEnds = segEnds(s);
      if (sEnds.join() === tEnds.join()) return { pts: [s.edge, s.acc, t.acc, t.edge], len: dist(s.edge, s.acc) + dist(s.acc, t.acc) + dist(t.acc, t.edge) };
      starts = sEnds.map(function (k) { return { k: k, pre: [s.edge, s.acc], c: dist(s.edge, s.acc) + dist(s.acc, NODES[k]) }; });
    }
    var best = null;
    starts.forEach(function (st) {
      var g = dijkstra(st.k);
      tEnds.forEach(function (te) {
        var c = st.c + g.d[te] + dist(NODES[te], t.acc);
        if (!best || c < best.c) best = { c: c, st: st, te: te, g: g };
      });
    });
    var path = [], k = best.te;
    while (k) { path.unshift(NODES[k]); k = best.g.prev[k]; }
    return { pts: best.st.pre.concat(path, [t.acc, t.edge]), len: best.c + dist(t.acc, t.edge) };
  }
  function meters(r) { return Math.max(1, Math.round(r.len / U)); }

  /* ===== EKSEMPELBILDER: flate plassholdere (ingen gradienter), merket Eksempelbilde ===== */
  var TONES = ['#8a97a8', '#a39a8c', '#8ea394', '#a08e9e', '#8f9bb3', '#b0a58a'];
  function tone(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return TONES[h % TONES.length]; }
  function demoImg(title, sub, slabLabel) {
    var t = esc(title).slice(0, 24), s = esc(sub || 'Eksempelbilde'), c = tone(title), H = slabLabel ? 400 : 336;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="' + H + '" viewBox="0 0 240 ' + H + '">';
    if (slabLabel) {
      svg += '<rect width="240" height="400" fill="#e6e8ec" stroke="#9aa1ad" stroke-width="2"/><rect x="12" y="12" width="216" height="52" fill="#fff" stroke="#444" stroke-width="2"/>' +
        '<text x="22" y="34" font-family="Arial" font-size="12" font-weight="700" fill="#111">' + esc(slabLabel) + '</text><text x="22" y="54" font-family="Arial" font-size="11" fill="#444">' + t + '</text>' +
        '<rect x="22" y="76" width="196" height="300" fill="' + c + '"/><rect x="34" y="88" width="172" height="276" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>' +
        '<text x="120" y="232" text-anchor="middle" font-family="Arial" font-size="13" fill="#fff">' + s + '</text>';
    } else {
      svg += '<rect width="240" height="336" fill="' + c + '"/><rect x="12" y="12" width="216" height="312" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>' +
        '<text x="120" y="160" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#fff">' + t + '</text>' +
        '<text x="120" y="188" text-anchor="middle" font-family="Arial" font-size="13" fill="#fff">' + s + '</text>';
    }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg + '</svg>');
  }
