/* mission.js: "เรื่องเล็ก ๆ วันนี้" shared daily log + story card. Classic script; never throws. */
(function () {
  'use strict';
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
             set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  function ymd(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var RIT = [
    { id: 'spin', th: 'ปั่นสปิน', en: 'spin class', who: 'เกียวๆ', ico: '◐' },
    { id: 'his', th: null, en: "Jay's thing", who: 'เจ', ico: '◇' },
    { id: 'coffee', th: 'กาแฟนม<wbr>ที่ระเบียง', en: 'coffee milk, balcony', who: 'สองคน', ico: '◉' },
    { id: 'kind', th: 'เรื่องดี ๆ<wbr>ให้กัน', en: 'one kind thing', who: 'สองคน', ico: '✦' }
  ];
  // Questions, not slogans. One per day.
  var DAILY = [
    ['วันนี้อยากให้ช่วยอะไรไหม?', 'Anything I can help with today?'],
    ['วันนี้มีอะไรอยากเล่าให้ฟังไหม?', 'Anything you want to tell me about today?'],
    ['วันนี้เริ่มจากกาแฟก่อน', 'Coffee first today.'],
    ['คืนนี้ดูต่อตอนไหนดี?', 'Which episode tonight?'],
    ['วันนี้พักบ้างนะ', 'Take a break today.'],
    ['ปั่นเสร็จแล้วกินอะไรดี?', 'After spin, what are we eating?']
  ];
  function load() { try { return JSON.parse(LS.get('kk_log', '{}')) || {}; } catch (e) { return {}; } }
  function save(l) { LS.set('kk_log', JSON.stringify(l)); }
  function days(log) { return Object.keys(log).filter(function (k) { return log[k] && log[k].length; }).length; }
  function run(log) { var n = 0, d = new Date(); for (;;) { var k = ymd(d); if (log[k] && log[k].length) { n++; d.setDate(d.getDate() - 1); } else if (n === 0 && k === ymd()) { d.setDate(d.getDate() - 1); } else break; } return n; }

  function css() {
    var s = document.createElement('style');
    s.textContent = '#mission .q{font-size:15px;color:var(--ivory2);margin-bottom:10px}#mission .q .en{font-size:17px}' +
      '#mission .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
      '#mission .r{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;min-height:60px;padding:9px 12px;word-break:keep-all;border-radius:12px;border:1px solid var(--line);background:rgba(244,236,220,.05);color:var(--ivory);font:400 15px Sarabun;cursor:pointer}' +
      '#mission .r small{font-size:12px;color:var(--ivory2)}#mission .r .ico{color:var(--ivory2);font-size:14px}' +
      '#mission .r.done{background:rgba(230,178,106,.18);border-color:rgba(230,178,106,.6)}#mission .r.done .ico{color:var(--amber)}' +
      '#mission .r [contenteditable]{outline:none;border-bottom:1px dashed rgba(244,236,220,.3)}' +
      '#mission .foot{margin-top:10px;font-size:14px;color:var(--ivory2)}' +
      'html[data-lang="th"] #mission .en{display:none}html[data-lang="en"] #mission .th{display:none}';
    document.head.appendChild(s);
  }
  function render() {
    var el = document.getElementById('mission'); if (!el) return;
    var log = load(), today = ymd(), done = log[today] || [], dq = DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
    var his = LS.get('kk_hisgoal', 'เป้าหมายของเจ');
    var h = '<p class="q"><span class="th">' + dq[0] + '</span> <span class="en">' + dq[1] + '</span></p><div class="grid">';
    RIT.forEach(function (r) {
      var label = r.id === 'his' ? '<span contenteditable="true" spellcheck="false" data-his>' + his.replace(/</g, '&lt;') + '</span>' : '<span class="th">' + r.th + '</span>';
      h += '<button type="button" class="r' + (done.indexOf(r.id) > -1 ? ' done' : '') + '" data-id="' + r.id + '" aria-pressed="' + (done.indexOf(r.id) > -1) + '">' +
        '<span class="ico">' + r.ico + ' <small>' + r.who + '</small></span>' + label + '<small class="en">' + r.en + '</small></button>';
    });
    var n = days(log), s = run(log);
    h += '</div><p class="foot">' + (n ? '<span class="th">ทำเรื่องเล็ก ๆ ด้วยกันมาแล้ว ' + n + ' วัน' + (s > 1 ? ' (ติดกัน ' + s + ' วัน)' : '') + '</span> <span class="en">' + n + ' small days so far' + (s > 1 ? ', ' + s + ' in a row' : '') + '</span>'
      : '<span class="th">แตะสิ่งที่ทำวันนี้ ไม่ต้องครบก็ได้</span> <span class="en">Tap what happened today. No need for all four.</span>') + '</p>';
    el.innerHTML = h;
  }
  function bind() {
    var el = document.getElementById('mission'); if (!el) return;
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-his]')) return;
      var b = e.target.closest('.r'); if (!b) return;
      var log = load(), k = ymd(), d = log[k] || [], i = d.indexOf(b.dataset.id);
      if (i > -1) d.splice(i, 1); else d.push(b.dataset.id);
      log[k] = d; save(log); render();
    });
    el.addEventListener('input', function (e) { if (e.target.hasAttribute('data-his')) LS.set('kk_hisgoal', e.target.textContent.trim() || 'เป้าหมายของเจ'); });
    el.addEventListener('keydown', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-his') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); } e.stopPropagation(); });
  }

  // ---------- Story card 1080x1920: her stirred coffee galaxy inside one silver ring ----------
  var card = null;
  function draw(withName) {
    var W = 1080, H = 1920, c = card || (card = document.createElement('canvas')); c.width = W; c.height = H;
    var g = c.getContext('2d'), st = window.KK || {}, seed = (st.swirl || 0) * 7 + (st.ring || 0) * 3 + 1;
    var rnd = (function (s) { return function () { s = (s * 16807 + 11) % 2147483647; return (s % 10000) / 10000; }; })(Math.floor(Math.abs(seed) * 1000) + 7);
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#070b1c'); bg.addColorStop(.7, '#121b38'); bg.addColorStop(1, '#1c1f3a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 260; i++) { g.fillStyle = 'rgba(245,234,216,' + (rnd() * .6 + .1) + ')'; g.beginPath(); g.arc(rnd() * W, rnd() * H, rnd() * 1.8 + .3, 0, 7); g.fill(); }
    var cx = W / 2, cy = 860, R = 400, tw = (st.swirl || 0) * 0.6 + 2.2;
    g.strokeStyle = 'rgba(214,222,232,.85)'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    g.strokeStyle = 'rgba(214,222,232,.18)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, R + 26, R * (0.3 + 0.6 * Math.abs(Math.cos(st.ring || 0))), (st.ring || 0) * .5, 0, 7); g.stroke();
    var glow = g.createRadialGradient(cx, cy, 0, cx, cy, 300); glow.addColorStop(0, 'rgba(240,200,150,.55)'); glow.addColorStop(1, 'rgba(240,200,150,0)'); g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, 300, 0, 7); g.fill();
    for (var a = 0; a < 2; a++) for (var k = 0; k < 900; k++) {
      var t = k / 900, r = t * 300, ang = a * Math.PI + t * tw * Math.PI + (rnd() - .5) * .5;
      g.fillStyle = 'rgba(' + (250 - t * 40) + ',' + (225 - t * 70) + ',' + (190 - t * 90) + ',' + (.8 - t * .5) + ')';
      g.beginPath(); g.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * .82, rnd() * 3 + .6, 0, 7); g.fill();
    }
    g.textAlign = 'center'; g.fillStyle = 'rgba(245,234,216,.8)'; g.font = '500 34px Sarabun'; g.letterSpacing = '12px';
    g.fillText('SMALL ADJUSTMENTS', cx, 330); g.letterSpacing = '0px';
    var y = 1440;
    if (withName) { g.fillStyle = '#f5ead8'; g.font = '600 96px Sarabun'; g.fillText('เกียวๆ', cx, y); y += 110; }
    g.fillStyle = '#f5ead8'; g.font = '400 54px Sarabun'; g.fillText('ค่อย ๆ ปรับ แล้วไปกินกาแฟกัน', cx, y);
    g.fillStyle = '#e6b26a'; g.font = 'italic 500 52px "Cormorant Garamond", serif'; g.fillText('Small adjustments. Then coffee.', cx, y + 76);
    return c;
  }
  function show() {
    var p = document.getElementById('storyPreview'), cb = document.getElementById('withName');
    var go = function () { var c = draw(cb && cb.checked); if (p && !p.contains(c)) { p.innerHTML = ''; p.appendChild(c); } };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go, go);
  }
  function blob(cb) { draw(document.getElementById('withName') && document.getElementById('withName').checked).toBlob(cb, 'image/png'); }
  function download() { blob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'keawkeaw_story.png'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }); }
  function share() {
    blob(function (b) {
      try {
        var f = new File([b], 'keawkeaw_story.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f] }).catch(function () {}); return; }
      } catch (e) {}
      download();
    });
  }
  window.__storyCanvas = function () { return new Promise(function (r) { (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { r(draw(false)); }); }); };

  function init() {
    try {
      css(); render(); bind();
      window.addEventListener('storyopen', show);
      var cb = document.getElementById('withName'); if (cb) cb.addEventListener('change', show);
      var d = document.getElementById('dlBtn'); if (d) d.addEventListener('click', download);
      var s = document.getElementById('shareBtn'); if (s) { s.addEventListener('click', share); if (!navigator.share) s.style.display = 'none'; }
      window.addEventListener('scene', function (e) { if (e.detail === 9) render(); });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
