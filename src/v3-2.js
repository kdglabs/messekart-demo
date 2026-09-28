  /* ===== EKSEMPELDATA ===== */
  var CM = 'https://www.cardmarket.com/en/Pokemon', CL = 'https://collectr.com/';
  function contact(p, e, ig, sp, se, si) { return { phone: p, email: e, ig: ig, show: { phone: sp, email: se, ig: si } }; }
  var S = {
    ev: { name: 'Oslo TCG Show', date: '2026-11-14', place: 'Oslo Kongressenter, hall B' },
    vendors: [
      { id: 'v1', name: 'Nordic Cards', booth: 5, code: 'OTS-05-K7Q4', loggedIn: true, bio: 'Pokémon-singles og graderte kort. Fokus på moderne sett og alt-arts.', c: contact('400 00 001', 'nordiccards@example.no', '@nordiccards.demo', true, true, true) },
      { id: 'v2', name: 'Binder Bros', booth: 8, code: 'OTS-08-M2XR', loggedIn: true, bio: 'To brødre med permene fulle av Eeveelutions og Evolving Skies.', c: contact('400 00 002', 'binderbros@example.no', '@binderbros.demo', false, true, true) },
      { id: 'v3', name: 'Pixel Packs', booth: 16, code: 'OTS-16-P9DW', loggedIn: true, bio: 'Retro Yu-Gi-Oh og Pokémon fra WotC-æraen.', c: contact('400 00 003', 'pixelpacks@example.no', '@pixelpacks.demo', false, true, false) },
      { id: 'v4', name: 'Legend Vault', booth: 21, code: 'OTS-21-L4VT', loggedIn: true, bio: 'Vintage MTG og high-end singles (demo-samling).', c: contact('400 00 004', 'legendvault@example.no', '@legendvault.demo', true, false, false) },
      { id: 'v5', name: 'Draugen Spillsenter', booth: 29, code: 'OTS-29-D8GN', loggedIn: true, bio: 'Spillbutikk med sealed Digimon og One Piece.', c: contact('400 00 005', 'draugen@example.no', '@draugen.demo', true, true, false) },
      { id: 'v6', name: 'Cardhaven', booth: 33, code: 'OTS-33-C3HV', loggedIn: true, bio: 'Lorcana og promoer. Glad i å prate kort.', c: contact('400 00 006', 'cardhaven@example.no', '@cardhaven.demo', false, false, true) },
      { id: 'v7', name: 'Mega Mox', booth: 40, code: 'OTS-40-X5MB', loggedIn: true, bio: 'Commander-staples til hverdagspriser. Store bulk-kasser.', c: contact('400 00 007', 'megamox@example.no', '@megamox.demo', false, true, true) },
      { id: 'v8', name: 'Sealed Only', booth: 52, code: 'OTS-52-S6QZ', loggedIn: true, bio: 'Kun forseglede produkter: booster boxes, ETB-er og cases.', c: contact('400 00 008', 'sealedonly@example.no', '@sealedonly.demo', false, true, false) },
      { id: 'v9', name: 'Kortkjelleren', booth: 18, code: 'OTS-18-R7KJ', loggedIn: false, bio: '', c: contact('', '', '', false, false, false) },
      { id: 'v10', name: 'Troll TCG', booth: 44, code: 'OTS-44-T2FN', loggedIn: true, bio: 'Nye på messa i år.', c: contact('', '', '', false, false, false) }
    ],
    items: [
      { id: 'i1', v: 'v1', name: 'Charizard ex (151)', kind: 'raw', cond: 'Near Mint', price: 890, link: 'cardmarket', images: [demoImg('Charizard ex (151)', 'Eksempelbilde', '#f97316', '#b91c1c')] },
      { id: 'i2', v: 'v1', name: 'Pikachu Illustrator (proxy/demo)', kind: 'raw', cond: 'NM', price: 1200, link: 'collectr', images: [] },
      { id: 'i3', v: 'v2', name: 'Umbreon VMAX (Evolving Skies)', kind: 'raw', cond: 'Lightly Played', price: 450, images: [demoImg('Umbreon VMAX', 'Eksempelbilde', '#312e81', '#0f172a')] },
      { id: 'i4', v: 'v4', name: 'Black Lotus (Alpha, demo)', kind: 'raw', cond: 'NM', price: null, link: 'cardmarket', images: [] },
      { id: 'i5', v: 'v8', name: 'One Piece OP-05 booster box', kind: 'sealed', cond: 'Sealed', price: 1450, images: [demoImg('OP-05 booster box', 'Eksempelbilde', '#dc2626', '#1e3a8a')] },
      { id: 'i6', v: 'v6', name: 'Lorcana Elsa (promo)', kind: 'raw', cond: 'NM', price: 320, images: [] },
      { id: 'i7', v: 'v3', name: 'Yu-Gi-Oh Blue-Eyes White Dragon (LOB)', kind: 'raw', cond: 'LP', price: 180, images: [] },
      { id: 'i8', v: 'v7', name: 'MTG Sol Ring (Commander Masters)', kind: 'raw', cond: 'NM', price: 25, images: [demoImg('Sol Ring', 'Eksempelbilde', '#78716c', '#292524')] },
      { id: 'i9', v: 'v8', name: 'Pokémon ETB Ascended Heroes', kind: 'sealed', cond: 'Sealed', price: 799, images: [] },
      { id: 'i10', v: 'v5', name: 'Digimon BT-14 case', kind: 'sealed', cond: 'Sealed', price: 2100, images: [] }
    ],
    session: null, pos: null, target: null, picking: false, vSel: null, zoom: 1.2, arrFilter: 'vendor', uid: 100
  };
  var LINKS = { cardmarket: ['Cardmarket', CM], collectr: ['Collectr', CL] };
  /* Eksempelkatalog (demo): raw og sealed med sett og nummer */
  var CATALOG = [
    { name: 'Charizard ex', set: '151', no: '199/165', kind: 'raw', game: 'Pokémon', c: ['#f97316', '#b91c1c'] },
    { name: 'Charizard ex', set: 'Obsidian Flames', no: '223/197', kind: 'raw', game: 'Pokémon', c: ['#ea580c', '#1f2937'] },
    { name: 'Mewtwo ex', set: '151', no: '193/165', kind: 'raw', game: 'Pokémon', c: ['#a855f7', '#312e81'] },
    { name: 'Pikachu ex', set: 'Surging Sparks', no: '238/191', kind: 'raw', game: 'Pokémon', c: ['#facc15', '#b45309'] },
    { name: 'Umbreon VMAX Alt Art', set: 'Evolving Skies', no: '215/203', kind: 'raw', game: 'Pokémon', c: ['#312e81', '#0f172a'] },
    { name: 'Lugia V Alt Art', set: 'Silver Tempest', no: '186/195', kind: 'raw', game: 'Pokémon', c: ['#94a3b8', '#1e3a8a'] },
    { name: 'Sol Ring', set: 'Commander Masters', no: '410', kind: 'raw', game: 'Magic', c: ['#78716c', '#292524'] },
    { name: 'The One Ring', set: 'LOTR: Tales of Middle-earth', no: '246', kind: 'raw', game: 'Magic', c: ['#ca8a04', '#422006'] },
    { name: 'Blue-Eyes White Dragon', set: 'Legend of Blue Eyes', no: 'LOB-001', kind: 'raw', game: 'Yu-Gi-Oh', c: ['#38bdf8', '#1e3a8a'] },
    { name: 'Elsa – Spirit of Winter', set: 'The First Chapter', no: '207/204', kind: 'raw', game: 'Lorcana', c: ['#67e8f9', '#1e40af'] },
    { name: 'Monkey D. Luffy (leader)', set: 'OP-05 Awakening of the New Era', no: 'OP05-060', kind: 'raw', game: 'One Piece', c: ['#ef4444', '#7f1d1d'] },
    { name: 'OP-05 booster box', set: 'Awakening of the New Era', no: 'OP-05', kind: 'sealed', game: 'One Piece', c: ['#dc2626', '#1e3a8a'] },
    { name: 'Elite Trainer Box', set: 'Ascended Heroes', no: 'ETB', kind: 'sealed', game: 'Pokémon', c: ['#0ea5e9', '#1e293b'] },
    { name: 'Booster bundle', set: '151', no: '6 pk', kind: 'sealed', game: 'Pokémon', c: ['#f43f5e', '#1e293b'] },
    { name: 'BT-14 case', set: 'Blast Ace', no: 'BT-14', kind: 'sealed', game: 'Digimon', c: ['#2563eb', '#0f172a'] },
    { name: 'Play Booster box', set: 'Foundations', no: 'FDN', kind: 'sealed', game: 'Magic', c: ['#16a34a', '#14532d'] }
  ];
  /* Simulert kameraskann av slab (demo): forslag fra flere selskaper */
  var SLAB_SCAN = [
    { cat: 0, company: 'PSA', grade: 'PSA 10 GEM MT', cert: '84512377' },
    { cat: 2, company: 'CGC', grade: 'CGC 9.5 Mint+', cert: '4123456001' },
    { cat: 3, company: 'TAG', grade: 'TAG 10 Pristine', cert: 'T0A3F92K' },
    { cat: 4, company: 'BGS', grade: 'BGS 9.5 Gem Mint', cert: '0012345678' },
    { cat: 5, company: 'ACE', grade: 'ACE 10 Gem Mint', cert: 'ACE-0098123' }
  ];
  /* Fiktive «offisielle sider» for TAG og CGC (demo-URL-er, ingen ekte oppslag) */
  var OFFICIAL_URL = { TAG: 'https://example.com/demo/tag-verify?cert=', CGC: 'https://example.com/demo/cgc-verify?cert=' };
  var catImgCache = {};
  function catImg(i, sub) { var k = i + '|' + (sub || ''); if (!catImgCache[k]) { var c = CATALOG[i]; catImgCache[k] = demoImg(c.name, sub || 'Plassholder · demo', c.c[0], c.c[1]); } return catImgCache[k]; }
  function catLine(c) { return c.set + ' · ' + (c.kind === 'sealed' ? c.no : '#' + c.no); }

  function vByBooth(n) { return find(S.vendors, function (v) { return v.booth === n; }); }
  function vById(id) { return find(S.vendors, function (v) { return v.id === id; }); }
  function itemsOf(id) { return S.items.filter(function (i) { return i.v === id; }); }
  function isActive(v) { return !!(v && v.loggedIn); }
  function statusOf(n) {
    var v = vByBooth(n);
    if (!v || !v.code) return ['none', 'Ingen kode'];
    if (!v.loggedIn) return ['sent', 'Kode sendt'];
    if (itemsOf(v.id).length) return ['items', 'Varer lagt inn'];
    return ['in', 'Innlogget'];
  }
  function price(it) { return it.price == null ? 'Pris ved bordet' : Number(it.price).toLocaleString('nb-NO') + ' kr'; }
  function condLine(it) { return it.kind === 'slab' && it.slab ? it.slab.grade + ' · slab' : (it.cond || ''); }
  function dateLine() { var s = new Date(S.ev.date + 'T12:00:00').toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2300); }
  function copy(text) {
    var done = function () { toast('Kode kopiert: ' + text); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
  }
  var CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  function newCode(n) { var s = ''; for (var i = 0; i < 4; i++) s += CH[Math.floor(Math.random() * CH.length)]; return 'OTS-' + (n < 10 ? '0' : '') + n + '-' + s; }
