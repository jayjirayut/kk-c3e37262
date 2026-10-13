// Procedural scenes for Small Adjustments v3. 0 gate(name in stars), 1 river, 2 spin, 3 lift, 4 travel, 5 weeknight TV,
// 6 coffee milk, 7 two rings, 8 shelf, 9 river again. Only the active group(s) are visible.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const App = window.App || { scene: 0, fast: false };
const small = innerWidth < 700, REDUCE = !!App.reduce;
const AMBER = 0xf0bd7a, ROSE = 0xe9a9ae, IVORY = 0xf5ead8, SILVER = 0xd9dee6;
const KK = window.KK = { swirl: 0, ring: 0 };
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: !small }); }
catch (e) { document.body.classList.add('nogl'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x070b1c);
scene.fog = new THREE.Fog(0x0b1230, 300, 1400);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 5000);
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.45, 0.5, 0.35); composer.addPass(bloom);
scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x2a2440, 1.1));
const keyL = new THREE.DirectionalLight(0xffffff, 1.3); keyL.position.set(1, 2, 3); scene.add(keyL);

const rand = (a, b) => a + Math.random() * (b - a);
const basic = (c, o = 1) => new THREE.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o });
const std = (c, m = 0, r = .6) => new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r });
const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, '#fff'); r.addColorStop(.3, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
function points(pos, col, size, color = IVORY) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (col) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size, map: dotTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: !!col, color: col ? 0xffffff : color, fog: false }));
}
function label(text, w = 512, h = 96, font = '500 44px Sarabun', color = '#f5ead8', bg = null) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = color; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
{ const p = [], n = small ? 2000 : 4000; for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(rand(1500, 2600)); p.push(v.x, Math.abs(v.y) * .9 + 50, v.z); } scene.add(points(p, null, 4)); }

// groups and camera anchors per scene
const G = {}, A = [];
function group(name, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); G[name] = g; return g; }
const SHOW = { 0: ['name'], 1: ['river'], 2: ['fly'], 3: ['lift'], 4: ['travel'], 5: ['tv'], 6: ['cup'], 7: ['rings'], 8: ['shelf'], 9: ['river'] };

// ---------- river: view from a high balcony, looking down across the Chao Phraya ----------
{ const R = group('river', 0, 0, 0);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(3000, 700), new THREE.MeshStandardMaterial({ color: 0x1c2336, metalness: .3, roughness: .35, emissive: 0x0c1020 }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0, -480); R.add(water);
  const bankMat = std(0x1a2142, 0, .9), box = new THREE.BoxGeometry(1, 1, 1);
  const near = new THREE.Mesh(new THREE.BoxGeometry(3000, 6, 300), bankMat); near.position.set(0, 3, -10); R.add(near);
  const far = new THREE.Mesh(new THREE.BoxGeometry(3000, 6, 400), bankMat); far.position.set(0, 3, -1000); R.add(far);
  const wp = [], wc = [], refl = [];
  const tower = (x, z, h, w) => { const m = new THREE.Mesh(box, std(0x222b52, 0, .8)); m.scale.set(w, h, w); m.position.set(x, h / 2, z); R.add(m);
    for (let k = 3; k < h; k += 7) for (let j = -1; j <= 1; j++) if (Math.random() < .5) { const c = new THREE.Color(Math.random() < .75 ? AMBER : IVORY).multiplyScalar(rand(.5, 1)); wp.push(x + j * w / 3, k, z + w / 2 + .6); wc.push(c.r, c.g, c.b); } };
  for (let i = 0; i < (small ? 70 : 120); i++) tower(rand(-1300, 1300), rand(-1150, -860), rand(30, 200), rand(16, 40));
  for (let i = 0; i < 30; i++) tower(rand(-1300, 1300), rand(-150, -80), rand(10, 40), rand(16, 30)); // low near bank only
  R.add(points(wp, wc, small ? 6 : 4.5));
  { const sl = []; for (let x = -1400; x <= 1400; x += 9) sl.push(x, 8 + Math.random() * 3, -800); R.add(points(sl, null, small ? 6 : 4, AMBER)); }
  const reflTex = (() => { const c = document.createElement('canvas'); c.width = 32; c.height = 256; const q = c.getContext('2d');
    const g = q.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,215,160,.9)'); g.addColorStop(1, 'rgba(255,215,160,0)');
    q.fillStyle = g; for (let y = 0; y < 256; y += 6) { const w = 6 + Math.random() * 20; q.globalAlpha = .4 + Math.random() * .6; q.fillRect(16 - w / 2, y, w, 4); }
    return new THREE.CanvasTexture(c); })();
  const towersFar = R.children.filter(m => m.isMesh && m.position.z < -850);
  // broken reflections: short dashes stacked under far-bank lights
  const rg = new THREE.PlaneGeometry(1, 1);
  for (const t of towersFar) { if (t.scale.y < 60) continue; const len = 120 + t.scale.y * 1.4;
    const m = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ map: reflTex, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2; m.scale.set(t.scale.x * .8, len, 1); m.position.set(t.position.x, .4, -800 + len / 2); m.userData.ph = rand(0, 6); refl.push(m); R.add(m); }
  // two bridges with light strings across the water
  for (const bx of [-520, 620]) { const deck = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 900), std(0x2b3458)); deck.position.set(bx, 22, -500); R.add(deck);
    const lp = []; for (let z = -940; z <= -60; z += 14) lp.push(bx, 27, z);
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(6, 110, 6), std(0x3a4268)); p1.position.set(bx, 55, -500); R.add(p1);
    for (let j = 1; j <= 12; j++) { lp.push(bx, 110 - j * 7, -500 - j * 30, bx, 110 - j * 7, -500 + j * 30); }
    R.add(points(lp, null, 7, AMBER));
    const rf = new THREE.Mesh(new THREE.PlaneGeometry(10, 860), basic(AMBER, .18)); rf.rotation.x = -Math.PI / 2; rf.position.set(bx + 20, .6, -500); R.add(rf); }
  // boats
  const boats = []; for (let i = 0; i < 7; i++) { const b = new THREE.Group(); b.add(new THREE.Mesh(new THREE.BoxGeometry(40, 6, 12), std(0x39406a)));
    b.add(points([-16, 6, 0, 0, 7, 0, 16, 6, 0], null, 9, i % 2 ? ROSE : AMBER));
    const w = new THREE.Mesh(new THREE.PlaneGeometry(3, 50), basic(IVORY, .2)); w.rotation.x = -Math.PI / 2; w.rotation.z = Math.PI / 2; w.position.set(40, -2.8, 0); b.add(w);
    b.position.set(rand(-1000, 1000), 3, rand(-760, -260)); b.userData.v = rand(8, 18) * (i % 2 ? -1 : 1); w.position.x = b.userData.v > 0 ? -40 : 40; boats.push(b); R.add(b); }
  // balcony railing in the foreground
  const rail = new THREE.Group(), rm = std(0x0c1022, .6, .4);
  const top = new THREE.Mesh(new THREE.BoxGeometry(400, 1.6, 2), std(0x8b93a8, .9, .3)); top.position.set(0, 0, 0); rail.add(top);
  for (let x = -200; x <= 200; x += 14) { const p = new THREE.Mesh(new THREE.BoxGeometry(.5, 9, .5), rm); p.position.set(x, -4.5, 0); rail.add(p); }
  rail.position.set(0, 186, 75); R.add(rail);
  R.userData = { refl, boats };
  // rising lights (scene 1 only)
  const up = []; for (let i = 0; i < (small ? 300 : 600); i++) up.push(rand(-900, 900), rand(0, 700), rand(-1100, -400));
  const rise = points(up, null, 5, AMBER); R.add(rise); R.userData.rise = rise;
}
A[1] = [new THREE.Vector3(0, 210, 120), new THREE.Vector3(0, 40, -600)];
A[9] = [new THREE.Vector3(30, 214, 124), new THREE.Vector3(30, 60, -620)];

// ---------- name constellation for the gate ----------
let nameStars;
{ const g = group('name', 0, 1400, -3000), N = small ? 2200 : 3800, start = [], tgt = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) start.push(rand(-500, 500), rand(-300, 300), rand(-200, 100));
  nameStars = points(start, null, small ? 3.6 : 2.8, 0xd9b48a); nameStars.material.opacity = .8; g.add(nameStars); nameStars.userData = { start: Float32Array.from(start), tgt, t: 0 };
  const sample = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 360; const q = c.getContext('2d');
    q.fillStyle = '#fff'; q.font = '600 220px Sarabun, "Noto Sans Thai", sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('เกียวๆ', 512, 190);
    const d = q.getImageData(0, 0, 1024, 360).data, pts = []; for (let y = 0; y < 360; y += 3) for (let x = 0; x < 1024; x += 3) if (d[(y * 1024 + x) * 4 + 3] > 128) pts.push([x, y]);
    const sc = small ? .25 : .5; for (let i = 0; i < N; i++) { const p = pts.length ? pts[(Math.random() * pts.length) | 0] : [512, 180];
      tgt[i * 3] = (p[0] - 512) * sc; tgt[i * 3 + 1] = (180 - p[1]) * sc + 60; tgt[i * 3 + 2] = rand(-4, 4); } };
  Promise.race([document.fonts ? document.fonts.load('600 220px Sarabun') : 0, new Promise(r => setTimeout(r, 2000))]).then(sample, sample); }
A[0] = [new THREE.Vector3(0, 1400, -2620), new THREE.Vector3(0, 1430, -3000)];

// ---------- 2 flywheel: swipe to spin ----------
let flyV = REDUCE ? 0 : 0.6;
{ const g = group('fly', 2000, 0, -2000), m = std(SILVER, 1, .22);
  const wheel = new THREE.Group(); g.add(wheel);
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(60, 5, 24, 120), m));
  for (let i = 0; i < 10; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(2, 116, 2), m); s.rotation.z = i * Math.PI / 10; wheel.add(s); }
  { const hub = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 10, 32), m); hub.rotation.x = Math.PI / 2; wheel.add(hub); }
  const gauge = new THREE.Mesh(new THREE.RingGeometry(74, 77, 64, 1, Math.PI / 2, Math.PI * 2), basic(AMBER)); gauge.scale.x = -1; g.add(gauge); g.userData = { wheel, gauge }; }
A[2] = [new THREE.Vector3(2000, 10, -1810), new THREE.Vector3(2000, -6, -2000)];

// ---------- 3 lift: WORK / OFF DUTY ----------
let liftOpen = 0, liftTarget = 0;
{ const g = group('lift', 4000, 0, -2000);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(70, 100, 4), std(0xb9c0cc, .8, .35)); frame.position.z = -2; g.add(frame);
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(56, 86), new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 128; const q = c.getContext('2d'); const g = q.createRadialGradient(32, 90, 4, 32, 80, 90); g.addColorStop(0, '#d9925a'); g.addColorStop(.5, '#6b3f34'); g.addColorStop(1, '#1a1426'); q.fillStyle = g; q.fillRect(0, 0, 64, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })() })); warm.position.z = .2; g.add(warm);
  const dm = std(0xcfd4dc, .9, .25), L = new THREE.Mesh(new THREE.BoxGeometry(28, 86, 2), dm), Rr = new THREE.Mesh(new THREE.BoxGeometry(28, 86, 2), dm);
  L.position.set(-14, 0, 1.5); Rr.position.set(14, 0, 1.5); g.add(L, Rr);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), new THREE.MeshBasicMaterial({ map: label('WORK   ·   OFF DUTY', 512, 128, '500 46px Sarabun', '#f0bd7a', '#141a30') })); panel.position.set(0, 56, 1); g.add(panel);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), std(0x2a2f4c, .3, .7)); fl.rotation.x = -Math.PI / 2; fl.position.y = -43; g.add(fl);
  g.userData = { L, Rr }; }
addEventListener('lift', e => { liftTarget = e.detail === 'off' ? 1 : 0; });
A[3] = [new THREE.Vector3(4000, 0, -1840), new THREE.Vector3(4000, 4, -2000)];

// ---------- 4 travel: one skyline, two cities ----------
{ const g = group('travel', 6000, 0, -2000);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(90, 70, 10, 48), std(0x283058)); base.position.y = -40; g.add(base);
  for (let i = 0; i < 28; i++) { const h = rand(16, 60), b = new THREE.Mesh(new THREE.BoxGeometry(rand(6, 12), h, rand(6, 12)), std(0x4a5384, .2, .5));
    b.position.set(rand(-75, 75), -35 + h / 2, rand(-40, 30)); g.add(b); }
  const twr = new THREE.Mesh(new THREE.CylinderGeometry(2, 6, 110, 16, 1, true), std(0xf0b8c0, .2, .4)); twr.position.set(-30, 20, 0); g.add(twr);
  const sz = new THREE.Mesh(new THREE.BoxGeometry(10, 120, 10), std(0xcfd6e4, .7, .3)); sz.position.set(40, 25, -5); g.add(sz);
  const tl = new THREE.Mesh(new THREE.PlaneGeometry(60, 12), new THREE.MeshBasicMaterial({ map: label('广州  ·  深圳', 512, 100, '500 54px sans-serif', '#f5ead8'), transparent: true })); tl.position.set(0, 74, 0); g.add(tl); }
A[4] = [new THREE.Vector3(6000, 20, -1800), new THREE.Vector3(6000, 10, -2000)];

// ---------- 5 weeknight: couch and TV ----------
{ const g = group('tv', 8000, 0, -2000), fab = std(0x9a6a6e, 0, .9);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(80, 14, 30), fab); seat.position.set(0, -30, 20); g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(80, 26, 8), fab); back.position.set(0, -14, 36); g.add(back);
  for (const x of [-44, 44]) { const a = new THREE.Mesh(new THREE.BoxGeometry(10, 20, 30), fab); a.position.set(x, -24, 20); g.add(a); }
  const c = document.createElement('canvas'); c.width = 512; c.height = 288; const q = c.getContext('2d');
  const bg = q.createLinearGradient(0, 0, 0, 288); bg.addColorStop(0, '#1d2236'); bg.addColorStop(1, '#0a0d18'); q.fillStyle = bg; q.fillRect(0, 0, 512, 288);
  q.strokeStyle = 'rgba(240,189,122,.8)'; q.lineWidth = 2; for (let i = 0; i < 9; i++) { q.beginPath(); q.ellipse(256, 50 + i * 22, 120 - i * 6, 14, 0, 0, 7); q.stroke(); }
  q.beginPath(); q.moveTo(256, 30); q.lineTo(256, 250); q.stroke();
  const tv = new THREE.Mesh(new THREE.PlaneGeometry(90, 50), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); tv.position.set(0, 10, -50); g.add(tv);
  const bez = new THREE.Mesh(new THREE.BoxGeometry(94, 54, 2), std(0x0a0c14)); bez.position.set(0, 10, -51.5); g.add(bez);
  const glow = new THREE.PointLight(0x9fb4ff, 30, 200, 1.5); glow.position.set(0, 10, -30); g.add(glow); }
A[5] = [new THREE.Vector3(8000, 26, -1820), new THREE.Vector3(8000, -2, -2010)];

// ---------- 6 coffee milk: drag to stir ----------
let stirV = REDUCE ? 0 : .4;
{ const g = group('cup', 10000, 0, -2000);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(34, 26, 50, 64, 1, true), new THREE.MeshStandardMaterial({ color: IVORY, roughness: .35, side: THREE.DoubleSide })); g.add(cup);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(26, 48), std(IVORY)); bot.rotation.x = -Math.PI / 2; bot.position.y = -25; g.add(bot);
  const c = document.createElement('canvas'); c.width = c.height = 512; const tex = new THREE.CanvasTexture(c);
  const top = new THREE.Mesh(new THREE.CircleGeometry(32.5, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: .4 })); top.rotation.x = -Math.PI / 2; top.position.y = 21; g.add(top);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(12, 3, 16, 40, Math.PI), std(IVORY)); handle.rotation.z = -Math.PI / 2; handle.position.set(34, 0, 0); g.add(handle);
  const steam = []; for (let i = 0; i < 24; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), basic(IVORY, .12)); s.userData.o = Math.random(); g.add(s); steam.push(s); }
  g.userData = { c, tex, top, steam }; }
function paintCoffee(tw) { const { c, tex } = G.cup.userData, q = c.getContext('2d');
  q.fillStyle = '#8a5a3a'; q.fillRect(0, 0, 512, 512);
  for (let a = 0; a < 3; a++) for (let k = 0; k < 220; k++) { const t = k / 220, r = t * 240, ang = a * 2.09 + t * tw;
    q.fillStyle = `rgba(245,228,205,${.55 - t * .35})`; q.beginPath(); q.arc(256 + Math.cos(ang) * r, 256 + Math.sin(ang) * r, 10 - t * 6, 0, 7); q.fill(); }
  tex.needsUpdate = true; }
paintCoffee(3);
A[6] = [new THREE.Vector3(10000, 95, -1880), new THREE.Vector3(10000, 0, -2000)];

// ---------- 7 two rings: drag one, the other makes room ----------
let ringA = 0, ringAV = 0;
{ const g = group('rings', 12000, 0, -2000);
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(52, 2, 20, 180), new THREE.MeshStandardMaterial({ color: SILVER, metalness: .6, roughness: .35, emissive: 0x3a3f4a }));
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(44, 2, 20, 180), new THREE.MeshStandardMaterial({ color: 0xf2c79a, metalness: .6, roughness: .35, emissive: 0x4a3020 })); g.add(r1, r2);
  for (const [x, y] of [[-120, 80], [120, -60]]) { const l = new THREE.PointLight(0xfff1e0, 25, 400, 1.2); l.position.set(x, y, 90); g.add(l); } g.userData = { r1, r2 }; }
A[7] = [new THREE.Vector3(12000, 0, -1840), new THREE.Vector3(12000, 0, -2000)];

// ---------- 8 shelf of ordinary days: a few readable books ----------
{ const g = group('shelf', 14000, 0, -2000), wood = std(0x5a4a44, 0, .8);
  for (const y of [-30, 10]) { const b = new THREE.Mesh(new THREE.BoxGeometry(150, 3, 26), wood); b.position.y = y; g.add(b); }
  const acts = [['กาแฟนม', '#e6b26a'], ['ปั่นสปิน', '#e3a9a6'], ['ซีรีส์', '#9fb0d8'], ['ข้อความฝันดี', '#d9dee6'], ['ช่วยกันนิดหน่อย', '#c9a07a'], ['พัก', '#b8c9b0']];
  acts.forEach(([t, col], i) => { const c = document.createElement('canvas'); c.width = 128; c.height = 512; const q = c.getContext('2d');
    q.fillStyle = col; q.fillRect(0, 0, 128, 512); q.save(); q.translate(64, 256); q.rotate(-Math.PI / 2); q.fillStyle = '#141a30'; q.font = '600 52px Sarabun'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(t, 0, 0); q.restore();
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const mats = [std(col, 0, .9), std(col, 0, .9), std(col, 0, .9), std(col, 0, .9), new THREE.MeshStandardMaterial({ map: tex, roughness: .9 }), std(col, 0, .9)];
    const bk = new THREE.Mesh(new THREE.BoxGeometry(10, 34, 22), mats); const row = i < 3 ? 0 : 1;
    bk.position.set(-36 + (i % 3) * 30 + (row ? 14 : 0), (row ? 10 : -30) + 18.5, 0); bk.rotation.z = (i === 2 ? -.12 : 0); g.add(bk); });
  const lamp = new THREE.PointLight(AMBER, 12, 260, 1.5); lamp.position.set(40, 60, 60); g.add(lamp); }
A[8] = [new THREE.Vector3(14000, 6, -1830), new THREE.Vector3(14000, -4, -2000)];

// portrait phones: pull object scenes back a little so they fit
const fit = (n) => { const a = A[n], asp = camera.aspect; if (asp >= 1 || n === 1 || n === 9 || n === 0) return a;
  const f = Math.min(1.8, 1 / asp * .85); return [a[1].clone().add(a[0].clone().sub(a[1]).multiplyScalar(f)), a[1]]; };

let from = A[1], to = A[1], t0 = -1e9, cur = 0; const DUR = 1600;
const ct = new THREE.Vector3();
function visible(n) { for (const k in G) G[k].visible = SHOW[n].includes(k); }
function goTo(n) {
  n = Math.max(0, Math.min(9, n | 0)); const prev = cur; cur = n; to = fit(n);
  const snap = () => { camera.position.copy(to[0]); ct.copy(to[1]); t0 = -1e9; visible(n); };
  if (App.fast || REDUCE) { snap(); }
  else { const fd = document.getElementById('fade'); if (fd) fd.classList.add('on');
    setTimeout(() => { snap(); from = [to[0].clone().add(new THREE.Vector3(0, 6, 40)), to[1].clone()]; camera.position.copy(from[0]); t0 = performance.now(); if (fd) fd.classList.remove('on'); }, 300); }
  if (n === 0) nameStars.userData.t = App.fast ? 1 : nameStars.userData.t;
}
camera.position.copy(A[0][0]); ct.copy(A[0][1]); visible(0);
addEventListener('scene', e => goTo(e.detail));
if (App.scene) goTo(App.scene);

addEventListener('objdrag', e => { const { dx, dy } = e.detail;
  if (cur === 2) flyV = Math.min(14, flyV + Math.abs(dx) * .02 + Math.abs(dy) * .01);
  if (cur === 6) { stirV += (dx - dy) * .004; }
  if (cur === 7) { ringAV += dx * .12; } });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); to = fit(cur); if (t0 < 0) camera.position.copy(to[0]); });

const clock = new THREE.Clock(); let swirl = 3;
function frame() {
  const dt = Math.min(clock.getDelta(), .1), T = clock.elapsedTime, mo = REDUCE ? 0 : 1;
  const k = t0 < 0 ? 1 : Math.min(1, (performance.now() - t0) / DUR), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  if (k < 1) { camera.position.lerpVectors(from[0], to[0], e); ct.lerpVectors(from[1], to[1], e); }
  camera.lookAt(ct);
  if (G.river.visible) { for (const b of G.river.userData.boats) { b.position.x += b.userData.v * dt * mo; if (Math.abs(b.position.x) > 1200) b.position.x *= -.98; }
    for (const r of G.river.userData.refl) r.material.opacity = .35 + .15 * Math.sin(T * 1.3 * mo + r.userData.ph);
    const rp = G.river.userData.rise; rp.visible = cur === 1; if (rp.visible) { const a = rp.geometry.attributes.position.array; for (let i = 1; i < a.length; i += 3) { a[i] += dt * 22 * mo; if (a[i] > 900) a[i] = 0; } rp.geometry.attributes.position.needsUpdate = true; } }
  if (G.name.visible || cur === 0) { const u = nameStars.userData; u.t = REDUCE ? 1 : Math.min(1, u.t + dt / 3); const q = u.t < .5 ? 4 * u.t ** 3 : 1 - Math.pow(-2 * u.t + 2, 3) / 2, p = nameStars.geometry.attributes.position.array;
    for (let i = 0; i < p.length; i++) p[i] = u.start[i] + (u.tgt[i] - u.start[i]) * q; nameStars.geometry.attributes.position.needsUpdate = true; }
  if (G.fly.visible) { flyV = Math.max(REDUCE ? 0 : .3, flyV - dt * 1.2); G.fly.userData.wheel.rotation.z -= flyV * dt;
    const f = Math.min(1, flyV / 14); G.fly.userData.gauge.geometry.setDrawRange(0, 6 * Math.max(2, Math.round(64 * f))); }
  if (G.lift.visible) { liftOpen += (liftTarget - liftOpen) * Math.min(1, dt * 2.5); const { L, Rr } = G.lift.userData; L.position.x = -14 - liftOpen * 26; Rr.position.x = 14 + liftOpen * 26; }
  if (G.cup.visible) { stirV *= Math.pow(.6, dt); swirl += stirV * dt * 6; KK.swirl = swirl; if (Math.abs(stirV) > .02 || !G.cup.userData.p) { paintCoffee(swirl); G.cup.userData.p = 1; }
    for (const s of G.cup.userData.steam) { const o = (s.userData.o + T * .12 * mo) % 1; s.position.set(Math.sin(o * 8 + s.userData.o * 9) * 6, 24 + o * 50, Math.cos(o * 6) * 4); s.material.opacity = .14 * (1 - o); } }
  if (G.rings.visible) { const { r1, r2 } = G.rings.userData; ringAV *= Math.pow(.5, dt); ringA += ringAV * dt;
    r1.rotation.x = ringA + T * .25 * mo; r1.rotation.y = T * .12 * mo;
    r2.rotation.x = ringA * .6 + 1.2 + T * .18 * mo; r2.rotation.y = -ringA * .4 + T * .08 * mo; KK.ring = ringA; }
  if (G.shelf.visible) G.shelf.rotation.y = Math.sin(T * .2) * .08 * mo;
  composer.render(); window.__ready = true; requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
