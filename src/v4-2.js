  /* ===== EKSEMPELDATA (alt fiktivt) ===== */
  var CM = 'https://www.cardmarket.com/en/Pokemon', CL = 'https://collectr.com/';
  function contact(p, e, ig, sp, se, si) { return { phone: p, email: e, ig: ig, show: { phone: sp, email: se, ig: si } }; }
  var S = {
    ev: { name: 'Nordic Card Show Oslo', date: '2026-11-14', place: 'Fjellhamarhallen' },
    vendors: [
      { id: 'v1', name: 'Nordic Cards', booth: 5, code: 'OTS-05-K7Q4', loggedIn: true, bio: 'Pokémon-singles og graderte kort. Fokus på moderne sett og alt-arts.', c: contact('400 00 001', 'nordiccards@example.no', '@nordiccards.demo', true, true, true) },
      { id: 'v2', name: 'Binder Bros', booth: 8, code: 'OTS-08-M2XR', loggedIn: true, bio: 'To brødre med permene fulle av Eeveelutions og Evolving Skies.', c: contact('400 00 002', 'binderbros@example.no', '@binderbros.demo', false, true, true) },
      { id: 'v3', name: 'Pixel Packs', booth: 16, code: 'OTS-16-P9DW', loggedIn: true, bio: 'Retro Yu-Gi-Oh og Pokémon fra WotC-æraen.', c: contact('400 00 003', 'pixelpacks@example.no', '@pixelpacks.demo', false, true, false) },
      { id: 'v4', name: 'Legend Vault', booth: 21, code: 'OTS-21-L4VT', loggedIn: true, bio: 'Vintage MTG og high-end singles.', c: contact('400 00 004', 'legendvault@example.no', '@legendvault.demo', true, false, false) },
      { id: 'v5', name: 'Draugen Spillsenter', booth: 29, code: 'OTS-29-D8GN', loggedIn: true, bio: 'Spillbutikk med sealed Digimon og One Piece.', c: contact('400 00 005', 'draugen@example.no', '@draugen.demo', true, true, false) },
      { id: 'v6', name: 'Cardhaven', booth: 33, code: 'OTS-33-C3HV', loggedIn: true, bio: 'Lorcana og promoer. Glad i å prate kort.', c: contact('400 00 006', 'cardhaven@example.no', '@cardhaven.demo', false, false, true) },
      { id: 'v7', name: 'Mega Mox', booth: 40, code: 'OTS-40-X5MB', loggedIn: true, bio: 'Commander-staples til hverdagspriser. Store bulk-kasser.', c: contact('400 00 007', 'megamox@example.no', '@megamox.demo', false, true, true) },
      { id: 'v8', name: 'Sealed Only', booth: 52, code: 'OTS-52-S6QZ', loggedIn: true, bio: 'Kun forseglede produkter: booster boxes, ETB-er og cases.', c: contact('400 00 008', 'sealedonly@example.no', '@sealedonly.demo', false, true, false) },
      { id: 'v9', name: 'Kortkjelleren', booth: 18, code: 'OTS-18-R7KJ', loggedIn: true, bio: 'Oslo-butikk med alt fra bulk til sjeldne holo-kort.', c: contact('400 00 009', 'kortkjelleren@example.no', '', true, true, false) },
      { id: 'v10', name: 'Troll TCG', booth: 44, code: 'OTS-44-T2FN', loggedIn: true, bio: 'Nye på messa i år.', c: contact('', '', '', false, false, false) }
    ],
    items: [
      { id: 'i1', v: 'v1', name: 'Charizard ex (151)', kind: 'raw', cond: 'Near Mint', price: 890, link: 'cardmarket', images: [] },
      { id: 'i2', v: 'v1', name: 'Mewtwo ex (151)', kind: 'raw', cond: 'Near Mint', price: 240, link: 'collectr', images: [] },
      { id: 'i3', v: 'v2', name: 'Umbreon VMAX (Evolving Skies)', kind: 'raw', cond: 'Lightly Played', price: 450, images: [] },
      { id: 'i3b', v: 'v2', name: 'Espeon VMAX Alt Art', kind: 'raw', cond: 'Near Mint', price: 390, images: [] },
      { id: 'i4', v: 'v4', name: 'Black Lotus (proxy, demo)', kind: 'raw', cond: 'Near Mint', price: null, link: 'cardmarket', images: [] },
      { id: 'i4b', v: 'v4', name: 'Charizard Base Set 1st Ed. (demo)', kind: 'slab', cond: 'PSA 8 NM-MT', price: 12500, images: [], slab: { company: 'PSA', grade: 'PSA 8 NM-MT', cert: '73920145' } },
      { id: 'i5', v: 'v8', name: 'One Piece OP-05 booster box', kind: 'sealed', cond: 'Sealed', price: 1450, images: [] },
      { id: 'i6', v: 'v6', name: 'Lorcana Elsa (promo)', kind: 'raw', cond: 'Near Mint', price: 320, images: [] },
      { id: 'i6b', v: 'v6', name: 'Lorcana Mickey Mouse (Enchanted)', kind: 'raw', cond: 'Near Mint', price: 1900, images: [] },
      { id: 'i7', v: 'v3', name: 'Yu-Gi-Oh Blue-Eyes White Dragon (LOB)', kind: 'raw', cond: 'Lightly Played', price: 180, images: [] },
      { id: 'i7b', v: 'v3', name: 'Pokémon Base Set Blastoise', kind: 'raw', cond: 'Moderately Played', price: 650, images: [] },
      { id: 'i8', v: 'v7', name: 'MTG Sol Ring (Commander Masters)', kind: 'raw', cond: 'Near Mint', price: 25, images: [] },
      { id: 'i8b', v: 'v7', name: 'MTG The One Ring (LOTR)', kind: 'raw', cond: 'Near Mint', price: 2400, images: [] },
      { id: 'i9', v: 'v8', name: 'Pokémon ETB Ascended Heroes', kind: 'sealed', cond: 'Sealed', price: 799, images: [] },
      { id: 'i10', v: 'v5', name: 'Digimon BT-14 case', kind: 'sealed', cond: 'Sealed', price: 2100, images: [] },
      { id: 'i10b', v: 'v5', name: 'One Piece Luffy leader (OP05-060)', kind: 'raw', cond: 'Near Mint', price: 120, images: [] },
      { id: 'i11', v: 'v9', name: 'Zekrom-GX Rainbow (Unbroken Bonds)', kind: 'raw', cond: 'Near Mint', price: 350, images: [] },
      { id: 'i11b', v: 'v9', name: 'Pikachu ex (Surging Sparks)', kind: 'raw', cond: 'Near Mint', price: 275, images: [] },
      { id: 'i12', v: 'v10', name: 'Pikachu VMAX Rainbow', kind: 'raw', cond: 'Near Mint', price: 520, images: [] },
      { id: 'i12b', v: 'v10', name: 'Pokémon Booster bundle (151)', kind: 'sealed', cond: 'Sealed', price: 260, images: [] }
    ],
    apps: [],
    myApp: null, session: null, pos: null, target: null, sel: null, picking: false, zoom: 0.5, arrFilter: 'todo', uid: 100
  };
  S.items.forEach(function (it) { if (!it.images.length) it.images = [demoImg(it.name, it.kind === 'slab' ? 'Slab · eksempelbilde' : 'Eksempelbilde')]; });
  var LINKS = { cardmarket: ['Cardmarket', CM], collectr: ['Collectr', CL] };
  var PEOPLE = ['Ola Vikane', 'Ida Rønning', 'Sander Holt', 'Marte Aasen', 'Jonas Bakke', 'Silje Dahl', 'Håkon Lie', 'Nora Berg', 'Tobias Moe', 'Emilie Strand'];
  S.vendors.forEach(function (v, i) {
    S.apps.push({ id: 'a' + (i + 1), name: v.name, person: PEOPLE[i], email: v.c.email || v.name.toLowerCase().replace(/\s/g, '') + '@example.no', size: 'Standard', count: 1, desc: v.bio, status: 'sent', booth: v.booth, code: v.code, vid: v.id, date: '2026-09-' + (2 + i) });
  });
  S.apps.push(
    { id: 'a11', name: 'Norsk Kortlager', person: 'Andreas Fjell', email: 'andreas@norskkortlager.example.no', size: 'Standard', count: 2, desc: 'Bulk og singles for Magic og Pokémon. Store kasser med kort til 5 kr, mange Commander-staples.', status: 'new', booth: null, code: null, date: '2026-09-27' },
    { id: 'a12', name: 'Bergen Booster', person: 'Kari Nilsen', email: 'kari@bergenbooster.example.no', size: 'Halvt bord', count: 1, desc: 'Sealed One Piece og Lorcana, samt noen graderte kort (PSA/CGC).', status: 'new', booth: null, code: null, date: '2026-09-28' },
    { id: 'a13', name: 'Ravn Games', person: 'Mats Eriksen', email: 'mats@ravngames.example.no', size: 'Standard', count: 1, desc: 'Digimon og Flesh and Blood. Turneringsutstyr og sleeves i tillegg til kort.', status: 'approved', booth: 12, code: null, date: '2026-09-20' },
    { id: 'a14', name: 'Holmenkollen Hobby', person: 'Line Solberg', email: 'line@holmenkollenhobby.example.no', size: 'Standard', count: 2, desc: 'Pokémon fra Base Set til Sword & Shield. Mange holo-kort fra 90-tallet.', status: 'paid', booth: 27, code: null, date: '2026-09-15' },
    { id: 'a15', name: 'Sjøfolk Sealed', person: 'Petter Haugen', email: 'petter@sjofolksealed.example.no', size: 'Standard', count: 3, desc: 'Kun forseglede produkter, mest Magic-bokser.', status: 'rejected', booth: null, code: null, reason: 'For mange sealed-vendors i år.', date: '2026-09-12' }
  );
  var STAT = {
    new: { t: 'Søknad mottatt', d: 'new' }, approved: { t: 'Godkjent – venter på betaling', d: 'appr' },
    paid: { t: 'Betalt – kode ikke sendt', d: 'paid' }, sent: { t: 'Betalt – kode sendt', d: 'sent' }, rejected: { t: 'Avslått', d: 'rej' }
  };
  /* Eksempelkatalog (demo) */
  var CATALOG = [
    { name: 'Charizard ex', set: '151', no: '199/165', kind: 'raw', game: 'Pokémon' },
    { name: 'Charizard ex', set: 'Obsidian Flames', no: '223/197', kind: 'raw', game: 'Pokémon' },
    { name: 'Mewtwo ex', set: '151', no: '193/165', kind: 'raw', game: 'Pokémon' },
    { name: 'Pikachu ex', set: 'Surging Sparks', no: '238/191', kind: 'raw', game: 'Pokémon' },
    { name: 'Umbreon VMAX Alt Art', set: 'Evolving Skies', no: '215/203', kind: 'raw', game: 'Pokémon' },
    { name: 'Lugia V Alt Art', set: 'Silver Tempest', no: '186/195', kind: 'raw', game: 'Pokémon' },
    { name: 'Sol Ring', set: 'Commander Masters', no: '410', kind: 'raw', game: 'Magic' },
    { name: 'The One Ring', set: 'LOTR: Tales of Middle-earth', no: '246', kind: 'raw', game: 'Magic' },
    { name: 'Blue-Eyes White Dragon', set: 'Legend of Blue Eyes', no: 'LOB-001', kind: 'raw', game: 'Yu-Gi-Oh' },
    { name: 'Elsa – Spirit of Winter', set: 'The First Chapter', no: '207/204', kind: 'raw', game: 'Lorcana' },
    { name: 'Monkey D. Luffy (leader)', set: 'OP-05 Awakening of the New Era', no: 'OP05-060', kind: 'raw', game: 'One Piece' },
    { name: 'OP-05 booster box', set: 'Awakening of the New Era', no: 'OP-05', kind: 'sealed', game: 'One Piece' },
    { name: 'Elite Trainer Box', set: 'Ascended Heroes', no: 'ETB', kind: 'sealed', game: 'Pokémon' },
    { name: 'Booster bundle', set: '151', no: '6 pk', kind: 'sealed', game: 'Pokémon' },
    { name: 'BT-14 case', set: 'Blast Ace', no: 'BT-14', kind: 'sealed', game: 'Digimon' },
    { name: 'Play Booster box', set: 'Foundations', no: 'FDN', kind: 'sealed', game: 'Magic' }
  ];
  var SLAB_SCAN = [
    { cat: 0, company: 'PSA', grade: 'PSA 10 GEM MT', cert: '84512377' },
    { cat: 2, company: 'CGC', grade: 'CGC 9.5 Mint+', cert: '4123456001' },
    { cat: 3, company: 'TAG', grade: 'TAG 10 Pristine', cert: 'T0A3F92K' },
    { cat: 4, company: 'BGS', grade: 'BGS 9.5 Gem Mint', cert: '0012345678' },
    { cat: 5, company: 'ACE', grade: 'ACE 10 Gem Mint', cert: 'ACE-0098123' }
  ];
  var OFFICIAL_URL = { TAG: 'https://example.com/demo/tag-verify?cert=', CGC: 'https://example.com/demo/cgc-verify?cert=' };
  var catImgCache = {};
  function catImg(i, sub) { var k = i + '|' + (sub || ''); if (!catImgCache[k]) catImgCache[k] = demoImg(CATALOG[i].name, sub || 'Eksempelbilde'); return catImgCache[k]; }
  function catLine(c) { return c.set + ' · ' + (c.kind === 'sealed' ? c.no : '#' + c.no); }

  function vByBooth(n) { return find(S.vendors, function (v) { return v.booth === n; }); }
  function vById(id) { return find(S.vendors, function (v) { return v.id === id; }); }
  function appById(id) { return find(S.apps, function (a) { return a.id === id; }); }
  function itemsOf(id) { return S.items.filter(function (i) { return i.v === id; }); }
  function isActive(v) { return !!(v && v.loggedIn); }
  /* Bord som er reservert av en søknad (godkjent eller videre) */
  function reservedBy(n) { return find(S.apps, function (a) { return a.booth === n && a.status !== 'rejected' && a.status !== 'new'; }); }
  function freeTables() { return ALL_TABLES.filter(function (n) { return !reservedBy(n); }); }
  function price(it) { return it.price == null ? 'Pris ved bordet' : Number(it.price).toLocaleString('nb-NO') + ' kr'; }
  function condLine(it) { return it.kind === 'slab' && it.slab ? it.slab.grade + ' · slab' : (it.cond || ''); }
  function dateLine() { var s = new Date(S.ev.date + 'T12:00:00').toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function copy(text) {
    var done = function () { toast('Kode kopiert: ' + text); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
  }
  var CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  function newCode(n) { var s = ''; for (var i = 0; i < 4; i++) s += CH[Math.floor(Math.random() * CH.length)]; return 'OTS-' + (n < 10 ? '0' : '') + n + '-' + s; }
