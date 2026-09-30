  function setPicking(on) { S.picking = on; $('#k-wrap').classList.toggle('picking', on); var b = $('#pick-banner'); if (b) b.style.display = on ? 'flex' : 'none'; if (b) b.style.alignItems = 'center'; }
  function youXY() { return S.pos == null ? NODES.E : TABLES[S.pos].acc; }

  var VIEWS = {
    start: function () { $('[data-event-line]').textContent = dateLine() + ' · ' + S.ev.place; $$('[data-ev-name]').forEach(function (e) { e.textContent = S.ev.name; }); },
    vendor: function () { $('#btn-apply').textContent = S.myApp ? 'Se status på søknaden' : 'Søk om bord'; $('#btn-apply').setAttribute('data-mode', S.myApp ? 'status' : 'new'); },
    soknad: function () { $('[data-event-line2]').textContent = S.ev.name + ' · ' + dateLine() + ' · ' + S.ev.place; $('#sk-err').classList.remove('show'); },
    status: function () { renderStatus(); },
    'vendor-login': function () { $('#v-err').classList.remove('show'); },
    'vendor-home': function () {
      var v = vById(S.session), its = itemsOf(v.id);
      $('#vh-name').textContent = v.name; $('#vh-sub').textContent = 'Bord ' + v.booth + ' · ' + S.ev.name;
      $('#vh-n').textContent = its.length; $('#vh-b').textContent = v.booth;
      $('#vh-items').innerHTML = its.length ? its.map(function (it) { return itemRow(it, { edit: true }); }).join('') : '<div class="empty">Ingen varer ennå.<br>Trykk «Legg til vare» for å komme i gang.</div>';
    },
    'vendor-profil': function () {
      var v = vById(S.session);
      $('#pf-bio').value = v.bio || ''; $('#pf-phone').value = v.c.phone; $('#pf-email').value = v.c.email; $('#pf-ig').value = v.c.ig;
      $('#pf-show-phone').checked = v.c.show.phone; $('#pf-show-email').checked = v.c.show.email; $('#pf-show-ig').checked = v.c.show.ig;
    },
    'vendor-kart': function () { renderVendorMap(true); },
    kart: function (n) { if (n && TABLES[n]) S.target = n; else if (!n) S.target = null; renderKart(true); },
    sok: function () { renderSearch(); },
    bord: function (n) {
      var v = vByBooth(n), sc = $('#s-bord');
      sc.setAttribute('data-back-dyn', 'kart' + (S.target ? '/' + S.target : ''));
      $('#b-name').textContent = v ? v.name : 'Ledig bord'; $('#b-booth').textContent = 'Bord ' + n;
      $('#b-bio').textContent = v && v.bio ? v.bio : '';
      $('#btn-route').setAttribute('data-go', 'kart/' + n);
      var its = v ? itemsOf(v.id) : [];
      $('#b-items').innerHTML = its.length ? its.map(function (it) { return itemRow(it, { links: true, allThumbs: true }); }).join('') : '<div class="empty">Ingen varer listet.</div>';
    }
  };

  /* ===== KJØPER: kart med festet panel ===== */
  function renderKart(recenter) {
    var r = S.target ? route(S.pos, S.target) : null, you = youXY(), sc = $('#k-scroll'), pn = $('#k-panel'), keep = [sc.scrollLeft, sc.scrollTop];
    var tv = S.target && vByBooth(S.target), from = S.pos == null ? 'inngangen' : 'bord ' + S.pos;
    if (S.picking) pn.style.display = 'none'; else pn.style.display = '';
    var h = '<div class="grip"><i></i></div><div class="pn-body">';
    if (S.target && !S.picking) {
      h += '<div class="pn-title">Bord ' + S.target + (tv ? ' · ' + esc(tv.name) : '') + '</div><div class="pn-sub">' + (tv ? esc(tv.bio) : 'Ledig bord') + '</div>' +
        '<div class="pn-meta"><div><b>' + meters(r) + ' m</b><span>å gå fra ' + from + '</span></div><div><b>' + (tv ? itemsOf(tv.id).length : 0) + '</b><span>varer</span></div></div>' +
        '<div class="row" style="border-top:1px solid var(--line);border-bottom:0;min-height:52px;padding:4px 0"><span class="g"><span class="d">Du er her</span> <span class="t">' + (S.pos == null ? 'Inngangen' : 'Bord ' + S.pos) + '</span></span><button class="btn txt sm" id="btn-pos" style="min-height:48px">Endre startpunkt</button></div></div><div class="pn-foot"><button class="btn primary grow" data-go="bord/' + S.target + '">Se varer</button><button class="btn sec" style="width:auto" id="btn-clear">Fjern rute</button></div>';
    } else {
      h += '<div class="pn-title">' + esc(S.ev.name) + '</div><div class="pn-sub">' + dateLine() + ' · ' + esc(S.ev.place) + '</div>' +
        '<div class="row" style="margin-top:8px;border-top:1px solid var(--line);border-bottom:0"><span class="g"><span class="d">Du er her</span><br><span class="t">' + (S.pos == null ? 'Inngangen' : 'Bord ' + S.pos) + '</span></span></div></div>' +
        '<div class="pn-foot"><button class="btn primary grow" id="btn-pos">Jeg står ved bord …</button></div>';
    }
    pn.innerHTML = h;
    var run = function () {
      mapInto(sc, mapSVG({ mode: S.picking ? 'pick' : 'buyer', target: S.target, route: r, you: you, chosen: null }), pn);
      if (S.picking) $$('.m-tb', sc).forEach(function (g) { g.setAttribute('class', 'm-tb click pick'); });
      if (recenter) { if (r) centerOn(sc, r.pts, pn); else centerOn(sc, [you, [you[0], you[1] - 300]], pn); } else { sc.scrollLeft = keep[0]; sc.scrollTop = keep[1]; }
    };
    run();
  }
  $('#k-scroll').addEventListener('click', function (e) {
    var g = e.target.closest('[data-booth]'); if (!g) return;
    var n = Number(g.getAttribute('data-booth'));
    if (S.picking) { S.pos = n; setPicking(false); toast('Du står ved bord ' + n); renderKart(true); return; }
    if (isActive(vByBooth(n))) { S.target = n; renderKart(true); } else toast('Bord ' + n + ' er ledig');
  });
  $('#k-panel').addEventListener('click', function (e) {
    if (e.target.closest('#btn-clear')) { S.target = null; if (location.hash !== '#kart') location.hash = 'kart'; else renderKart(true); return; }
    if (e.target.closest('#btn-pos')) { $('#pos-num').value = ''; $('#pos-err').classList.remove('show'); $('#btn-pos-reset').style.display = S.pos == null ? 'none' : ''; openSheet('sh-pos'); }
  });
  $('#btn-pick-map').addEventListener('click', function () { closeSheet('sh-pos'); setPicking(true); renderKart(false); });
  $('#btn-pick-cancel').addEventListener('click', function () { setPicking(false); renderKart(false); });
  function usePosNum() {
    var n = Number($('#pos-num').value);
    if (!TABLES[n]) { var er = $('#pos-err'); er.textContent = 'Finner ikke bord «' + ($('#pos-num').value || '') + '». Bordene er nummerert 1–' + NTAB + '.'; er.classList.add('show'); return; }
    S.pos = n; closeSheet('sh-pos'); toast('Du står ved bord ' + n); renderKart(true);
  }
  $('#btn-pos-num').addEventListener('click', usePosNum);
  $('#pos-num').addEventListener('keydown', function (e) { if (e.key === 'Enter') usePosNum(); });
  $('#btn-pos-reset').addEventListener('click', function () { S.pos = null; closeSheet('sh-pos'); toast('Starter fra inngangen'); renderKart(true); });
  $('#q').addEventListener('input', renderSearch);
  function renderSearch() {
    var q = $('#q').value.trim().toLowerCase(), box = $('#q-res');
    if (!q) { box.innerHTML = '<div class="empty">Prøv «Charizard», «Sol Ring» eller «Elsa».</div>'; return; }
    var hits = S.items.filter(function (it) { var v = vById(it.v); return isActive(v) && (it.name.toLowerCase().indexOf(q) >= 0 || v.name.toLowerCase().indexOf(q) >= 0); });
    box.innerHTML = hits.length ? '<ul class="list" style="border-top:0">' + hits.map(function (it) { var v = vById(it.v); return '<li><button class="row" data-hit="' + v.booth + '"><span class="g"><span class="t">' + esc(it.name) + '</span><br><span class="d">' + esc(v.name) + ' · ' + esc(price(it)) + '</span></span><span class="r">Bord ' + v.booth + '</span></button></li>'; }).join('') + '</ul>' : '<div class="empty">Ingen treff på «' + esc(q) + '».</div>';
  }
  $('#q-res').addEventListener('click', function (e) { var b = e.target.closest('[data-hit]'); if (b) go('kart/' + b.getAttribute('data-hit')); });

  /* ===== VENDOR: innlogging og profil ===== */
  $('#btn-v-demo').addEventListener('click', function () { $('#v-code').value = 'OTS-05-K7Q4'; $('#v-err').classList.remove('show'); });
  $('#v-code').addEventListener('input', function () { $('#v-err').classList.remove('show'); });
  function loginWith(raw, errEl) {
    raw = String(raw).trim().toUpperCase().replace(/\s+/g, '');
    if (!raw) { errEl.textContent = 'Skriv inn koden du har fått fra arrangøren.'; errEl.classList.add('show'); return; }
    if (!/^OTS-\d{2}-[A-Z0-9]{4}$/.test(raw)) { errEl.textContent = 'Feil format. Koden ser slik ut: OTS-12-K7Q4.'; errEl.classList.add('show'); return; }
    var v = find(S.vendors, function (x) { return x.code === raw; });
    if (!v) { errEl.textContent = 'Ugyldig kode. Sjekk koden, eller kontakt arrangøren.'; errEl.classList.add('show'); return; }
    v.loggedIn = true; S.session = v.id; $('#v-code').value = ''; toast('Innlogget som ' + v.name); go('vendor-home');
  }
  $('#btn-v-login').addEventListener('click', function () { loginWith($('#v-code').value, $('#v-err')); });
  $('#v-code').addEventListener('keydown', function (e) { if (e.key === 'Enter') loginWith($('#v-code').value, $('#v-err')); });
  $('#btn-logout').addEventListener('click', function () { S.session = null; toast('Logget ut'); go('start'); });
  $('#btn-pf-save').addEventListener('click', function () {
    var v = vById(S.session);
    v.bio = $('#pf-bio').value.trim();
    v.c.phone = $('#pf-phone').value.trim(); v.c.email = $('#pf-email').value.trim(); v.c.ig = $('#pf-ig').value.trim();
    v.c.show = { phone: $('#pf-show-phone').checked, email: $('#pf-show-email').checked, ig: $('#pf-show-ig').checked };
    toast('Profil lagret'); go('vendor-home');
  });

  /* ===== VENDOR: kart med andre vendors ===== */
  function renderVendorMap(recenter) {
    var v = vById(S.session), sc = $('#vk-scroll'), pn = $('#vk-panel'), keep = [sc.scrollLeft, sc.scrollTop];
    var sel = S.vSel ? vByBooth(S.vSel) : null;
    if (!sel) { pn.style.display = 'none'; $('#vk-hint').textContent = 'Ditt bord er bord ' + v.booth + '. Trykk på et annet bord.'; }
    else { pn.style.display = ''; showVendorInfo(sel); $('#vk-hint').textContent = 'Bord ' + sel.booth + ' · ' + sel.name; }
    mapInto(sc, mapSVG({ mode: 'vendor', own: v.booth, selected: S.vSel }), pn);
    if (recenter) centerOn(sc, [tc(v.booth)], pn); else { sc.scrollLeft = keep[0]; sc.scrollTop = keep[1]; }
  }
  $('#vk-scroll').addEventListener('click', function (e) {
    var g = e.target.closest('[data-booth]'); if (!g) return;
    var n = Number(g.getAttribute('data-booth')), me = vById(S.session), v = vByBooth(n);
    if (n === me.booth) { toast('Dette er ditt bord'); return; }
    if (!isActive(v)) { toast('Bord ' + n + ' er ledig'); return; }
    S.vSel = n; renderVendorMap(false);
  });
  function showVendorInfo(v) {
    var its = itemsOf(v.id), c = v.c, rows = [];
    if (c.show.phone && c.phone) rows.push('<a href="tel:' + c.phone.replace(/\s/g, '') + '" data-contact="phone"><span class="k">Telefon</span>' + esc(c.phone) + '</a>');
    if (c.show.email && c.email) rows.push('<a href="mailto:' + esc(c.email) + '" data-contact="email"><span class="k">E-post</span>' + esc(c.email) + '</a>');
    if (c.show.ig && c.ig) rows.push('<a href="https://www.instagram.com/' + esc(c.ig.replace(/^@/, '')) + '" target="_blank" rel="noopener" data-contact="ig"><span class="k">Instagram</span>' + esc(c.ig) + '</a>');
    $('#vk-panel').innerHTML = '<div class="grip"><i></i></div><div class="pn-body"><div style="display:flex;align-items:flex-start;gap:8px"><div style="flex:1"><div class="pn-title">' + esc(v.name) + '</div><div class="pn-sub">Bord ' + v.booth + '</div></div><button class="btn txt sm" id="btn-vk-close" style="min-height:48px;padding:0 4px">Lukk</button></div>' +
      (v.bio ? '<p class="pn-bio" id="vi-bio">' + esc(v.bio) + '</p>' : '') +
      '<div class="pn-h">Kontakt · kun for vendors</div>' +
      (rows.length ? '<div class="contact">' + rows.join('') + '</div>' : '<p class="mu sm" style="padding:6px 0">Denne vendoren deler ikke kontaktinfo.</p>') +
      '<div class="pn-h">Varer (' + its.length + ')</div>' +
      (its.length ? its.map(function (it) { return itemRow(it, {}); }).join('') : '<p class="mu sm">Ingen varer ennå.</p>') + '<div style="height:16px"></div></div>';
  }
  $('#vk-panel').addEventListener('click', function (e) { if (e.target.closest('#btn-vk-close')) { S.vSel = null; renderVendorMap(false); } });
