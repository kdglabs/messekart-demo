  /* ===== KJØPER: posisjon, søk ===== */
  function setPicking(on) { S.picking = on; $('#pick-banner').classList.toggle('show', on); $('#k-card').classList.toggle('picking', on); }
  $('#k-scroll').addEventListener('click', function (e) {
    var g = e.target.closest('[data-booth]'); if (!g) return;
    var n = Number(g.getAttribute('data-booth'));
    if (S.picking) { S.pos = n; setPicking(false); toast('Du står ved bord ' + n); VIEWS.kart(S.target); return; }
    if (isActive(vByBooth(n))) go('bord/' + n);
  });
  $('#btn-pos').addEventListener('click', function () { $('#pos-num').value = ''; $('#pos-err').classList.remove('show'); $('#btn-pos-reset').style.display = S.pos == null ? 'none' : ''; openSheet('sh-pos'); });
  $('#btn-pick-map').addEventListener('click', function () { closeSheet('sh-pos'); setPicking(true); VIEWS.kart(S.target); });
  $('#btn-pick-cancel').addEventListener('click', function () { setPicking(false); VIEWS.kart(S.target); });
  function usePosNum() {
    var n = Number($('#pos-num').value);
    if (!TABLES[n]) { var er = $('#pos-err'); er.textContent = 'Finner ikke bord «' + ($('#pos-num').value || '') + '». Bordene er nummerert 1–58.'; er.classList.add('show'); return; }
    S.pos = n; closeSheet('sh-pos'); toast('Du står ved bord ' + n); VIEWS.kart(S.target);
  }
  $('#btn-pos-num').addEventListener('click', usePosNum);
  $('#pos-num').addEventListener('keydown', function (e) { if (e.key === 'Enter') usePosNum(); });
  $('#btn-pos-reset').addEventListener('click', function () { S.pos = null; closeSheet('sh-pos'); toast('Starter fra inngangen'); VIEWS.kart(S.target); });
  $('#q').addEventListener('input', renderSearch);
  function renderSearch() {
    var q = $('#q').value.trim().toLowerCase(), box = $('#q-res');
    if (!q) { box.innerHTML = '<div class="empty">Prøv «Charizard», «Sol Ring» eller «Elsa».</div>'; return; }
    var hits = S.items.filter(function (it) { var v = vById(it.v); return isActive(v) && (it.name.toLowerCase().indexOf(q) >= 0 || v.name.toLowerCase().indexOf(q) >= 0); });
    box.innerHTML = hits.length ? hits.map(function (it) { var v = vById(it.v); return '<button class="result" data-hit="' + v.booth + '"><span class="grow"><b>' + esc(it.name) + '</b><br><span class="muted small">' + esc(v.name) + ' · ' + esc(price(it)) + '</span></span><span class="tb">Bord ' + v.booth + '</span></button>'; }).join('') : '<div class="empty">Ingen treff på «' + esc(q) + '».</div>';
  }
  $('#q-res').addEventListener('click', function (e) { var b = e.target.closest('[data-hit]'); if (b) go('kart/' + b.getAttribute('data-hit')); });

  render();
