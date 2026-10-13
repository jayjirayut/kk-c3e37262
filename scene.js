// Scenes for Small Adjustments, drawn as hairline line art: ivory ink on navy, one muted gold accent per scene.
// 0 gate (her name in fine points), 1 river, 2 spin, 3 lift, 4 travel, 5 weeknight, 6 coffee milk, 7 two orbits, 8 shelf, 9 river again.
import * as THREE from 'three';

const App = window.App || { scene: 0, fast: false };
const small = innerWidth < 700, REDUCE = !!App.reduce;
const NAVY = 0x0b1323, IVORY = 0xf1ebdd, SECOND = 0xb7b1a8, GOLD = 0xb99a68, WARM = 0xe8c9a0;
const KK = window.KK = { swirl: 0, ring: 0 };
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true }); }
catch (e) { document.body.classList.add('nogl'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(innerWidth, innerHeight);
const scene = new THREE.Scene(); scene.background = new THREE.Color(NAVY);
scene.fog = new THREE.Fog(NAVY, 500, 1700);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 5000);

const rand = (a, b) => a + Math.random() * (b - a);
const LM = (c = IVORY, o = .6) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false });
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
function seg(flat, m) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3)); return new THREE.LineSegments(g, m); }
function poly(pts, m, closed = false) { const g = new THREE.BufferGeometry().setFromPoints(pts); return closed ? new THREE.LineLoop(g, m) : new THREE.Line(g, m); }
function ring(r, n = 96, y = 0, rx = r) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; p.push(V(Math.cos(a) * rx, y, Math.sin(a) * r)); } return p; }
function circleXY(r, n = 96) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; p.push(V(Math.cos(a) * r, Math.sin(a) * r, 0)); } return p; }
function rect(w, h, x = 0, y = 0, z = 0) { return [V(x - w / 2, y - h / 2, z), V(x + w / 2, y - h / 2, z), V(x + w / 2, y + h / 2, z), V(x - w / 2, y + h / 2, z)]; }
function boxLines(w, h, d, m) { return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), m); }
const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d');
  const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, '#fff'); r.addColorStop(.5, 'rgba(255,255,255,.8)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();
function points(pos, size, color = IVORY, o = .8) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size, map: dotTex, transparent: true, opacity: o, depthWrite: false, color, sizeAttenuation: true }));
}
function label(text, w = 512, h = 96, font = '400 40px Inter, "IBM Plex Sans Thai"', color = '#f1ebdd') {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = color; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// a very faint sky: a sparse, even handful, no glitter
{ const p = [], n = small ? 120 : 220; for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(rand(1800, 2600)); p.push(v.x, Math.abs(v.y) * .9 + 300, v.z); }
  const s = points(p, 3, IVORY, .22); s.material.fog = false; scene.add(s); }

const G = {}, A = [];
function group(name, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); G[name] = g; return g; }
const SHOW = { 0: ['name'], 1: ['river'], 2: ['fly'], 3: ['lift'], 4: ['travel'], 5: ['tv'], 6: ['cup'], 7: ['rings'], 8: ['shelf'], 9: ['river'] };
// every object scene stands on a floor line that fades into the distance, so nothing floats
function floor(g, y, w = 420) { g.add(seg([-w, y, 0, w, y, 0], LM(IVORY, .14))); g.add(seg([-w * .6, y, -60, w * .6, y, -60], LM(IVORY, .06))); }

// ---------- river: a high view across the Chao Phraya, drawn in ink ----------
{ const R = group('river', 0, 0, 0);
  // far bank skyline: one continuous profile, varied heights, a few vertical edges
  const prof = [], edges = [], win = [], zf = -950; let x = -1500;
  prof.push(V(x, 6, zf));
  while (x < 1500) { const w = rand(8, 28), h = Math.random() < .1 ? rand(120, 200) : rand(22, 95);
    prof.push(V(x, h, zf), V(x + w, h, zf));
    if (Math.random() < .5) edges.push(x + w * .5, 6, zf, x + w * .5, h * rand(.5, .95), zf);
    if (Math.random() < .55) { const n = 1 + (Math.random() * 3 | 0); for (let k = 0; k < n; k++) win.push(x + rand(2, w - 2), rand(10, h - 6), zf + 1); }
    x += w + (Math.random() < .3 ? rand(4, 20) : 0); }
  prof.push(V(1500, 6, zf));
  R.add(poly(prof, LM(IVORY, .5))); R.add(seg(edges, LM(IVORY, .14)));
  R.add(points(win, small ? 5 : 3.5, WARM, .85));
  // a second, lower and fainter row behind gives depth
  { const p2 = []; let x2 = -1600; p2.push(V(x2, 6, -1100)); while (x2 < 1600) { const w = rand(40, 110), h = rand(40, 170); p2.push(V(x2, h, -1100), V(x2 + w, h, -1100)); x2 += w; } R.add(poly(p2, LM(SECOND, .16))); }
  // banks
  R.add(seg([-1600, 4, -900, 1600, 4, -900, -1600, 3, -110, 1600, 3, -110], LM(IVORY, .28)));
  // water: slow horizontal hairlines, sparser and shorter toward us
  const water = []; for (let i = 0; i < (small ? 70 : 110); i++) { const z = rand(-880, -140), w = rand(30, 160) * (1 + (z + 880) / 500), x0 = rand(-1300, 1300);
    const l = seg([x0, .5, z, x0 + w, .5, z], LM(IVORY, .1)); l.userData.ph = rand(0, 6); l.userData.o = rand(.06, .2); water.push(l); R.add(l); }
  // reflections: a few thin vertical streaks under the brightest windows, not barcodes
  for (let i = 0; i < 14; i++) { const x0 = rand(-1200, 1200), l = seg([x0, .6, -890, x0, .6, -890 + rand(120, 320)], LM(WARM, .12)); l.userData.ph = rand(0, 6); l.userData.o = .12; water.push(l); R.add(l); }
  // two bridges: a deck line and a few cables
  for (const bx of [-520, 620]) { R.add(seg([bx, 22, -900, bx, 22, -110], LM(IVORY, .3)));
    const c = []; for (let j = 1; j <= 8; j++) c.push(bx, 100, -500, bx, 22, -500 - j * 45, bx, 100, -500, bx, 22, -500 + j * 45);
    c.push(bx, 22, -500, bx, 104, -500); R.add(seg(c, LM(IVORY, .14))); }
  // boats: a small hull, one soft light, a faint curved wake
  const boats = []; for (let i = 0; i < 5; i++) { const b = new THREE.Group(), dir = i % 2 ? -1 : 1;
    b.add(poly([V(-18, 4, 0), V(18, 4, 0), V(13, 0, 0), V(-13, 0, 0)], LM(IVORY, .55), true));
    b.add(points([0, 8, 0], small ? 7 : 5, WARM, .9));
    const wk = []; for (let k = 0; k <= 20; k++) { const t = k / 20; wk.push(V(-dir * (18 + t * 120), .4, Math.sin(t * 2.4) * 10 * t)); } b.add(poly(wk, LM(IVORY, .12)));
    b.position.set(rand(-1000, 1000), 2, rand(-760, -260)); b.userData.v = rand(8, 16) * dir; boats.push(b); R.add(b); }
  // the balcony: one dark hairline low in frame, never across the caption
  R.add(seg([-260, 182, 70, 260, 182, 70], LM(0x1a2033, .9)));
  R.userData = { water, boats };
  // scene 1 only: a few lights rise slowly, as if becoming stars
  const up = []; for (let i = 0; i < (small ? 90 : 160); i++) up.push(rand(-900, 900), rand(0, 700), rand(-1050, -500));
  const rise = points(up, small ? 4 : 3, WARM, .55); R.add(rise); R.userData.rise = rise;
}
A[1] = [new THREE.Vector3(0, 210, 120), new THREE.Vector3(0, 40, -600)];
A[9] = [new THREE.Vector3(30, 214, 124), new THREE.Vector3(30, 60, -620)];

// ---------- 0 her name in fine, even points ----------
let nameStars;
{ const g = group('name', 0, 1400, -3000), N = small ? 1500 : 2600, start = [], tgt = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) start.push(rand(-500, 500), rand(-300, 300), rand(-200, 100));
  nameStars = points(start, small ? 2.6 : 2.1, IVORY, .92); g.add(nameStars); nameStars.userData = { start: Float32Array.from(start), tgt, t: 0 };
  const sample = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 360; const q = c.getContext('2d');
    q.fillStyle = '#fff'; q.font = '400 220px "IBM Plex Sans Thai", "Noto Sans Thai", sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('เกียวๆ', 512, 190);
    const d = q.getImageData(0, 0, 1024, 360).data, pts = []; for (let y = 0; y < 360; y += 3) for (let x = 0; x < 1024; x += 3) if (d[(y * 1024 + x) * 4 + 3] > 160) pts.push([x, y]);
    const sc = small ? .25 : .5; for (let i = 0; i < N; i++) { const p = pts.length ? pts[(i * 7919) % pts.length] : [512, 180];
      tgt[i * 3] = (p[0] - 512) * sc; tgt[i * 3 + 1] = (180 - p[1]) * sc + 60; tgt[i * 3 + 2] = 0; } };
  Promise.race([document.fonts ? document.fonts.load('400 220px "IBM Plex Sans Thai"', 'เกียว') : 0, new Promise(r => setTimeout(r, 2000))]).then(sample, sample); }
A[0] = [new THREE.Vector3(0, 1400, -2620), new THREE.Vector3(0, 1430, -3000)];

// ---------- 2 flywheel: hairline circles, thin spokes, a gold tick ----------
let flyV = REDUCE ? 0 : 0.6;
const GN = 129;
{ const g = group('fly', 2000, 0, -2000), wheel = new THREE.Group(); g.add(wheel);
  wheel.add(poly(circleXY(60, 160), LM(IVORY, .75), true), poly(circleXY(55, 160), LM(IVORY, .25), true), poly(circleXY(9, 48), LM(IVORY, .6), true));
  const sp = []; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; sp.push(Math.cos(a) * 9, Math.sin(a) * 9, 0, Math.cos(a) * 55, Math.sin(a) * 55, 0); } wheel.add(seg(sp, LM(IVORY, .35)));
  const gp = []; for (let i = 0; i < GN; i++) { const a = Math.PI / 2 - i / (GN - 1) * Math.PI * 2; gp.push(V(Math.cos(a) * 74, Math.sin(a) * 74, 0)); }
  const gauge = poly(gp, LM(GOLD, .9)); g.add(gauge); g.add(poly(circleXY(74, 160), LM(IVORY, .08), true));
  g.add(seg([0, 70, 0, 0, 80, 0], LM(GOLD, 1)));
  floor(g, -82, 260); g.userData = { wheel, gauge }; }
A[2] = [new THREE.Vector3(2000, 10, -1810), new THREE.Vector3(2000, -6, -2000)];

// ---------- 3 lift: a drawn door, floor ticks, one call button ----------
let liftOpen = 0, liftTarget = 0;
{ const g = group('lift', 4000, 0, -2000);
  g.add(poly(rect(72, 102, 0, 0, -1), LM(IVORY, .7), true), poly(rect(64, 94, 0, 0, -1), LM(IVORY, .2), true));
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(56, 86), new THREE.MeshBasicMaterial({ color: WARM, transparent: true, opacity: 0, depthWrite: false })); warm.position.z = -.5; g.add(warm);
  const door = () => { const d = new THREE.Group(); d.add(poly(rect(28, 86), LM(IVORY, .65), true)); d.add(new THREE.Mesh(new THREE.PlaneGeometry(28, 86), new THREE.MeshBasicMaterial({ color: NAVY }))); return d; };
  const L = door(), Rr = door(); L.position.set(-14, 0, .5); Rr.position.set(14, 0, .5); g.add(L, Rr);
  // floor indicator: an arc of ticks with a small gold needle
  const tk = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (.15 + .7 * i / 8); tk.push(Math.cos(a) * 16, 58 + Math.sin(a) * 16 - 10, 0, Math.cos(a) * 19, 58 + Math.sin(a) * 19 - 10, 0); } g.add(seg(tk, LM(IVORY, .45)));
  const needle = seg([0, 48, .2, 0, 62, .2], LM(GOLD, .95)); g.add(needle);
  g.add(poly(circleXY(3.2, 40).map(p => p.add(V(46, 0, 0))), LM(IVORY, .7), true));
  g.add(seg([46, 8, 0, 46, 14, 0], LM(IVORY, .2)));
  floor(g, -51, 240);
  g.userData = { L, Rr, needle, warm }; }
addEventListener('lift', e => { liftTarget = e.detail === 'off' ? 1 : 0; });
A[3] = [new THREE.Vector3(4000, 0, -1840), new THREE.Vector3(4000, 4, -2000)];

// ---------- 4 travel: two landmark outlines on one low skyline ----------
{ const g = group('travel', 6000, 0, -2000), gy = -38;
  const sk = [V(-110, gy, 0)]; let x = -110; while (x < 110) { const w = rand(5, 12), h = rand(6, 28); sk.push(V(x, gy + h, 0), V(x + w, gy + h, 0)); x += w; } sk.push(V(110, gy, 0)); g.add(poly(sk, LM(IVORY, .28)));
  // a slender waisted tower: two curves pinched in the middle, a mast on top
  const tw = (s) => { const p = []; for (let k = 0; k <= 30; k++) { const t = k / 30, y = gy + t * 108, r = 9 - Math.sin(t * Math.PI) * 5.5 - t * 2.5; p.push(V(-30 + s * r, y, 2)); } return p; };
  g.add(poly(tw(-1), LM(IVORY, .7)), poly(tw(1), LM(IVORY, .7)));
  const bands = []; for (let k = 1; k < 10; k++) { const t = k / 10, y = gy + t * 108, r = 9 - Math.sin(t * Math.PI) * 5.5 - t * 2.5; bands.push(-30 - r, y, 2, -30 + r, y, 2); } g.add(seg(bands, LM(IVORY, .16)));
  g.add(seg([-30, gy + 108, 2, -30, gy + 136, 2], LM(IVORY, .6)));
  // a tall tapered tower with a spire
  g.add(poly([V(32, gy, 2), V(34, gy + 112, 2), V(40, gy + 120, 2), V(46, gy + 112, 2), V(48, gy, 2)], LM(IVORY, .7)));
  g.add(seg([40, gy + 120, 2, 40, gy + 142, 2, 34, gy + 40, 2, 46, gy + 40, 2, 34.6, gy + 80, 2, 45.4, gy + 80, 2], LM(IVORY, .3)));
  g.add(points([40, gy + 142, 2], small ? 5 : 4, GOLD, .95));
  floor(g, gy, 260);
  const tl = new THREE.Mesh(new THREE.PlaneGeometry(60, 12), new THREE.MeshBasicMaterial({ map: label('广州  ·  深圳', 512, 100, '400 46px "IBM Plex Sans Thai", sans-serif', '#b7b1a8'), transparent: true, depthWrite: false })); tl.position.set(0, 78, 0); g.add(tl); }
A[4] = [new THREE.Vector3(6000, 20, -1800), new THREE.Vector3(6000, 10, -2000)];

// ---------- 5 weeknight: a drawn sofa and a quiet screen ----------
{ const g = group('tv', 8000, 0, -2000), m = LM(IVORY, .55), soft = LM(IVORY, .22);
  const add = (o, x, y, z) => { o.position.set(x, y, z); g.add(o); return o; };
  add(boxLines(84, 12, 30, m), 0, -32, 20); add(boxLines(84, 24, 8, m), 0, -16, 36);
  for (const xx of [-46, 46]) add(boxLines(8, 20, 32, m), xx, -28, 20);
  add(boxLines(39, 5, 26, soft), -20.5, -23.5, 19); add(boxLines(39, 5, 26, soft), 20.5, -23.5, 19);
  for (const xx of [-38, 38]) g.add(seg([xx, -38, 32, xx, -42, 32], soft));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(88, 48), new THREE.MeshBasicMaterial({ color: 0x9fb0d0, transparent: true, opacity: .07, depthWrite: false })); scr.position.set(0, 10, -50); g.add(scr);
  g.add(poly(rect(92, 52, 0, 10, -50), LM(IVORY, .7), true));
  g.add(seg([-12, -16, -50, 12, -16, -50, 0, -16, -50, 0, -42, -50], soft));
  floor(g, -42, 300); g.userData = { scr }; }
A[5] = [new THREE.Vector3(8000, 26, -1820), new THREE.Vector3(8000, -2, -2010)];

// ---------- 6 coffee milk: a drawn cup, fine spirals, slow steam ----------
let stirV = REDUCE ? 0 : .4;
const SPN = 70;
{ const g = group('cup', 10000, 0, -2000), m = LM(IVORY, .7), soft = LM(IVORY, .25);
  g.add(poly(ring(34, 120, 25), m, true), poly(ring(26, 96, -25), soft, true));
  g.add(seg([-34, 25, 0, -26, -25, 0, 34, 25, 0, 26, -25, 0], m));
  g.add(poly(ring(52, 120, -27), soft, true), poly(ring(44, 120, -26), LM(IVORY, .12), true));
  const hp = []; for (let k = 0; k <= 30; k++) { const a = -Math.PI / 2 + k / 30 * Math.PI; hp.push(V(32 + Math.cos(a) * 12, Math.sin(a) * 12 + 4, 0)); } g.add(poly(hp, m));
  g.add(poly(ring(31.5, 120, 21), LM(0xc9a27e, .45), true));
  const spir = []; for (let a = 0; a < 3; a++) { const l = poly(Array.from({ length: SPN }, () => V(0, 21.2, 0)), LM(IVORY, .55)); g.add(l); spir.push(l); }
  const steam = []; for (let i = 0; i < 3; i++) { const l = poly(Array.from({ length: 40 }, () => V(0, 30, 0)), LM(IVORY, .2)); l.userData.x = (i - 1) * 9; l.userData.ph = i * 2.1; g.add(l); steam.push(l); }
  floor(g, -28, 240); g.userData = { spir, steam }; }
function paintCoffee(tw) { const { spir } = G.cup.userData;
  spir.forEach((l, a) => { const p = l.geometry.attributes.position.array;
    for (let k = 0; k < SPN; k++) { const t = k / (SPN - 1), r = t * 29, ang = a * 2.094 + t * tw; p[k * 3] = Math.cos(ang) * r; p[k * 3 + 1] = 21.2; p[k * 3 + 2] = Math.sin(ang) * r; }
    l.geometry.attributes.position.needsUpdate = true; }); }
paintCoffee(3);
A[6] = [new THREE.Vector3(10000, 95, -1880), new THREE.Vector3(10000, 0, -2000)];

// ---------- 7 two orbits: thin ellipses that answer each other ----------
let ringA = 0, ringAV = 0;
{ const g = group('rings', 12000, 0, -2000);
  const r1 = poly(circleXY(52, 200), LM(IVORY, .75), true), r2 = poly(circleXY(44, 200), LM(GOLD, .85), true); g.add(r1, r2);
  g.add(poly(circleXY(70, 200), LM(IVORY, .06), true)); g.userData = { r1, r2 }; }
A[7] = [new THREE.Vector3(12000, 0, -1840), new THREE.Vector3(12000, 0, -2000)];

// ---------- 8 shelf of ordinary days: slim drawn spines ----------
{ const g = group('shelf', 14000, 0, -2000);
  for (const y of [-30, 12]) { g.add(poly(rect(150, 2.4, 0, y, 0), LM(IVORY, .6), true)); g.add(seg([-75, y - 1.2, 0, -75, y - 8, 0, 75, y - 1.2, 0, 75, y - 8, 0], LM(IVORY, .18))); }
  const books = [[-62, 5, 34, 0], [-55, 7, 30, 0], [-46.5, 4, 36, 0], [-40, 8, 28, 0], [-30, 6, 33, .12], [-14, 6, 31, 0], [-6, 4, 35, 0]];
  books.forEach(([x, w, h, r], i) => { const b = poly(rect(w, h), LM(i === 3 ? GOLD : i % 2 ? SECOND : IVORY, i === 3 ? .9 : .55), true); b.position.set(x, -28.8 + h / 2, 0); b.rotation.z = -r; g.add(b); });
  [[14, 6, 30], [22, 5, 33], [30, 7, 27], [52, 5, 34], [58.5, 6, 29]].forEach(([x, w, h], i) => { const b = poly(rect(w, h), LM(i % 2 ? IVORY : SECOND, .5), true); b.position.set(x, 13.2 + h / 2, 0); g.add(b); });
  g.add(poly([V(36, 13.2, 0), V(48, 13.2, 0), V(48, 22, 0), V(36, 22, 0)], LM(IVORY, .3), true));
  floor(g, -52, 260); }
A[8] = [new THREE.Vector3(14000, 6, -1830), new THREE.Vector3(14000, -4, -2000)];

const fit = (n) => { const a = A[n], asp = camera.aspect; if (asp >= 1 || n === 1 || n === 9 || n === 0) return a;
  const f = Math.min(1.8, 1 / asp * .85); return [a[1].clone().add(a[0].clone().sub(a[1]).multiplyScalar(f)), a[1]]; };

let from = A[1], to = A[1], t0 = -1e9, cur = 0; const DUR = 1600;
const ct = new THREE.Vector3();
function visible(n) { for (const k in G) G[k].visible = SHOW[n].includes(k); }
function goTo(n) {
  n = Math.max(0, Math.min(9, n | 0)); cur = n; to = fit(n);
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
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); to = fit(cur); if (t0 < 0) camera.position.copy(to[0]); });

const clock = new THREE.Clock(); let swirl = 3;
function frame() {
  const dt = Math.min(clock.getDelta(), .1), T = clock.elapsedTime, mo = REDUCE ? 0 : 1;
  const k = t0 < 0 ? 1 : Math.min(1, (performance.now() - t0) / DUR), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  if (k < 1) { camera.position.lerpVectors(from[0], to[0], e); ct.lerpVectors(from[1], to[1], e); }
  camera.lookAt(ct);
  if (G.river.visible) { const reading = cur === 9;
    for (const b of G.river.userData.boats) { b.position.x += b.userData.v * dt * mo * (reading ? 0 : 1); if (Math.abs(b.position.x) > 1200) b.position.x *= -.98; }
    for (const l of G.river.userData.water) l.material.opacity = l.userData.o * (.7 + .3 * Math.sin(T * .8 * mo + l.userData.ph));
    const rp = G.river.userData.rise; rp.visible = cur === 1; if (rp.visible) { const a = rp.geometry.attributes.position.array; for (let i = 1; i < a.length; i += 3) { a[i] += dt * 14 * mo; if (a[i] > 900) a[i] = 0; } rp.geometry.attributes.position.needsUpdate = true; } }
  if (G.name.visible || cur === 0) { const u = nameStars.userData; u.t = REDUCE ? 1 : Math.min(1, u.t + dt / 3); const q = u.t < .5 ? 4 * u.t ** 3 : 1 - Math.pow(-2 * u.t + 2, 3) / 2, p = nameStars.geometry.attributes.position.array;
    for (let i = 0; i < p.length; i++) p[i] = u.start[i] + (u.tgt[i] - u.start[i]) * q; nameStars.geometry.attributes.position.needsUpdate = true; }
  if (G.fly.visible) { flyV = Math.max(REDUCE ? 0 : .3, flyV - dt * 1.2); G.fly.userData.wheel.rotation.z -= flyV * dt;
    const f = Math.min(1, flyV / 14); G.fly.userData.gauge.geometry.setDrawRange(0, Math.max(2, Math.round(GN * f))); }
  if (G.lift.visible) { liftOpen += (liftTarget - liftOpen) * Math.min(1, dt * 2.5); const { L, Rr, needle, warm } = G.lift.userData;
    L.position.x = -14 - liftOpen * 26; Rr.position.x = 14 + liftOpen * 26; needle.rotation.z = (liftOpen - .5) * 1.6; needle.position.set(-Math.sin(needle.rotation.z) * 48 * 0, 0, 0); warm.material.opacity = liftOpen * .1; }
  if (G.tv.visible) G.tv.userData.scr.material.opacity = .06 + .02 * Math.sin(T * 1.7 * mo) + .01 * Math.sin(T * 5.3 * mo);
  if (G.cup.visible) { stirV *= Math.pow(.6, dt); swirl += stirV * dt * 6; KK.swirl = swirl; if (Math.abs(stirV) > .02 || !G.cup.userData.p) { paintCoffee(swirl); G.cup.userData.p = 1; }
    for (const l of G.cup.userData.steam) { const p = l.geometry.attributes.position.array, ph = l.userData.ph;
      for (let i = 0; i < 40; i++) { const t = i / 39; p[i * 3] = l.userData.x + Math.sin(t * 6 + T * .9 * mo + ph) * 3 * t; p[i * 3 + 1] = 30 + t * 46; p[i * 3 + 2] = 0; }
      l.geometry.attributes.position.needsUpdate = true; l.material.opacity = .14 + .06 * Math.sin(T * .7 * mo + ph); } }
  if (G.rings.visible) { const { r1, r2 } = G.rings.userData; ringAV *= Math.pow(.5, dt); ringA += ringAV * dt;
    r1.rotation.x = ringA + T * .25 * mo; r1.rotation.y = T * .12 * mo;
    r2.rotation.x = ringA * .6 + 1.2 + T * .18 * mo; r2.rotation.y = -ringA * .4 + T * .08 * mo; KK.ring = ringA; }
  if (G.shelf.visible) G.shelf.rotation.y = Math.sin(T * .2) * .06 * mo;
  renderer.render(scene, camera); window.__ready = true; requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
