  /* ===== VENDOR: legg til vare – to steg: 1 Finn kortet, 2 Detaljer ===== */
  var F = null;
  function newDraft(o) { return Object.assign({ id: null, name: '', set: '', no: '', kind: 'raw', cond: 'Near Mint', price: '', link: '', images: [], slab: null, cat: null, official: false }, o || {}); }
  function openAdd() { F = { step: 1, q: '', cam: 'idle' }; renderFlow(); openSheet('sh-flow'); }
  function openEdit(id) {
    var it = find(S.items, function (i) { return i.id === id; });
    var own = (it.images || []).filter(function (u) { return !it.officialImgs || it.officialImgs.indexOf(u) < 0; });
    F = { step: 2, editing: true, draft: newDraft({ id: it.id, name: it.name, set: it.set || '', no: it.no || '', kind: it.kind || 'raw', cond: it.cond, price: it.price == null ? '' : String(it.price), link: it.link || '', images: own, slab: it.slab || null, cat: it.cat == null ? null : it.cat, official: !!(it.officialImgs && it.officialImgs.length) }) };
    renderFlow(); openSheet('sh-flow');
  }
  function head(title, back) {
    return '<div class="sheet-head">' + (back ? '<button class="icon-btn" data-fback aria-label="Tilbake">←</button>' : '') + '<h3>' + title + '</h3><button class="icon-btn" data-close aria-label="Lukk">✕</button></div>';
  }
  function stepper(n, label) {
    return '<div class="stepper" aria-label="Steg ' + n + ' av 2"><div class="bars"><i class="on"></i><i' + (n === 2 ? ' class="on"' : '') + '></i></div><div class="st-l"><b>Steg ' + n + ' av 2</b> · ' + label + '</div></div>';
  }
  function officialImgs(d) {
    if (!d.slab || d.slab.company !== 'PSA') return [];
    if (!d._off) { var lbl = 'PSA · ' + d.slab.grade + ' · #' + d.slab.cert; d._off = [demoImg(d.name, 'Offisielt PSA-bilde · DEMO', '#f97316', '#7c2d12', lbl), demoImg(d.name, 'Bakside · DEMO', '#1e3a8a', '#0f172a', lbl)]; }
    return d._off;
  }
  function allImgs(d) { return (d.official ? officialImgs(d) : []).concat(d.images); }
  function sugRow(attr, i, c, slab) {
    return '<button class="result sug" ' + attr + '="' + i + '"><img class="thumb" src="' + (slab ? slabThumb(slab) : catImg(slab ? slab.cat : i)) + '" alt=""><span class="grow"><b>' + esc(c.name) + '</b><br><span class="muted small">' + esc(catLine(c)) + '</span>' +
      (slab ? '<br><span class="tag co">' + esc(slab.company) + '</span> <span class="small grade">' + esc(slab.grade) + '</span>' : '<br><span class="tag">' + (c.kind === 'sealed' ? 'Sealed' : 'Raw') + ' · ' + esc(c.game) + '</span>') + '</span><span class="chev">›</span></button>';
  }
  function slabThumb(sl) { var k = 'slab|' + sl.company; if (!catImgCache[k]) { var c = CATALOG[sl.cat]; catImgCache[k] = demoImg(c.name, 'Plassholder · demo', c.c[0], c.c[1], sl.company + ' · ' + sl.grade); } return catImgCache[k]; }
  function step1HTML() {
    var h = head('Legg til vare') + stepper(1, 'Finn kortet');
    if (F.cam === 'scanning') h += '<div class="viewfinder"><span class="vf-demo">DEMO-KAMERA</span><div class="frame"></div><div class="scanline"></div><div class="vf-l">Leser etiketten på slabben …</div></div>';
    else h += '<button class="cam-btn" id="fl-cam"><span class="cam-ic">📷</span><span><b>Sikt kamera mot slab</b><span class="d">Simulert kamera (demo). Gir forslag du velger fra.</span></span></button>';
    h += '<div class="or"><span>eller</span></div>' +
      '<label class="f" style="margin-bottom:8px"><span>Skriv kortnavn</span><div class="search" style="margin:0"><span class="si">🔍</span><input type="search" id="fl-q" placeholder="F.eks. Charizard eller booster box" autocomplete="off" value="' + esc(F.q) + '"></div></label>' +
      '<div id="fl-res"></div>';
    return h;
  }
  function resultsHTML() {
    if (F.cam === 'done' && !F.q) {
      return '<div class="sec-title">Forslag fra kameraet (demo)</div><p class="muted small" style="margin:0 0 4px">Trykk på riktig kort.</p>' +
        SLAB_SCAN.map(function (sl, i) { return sugRow('data-slab', i, CATALOG[sl.cat], sl); }).join('');
    }
    var q = F.q.trim().toLowerCase();
    if (!q) return '<div class="empty small">Søk dekker raw og sealed i eksempelkatalogen.</div>';
    var list = [];
    CATALOG.forEach(function (c, i) { if ((c.name + ' ' + c.set + ' ' + c.no + ' ' + c.game).toLowerCase().indexOf(q) >= 0) list.push(i); });
    return list.length ? '<div class="sec-title">Forslag</div>' + list.map(function (i) { return sugRow('data-cat', i, CATALOG[i]); }).join('') : '<div class="empty">Ingen treff på «' + esc(F.q) + '» i eksempelkatalogen.</div>';
  }
  function renderResults() { var r = $('#fl-res'); if (r) r.innerHTML = resultsHTML(); }
