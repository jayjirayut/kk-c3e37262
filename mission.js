/* mission.js: "เรื่องเล็ก ๆ วันนี้" shared daily log + story card. Classic script; never throws. */
(function () {
  'use strict';
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
             set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  function ymd(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var RIT = [
    { id: 'spin', th: 'คลาสปั่นจักรยาน', en: 'Spin class', who: 'เกียวๆ', whoEn: 'Keaw Keaw' },
    { id: 'his', th: null, en: "Jay's thing", who: 'เจ', whoEn: 'Jay' },
    { id: 'coffee', th: 'กาแฟที่ระเบียง', en: 'Coffee on the balcony', who: 'สองคน', whoEn: 'Both' },
    { id: 'kind', th: 'เลือกตอนที่จะดูด้วยกัน', en: 'Pick an episode together', who: 'สองคน', whoEn: 'Both' }
  ];
  // Questions, not slogans. One per day.
  var DAILY = [
    ['วันนี้อยากให้ช่วยอะไรไหม?', 'Anything I can help with today?'],
    ['วันนี้มีอะไรอยากเล่าให้ฟังไหม?', 'Anything you want to tell me about today?'],
    ['วันนี้เริ่มจากกาแฟก่อน', 'Coffee first today.'],
    ['วันนี้พักบ้างนะ', 'Take a break today.'],
    ['ปั่นเสร็จแล้วกินอะไรดี?', 'After spin, what are we eating?']
  ];
  function load() { try { return JSON.parse(LS.get('kk_log', '{}')) || {}; } catch (e) { return {}; } }
  function save(l) { LS.set('kk_log', JSON.stringify(l)); }
  function days(log) { return Object.keys(log).filter(function (k) { return log[k] && log[k].length; }).length; }
  function run(log) { var n = 0, d = new Date(); for (;;) { var k = ymd(d); if (log[k] && log[k].length) { n++; d.setDate(d.getDate() - 1); } else if (n === 0 && k === ymd()) { d.setDate(d.getDate() - 1); } else break; } return n; }

  function css() {
    var s = document.createElement('style');
    // A hairline table: four cells share 1px rules, no fills. Done reads as a gold frame and gold type.
    s.textContent = '#mission .q{margin-bottom:18px;font:400 16px/1.55 var(--sans);color:var(--ivory)}#mission .q .th{font-family:var(--thai)}' +
      'html[data-lang="both"] #mission .q .en{display:block;margin-top:2px;font-size:14px;color:var(--ivory2)}' +
      '#mission .grid{display:block;border-top:1px solid rgba(241,235,221,.16)}' +
      '#mission .r{position:relative;display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;min-height:64px;padding:12px 0 12px 36px;text-align:left;word-break:keep-all;' +
        'border:0;border-bottom:1px solid rgba(241,235,221,.16);border-radius:0;background:none;color:var(--ivory);' +
        'font:400 17px/1.4 var(--sans);cursor:pointer;transition:color .24s cubic-bezier(.2,0,0,1)}' +
      '#mission .r::before{content:"";position:absolute;left:0;top:50%;width:20px;height:20px;margin-top:-10px;border-radius:50%;border:1px solid rgba(241,235,221,.4);transition:background .24s cubic-bezier(.2,0,0,1),border-color .24s}' +
      '#mission .r.done::before{background:var(--gold);border-color:var(--gold)}#mission .lab{display:flex;flex-direction:column;gap:2px}' +
      '#mission .r .th{font:400 17px/1.6 var(--thai)}' +
      '#mission .who{flex:0 0 88px;font:400 13px/1.4 var(--sans);color:var(--ivory2);text-align:right}#mission .lab{flex:1;min-width:0}#mission .r.done::after{content:"";position:absolute;left:7px;top:50%;width:5px;height:9px;margin-top:-6px;border-right:1.5px solid var(--ink);border-bottom:1.5px solid var(--ink);transform:rotate(45deg)}' +
      '#mission .who .th{font:400 13px/1.6 var(--thai)}' +
      '#mission .r.set{color:var(--ivory2)}' +
      '#mission .r.set>.th,#mission .r.set>.en{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px;text-decoration-color:var(--line2)}' +
      '#mission .r.done{color:var(--ivory)}' +
      '#mission .r:focus-visible{outline:1px solid var(--ivory);outline-offset:-6px}' +
      '#mission .r [contenteditable]{outline:none;border-bottom:1px solid var(--line2)}' +
      '#mission .foot{margin-top:16px;font:400 13px/1.55 var(--sans);color:var(--ivory2)}#mission .foot .th{font-family:var(--thai)}' +
      '#mission .foot.fine{margin-top:4px;font:400 12px/18px var(--sans);color:var(--ivory2)}' +
      'html[data-lang="th"] #mission .en{display:none}html[data-lang="en"] #mission .th{display:none}' +
      'html[data-lang="both"] #mission .who .en{display:none}html[data-lang="both"] #mission .r>.en{font-size:12px;color:var(--ivory2)}' +
      'html[data-lang="both"] #mission .r.done>.en{color:inherit}';
    document.head.appendChild(s);
  }
  function render() {
    var el = document.getElementById('mission'); if (!el) return;
    var log = load(), today = ymd(), done = log[today] || [], dq = DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
    var his = LS.get('kk_hisgoal', '');
    var h = '<p class="q"><span class="th">' + dq[0] + '</span> <span class="en">' + dq[1] + '</span></p><div class="grid">';
    RIT.forEach(function (r) {
      var who = '<small class="who"><span class="th">' + r.who + '</span><span class="en">' + r.whoEn + '</span></small>';
      if (r.id === 'his' && !his) { return; }
      var label = r.id === 'his' ? '<span class="th" data-his>' + his.replace(/</g, '&lt;') + '</span>' : '<span class="th">' + r.th + '</span>';
      h += '<button type="button" class="r' + (done.indexOf(r.id) > -1 ? ' done' : '') + '" data-id="' + r.id + '" aria-pressed="' + (done.indexOf(r.id) > -1) + '">' +
        '<span class="lab">' + label + '<span class="en">' + r.en + '</span></span>' + who + '</button>';
    });
    var n = days(log), s = run(log);
    h += '</div><p class="foot">' + (n ? '<span class="th">บันทึกไว้แล้ว ' + n + ' วัน' + (s > 1 ? ' (ติดกัน ' + s + ' วัน)' : '') + '</span> <span class="en">' + n + ' days logged' + (s > 1 ? ', ' + s + ' in a row' : '') + '</span>'
      : '<span class="th">เลือกสักอย่างสำหรับวันนี้</span> <span class="en">Pick one for today.</span>') + '</p>' +
      '<p class="foot fine"><span class="th" title="ไม่ได้ซิงก์กับเครื่องอื่น">บันทึกไว้ในเครื่องนี้</span> <span class="en" title="Not synced to other phones">Saved on this device</span></p>';
    el.innerHTML = h; el.dataset.day = today;
  }
  function bind() {
    var el = document.getElementById('mission'); if (!el) return;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.r'); if (!b) return;
      if (b.dataset.set || (e.target.closest('[data-his]') && e.detail === 2)) { var v = prompt('กิจกรรมของเจ (เช่น วิ่ง 5 กม.) · Jay\'s activity', LS.get('kk_hisgoal', '')); if (v != null) { LS.set('kk_hisgoal', v.trim()); render(); } return; }
      var log = load(), k = ymd(), d = log[k] || [], i = d.indexOf(b.dataset.id);
      if (i > -1) d.splice(i, 1); else d.push(b.dataset.id);
      log[k] = d; save(log); render();
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
    setInterval(function () { if (el.dataset.day !== ymd()) render(); }, 60000);
  }

  // ---------- Story card 1080x1920: ink ground, a muted gold hairline frame, her stirred coffee galaxy inside one gold ring ----------
  // Type: Cormorant headline, Inter tracked capitals, IBM Plex Sans Thai. Hairline rules only: no rounded corners, glow or glyph ornaments.
  var card = null, SERIF = '"Cormorant Garamond", Georgia, serif', SANS = 'Inter, sans-serif', THAI = '"IBM Plex Sans Thai", Inter, sans-serif';
  // Tracked capitals, spaced by hand because canvas letterSpacing is missing on some phones. Latin only: Thai marks must never be split.
  function tracked(g, t, x, y, ls) {
    var i, w = -ls, cw = [], al = g.textAlign;
    for (i = 0; i < t.length; i++) { cw.push(g.measureText(t.charAt(i)).width); w += cw[i] + ls; }
    g.textAlign = 'left'; x -= w / 2;
    for (i = 0; i < t.length; i++) { g.fillText(t.charAt(i), x, y); x += cw[i] + ls; }
    g.textAlign = al;
  }
  // Canvas text only uses faces that are already loaded, so ask for the card's faces before drawing.
  function fonts() {
    var f = document.fonts; if (!f || !f.load) return Promise.resolve();
    try {
      return Promise.all([f.load('400 92px "Cormorant Garamond"', 'Small adjustments.'), f.load('italic 400 92px "Cormorant Garamond"', 'Then coffee.'),
        f.load('300 28px Inter', 'SMALL ADJUSTMENTS'), f.load('300 42px "IBM Plex Sans Thai"', 'ค่อย ๆ ปรับ แล้วไปกินกาแฟกัน'), f.load('300 84px "IBM Plex Sans Thai"', 'เกียวๆ')])
        .then(function () { return f.ready; }, function () { return f.ready; });
    } catch (e) { return Promise.resolve(); }
  }
  function draw(withName) {
    var W = 1080, H = 1920, c = card || (card = document.createElement('canvas')); c.width = W; c.height = H;
    var g = c.getContext('2d'), st = window.KK || {}, seed = (st.swirl || 0) * 7 + (st.ring || 0) * 3 + 1;
    var rnd = (function (s) { return function () { s = (s * 16807 + 11) % 2147483647; return (s % 10000) / 10000; }; })(Math.floor(Math.abs(seed) * 1000) + 7);
    g.fillStyle = '#0b1324'; g.fillRect(0, 0, W, H);
    // the frame: one muted gold hairline, square corners
    g.strokeStyle = 'rgba(184,149,106,.55)'; g.lineWidth = 2; g.strokeRect(57, 57, W - 114, H - 114);
    var cx = W / 2, cy = 860, R = 330, tw = (st.swirl || 0) * 0.6 + 2.2;
    // fine grains from ivory to gold, no glow
    for (var a = 0; a < 2; a++) for (var k = 0; k < 900; k++) {
      var t = k / 900, r = t * 250, ang = a * Math.PI + t * tw * Math.PI + (rnd() - .5) * .5;
      g.fillStyle = 'rgba(' + Math.round(244 - t * 60) + ',' + Math.round(236 - t * 87) + ',' + Math.round(220 - t * 114) + ',' + (.62 - t * .42).toFixed(3) + ')';
      g.beginPath(); g.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * .82, rnd() * 2.2 + .5, 0, 7); g.fill();
    }
    // two hairlines: the faint orbit from her rings, then one gold ring
    g.strokeStyle = 'rgba(244,236,220,.16)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, R + 34, R * (0.3 + 0.6 * Math.abs(Math.cos(st.ring || 0))), (st.ring || 0) * .5, 0, 7); g.stroke();
    g.strokeStyle = '#b8956a'; g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.fillStyle = '#b8956a'; g.font = '300 28px ' + SANS; tracked(g, 'SMALL ADJUSTMENTS', cx, 300, 6);
    g.fillStyle = 'rgba(184,149,106,.7)'; g.fillRect(cx - 40, 340, 80, 2); // short hairline rule under the label
    var y = 1395;
    if (withName) { g.fillStyle = '#f4ecdc'; g.font = '300 84px ' + THAI; g.fillText('เกียวๆ', cx, y); y += 128; } else y += 40;
    g.fillStyle = '#f4ecdc'; g.font = '400 92px ' + SERIF; g.fillText('Small adjustments.', cx, y);
    g.font = 'italic 400 92px ' + SERIF; g.fillText('Then coffee.', cx, y + 100);
    g.fillStyle = 'rgba(244,236,220,.3)'; g.fillRect(cx - 40, y + 150, 80, 2); // hairline rule between English and Thai
    g.fillStyle = 'rgba(244,236,220,.72)'; g.font = '300 42px ' + THAI; g.fillText('ค่อย ๆ ปรับ แล้วไปกินกาแฟกัน', cx, y + 222);
    return c;
  }
  function show() {
    var p = document.getElementById('storyPreview'), cb = document.getElementById('withName');
    var go = function () { var c = draw(cb && cb.checked); if (p && !p.contains(c)) { p.innerHTML = ''; p.appendChild(c); } prep(); };
    fonts().then(go, go);
  }
  function blob(cb) { var go = function () { draw(document.getElementById('withName') && document.getElementById('withName').checked).toBlob(cb, 'image/png'); }; fonts().then(go, go); }
  function download() { blob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'keawkeaw_story.png'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }); }
  var ready = null;
  function msg(t) { var p = document.getElementById('shareMsg'); if (p) p.textContent = t; }
  function prep() { ready = null; blob(function (b) { try { ready = new File([b], 'keawkeaw_story.png', { type: 'image/png' }); } catch (e) { ready = b; } }); }
  function share() {
    msg('');
    var f = ready;
    if (f && navigator.canShare && f instanceof File && navigator.canShare({ files: [f] })) {
      navigator.share({ files: [f] }).catch(function (e) { if (e && e.name === 'AbortError') return; msg('แชร์ไม่ได้ บันทึกภาพแทนแล้ว · Share failed, saved instead.'); download(); });
      return;
    }
    msg('บันทึกภาพแทน · Saved the image instead.'); download();
  }
  window.__storyCanvas = function () { return new Promise(function (r) { var go = function () { r(draw(false)); }; fonts().then(go, go); }); };

  function init() {
    try {
      css(); render(); bind();
      window.addEventListener('storyopen', show);
      var cb = document.getElementById('withName'); if (cb) cb.addEventListener('change', show);
      var d = document.getElementById('dlBtn'); if (d) d.addEventListener('click', download);
      var s = document.getElementById('shareBtn'); if (s) { s.addEventListener('click', share); if (!navigator.share || !navigator.canShare) s.style.display = 'none'; }
      window.addEventListener('scene', function (e) { if (e.detail === 9) render(); });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
