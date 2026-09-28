  var VIEWS = {
    start: function () { $('[data-event-line]').textContent = dateLine() + ' · ' + S.ev.place; },
    'arr-messe': function () { $('#ev-name').value = S.ev.name; $('#ev-date').value = S.ev.date; $('#ev-place').value = S.ev.place; },
    'arr-bord': function () { renderArrList(); },
    'vendor-login': function () { $('#v-err').classList.remove('show'); },
    'vendor-home': function () {
      var v = vById(S.session), its = itemsOf(v.id);
      $('#vh-name').textContent = v.name; $('#vh-booth').textContent = 'Bord ' + v.booth;
      $('#vh-items').innerHTML = its.length ? its.map(function (it) { return itemRow(it, { edit: true }); }).join('') : '<div class="empty">Ingen varer ennå.<br>Trykk «Legg til vare».</div>';
    },
    'vendor-profil': function () {
      var v = vById(S.session);
      $('#pf-bio').value = v.bio || ''; $('#pf-phone').value = v.c.phone; $('#pf-email').value = v.c.email; $('#pf-ig').value = v.c.ig;
      $('#pf-show-phone').checked = v.c.show.phone; $('#pf-show-email').checked = v.c.show.email; $('#pf-show-ig').checked = v.c.show.ig;
    },
    'vendor-kart': function () { renderVendorMap(true); },
    kart: function (n) {
      if (n && TABLES[n]) S.target = n; else if (!n) S.target = null;
      var r = S.target ? route(S.pos, S.target) : null;
      var you = S.pos == null ? NODES.E : TABLES[S.pos].acc;
      var sc = $('#k-scroll');
      sc.innerHTML = mapSVG({ clickable: true, pickAll: S.picking, target: S.target, route: r, you: you });
      $('#k-you').textContent = '📍 Du er her: ' + (S.pos == null ? 'Inngangen' : 'Bord ' + S.pos);
      var tv = S.target && vByBooth(S.target);
      $('#k-target').innerHTML = S.target && !S.picking ?
        '<div class="target"><div class="row-top"><b>Bord ' + S.target + (tv ? ' · ' + esc(tv.name) : '') + '</b><span class="muted small">ca. ' + Math.round(r.len / 10) + ' m</span></div>' +
        '<p class="muted small" style="margin:4px 0 12px">Fra ' + (S.pos == null ? 'inngangen' : 'bord ' + S.pos) + '. Følg den oransje linjen langs gangene.</p>' +
        '<div style="display:flex;gap:10px"><button class="btn btn-primary btn-sm" style="flex:1" data-go="bord/' + S.target + '">Se varer</button><button class="btn btn-secondary btn-sm" data-go="kart">Fjern rute</button></div></div>' : '';
      requestAnimationFrame(function () { if (r) centerOn(sc, r.pts); else centerOn(sc, [you]); });
    },
    sok: function () { renderSearch(); setTimeout(function () { $('#q').focus(); }, 50); },
    bord: function (n) {
      var v = vByBooth(n), sc = $('#s-bord');
      sc.setAttribute('data-back-dyn', 'kart' + (S.target ? '/' + S.target : ''));
      $('[data-t]', sc).textContent = 'Bord ' + n; $('[data-sub]', sc).textContent = v ? v.name : 'Ledig';
      $('#b-name').textContent = v ? v.name : 'Ledig bord'; $('#b-booth').textContent = 'Bord ' + n;
      $('#b-bio').textContent = v && v.bio ? v.bio : '';
      $('#btn-route').setAttribute('data-go', 'kart/' + n);
      var its = v ? itemsOf(v.id) : [];
      // Kjøpervisning: ALDRI kontaktinfo
      $('#b-items').innerHTML = its.length ? its.map(function (it) { return itemRow(it, { links: true, allThumbs: true }); }).join('') : '<div class="empty">Ingen varer listet.</div>';
    }
  };

  /* ===== ARRANGØR ===== */
  $('#btn-ev-save').addEventListener('click', function () { S.ev.name = $('#ev-name').value.trim() || S.ev.name; S.ev.date = $('#ev-date').value || S.ev.date; S.ev.place = $('#ev-place').value.trim() || S.ev.place; toast('Messe lagret'); go('arr-bord'); });
  $('#arr-q').addEventListener('input', renderArrList);
  $('#arr-seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.arrFilter = b.getAttribute('data-f'); $$('#arr-seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); renderArrList(); });
  function renderArrList() {
    var q = $('#arr-q').value.trim().toLowerCase(), counts = { items: 0, in: 0, sent: 0, none: 0 };
    ALL_TABLES.forEach(function (n) { counts[statusOf(n)[0]]++; });
    $('#arr-seg [data-f=vendor]').textContent = 'Med vendor (' + (ALL_TABLES.length - counts.none) + ')';
    $('#arr-seg [data-f=all]').textContent = 'Alle bord (' + ALL_TABLES.length + ')';
    $('#arr-summary').textContent = counts.items + ' med varer · ' + counts.in + ' innlogget · ' + counts.sent + ' kode sendt · ' + counts.none + ' uten kode';
    var rows = ALL_TABLES.filter(function (n) { var v = vByBooth(n); if (S.arrFilter === 'vendor' && !v && !q) return false; if (!q) return true; return String(n).indexOf(q) === 0 || (v && v.name.toLowerCase().indexOf(q) >= 0); });
    $('#arr-list').innerHTML = rows.length ? rows.map(function (n) {
      var v = vByBooth(n), st = statusOf(n);
      return '<li class="row"><div class="row-top"><b>Bord ' + n + ' <span class="muted" style="font-weight:500">· ' + (v ? esc(v.name) : 'Ledig') + '</span></b><span class="status st-' + st[0] + '">' + st[1] + '</span></div>' +
        '<div class="row-bot"><span class="mono ' + (v ? '' : 'muted') + '">' + (v ? v.code : '—') + '</span>' +
        (v ? '<button class="btn btn-secondary btn-sm" data-copy="' + v.code + '">Kopier kode</button>' : '<button class="btn btn-primary btn-sm" data-gen="' + n + '">Generer kode</button>') + '</div></li>';
    }).join('') : '<li class="empty">Ingen bord matcher «' + esc(q) + '»</li>';
  }
  var genBooth = null;
  $('#arr-list').addEventListener('click', function (e) {
    var c = e.target.closest('[data-copy]'); if (c) { copy(c.getAttribute('data-copy')); return; }
    var g = e.target.closest('[data-gen]'); if (g) { genBooth = Number(g.getAttribute('data-gen')); $('#gen-title').textContent = 'Generer kode for bord ' + genBooth; $('#gen-name').value = ''; openSheet('sh-gen'); }
  });
  $('#btn-gen-ok').addEventListener('click', function () {
    var name = $('#gen-name').value.trim(); if (!name) { toast('Skriv inn vendornavn'); return; }
    var code = newCode(genBooth);
    S.vendors.push({ id: 'v' + (++S.uid), name: name, booth: genBooth, code: code, loggedIn: false, bio: '', c: contact('', '', '', false, false, false) });
    closeSheet('sh-gen'); toast('Kode generert: ' + code); renderArrList();
  });

  /* ===== VENDOR: innlogging og profil ===== */
  $('#btn-v-demo').addEventListener('click', function () { $('#v-code').value = 'OTS-05-K7Q4'; $('#v-err').classList.remove('show'); });
  $('#v-code').addEventListener('input', function () { $('#v-err').classList.remove('show'); });
  function doLogin() {
    var raw = $('#v-code').value.trim().toUpperCase().replace(/\s+/g, ''), err = $('#v-err');
    if (!raw) { err.textContent = 'Skriv inn koden du har fått fra arrangøren.'; err.classList.add('show'); return; }
    if (!/^OTS-\d{2}-[A-Z0-9]{4}$/.test(raw)) { err.textContent = 'Feil format. Koden ser slik ut: OTS-12-K7Q4.'; err.classList.add('show'); return; }
    var v = find(S.vendors, function (x) { return x.code === raw; });
    if (!v) { err.textContent = 'Ugyldig kode. Sjekk koden, eller kontakt arrangøren.'; err.classList.add('show'); return; }
    v.loggedIn = true; S.session = v.id; $('#v-code').value = ''; toast('Innlogget som ' + v.name); go('vendor-home');
  }
  $('#btn-v-login').addEventListener('click', doLogin);
  $('#v-code').addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
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
    var v = vById(S.session), sc = $('#vk-scroll'), keep = [sc.scrollLeft, sc.scrollTop];
    sc.innerHTML = mapSVG({ own: v.booth, selected: S.vSel, clickable: true });
    $('#vk-caption').textContent = S.vSel ? '' : 'Ditt bord (' + v.booth + ') er gult. Trykk på et annet bord for å se vendor.';
    requestAnimationFrame(function () { if (recenter) centerOn(sc, [tc(v.booth)]); else { sc.scrollLeft = keep[0]; sc.scrollTop = keep[1]; } });
  }
  $('#vk-scroll').addEventListener('click', function (e) {
    var g = e.target.closest('[data-booth]'); if (!g) return;
    var n = Number(g.getAttribute('data-booth')), me = vById(S.session), v = vByBooth(n);
    if (n === me.booth) { toast('Dette er ditt bord'); return; }
    if (!isActive(v)) { toast('Bord ' + n + ' er ledig'); return; }
    S.vSel = n; renderVendorMap(false); showVendorInfo(v);
  });
  function showVendorInfo(v) {
    var its = itemsOf(v.id), c = v.c, rows = [];
    if (c.show.phone && c.phone) rows.push('<a href="tel:' + c.phone.replace(/\s/g, '') + '" data-contact="phone">📞 ' + esc(c.phone) + '</a>');
    if (c.show.email && c.email) rows.push('<a href="mailto:' + esc(c.email) + '" data-contact="email">✉️ ' + esc(c.email) + '</a>');
    if (c.show.ig && c.ig) rows.push('<a href="https://www.instagram.com/' + esc(c.ig.replace(/^@/, '')) + '" target="_blank" rel="noopener" data-contact="ig">📷 ' + esc(c.ig) + '</a>');
    $('#vinfo').innerHTML = '<div class="grip"></div><div class="sheet-head"><h3>' + esc(v.name) + ' <span class="status st-sent" style="vertical-align:middle">Bord ' + v.booth + '</span></h3><button class="icon-btn" data-close aria-label="Lukk">✕</button></div>' +
      (v.bio ? '<p class="muted" id="vi-bio">' + esc(v.bio) + '</p>' : '') +
      '<div class="sec-title">Kontakt · kun for vendors</div>' +
      (rows.length ? '<div class="contact">' + rows.join('') + '</div>' : '<p class="muted small">Denne vendoren deler ikke kontaktinfo.</p>') +
      '<div class="sec-title">Varer (' + its.length + ')</div>' +
      (its.length ? its.map(function (it) { return itemRow(it, {}); }).join('') : '<p class="muted small">Ingen varer ennå.</p>');
    openSheet('sh-vinfo');
  }
