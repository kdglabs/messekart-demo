  /* ===== VENDOR: søknad og status ===== */
  $('#btn-apply').addEventListener('click', function () { go(S.myApp ? 'status' : 'soknad'); });
  $('#btn-sk-demo').addEventListener('click', function () {
    $('#sk-firma').value = 'Fenrir Kort & Spill'; $('#sk-person').value = 'Mats Eriksen'; $('#sk-epost').value = 'mats@fenrirkort.example.no';
    $('#sk-str').selectedIndex = 1; $('#sk-ant').selectedIndex = 0; $('#sk-desc').value = 'Pokémon- og Lorcana-singles, litt sealed og noen graderte kort (PSA).'; $('#sk-err').classList.remove('show');
  });
  $('#btn-sk-send').addEventListener('click', function () {
    var f = $('#sk-firma').value.trim(), p = $('#sk-person').value.trim(), e = $('#sk-epost').value.trim(), d = $('#sk-desc').value.trim(), er = $('#sk-err');
    var msg = !f ? 'Skriv inn firmanavn.' : !p ? 'Skriv inn kontaktperson.' : !/^\S+@\S+\.\S+$/.test(e) ? 'Skriv inn en gyldig e-postadresse.' : !d ? 'Fortell kort hva du selger.' : '';
    if (msg) { er.textContent = msg; er.classList.add('show'); return; }
    var a = { id: 'a' + (++S.uid), name: f, person: p, email: e, size: $('#sk-str').value.replace(/ \(.*/, ''), count: Number($('#sk-ant').value), desc: d, status: 'new', booth: null, code: null, date: '2026-09-30', mine: true };
    S.apps.unshift(a); S.myApp = a.id; go('status'); toast('Søknaden er sendt');
  });
  function renderStatus() {
    var a = S.myApp && appById(S.myApp), b = $('#st-body'), dk = $('#st-dock');
    if (!a) { go('vendor'); return; }
    var stage = { new: 1, approved: 2, paid: 3, sent: 4, rejected: 0 }[a.status];
    var h = '<div class="navrow"><button class="back" data-back-x data-go="vendor">' + ic('back') + 'Tilbake</button></div>';
    var big = { new: 'Søknaden er sendt', approved: 'Godkjent – venter på betaling', paid: 'Betalingen er registrert', sent: 'Du har fått bordkode', rejected: 'Søknaden er avslått' }[a.status];
    h += '<h1 class="tight" id="st-title">' + big + '</h1>';
    if (a.status === 'new') h += '<p class="lead">Arrangøren har mottatt søknaden fra ' + esc(a.name) + ' og svarer på ' + esc(a.email) + '.</p>';
    if (a.status === 'approved') h += '<p class="lead">Du har fått bord ' + a.booth + '. Arrangøren fakturerer deg utenfor appen. Når betalingen er registrert, får du bordkoden.</p>';
    if (a.status === 'paid') h += '<p class="lead">Arrangøren sender bordkoden til ' + esc(a.email) + ' i løpet av kort tid.</p>';
    if (a.status === 'sent') h += '<p class="lead">Koden ble sendt til ' + esc(a.email) + ' (demo). Bruk den til å logge inn og legge inn varer.</p>';
    if (a.status === 'rejected') h += '<p class="lead">' + esc(a.reason || 'Arrangøren kan ikke tilby bord denne gangen.') + '</p>';
    if (a.status === 'sent') {
      h += '<label class="f"><span>Din bordkode</span><input id="st-code" class="code" value="' + esc(a.code) + '" readonly></label>';
    } else if (a.status !== 'rejected') {
      var L = ['Søknad mottatt', 'Godkjent, bord tildelt', 'Betalt (faktura utenfor appen)', 'Bordkode mottatt'];
      h += '<ol class="steps">' + L.map(function (t, i) { return '<li class="' + (i + 1 < stage ? 'done' : i + 1 === stage ? 'now' : '') + '">' + t + (i === 3 && stage < 4 ? '<small>Vises her når arrangøren har sendt den</small>' : '') + '</li>'; }).join('') + '</ol>';
    }
    h += '<h2>Søknaden</h2><div class="kv"><span>Firma</span><span>' + esc(a.name) + '</span></div><div class="kv"><span>Kontaktperson</span><span>' + esc(a.person) + '</span></div><div class="kv"><span>Bord</span><span>' + a.count + ' × ' + esc(a.size.toLowerCase()) + (a.booth ? ' · nr. ' + a.booth : '') + '</span></div>';
    b.innerHTML = h;
    var d = '';
    if (a.status === 'sent') d = '<button class="btn primary" id="btn-st-login">Logg inn</button>';
    else if (a.status === 'rejected') d = '<button class="btn sec" data-go="vendor">Tilbake</button>';
    else d = '<button class="btn sec" data-go="arr">Demo: bytt til arrangør</button>';
    dk.innerHTML = d;
  }
  $('#st-dock').addEventListener('click', function (e) { if (e.target.closest('#btn-st-login')) loginWith($('#st-code').value, $('#v-err')); });

  /* ===== ARRANGØR ===== */
  $('#btn-ev-save').addEventListener('click', function () { S.ev.name = $('#ev-name').value.trim() || S.ev.name; S.ev.date = $('#ev-date').value || S.ev.date; S.ev.place = $('#ev-place').value.trim() || S.ev.place; toast('Messe lagret'); go('arr'); });
  VIEWS.arr = function () { renderApps(); };
  VIEWS['arr-bord'] = function () { renderBord(); };
  VIEWS['arr-messe'] = function () { $('#ev-name').value = S.ev.name; $('#ev-date').value = S.ev.date; $('#ev-place').value = S.ev.place; $('#ev-tables').textContent = NTAB + ' (forenklet utkast)'; };
  function cnt(st) { return S.apps.filter(function (a) { return a.status === st; }).length; }
  function renderApps() {
    $('#arr-lead').textContent = S.ev.name + ' · ' + S.apps.length + ' søknader';
    $('#arr-num').innerHTML = '<div><b>' + cnt('new') + '</b><span>nye søknader</span></div><div><b>' + cnt('approved') + '</b><span>venter på betaling</span></div><div><b>' + cnt('paid') + '</b><span>klar for kode</span></div>';
    var rows = S.apps.filter(function (a) { return a.status !== 'rejected' && (S.arrFilter === 'all' || a.status === 'new' || a.status === 'approved' || a.status === 'paid'); });
    var rej = S.apps.filter(function (a) { return a.status === 'rejected'; });
    var order = { new: 0, paid: 1, approved: 2, sent: 3, rejected: 4 };
    rows = rows.slice().sort(function (x, y) { return order[x.status] - order[y.status]; });
    $('#arr-apps').innerHTML = rows.length ? rows.map(function (a) {
      var st = STAT[a.status], acts = '';
      if (a.status === 'new') acts = '<button class="btn primary grow" data-act="approve" data-id="' + a.id + '">Godkjenn</button><button class="btn sec" style="width:auto" data-act="reject" data-id="' + a.id + '">Avslå</button>';
      if (a.status === 'approved') acts = '<button class="btn primary grow" data-act="paid" data-id="' + a.id + '">Marker som betalt</button>';
      if (a.status === 'paid') acts = '<button class="btn primary grow" data-act="send" data-id="' + a.id + '">Send kode</button>';
      return appLi(a, acts);
    }).join('') : '<li class="empty">Ingen søknader som trenger handling.</li>';
    $('#arr-rej').innerHTML = rej.length ? '<h2>Avslått (' + rej.length + ')</h2><ul class="apps" id="arr-rej-list">' + rej.map(function (a) {
      return appLi(a, '<button class="btn sec sm" data-act="undo" data-id="' + a.id + '">Angre avslag</button>');
    }).join('') + '</ul>' : '';
    $('#arr-seg [data-f=todo]').textContent = 'Trenger handling (' + (cnt('new') + cnt('approved') + cnt('paid')) + ')';
    $('#arr-seg [data-f=all]').textContent = 'Alle (' + S.apps.length + ')';
    $$('#arr-seg button').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-f') === S.arrFilter); });
  }
  function appLi(a, acts) {
      var st = STAT[a.status];
      var extra = a.status === 'sent' ? '<div class="mu sm mono" style="margin-top:4px">' + esc(a.code) + '</div>' : a.status === 'rejected' && a.reason ? '<div class="mu sm" style="margin-top:4px">Begrunnelse: ' + esc(a.reason) + '</div>' : '';
      return '<li class="app" data-app="' + a.id + '"><div class="top"><div><div class="nm">' + esc(a.name) + '</div><div class="meta">' + esc(a.person) + ' · ' + a.count + ' × ' + esc(a.size.toLowerCase()) + '</div></div><div class="bord">' + (a.booth ? 'Bord ' + a.booth : '') + '</div></div>' +
        '<div class="meta" style="margin-top:6px;color:var(--tx)">' + esc(a.desc) + '</div>' +
        '<div class="st"><span class="dot ' + st.d + '"></span>' + st.t + '</div>' + extra + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</li>';
  }
  $('#arr-seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.arrFilter = b.getAttribute('data-f'); renderApps(); });
  function onAppAct(e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = appById(b.getAttribute('data-id')), act = b.getAttribute('data-act');
    if (act === 'approve') openApprove(a); else if (act === 'reject') openReject(a); else if (act === 'paid') openPaid(a); else if (act === 'send') openSend(a);
    else if (act === 'undo') { a.status = 'new'; a.reason = null; a.booth = null; toast('Avslaget er angret. ' + a.name + ' ligger igjen under nye søknader.'); renderApps(); }
  }
  $('#arr-apps').addEventListener('click', onAppAct); $('#arr-rej').addEventListener('click', onAppAct);
  function shHead(t) { return '<div class="grip"><i></i></div><div class="sh-head"><h3>' + t + '</h3><button class="ib" data-close aria-label="Lukk">' + ic('x') + '</button></div>'; }

  /* Godkjenn + bordtildeling */
  var AP = null;
  function suggestTables(a) { var f = freeTables(), out = []; if (AP && AP.pick && f.indexOf(AP.pick) >= 0) out.push(AP.pick); f.forEach(function (n) { if (out.length < 6 && out.indexOf(n) < 0 && !vByBooth(n)) out.push(n); }); return out.sort(function (x, y) { return x - y; }); }
  function openApprove(a) {
    var f = freeTables(), sug = f.filter(function (n) { return !vByBooth(n); });
    AP = { a: a, pick: a.count > 1 ? null : sug[Math.floor(sug.length / 3)], sug: sug.slice(2, 8) };
    AP.pick = AP.sug[0]; renderApprove(); openSheet('sh-approve');
  }
  function renderApprove() {
    var a = AP.a, sh = $('#approve');
    var ch = AP.sug.map(function (n) { return '<button class="chip' + (AP.pick === n ? ' on' : '') + '" data-tb="' + n + '">' + n + '</button>'; }).join('');
    sh.innerHTML = shHead('Godkjenn ' + esc(a.name)) + '<div class="sh-body"><p class="mu" style="padding-bottom:10px">Søker om ' + a.count + ' × ' + esc(a.size.toLowerCase()) + '. Velg bord: ledige forslag eller trykk i kartet.</p>' +
      '<div class="flabel">Ledige bord</div><div class="chips" id="ap-chips">' + ch + '</div>' +
      '<div class="pickmap" id="ap-map"></div><div class="mu sm">Ledige bord har blå kant. Grå bord er tatt eller reservert.</div></div>' +
      '<div class="sh-foot"><button class="btn primary" id="btn-ap-ok">Godkjenn med bord ' + AP.pick + '</button><button class="btn txt" data-close>Avbryt</button></div>';
    var m = $('#ap-map');
    m.innerHTML = '<div class="mapscroll" id="ap-scroll"></div><div class="zoomb" style="top:8px"><button data-zoom="1" aria-label="Zoom inn">+</button><button data-zoom="-1" aria-label="Zoom ut">−</button></div>';
    var sc = $('#ap-scroll'), t = TABLES[AP.pick], z = AP.z || 0.36;
    mapInto(sc, mapSVG({ mode: 'pick', chosen: AP.pick }), null, z, { top: 0, bottom: 0 });
    sc._zget = function () { return AP.z || 0.36; }; sc._zset = function (v) { AP.z = v; };
    attachZoom(sc);
    if (AP.keep) { sc.scrollLeft = AP.keep[0]; sc.scrollTop = AP.keep[1]; AP.keep = null; }
    else { sc.scrollLeft = Math.max(0, (t.x + t.w / 2) * z - sc.clientWidth / 2); sc.scrollTop = Math.max(0, (t.y + t.h / 2) * z - sc.clientHeight / 2); }
  }
  $('#approve').addEventListener('click', function (e) {
    var c = e.target.closest('[data-tb]'), g = e.target.closest('[data-booth]');
    if (c) { AP.pick = Number(c.getAttribute('data-tb')); renderApprove(); return; }
    if (e.target.closest('#ap-map') && !g) return;
    if (g && e.target.closest('#ap-map')) { var n = Number(g.getAttribute('data-booth')); if (reservedBy(n)) { toast('Bord ' + n + ' er tatt'); return; } if (AP.sug.indexOf(n) < 0) AP.sug = AP.sug.concat(n).sort(function (x, y) { return x - y; }); AP.pick = n; var s0 = $('#ap-scroll'); AP.keep = [s0.scrollLeft, s0.scrollTop]; renderApprove(); return; }
    if (e.target.closest('#btn-ap-ok')) { AP.a.status = 'approved'; AP.a.booth = AP.pick; closeSheet('sh-approve'); toast(AP.a.name + ' godkjent med bord ' + AP.pick); renderApps(); }
  });
  /* Avslå */
  function openReject(a) {
    AP = { a: a };
    $('#reject').innerHTML = shHead('Avslå ' + esc(a.name)) + '<div class="sh-body"><label class="f"><span>Begrunnelse (vises for vendor)</span><textarea id="rj-reason" placeholder="F.eks. Hallen er full"></textarea></label></div><div class="sh-foot"><button class="btn primary" id="btn-rj-ok">Avslå søknaden</button><button class="btn txt" data-close>Avbryt</button></div>';
    openSheet('sh-reject');
  }
  $('#reject').addEventListener('click', function (e) { if (e.target.closest('#btn-rj-ok')) { AP.a.status = 'rejected'; AP.a.reason = $('#rj-reason').value.trim() || 'Arrangøren kan ikke tilby bord denne gangen.'; closeSheet('sh-reject'); toast('Søknaden er avslått'); renderApps(); } });
  /* Marker som betalt */
  function openPaid(a) {
    AP = { a: a };
    $('#paid').innerHTML = shHead('Marker som betalt') + '<div class="sh-body"><p class="mu" style="padding-bottom:12px">Bekreft at fakturaen er betalt. Betalingen skjer utenfor appen, og appen kontrollerer ingenting.</p>' +
      '<div class="kv"><span>Vendor</span><span>' + esc(a.name) + '</span></div><div class="kv"><span>Bord</span><span>' + a.booth + '</span></div><div class="kv"><span>Størrelse</span><span>' + a.count + ' × ' + esc(a.size.toLowerCase()) + '</span></div></div>' +
      '<div class="sh-foot"><button class="btn primary" id="btn-paid-ok">Marker som betalt</button><button class="btn txt" data-close>Avbryt</button></div>';
    openSheet('sh-paid');
  }
  $('#paid').addEventListener('click', function (e) { if (e.target.closest('#btn-paid-ok')) { AP.a.status = 'paid'; closeSheet('sh-paid'); toast('Betaling registrert. Neste steg: send kode.'); renderApps(); } });
  /* Send kode */
  function openSend(a) {
    AP = { a: a }; if (!a.code) a.code = newCode(a.booth);
    $('#send').innerHTML = shHead('Send kode til ' + esc(a.name)) + '<div class="sh-body"><p class="mu" style="padding-bottom:12px">Koden gir tilgang til bord ' + a.booth + ' og sendes til ' + esc(a.email) + '. Vendor ser den ikke før du sender.</p>' +
      '<div class="codebox"><span>Bordkode</span><b id="sd-code">' + esc(a.code) + '</b></div>' +
      '<div class="flabel" style="display:flex;justify-content:space-between;align-items:center">Forhåndsvisning av e-posten <span class="tag">DEMO</span></div>' +
      '<div class="mailprev" id="sd-mail"><div class="mh"><span>Til</span>' + esc(a.email) + '</div><div class="mh"><span>Emne</span>Bordkode for ' + esc(S.ev.name) + '</div>' +
      '<div class="mb">Hei ' + esc(a.person.split(' ')[0]) + ',<br><br>her er bordkoden din til ' + esc(S.ev.name) + ' (' + esc(S.ev.place) + '): <b class="mono">' + esc(a.code) + '</b><br><br>Koden gjelder bord ' + a.booth + '. Åpne Messekart, velg «Vendor» og «Jeg har en kode», så kan du legge inn varene dine.<br><br>Vi sees på messen!<br>Arrangøren</div></div>' +
      '<p class="mu sm" style="padding-top:8px">Simulert. Det sendes ingen ekte e-post.</p></div>' +
      '<div class="sh-foot"><button class="btn primary" id="btn-send-ok">Send kode</button><button class="btn txt" data-close>Avbryt</button></div>';
    openSheet('sh-send');
  }
  $('#send').addEventListener('click', function (e) {
    if (!e.target.closest('#btn-send-ok')) return;
    var a = AP.a;
    if (a.status !== 'paid') { toast('Koden kan bare sendes etter at bordet er markert som betalt'); return; }
    a.status = 'sent';
    if (!a.vid) { var id = 'v' + (++S.uid); S.vendors.push({ id: id, name: a.name, booth: a.booth, code: a.code, loggedIn: false, bio: a.desc, c: contact('', a.email, '', false, false, false) }); a.vid = id; }
    $('#send').innerHTML = shHead('Kode sendt') + '<div class="sh-body"><p style="font-size:18px;font-weight:700;padding:4px 0 8px" id="sd-ok">Kode sendt til vendor på e-post (demo)</p><p class="mu">' + esc(a.name) + ' (' + esc(a.email) + ') har fått koden <span class="mono" style="color:var(--tx)">' + esc(a.code) + '</span> for bord ' + a.booth + '. Det sendes ingen ekte e-post.</p></div><div class="sh-foot"><button class="btn primary" data-close>Ferdig</button></div>';
    renderApps();
  });

  /* Bordliste */
  function renderBord() {
    var q = $('#arr-q').value.trim().toLowerCase(), filt = $('#ab-seg .on').getAttribute('data-f');
    var used = ALL_TABLES.filter(function (n) { return !!reservedBy(n); }).length;
    $('#ab-lead').textContent = used + ' av ' + NTAB + ' bord er tildelt · ' + (NTAB - used) + ' ledige';
    var rows = ALL_TABLES.filter(function (n) {
      var ap = reservedBy(n); if (filt === 'used' && !ap && !q) return false; if (!q) return true;
      return String(n).indexOf(q) === 0 || (ap && ap.name.toLowerCase().indexOf(q) >= 0);
    });
    $('#ab-list').innerHTML = rows.length ? rows.map(function (n) {
      var ap = reservedBy(n), st = ap ? STAT[ap.status].t : 'Ledig';
      return '<li><div class="row"><span class="g"><span class="t">Bord ' + n + ' · ' + (ap ? esc(ap.name) : '<span class="mu" style="font-weight:500">Ledig</span>') + '</span><br><span class="d">' + st + '</span></span></div></li>';
    }).join('') : '<li class="empty">Ingen bord matcher «' + esc(q) + '».</li>';
  }
  $('#arr-q').addEventListener('input', renderBord);
  $('#ab-seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('#ab-seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); renderBord(); });
