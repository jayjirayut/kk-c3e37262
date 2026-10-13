/* audio.js: original slow score for SMALL ADJUSTMENTS.
   Organ chords from additive sine partials, felt piano ticking like a clock at 60 BPM,
   generated-impulse reverb. No film melody. Classic script; never throws. */
(function () {
  'use strict';
  try {
    var App = window.App || {};
    var FAST = App.fast || /[?&]fast=1\b/.test(location.search);
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    var MASTER = 0.35, STEP = 0.5, SPC = 16; // 8th notes at 60 BPM, 8 s per chord
    var ctx = null, master, swell, organBus, pianoBus, timer = null, started = false;
    var step = 0, nextT = 0, suspendTimer = null;
    var muted = false;
    try { muted = localStorage.getItem('kk_mute') === '1'; } catch (e) {}

    function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

    // Original progression in A minor, voiced wide and slow.
    var CHORDS = [
      { organ: [45, 52, 57, 60, 64], arp: [69, 72, 76, 71] }, // Am(add9)
      { organ: [41, 48, 57, 60, 64], arp: [65, 69, 72, 76] }, // Fmaj7
      { organ: [43, 48, 55, 60, 64], arp: [64, 67, 72, 74] }, // C/G(add9)
      { organ: [40, 47, 57, 59, 64], arp: [64, 69, 71, 76] }, // Esus4
      { organ: [41, 50, 57, 62, 64], arp: [62, 65, 69, 76] }, // Dm(add9)/F
      { organ: [40, 47, 56, 59, 64], arp: [64, 68, 71, 76] }  // E
    ];
    var PARTIALS = [[1, 1], [2, 0.5], [3, 0.22], [4, 0.14], [6, 0.05], [8, 0.03]];
    var PAT_A = [0, 2, 1, 3, 0, 2, 1, 3], PAT_B = [3, 1, 2, 0, 3, 1, 2, 0];

    function impulse(sec, decay) {
      var r = ctx.sampleRate, n = Math.floor(r * sec), b = ctx.createBuffer(2, n, r);
      for (var c = 0; c < 2; c++) {
        var d = b.getChannelData(c);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
      }
      return b;
    }

    function build() {
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      master = ctx.createGain(); master.gain.value = 0.0001;
      swell = ctx.createGain(); swell.gain.value = 1;
      swell.connect(master); master.connect(comp); comp.connect(ctx.destination);

      var mix = ctx.createGain();
      var dry = ctx.createGain(); dry.gain.value = 0.55;
      var pre = ctx.createDelay(0.2); pre.delayTime.value = 0.03;
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 180;
      var verb = ctx.createConvolver(); verb.buffer = impulse(5, 2.6);
      var wet = ctx.createGain(); wet.gain.value = 0.6;
      mix.connect(dry); dry.connect(swell);
      mix.connect(pre); pre.connect(hp); hp.connect(verb); verb.connect(wet); wet.connect(swell);

      organBus = ctx.createGain(); organBus.gain.value = 0.9;
      var olp = ctx.createBiquadFilter(); olp.type = 'lowpass'; olp.frequency.value = 2200;
      organBus.connect(olp); olp.connect(mix);
      // slow breathing on the organ
      var lfo = ctx.createOscillator(), lfoG = ctx.createGain();
      lfo.frequency.value = 0.09; lfoG.gain.value = 0.08;
      lfo.connect(lfoG); lfoG.connect(organBus.gain); lfo.start();

      pianoBus = ctx.createGain(); pianoBus.gain.value = 0.85;
      pianoBus.connect(mix);
    }

    function organ(notes, t, dur) {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(1, t + 1.4);
      g.gain.setValueAtTime(1, t + dur - 0.5);
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 3);
      g.connect(organBus);
      notes.forEach(function (m, i) {
        var f = mtof(m), amp = 0.022 * (i === 0 ? 1.3 : 1);
        PARTIALS.forEach(function (p) {
          if (f * p[0] > 5000) return;
          var o = ctx.createOscillator(), pg = ctx.createGain();
          o.frequency.value = f * p[0];
          o.detune.value = (Math.random() - 0.5) * 6;
          pg.gain.value = amp * p[1];
          o.connect(pg); pg.connect(g);
          o.start(t); o.stop(t + dur + 3.2);
        });
      });
    }

    function piano(m, t, v) {
      var f = mtof(m);
      var o = ctx.createOscillator(), o2 = ctx.createOscillator();
      var g2 = ctx.createGain(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      o2.type = 'sine'; o2.frequency.value = f * 2.003; g2.gain.value = 0.18;
      lp.type = 'lowpass'; lp.Q.value = 0.3;
      lp.frequency.setValueAtTime(Math.min(4000, f * 5), t);
      lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.5), t + 1.2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.11 * v, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.03 * v, t + 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
      o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(pianoBus);
      o.start(t); o2.start(t); o.stop(t + 3.1); o2.stop(t + 3.1);
    }

    function sched(n, t) {
      var ch = CHORDS[Math.floor(n / SPC) % CHORDS.length], s = n % SPC;
      if (s === 0) organ(ch.organ, t, SPC * STEP);
      if (n < 2) return; // a breath, then the clock
      var pat = s < 8 ? PAT_A : PAT_B;
      var v = s === 0 ? 1.1 : (s % 2 === 0 ? 0.9 : 0.55);
      piano(ch.arp[pat[s % 8]], t, v);
      if (s % 4 === 0) piano(ch.organ[0] + 12, t, 0.45);
    }

    function pump() {
      try {
        if (!ctx || ctx.state !== 'running') return;
        if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.05;
        var horizon = ctx.currentTime + 1.5;
        while (nextT < horizon) { sched(step, nextT); step++; nextT += STEP; }
      } catch (e) {}
    }

    function unlock() {
      try {
        var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
        s.buffer = b; s.connect(ctx.destination); s.start(0);
      } catch (e) {}
    }

    function fadeTo(target, tc) {
      try {
        var t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
        master.gain.setTargetAtTime(target, t, tc);
      } catch (e) {}
    }

    function applyMute(first) {
      if (!ctx) return;
      clearTimeout(suspendTimer);
      if (muted) {
        fadeTo(0.0001, 0.35);
        suspendTimer = setTimeout(function () {
          try { if (muted && ctx.state === 'running') ctx.suspend(); } catch (e) {}
        }, 1800);
      } else {
        var p = ctx.state === 'suspended' ? ctx.resume() : null;
        var go = function () { pump(); fadeTo(MASTER, first ? 1.1 : 0.45); };
        if (p && p.then) p.then(go, function () {}); else go();
      }
    }

    function start() {
      try {
        if (FAST) return;
        if (!ctx) { ctx = new AC(); build(); unlock(); }
        if (ctx.state === 'suspended' && !muted) { var r = ctx.resume(); if (r && r.catch) r.catch(function () {}); }
        if (!started) {
          started = true;
          nextT = ctx.currentTime + 0.1;
          timer = setInterval(pump, 250);
          if (!muted) { master.gain.setValueAtTime(0.22, ctx.currentTime); piano(69, ctx.currentTime + 0.02, 1.2); piano(57, ctx.currentTime + 0.02, 0.7); }
          applyMute(true);
        }
      } catch (e) {}
    }

    // Mute button
    function updateBtn() {
      var btn = document.getElementById('mute');
      if (!btn) return;
      var label = muted ? 'เสียงปิด · sound off' : 'เสียงเปิด · sound on';
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('data-muted', muted ? '1' : '0');
      btn.classList.toggle('off', muted); if (window.App) window.App.muted = muted;
      if (!btn.children.length) btn.textContent = muted ? 'sound off' : 'sound on';
    }

    function toggleMute(e) {
      try {
        if (e) e.stopPropagation();
        muted = !muted;
        try { localStorage.setItem('kk_mute', muted ? '1' : '0'); } catch (x) {}
        updateBtn();
        if (!muted) start();
        applyMute(false);
      } catch (x) {}
    }

    function initBtn() {
      var btn = document.getElementById('mute');
      if (!btn) return;
      updateBtn();
      btn.addEventListener('click', toggleMute);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBtn);
    else initBtn();

    // Start on the gate tap
    window.addEventListener('begin', start);

    // One-time gesture fallback (resume or start inside any first gesture)
    var evs = ['pointerdown', 'touchend', 'keydown'];
    function fallback() {
      evs.forEach(function (ev) { document.removeEventListener(ev, fallback, true); });
      start();
    }
    evs.forEach(function (ev) { document.addEventListener(ev, fallback, true); });

    // Gentle swell per scene
    window.addEventListener('scene', function (e) {
      try {
        if (!ctx || !started || muted) return;
        var n = (e && e.detail) | 0, t = ctx.currentTime;
        var peak = (n === 4 || n === 7 || n === 9) ? 1.45 : 1.22;
        swell.gain.cancelScheduledValues(t);
        swell.gain.setValueAtTime(swell.gain.value, t);
        swell.gain.setTargetAtTime(peak, t, 0.7);
        swell.gain.setTargetAtTime(1, t + 2.6, 1.8);
      } catch (x) {}
    });

    // Rest when the tab is hidden
    document.addEventListener('visibilitychange', function () {
      try {
        if (!ctx || !started) return;
        if (document.hidden) { if (ctx.state === 'running') ctx.suspend(); }
        else if (!muted) { var r = ctx.resume(); if (r && r.then) r.then(pump, function () {}); }
      } catch (x) {}
    });

    window.KKAudio = { start: start, toggle: toggleMute, state: function () { return ctx ? ctx.state : 'none'; } };
  } catch (err) {}
})();
