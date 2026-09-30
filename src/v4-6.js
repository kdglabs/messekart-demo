  /* ===== VENDOR: legg til vare – to steg ===== */
  var F = null;
  function newDraft(o) { return Object.assign({ id: null, name: '', set: '', no: '', kind: 'raw', cond: 'Near Mint', price: '', link: '', images: [], slab: null, cat: null, official: false }, o || {}); }
  function openAdd() { F = { step: 1, q: '', cam: 'idle' }; renderFlow(); openSheet('sh-flow'); }
  function openEdit(id) {
    var it = find(S.items, function (i) { return i.id === id; });
    var own = (it.images || []).filter(function (u) { return !it.officialImgs || it.officialImgs.indexOf(u) < 0; });
    F = { step: 2, editing: true, draft: newDraft({ id: it.id, name: it.name, set: it.set || '', no: it.no || '', kind: it.kind || 'raw', cond: it.cond, price: it.price == null ? '' : String(it.price), link: it.link || '', images: own, slab: it.slab || null, cat: it.cat == null ? null : it.cat, official: !!(it.officialImgs && it.officialImgs.length) }) };
    renderFlow(); openSheet('sh-flow');
  }
  function fhead(title, back) {
    return '<div class="grip"><i></i></div><div class="sh-head">' + (back ? '<button class="ib" data-fback aria-label="Tilbake" style="margin-left:-12px">' + ic('back') + '</button>' : '') + '<h3>' + title + '</h3><button class="ib" data-close aria-label="Lukk">' + ic('x') + '</button></div>';
  }
  function stepper(n, label) { return '<div class="stepbar" aria-label="Steg ' + n + ' av 2"><i class="on"></i><i' + (n === 2 ? ' class="on"' : '') + '></i></div><div class="steplbl"><b>Steg ' + n + ' av 2</b> · ' + label + '</div>'; }
  function officialImgs(d) {
    if (!d.slab || d.slab.company !== 'PSA') return [];
    if (!d._off) { var lbl = 'PSA · ' + d.slab.grade + ' · #' + d.slab.cert; d._off = [demoImg(d.name, 'Offisielt PSA-bilde (demo)', lbl), demoImg(d.name + ' bak', 'Bakside (demo)', lbl)]; }
    return d._off;
  }
  function allImgs(d) { return (d.official ? officialImgs(d) : []).concat(d.images); }
  function slabThumb(sl) { var k = 'slab|' + sl.company; if (!catImgCache[k]) catImgCache[k] = demoImg(CATALOG[sl.cat].name, 'Eksempelbilde', sl.company + ' · ' + sl.grade); return catImgCache[k]; }
  function sugRow(attr, i, c, slab) {
    return '<button class="res" ' + attr + '="' + i + '"><img class="th" src="' + (slab ? slabThumb(slab) : catImg(i)) + '" alt=""><span class="g"><b>' + esc(c.name) + '</b><br><span class="mu sm">' + esc(catLine(c)) + '</span><br>' +
      (slab ? '<span class="tag">' + esc(slab.company) + '</span> <span class="sm">' + esc(slab.grade) + '</span>' : '<span class="mu sm">' + (c.kind === 'sealed' ? 'Sealed' : 'Raw') + ' · ' + esc(c.game) + '</span>') + '</span>' + ic('chev') + '</button>';
  }
  function step1HTML() {
    var h = '<div class="sh-body">' + stepper(1, 'Finn kortet');
    if (F.cam === 'scanning') h += '<div class="vf"><span class="tg2">DEMOKAMERA</span><div class="fr"></div><div class="sl"></div><div class="lb">Leser etiketten på slabben …</div></div>';
    else h += '<button class="camb" id="fl-cam">' + ic('cam') + '<span><b>Sikt kamera mot slab</b><span class="d">Simulert kamera i demoen. Du velger blant forslag.</span></span></button>';
    h += '<div class="or">eller søk</div>' +
      '<label class="search"><span data-ic="search">' + ic('search') + '</span><input type="search" id="fl-q" placeholder="Kortnavn, f.eks. Charizard" autocomplete="off" value="' + esc(F.q) + '" aria-label="Kortnavn"></label>' +
      '<div id="fl-res" style="margin-top:8px"></div></div>';
    return fhead('Legg til vare') + h;
  }
  function resultsHTML() {
    if (F.cam === 'done' && !F.q) return '<h2 style="padding-top:8px">Forslag fra kameraet</h2>' + SLAB_SCAN.map(function (sl, i) { return sugRow('data-slab', i, CATALOG[sl.cat], sl); }).join('');
    var q = F.q.trim().toLowerCase();
    if (!q) return '<div class="empty sm">Søket dekker raw og sealed i eksempelkatalogen.</div>';
    var list = [];
    CATALOG.forEach(function (c, i) { if ((c.name + ' ' + c.set + ' ' + c.no + ' ' + c.game).toLowerCase().indexOf(q) >= 0) list.push(i); });
    return list.length ? list.map(function (i) { return sugRow('data-cat', i, CATALOG[i]); }).join('') : '<div class="empty">Ingen treff på «' + esc(F.q) + '» i eksempelkatalogen.</div>';
  }
  function renderResults() { var r = $('#fl-res'); if (r) r.innerHTML = resultsHTML(); }
  function step2HTML() {
    var d = F.draft, imgs = allImgs(d), co = d.slab ? d.slab.company : null;
    var h = '<div class="sh-body">' + (F.editing ? '' : stepper(2, 'Detaljer'));
    var thumb = d.cat != null ? (d.slab ? slabThumb(d.slab) : catImg(d.cat)) : (imgs[0] || '');
    h += '<div class="slabcard">' + (thumb ? '<img src="' + thumb + '" alt="">' : '') + '<div><div style="font-weight:700;font-size:18px">' + esc(d.name) + '</div>' +
      (d.set ? '<div class="mu sm">' + esc(d.set) + (d.no ? ' · ' + (d.kind === 'sealed' ? '' : '#') + esc(d.no) : '') + '</div>' : '') +
      (d.slab ? '<div style="margin-top:8px"><span class="tag">' + esc(co) + '</span> <span class="sm">' + esc(d.slab.grade) + '</span></div><div class="mu sm mono">Sert. ' + esc(d.slab.cert) + '</div>' : '<div class="mu sm" style="margin-top:8px">' + (d.kind === 'sealed' ? 'Sealed' : 'Raw') + '</div>') + '</div></div>';
    h += '<div class="flabel">Bilde av varen (påkrevd)</div>';
    if (co === 'PSA') {
      h += '<div class="official' + (d.official ? ' on' : '') + '" id="fl-psa"><b>Offisielle PSA-bilder</b> <span class="mu sm">(eksempel)</span>' +
        '<div class="imgs">' + officialImgs(d).map(function (u) { return '<img src="' + u + '" alt="Offisielt PSA-bilde (eksempel)">'; }).join('') + '</div>' +
        '<button class="btn sm ' + (d.official ? 'sec' : 'primary') + '" id="fl-psa-accept" style="width:100%">' + (d.official ? 'Bruker offisielle bilder – angre' : 'Bruk offisielle bilder') + '</button></div>';
    } else if (co === 'TAG' || co === 'CGC') {
      h += '<div class="note" id="fl-offlink">' + co + ' deler ikke bilder her. Legg inn egne bilder av slabben.<a class="blk" id="fl-official" href="' + OFFICIAL_URL[co] + encodeURIComponent(d.slab.cert) + '" target="_blank" rel="noopener">Sjekk slabben på offisiell side (demolenke)</a></div>';
    } else if (co) {
      h += '<p class="mu sm" style="margin:0 0 10px" id="fl-noofficial">' + co + ' har ingen offisielle bilder. Legg inn egne bilder av slabben.</p>';
    }
    h += '<div class="imgedit" id="fd-imgs">' + d.images.map(function (u, i) { return '<div class="im"><img src="' + u + '" alt=""><button class="rm" data-rmimg="' + i + '" aria-label="Fjern bilde">' + ic('x') + '</button></div>'; }).join('') + '</div>' +
      '<div class="btnrow" style="margin-bottom:18px"><label class="btn sec sm filebtn grow">Ta bilde<input type="file" accept="image/*" capture="environment" data-img></label><label class="btn sec sm filebtn grow">Last opp<input type="file" accept="image/*" multiple data-img></label></div>';
    if (d.slab) h += '<label class="f"><span>Tilstand</span><input id="fd-cond" value="' + esc(d.slab.grade + ' (fra slab)') + '" readonly></label>';
    else {
      var opts = d.kind === 'sealed' ? ['Sealed', 'Sealed – skadet emballasje'] : ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];
      if (opts.indexOf(d.cond) < 0) opts.unshift(d.cond || opts[0]);
      h += '<label class="f"><span>Tilstand</span><select id="fd-cond">' + opts.map(function (c) { return '<option' + (c === d.cond ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></label>';
    }
    h += '<label class="f"><span>Pris i kr (du fyller inn selv)</span><input id="fd-price" inputmode="numeric" autocomplete="off" placeholder="F.eks. 450" value="' + esc(d.price) + '"></label>';
    h += '<label class="f"><span>Lenke (valgfri)</span><select id="fd-link"><option value="">Ingen</option><option value="cardmarket"' + (d.link === 'cardmarket' ? ' selected' : '') + '>Cardmarket</option><option value="collectr"' + (d.link === 'collectr' ? ' selected' : '') + '>Collectr</option></select></label>';
    var locked = !imgs.length;
    h += '</div><div class="sh-foot">' + (locked ? '<p class="lockhint" id="fl-imgreq">Legg inn minst ett bilde' + (co === 'PSA' ? ' eller bruk de offisielle PSA-bildene' : '') + ' for å lagre.</p>' : '') +
      '<div class="err" id="fl-err" style="padding:0"></div><button class="btn primary" id="fl-save"' + (locked ? ' disabled' : '') + '>Lagre vare</button></div>';
    return (F.editing ? fhead('Rediger vare') : fhead('Legg til vare', true)) + h;
  }
  function renderFlow() {
    var el = $('#flow'), keep = $('.sh-body', el) ? $('.sh-body', el).scrollTop : 0;
    el.innerHTML = F.step === 1 ? step1HTML() : step2HTML();
    if (F.step === 1) renderResults();
    var b = $('.sh-body', el); if (b) b.scrollTop = F.keepScroll ? keep : 0; F.keepScroll = false;
  }
  function syncDraft() {
    if (!F || F.step !== 2) return;
    var d = F.draft, c = $('#fd-cond');
    if (c && !d.slab) d.cond = c.value;
    d.price = $('#fd-price').value; d.link = $('#fd-link').value;
  }
  function pickCat(i, slab) {
    var c = CATALOG[i];
    F.step = 2;
    F.draft = newDraft({ name: c.name, set: c.set, no: c.no, kind: slab ? 'slab' : c.kind, cond: slab ? slab.grade : (c.kind === 'sealed' ? 'Sealed' : 'Near Mint'), cat: i, slab: slab ? { company: slab.company, grade: slab.grade, cert: slab.cert } : null });
    renderFlow();
  }
  $('#flow').addEventListener('click', function (e) {
    var t;
    if (e.target.closest('#fl-cam')) {
      F.cam = 'scanning'; F.q = ''; renderFlow();
      setTimeout(function () { if (F && F.step === 1 && F.cam === 'scanning') { F.cam = 'done'; renderFlow(); } }, 1200);
      return;
    }
    if (e.target.closest('[data-fback]')) { syncDraft(); F.step = 1; renderFlow(); return; }
    if ((t = e.target.closest('[data-slab]'))) { var sl = SLAB_SCAN[+t.getAttribute('data-slab')]; pickCat(sl.cat, sl); return; }
    if ((t = e.target.closest('[data-cat]'))) { pickCat(+t.getAttribute('data-cat'), null); return; }
    if (e.target.closest('#fl-psa-accept')) { syncDraft(); F.draft.official = !F.draft.official; F.keepScroll = true; renderFlow(); return; }
    if ((t = e.target.closest('[data-rmimg]'))) { syncDraft(); F.draft.images.splice(+t.getAttribute('data-rmimg'), 1); F.keepScroll = true; renderFlow(); return; }
    if (e.target.closest('#fl-save')) saveDraft();
  });
  $('#flow').addEventListener('input', function (e) { if (e.target.id === 'fl-q') { F.q = e.target.value; renderResults(); } });
  $('#flow').addEventListener('change', function (e) {
    if (!e.target.hasAttribute('data-img')) return;
    syncDraft();
    Array.prototype.forEach.call(e.target.files || [], function (f) { F.draft.images.push(URL.createObjectURL(f)); });
    F.keepScroll = true; renderFlow(); toast('Bilde lagt til');
  });
  function saveDraft() {
    syncDraft();
    var d = F.draft, err = $('#fl-err'), imgs = allImgs(d);
    if (!imgs.length) { err.textContent = 'Legg inn minst ett bilde før du lagrer.'; err.classList.add('show'); return; }
    var pr = String(d.price).replace(/\s/g, '').replace(',', '.');
    if (pr !== '' && !(Number(pr) >= 0)) { err.textContent = 'Pris må være et tall.'; err.classList.add('show'); return; }
    var full = d.name + (d.set ? ' (' + d.set + ')' : '');
    var data = { name: d.id ? d.name : full, set: d.set, no: d.no, cat: d.cat, kind: d.kind, cond: d.slab ? d.slab.grade : d.cond, price: pr === '' ? null : Number(pr), link: d.link || null, images: imgs, officialImgs: d.official ? officialImgs(d).slice() : null, slab: d.slab };
    if (d.id) { Object.assign(find(S.items, function (i) { return i.id === d.id; }), data); toast('Vare oppdatert'); }
    else { data.id = 'i' + (++S.uid); data.v = S.session; S.items.push(data); toast('Vare lagt til: ' + data.name); }
    F = null; closeSheet('sh-flow'); render();
  }
  $('#btn-add').addEventListener('click', openAdd);
  $('#vh-items').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]'); if (ed) openEdit(ed.getAttribute('data-edit'));
  });
  render();
