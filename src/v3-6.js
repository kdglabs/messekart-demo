  function step2HTML() {
    var d = F.draft, imgs = allImgs(d), co = d.slab ? d.slab.company : null;
    var h = F.editing ? head('Rediger vare') : head('Legg til vare', true) + stepper(2, 'Detaljer');
    var thumb = d.cat != null ? (d.slab ? slabThumb(d.slab) : catImg(d.cat)) : (imgs[0] || '');
    h += '<div class="slab-card">' + (thumb ? '<img src="' + thumb + '" alt="">' : '<div class="thumb ph">🃏</div>') + '<div><div style="font-weight:700">' + esc(d.name) + '</div>' +
      (d.set ? '<div class="muted small">' + esc(d.set) + (d.no ? ' · ' + (d.kind === 'sealed' ? '' : '#') + esc(d.no) : '') + '</div>' : '') +
      (d.slab ? '<div style="margin-top:6px"><span class="tag co">' + esc(co) + '</span> <span class="small grade">' + esc(d.slab.grade) + '</span></div><div class="muted small mono">Sert. ' + esc(d.slab.cert) + '</div>' : '<div style="margin-top:6px"><span class="tag">' + (d.kind === 'sealed' ? 'Sealed' : 'Raw') + '</span></div>') + '</div></div>';
    /* Bilder */
    h += '<div class="flabel">Bilde av varen (påkrevd)</div>';
    if (co === 'PSA') {
      h += '<div class="official' + (d.official ? ' on' : '') + '" id="fl-psa"><div class="off-top"><b>Offisielle PSA-bilder</b><span class="demo-pill">DEMO</span></div>' +
        '<div class="imgs">' + officialImgs(d).map(function (u) { return '<img src="' + u + '" alt="Offisielt PSA-bilde (demo)">'; }).join('') + '</div>' +
        '<p class="small muted" style="margin:8px 0 10px">Plassholdere som viser hvordan PSA-bilder kan brukes i stedet for egne.</p>' +
        '<button class="btn btn-sm ' + (d.official ? 'btn-secondary' : 'btn-outline') + '" id="fl-psa-accept">' + (d.official ? '✓ Bruker offisielle bilder – angre' : 'Bruk offisielle bilder') + '</button></div>';
    } else if (co === 'TAG' || co === 'CGC') {
      h += '<div class="notice info" id="fl-offlink">' + co + ' deler ikke bilder her. Du kan sjekke slabben på <a class="ext" id="fl-official" href="' + OFFICIAL_URL[co] + encodeURIComponent(d.slab.cert) + '" target="_blank" rel="noopener">Se på offisiell side ↗</a> <span class="small">(demo-lenke)</span>. Legg inn egne bilder.</div>';
    } else if (co) {
      h += '<p class="small muted" style="margin:0 0 10px" id="fl-noofficial">' + co + ' har ingen offisielle bilder. Legg inn egne bilder av slabben.</p>';
    }
    h += '<div class="img-edit" id="fd-imgs">' + d.images.map(function (u, i) { return '<div class="im"><img src="' + u + '" alt=""><button class="rm" data-rmimg="' + i + '" aria-label="Fjern bilde">✕</button></div>'; }).join('') + '</div>' +
      '<div class="btn-row" style="margin-bottom:18px"><label class="btn btn-secondary btn-sm file-btn">📷 Ta bilde<input type="file" accept="image/*" capture="environment" data-img></label>' +
      '<label class="btn btn-secondary btn-sm file-btn">🖼️ Last opp<input type="file" accept="image/*" multiple data-img></label></div>';
    /* Tilstand */
    if (d.slab) h += '<label class="f"><span>Tilstand</span><input id="fd-cond" value="' + esc(d.slab.grade + ' (fra slab)') + '" readonly></label>';
    else {
      var opts = d.kind === 'sealed' ? ['Sealed', 'Sealed – skadet emballasje'] : ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];
      if (opts.indexOf(d.cond) < 0) opts.unshift(d.cond || opts[0]);
      h += '<label class="f"><span>Tilstand</span><select id="fd-cond">' + opts.map(function (c) { return '<option' + (c === d.cond ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></label>';
    }
    h += '<label class="f"><span>Pris i kr (du fyller inn selv)</span><input id="fd-price" inputmode="numeric" autocomplete="off" placeholder="Pris" value="' + esc(d.price) + '"></label>';
    h += '<label class="f"><span>Lenke (valgfri)</span><select id="fd-link"><option value="">Ingen</option><option value="cardmarket"' + (d.link === 'cardmarket' ? ' selected' : '') + '>Cardmarket</option><option value="collectr"' + (d.link === 'collectr' ? ' selected' : '') + '>Collectr</option></select></label>';
    var locked = !imgs.length;
    if (locked) h += '<p class="lock-hint" id="fl-imgreq">🔒 Legg inn minst ett bilde' + (co === 'PSA' ? ' eller bruk de offisielle PSA-bildene' : '') + ' for å lagre.</p>';
    h += '<div class="err" id="fl-err"></div><button class="btn btn-primary" id="fl-save"' + (locked ? ' disabled' : '') + '>Lagre vare</button>';
    return h;
  }
  function renderFlow() {
    var el = $('#flow');
    el.innerHTML = F.step === 1 ? step1HTML() : step2HTML();
    if (F.step === 1) renderResults();
    el.scrollTop = 0;
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
    F.draft = newDraft({ name: c.name, set: c.set, no: c.no, kind: slab ? 'slab' : c.kind, cond: slab ? slab.grade : (c.kind === 'sealed' ? 'Sealed' : 'Near Mint'), cat: i,
      slab: slab ? { company: slab.company, grade: slab.grade, cert: slab.cert } : null });
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
    if (e.target.closest('#fl-psa-accept')) { syncDraft(); F.draft.official = !F.draft.official; renderFlow(); return; }
    if ((t = e.target.closest('[data-rmimg]'))) { syncDraft(); F.draft.images.splice(+t.getAttribute('data-rmimg'), 1); renderFlow(); return; }
    if (e.target.closest('#fl-save')) saveDraft();
  });
  $('#flow').addEventListener('input', function (e) { if (e.target.id === 'fl-q') { F.q = e.target.value; renderResults(); } });
  $('#flow').addEventListener('change', function (e) {
    if (!e.target.hasAttribute('data-img')) return;
    syncDraft();
    Array.prototype.forEach.call(e.target.files || [], function (f) { F.draft.images.push(URL.createObjectURL(f)); });
    renderFlow(); toast('Bilde lagt til');
  });
  function saveDraft() {
    syncDraft();
    var d = F.draft, err = $('#fl-err'), imgs = allImgs(d);
    if (!imgs.length) { err.textContent = 'Legg inn minst ett bilde før du lagrer.'; err.classList.add('show'); return; }
    var pr = String(d.price).replace(/\s/g, '').replace(',', '.');
    if (pr !== '' && !(Number(pr) >= 0)) { err.textContent = 'Pris må være et tall.'; err.classList.add('show'); return; }
    var full = d.name + (d.kind === 'sealed' ? ' (' + d.set + ')' : d.set ? ' (' + d.set + ')' : '');
    var data = { name: d.id ? d.name : full, set: d.set, no: d.no, cat: d.cat, kind: d.kind, cond: d.slab ? d.slab.grade : d.cond, price: pr === '' ? null : Number(pr), link: d.link || null,
      images: imgs, officialImgs: d.official ? officialImgs(d).slice() : null, slab: d.slab };
    if (d.id) { Object.assign(find(S.items, function (i) { return i.id === d.id; }), data); toast('Vare oppdatert'); }
    else { data.id = 'i' + (++S.uid); data.v = S.session; S.items.push(data); toast('Vare lagt til: ' + data.name); }
    F = null; closeSheet('sh-flow'); render();
  }
  $('#btn-add').addEventListener('click', openAdd);
  $('#vh-items').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]'), de = e.target.closest('[data-del]');
    if (ed) openEdit(ed.getAttribute('data-edit'));
    if (de) { var id = de.getAttribute('data-del'), it = find(S.items, function (i) { return i.id === id; }); if (confirm('Slette «' + it.name + '»?')) { S.items = S.items.filter(function (i) { return i.id !== id; }); toast('Vare slettet'); render(); } }
  });

