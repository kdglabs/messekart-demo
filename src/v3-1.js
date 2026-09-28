  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function find(arr, fn) { for (var i = 0; i < arr.length; i++) if (fn(arr[i])) return arr[i]; return null; }

  /* ===== GEOMETRI (fiktiv hall B) ===== */
  var TL = 20, TS = 12, P = 22, BS = 66;
  var AX = [120, 273, 430], AY = [80, 228, 380];
  var BLOCKS = [
    { start: 1, bx: 160, by: 120, c: 0, r: 0 }, { start: 13, bx: 320, by: 120, c: 1, r: 0 },
    { start: 25, bx: 160, by: 270, c: 0, r: 1 }, { start: 37, bx: 320, by: 270, c: 1, r: 1 }
  ];
  var TABLES = {};
  BLOCKS.forEach(function (b) {
    var L = AX[b.c], R = AX[b.c + 1], T = AY[b.r], B = AY[b.r + 1], i, n, x, y;
    for (i = 0; i < 3; i++) { n = b.start + i; x = b.bx - TS; y = b.by + BS - P * (i + 1) + 1; TABLES[n] = { n: n, x: x, y: y, w: TS, h: TL, acc: [L, y + TL / 2], edge: [x, y + TL / 2], seg: 'v' }; }
    for (i = 0; i < 3; i++) { n = b.start + 3 + i; x = b.bx + P * i + 1; y = b.by - TS; TABLES[n] = { n: n, x: x, y: y, w: TL, h: TS, acc: [x + TL / 2, T], edge: [x + TL / 2, y], seg: 'h' }; }
    for (i = 0; i < 3; i++) { n = b.start + 6 + i; x = b.bx + BS; y = b.by + P * i + 1; TABLES[n] = { n: n, x: x, y: y, w: TS, h: TL, acc: [R, y + TL / 2], edge: [x + TS, y + TL / 2], seg: 'v' }; }
    for (i = 0; i < 3; i++) { n = b.start + 9 + i; x = b.bx + BS - P * (i + 1) + 1; y = b.by + BS; TABLES[n] = { n: n, x: x, y: y, w: TL, h: TS, acc: [x + TL / 2, B], edge: [x + TL / 2, y + TS], seg: 'h' }; }
  });
  for (var wi = 0; wi < 10; wi++) { var wn = 49 + wi, wx = 146 + wi * 24, wy = 26; TABLES[wn] = { n: wn, x: wx, y: wy, w: TL, h: TS, acc: [wx + TL / 2, AY[0]], edge: [wx + TL / 2, wy + TS], seg: 'h' }; }
  var ALL_TABLES = Object.keys(TABLES).map(Number).sort(function (a, b) { return a - b; });

  var NODES = {};
  AX.forEach(function (x) { AY.forEach(function (y) { NODES[x + ',' + y] = [x, y]; }); });
  NODES.E = [273, 468];
  var EDGES = {};
  function dist(p, q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]); }
  function link(a, b) { var d = dist(NODES[a], NODES[b]); (EDGES[a] = EDGES[a] || []).push([b, d]); (EDGES[b] = EDGES[b] || []).push([a, d]); }
  AY.forEach(function (y) { for (var i = 0; i < 2; i++) link(AX[i] + ',' + y, AX[i + 1] + ',' + y); });
  AX.forEach(function (x) { for (var i = 0; i < 2; i++) link(x + ',' + AY[i], x + ',' + AY[i + 1]); });
  link('E', '273,' + AY[2]);

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
    var a = t.acc, i;
    if (t.seg === 'h') { for (i = 0; i < 2; i++) if (a[0] >= AX[i] && a[0] <= AX[i + 1]) return [AX[i] + ',' + a[1], AX[i + 1] + ',' + a[1]]; }
    else { for (i = 0; i < 2; i++) if (a[1] >= AY[i] && a[1] <= AY[i + 1]) return [a[0] + ',' + AY[i], a[0] + ',' + AY[i + 1]]; }
    return null;
  }
  // Rute langs gangene fra inngang (fromBooth = null) eller fra et bord, til målbord
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

  /* ===== DEMO-BILDER (genererte SVG-plassholdere, merket DEMO) ===== */
  function demoImg(title, sub, c1, c2, slabLabel) {
    var t = esc(title).slice(0, 26), s = esc(sub || ''), H = slabLabel ? 400 : 336, cx = slabLabel ? 98 : 120;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="' + H + '" viewBox="0 0 240 ' + H + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
      (slabLabel ? '<rect width="240" height="400" rx="14" fill="#dfe3ea"/><rect x="12" y="12" width="216" height="52" rx="6" fill="#fff" stroke="#b91c1c" stroke-width="3"/>' +
        '<text x="22" y="34" font-family="Arial" font-size="12" font-weight="700" fill="#111">' + esc(slabLabel) + '</text><text x="22" y="54" font-family="Arial" font-size="11" fill="#444">' + t + '</text><g transform="translate(22 76)">' : '<g>') +
      '<rect width="' + (slabLabel ? 196 : 240) + '" height="' + (slabLabel ? 300 : 336) + '" rx="12" fill="url(#g)"/>' +
      '<circle cx="' + cx + '" cy="130" r="54" fill="rgba(255,255,255,.25)"/>' +
      '<text x="' + cx + '" y="140" text-anchor="middle" font-family="Arial" font-size="30" font-weight="800" fill="rgba(255,255,255,.9)">DEMO</text>' +
      (slabLabel ? '' : '<text x="120" y="246" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#fff">' + t + '</text>') +
      '<text x="' + cx + '" y="272" text-anchor="middle" font-family="Arial" font-size="12" fill="rgba(255,255,255,.85)">' + s + '</text></g></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
