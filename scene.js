// Scenes for Small Adjustments: solid, softly lit, matte objects on navy; hairlines only as accents.
// 0 gate (her name), 1 river, 2 spin studio, 3 lift, 4 travel, 5 weeknight, 6 coffee milk, 7 two orbits, 8 shelf, 9 river again.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const App = window.App || { scene: 0, fast: false };
const small = innerWidth < 700, REDUCE = !!App.reduce;
const NAVY = 0x0b1323, IVORY = 0xf1ebdd, STONE = 0xcbbfae, TAUPE = 0x8a7f74, SLATE = 0x2a3550, GOLD = 0xb99a68, WARM = 0xf0c890;
const KK = window.KK = { swirl: 0, ring: 0 };
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true }); }
catch (e) { document.body.classList.add('nogl'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(NAVY);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 6000);
scene.add(new THREE.HemisphereLight(0xc8d2ff, 0x1a1c28, .75));
const key = new THREE.DirectionalLight(0xffe6c8, 1.6); key.position.set(-1, 2, 2.2); scene.add(key);

const rand = (a, b) => a + Math.random() * (b - a);
const mat = (c, r = .7, m = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, extra));
const LM = (c = IVORY, o = .5) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false });
const rbox = (w, h, d, r = 1.5) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .01, h / 2 - .01, d / 2 - .01));
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
function mesh(geo, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const dotTex = canvasTex(32, 32, (g) => { const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, '#fff'); r.addColorStop(.45, 'rgba(255,255,255,.75)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 32, 32); });
dotTex.colorSpace = THREE.NoColorSpace;
function points(pos, size, color = IVORY, o = .85, add = false) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size, map: dotTex, transparent: true, opacity: o, depthWrite: false, color, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }));
}
function textTex(lines, w, h, opts = {}) { return canvasTex(w, h, (g) => { if (opts.bg) { g.fillStyle = opts.bg; g.fillRect(0, 0, w, h); }
  lines.forEach((l) => { g.fillStyle = l.c || '#f1ebdd'; g.font = l.f; g.textAlign = l.a || 'center'; g.textBaseline = 'middle'; g.fillText(l.t, l.x == null ? w / 2 : l.x, l.y); }); }); }

const G = {}, A = [];
function group(name, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); G[name] = g; return g; }
const SHOW = { 0: ['name'], 1: ['river'], 2: ['fly'], 3: ['lift'], 4: ['travel'], 5: ['tv'], 6: ['cup'], 7: ['rings'], 8: ['shelf'], 9: ['river'] };
// a soft matte floor under each object scene, fading out at its edges
const floorTex = canvasTex(256, 256, (g) => { const r = g.createRadialGradient(128, 128, 10, 128, 128, 128); r.addColorStop(0, 'rgba(60,72,104,1)'); r.addColorStop(1, 'rgba(11,19,35,1)'); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
function floor(g, y, s = 360) { const f = mesh(new THREE.CircleGeometry(s, 64), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .95 }), 0, y, 0, g); f.rotation.x = -Math.PI / 2; return f; }
function addLights(g, x = -80, y = 120, z = 140, c = 0xffe2c0, i = 1.2) { const l = new THREE.PointLight(c, i * 9000, 700, 2); l.position.set(x, y, z); g.add(l); return l; }

// ---------- river: dusk over the Chao Phraya, from a high balcony ----------
{ const R = group('river', 0, 0, 0);
  // sky: navy overhead to a warm violet grey at the horizon
  const sky = mesh(new THREE.PlaneGeometry(6000, 1600), new THREE.MeshBasicMaterial({ map: canvasTex(4, 256, (g) => { const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, '#0b1323'); r.addColorStop(.55, '#1f2a48'); r.addColorStop(.85, '#4a4560'); r.addColorStop(1, '#6a5a64'); g.fillStyle = r; g.fillRect(0, 0, 4, 256); }), fog: false, depthWrite: false }), 0, 560, -1500, R);
  // water: a broad slate plane, a little brighter than the sky above it
  const wTex = canvasTex(4, 256, (g) => { const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, '#3a4262'); r.addColorStop(1, '#141c33'); g.fillStyle = r; g.fillRect(0, 0, 4, 256); });
  const water = mesh(new THREE.PlaneGeometry(4000, 1000), new THREE.MeshBasicMaterial({ map: wTex }), 0, 0, -500, R); water.rotation.x = -Math.PI / 2;
  // banks
  const bank = mat(0x1d2540, .9); mesh(new THREE.BoxGeometry(4000, 8, 260), bank, 0, 4, -1110, R); mesh(new THREE.BoxGeometry(4000, 6, 200), bank, 0, 3, -20, R);
  // skyline: solid towers with a quiet grid of lit windows
  const winTex = canvasTex(64, 256, (g) => { g.fillStyle = '#000000'; g.fillRect(0, 0, 64, 256); for (let y = 6; y < 256; y += 12) for (let x = 6; x < 64; x += 12) { const on = Math.random() < .28; g.fillStyle = '#ffd9a0'; if (on) g.fillRect(x, y, 6, 6); } });
  const towers = [];
  for (let i = 0; i < (small ? 70 : 110); i++) { const w = rand(26, 70), h = Math.random() < .15 ? rand(180, 300) : rand(50, 160), d = rand(24, 50), x = rand(-1500, 1500), z = rand(-1180, -1020);
    const lit = Math.random() < .7, c = new THREE.Color().setHSL(.63, .2, rand(.1, .18));
    const m = lit ? new THREE.MeshStandardMaterial({ color: c, roughness: .8, emissive: 0xffc88a, emissiveIntensity: .9, emissiveMap: (() => { const t = winTex.clone(); t.needsUpdate = true; t.repeat.set(w / 64, h / 120); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })() }) : new THREE.MeshStandardMaterial({ color: c, roughness: .85 });
    const t = mesh(new THREE.BoxGeometry(w, h, d), m, x, h / 2 + 6, z, R); towers.push(t); }
  // reflections: soft warm streaks under the bright bank, shimmering gently
  const rTex = canvasTex(32, 256, (g) => { const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, 'rgba(255,214,160,.9)'); r.addColorStop(1, 'rgba(255,214,160,0)'); g.fillStyle = r; g.fillRect(8, 0, 16, 256); });
  rTex.colorSpace = THREE.NoColorSpace;
  const refl = []; for (const t of towers) { if (t.scale && t.geometry.parameters.height < 120 || Math.random() < .4) continue;
    const len = 260 + t.geometry.parameters.height, m = mesh(new THREE.PlaneGeometry(t.geometry.parameters.width * .7, len), new THREE.MeshBasicMaterial({ map: rTex, transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending }), t.position.x, .6, -990 + len / 2, R);
    m.rotation.x = -Math.PI / 2; m.userData.ph = rand(0, 6); refl.push(m); }
  // a bridge with a row of warm lights
  for (const bx of [-560]) { mesh(new THREE.BoxGeometry(18, 8, 1000), mat(0x343d5e, .8), bx, 24, -540, R); mesh(new THREE.BoxGeometry(8, 120, 8), mat(0x3a4468, .8), bx, 64, -540, R);
    const lp = []; for (let z = -1020; z <= -60; z += 18) lp.push(bx + 9, 30, z); R.add(points(lp, 9, WARM, .9, true)); }
  // boats: rounded hulls, a small cabin, one warm light, a faint wake
  const boats = []; const hullM = mat(0xd8cfc2, .6), cabM = mat(0x2a3550, .7);
  for (let i = 0; i < 6; i++) { const b = new THREE.Group(), dir = i % 2 ? -1 : 1;
    mesh(rbox(52, 9, 16, 4), hullM, 0, 4, 0, b); mesh(rbox(22, 9, 12, 2), cabM, -dir * 6, 12, 0, b);
    b.add(points([dir * 8, 14, 0, -dir * 14, 13, 0], 10, WARM, .95, true));
    const wk = mesh(new THREE.PlaneGeometry(140, 10), new THREE.MeshBasicMaterial({ map: canvasTex(128, 8, (g) => { const r = g.createLinearGradient(0, 0, 128, 0); r.addColorStop(dir > 0 ? 1 : 0, 'rgba(241,235,221,.35)'); r.addColorStop(dir > 0 ? 0 : 1, 'rgba(241,235,221,0)'); g.fillStyle = r; g.fillRect(0, 2, 128, 4); }), transparent: true, depthWrite: false }), -dir * 96, .8, 0, b); wk.rotation.x = -Math.PI / 2;
    b.position.set(rand(-900, 900), 1, rand(-820, -260)); b.userData.v = rand(10, 18) * dir; boats.push(b); R.add(b); }
  // the balcony: a solid rail, slim balusters, a hint of floor
  const rail = new THREE.Group(), railM = mat(0x161c30, .55, .2);
  mesh(rbox(420, 2.6, 4, 1), railM, 0, 0, 0, rail); mesh(new THREE.BoxGeometry(420, .6, 1), new THREE.MeshBasicMaterial({ color: 0x8a7f74 }), 0, 1.4, 1.6, rail);
  for (let x = -200; x <= 200; x += 16) mesh(new THREE.BoxGeometry(.9, 12, .9), railM, x, -6.5, 0, rail);
  rail.position.set(0, 172, 70); R.add(rail);
  const city = new THREE.PointLight(0xffc890, 2.2e4, 2600, 1.6); city.position.set(0, 260, -760); R.add(city);
  R.userData = { refl, boats };
  const up = []; for (let i = 0; i < (small ? 80 : 140); i++) up.push(rand(-900, 900), rand(40, 700), rand(-1050, -600));
  const rise = points(up, small ? 6 : 5, WARM, .6, true); R.add(rise); R.userData.rise = rise;
  { const p = []; for (let i = 0; i < 120; i++) p.push(rand(-2500, 2500), rand(700, 1300), -1450); R.add(points(p, 4, IVORY, .35)); }
}
A[1] = [new THREE.Vector3(0, 210, 120), new THREE.Vector3(0, 70, -600)];
A[9] = [new THREE.Vector3(30, 214, 124), new THREE.Vector3(30, 80, -620)];

// ---------- 0 her name: points gather in 0.7s, then settle into crisp type ----------
let nameStars, nameType;
{ const g = group('name', 0, 1400, -3000), N = small ? 1400 : 2400, start = [], tgt = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) start.push(rand(-500, 500), rand(-300, 300), rand(-200, 100));
  nameStars = points(start, small ? 2.6 : 2.2, IVORY, .95); g.add(nameStars); nameStars.userData = { start: Float32Array.from(start), tgt, t: 0 };
  const sc = small ? .25 : .5;
  nameType = mesh(new THREE.PlaneGeometry(1024 * sc, 360 * sc), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 60 - 10 * sc, 0, g);
  const sample = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 360; const q = c.getContext('2d');
    q.fillStyle = '#fff'; q.font = '400 220px "IBM Plex Sans Thai", "Noto Sans Thai", sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('เกียวๆ', 512, 190);
    const d = q.getImageData(0, 0, 1024, 360).data, pts = []; for (let y = 0; y < 360; y += 3) for (let x = 0; x < 1024; x += 3) if (d[(y * 1024 + x) * 4 + 3] > 160) pts.push([x, y]);
    for (let i = 0; i < N; i++) { const p = pts.length ? pts[(i * 7919) % pts.length] : [512, 180]; tgt[i * 3] = (p[0] - 512) * sc; tgt[i * 3 + 1] = (180 - p[1]) * sc + 60; tgt[i * 3 + 2] = 0; }
    const t = canvasTex(2048, 720, (x) => { x.fillStyle = '#f1ebdd'; x.font = '400 440px "IBM Plex Sans Thai", "Noto Sans Thai", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('เกียวๆ', 1024, 380); });
    nameType.material.map = t; nameType.material.needsUpdate = true; nameType.position.y = 60; };
  Promise.race([document.fonts ? document.fonts.load('400 220px "IBM Plex Sans Thai"', 'เกียว') : 0, new Promise(r => setTimeout(r, 2000))]).then(sample, sample); }
A[0] = [new THREE.Vector3(0, 1400, -2620), new THREE.Vector3(0, 1430, -3000)];

// ---------- 2 spin studio: one stationary bike in profile, a dark room, cool LED strips ----------
let flyV = REDUCE ? 0 : 0.6;
{ const g = group('fly', 2000, 0, -2000), wheel = new THREE.Group(), leds = [];
  const ink = mat(0x14161c, .45, .6), ink2 = mat(0x1c1f27, .5, .5), chrome = mat(0x9aa0ad, .25, .9), seat = mat(0x0e0f13, .8, .1);
  const bar = (x1, y1, x2, y2, t, m = ink) => { const L = Math.hypot(x2 - x1, y2 - y1), o = mesh(rbox(L, t, t, t / 2.2), m, (x1 + x2) / 2, (y1 + y2) / 2, 0, g); o.rotation.z = Math.atan2(y2 - y1, x2 - x1); return o; };
  // room: a near-black wall and floor so the bike reads as a silhouette
  mesh(new THREE.PlaneGeometry(1400, 900), mat(0x07080c, .95), 0, 300, -70, g);
  { const fl = mesh(new THREE.PlaneGeometry(1400, 1200), mat(0x08090d, .6, .2), 0, -72, 520, g); fl.rotation.x = -Math.PI / 2; }
  // LED strips: low on the wall and along the floor line, blue to violet
  const ledM = (c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
  [[0, -64, -68, 520, 1.6, 0x5b6cff], [0, -71, -40, 520, 1.1, 0x7a5cff], [-150, 40, -68, 1.4, 150, 0x6a62ff], [150, 40, -68, 1.4, 150, 0x6a62ff]].forEach(([x, y, z, w, h, c]) => { const l = mesh(new THREE.PlaneGeometry(w, h), ledM(c), x, y, z, g); if (z === -40) l.rotation.x = -Math.PI / 2; leds.push(l); });
  // haze: a soft violet bloom rising from the floor strip
  const hz = canvasTex(256, 256, (x) => { const r = x.createRadialGradient(128, 200, 8, 128, 200, 150); r.addColorStop(0, 'rgba(110,100,255,.55)'); r.addColorStop(1, 'rgba(60,40,160,0)'); x.fillStyle = r; x.fillRect(0, 0, 256, 256); });
  const haze = mesh(new THREE.PlaneGeometry(520, 320), new THREE.MeshBasicMaterial({ map: hz, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 30, -60, g);
  // bike, side profile, facing right
  mesh(rbox(10, 5, 46, 2), ink2, -46, -68, 0, g); mesh(rbox(10, 5, 46, 2), ink2, 52, -68, 0, g); bar(-46, -66, 52, -66, 5, ink2);
  bar(-40, -64, 8, -30, 7); bar(8, -30, 44, 16, 7); bar(52, -64, 40, -40, 6);
  bar(-14, -46, -24, 22, 5); bar(-24, 22, -26, 30, 3, chrome);
  mesh(rbox(34, 5, 13, 2.4), seat, -28, 33, 0, g);
  bar(40, 8, 46, 34, 5); bar(46, 34, 48, 40, 3, chrome); bar(46, 42, 64, 45, 3.4, seat); bar(63, 45, 68, 51, 3, seat);
  // heavy front flywheel: a solid disc with a thin chrome rim, under a half guard
  wheel.position.set(40, -40, 0); g.add(wheel);
  { const d = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 6, 64), ink2); d.rotation.x = Math.PI / 2; wheel.add(d);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(25, .9, 12, 96), chrome); wheel.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 8, 24), chrome); hub.rotation.x = Math.PI / 2; wheel.add(hub); }
  // crank and pedals
  const crank = new THREE.Group(); crank.position.set(8, -34, 5); g.add(crank);
  { const arm = mesh(rbox(3, 26, 2, 1), chrome, 0, 0, 0, crank); mesh(rbox(10, 2.5, 5, 1), seat, 0, 13, 2, crank); mesh(rbox(10, 2.5, 5, 1), seat, 0, -13, -2, crank); mesh(new THREE.CylinderGeometry(5, 5, 3, 32), chrome, 0, 0, 0, crank).rotation.x = Math.PI / 2; }
  const rim = new THREE.PointLight(0x6d63ff, 5000, 520, 2); rim.position.set(0, -40, -50); g.add(rim);
  const top = new THREE.PointLight(0x9fb0ff, 2200, 500, 2); top.position.set(30, 150, 120); g.add(top);
  g.userData = { wheel, crank, leds, haze, rim }; }
A[2] = [new THREE.Vector3(2012, -38, -1760), new THREE.Vector3(2012, -46, -2000)];

// ---------- 3 lift: stone doors, a readable indicator, warm light inside ----------
let liftOpen = 0, liftTarget = 0;
{ const g = group('lift', 4000, 0, -2000);
  mesh(rbox(84, 112, 6, 1.5), mat(0x3a4262, .7, .1), 0, 0, -3, g);
  mesh(new THREE.PlaneGeometry(56, 88), new THREE.MeshStandardMaterial({ color: 0x5a4636, emissive: 0xffb070, emissiveIntensity: .0, roughness: .9 }), 0, -2, -.5, g);
  const inside = g.children[g.children.length - 1];
  const dm = mat(STONE, .45, .15), L = mesh(rbox(28, 88, 2.4, .6), dm, -14, -2, 1, g), Rr = mesh(rbox(28, 88, 2.4, .6), dm, 14, -2, 1, g);
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([V(0, -46, 2.4), V(0, 42, 2.4)]), LM(IVORY, .25)));
  const draw = (t) => textTex([{ t, f: '500 46px Inter, sans-serif', y: 48, c: '#f1ebdd' }], 512, 96, { bg: '#141b30' });
  const ind = mesh(new THREE.PlaneGeometry(38, 7.2), new THREE.MeshBasicMaterial({ map: draw('Work') }), 0, 50, 0, g);
  mesh(new THREE.CircleGeometry(3.4, 40), mat(GOLD, .4, .3), 50, 0, 0, g);
  floor(g, -56, 260); addLights(g, -60, 80, 160);
  const glow = new THREE.PointLight(0xffb878, 0, 160, 2); glow.position.set(0, 0, 20); g.add(glow);
  g.userData = { L, Rr, ind, draw, inside, glow, last: 'Work' }; }
addEventListener('lift', e => { liftTarget = e.detail === 'off' ? 1 : 0; });
A[3] = [new THREE.Vector3(4000, 0, -1840), new THREE.Vector3(4000, 4, -2000)];

// ---------- 4 travel: two matte landmark towers on a low skyline ----------
{ const g = group('travel', 6000, 0, -2000), gy = -38, m = mat(STONE, .7), low = mat(0x3a4466, .85);
  for (let i = 0; i < 22; i++) { const w = rand(6, 14), h = rand(8, 30); mesh(new THREE.BoxGeometry(w, h, rand(6, 14)), low, rand(-100, 100), gy + h / 2, rand(-30, -8), g); }
  const prof = []; for (let k = 0; k <= 24; k++) { const t = k / 24; prof.push(new THREE.Vector2(9 - Math.sin(t * Math.PI) * 5 - t * 2.6, t * 110)); }
  mesh(new THREE.LatheGeometry(prof, 48), m, -30, gy, 0, g); mesh(new THREE.CylinderGeometry(.6, 1.2, 28, 12), mat(IVORY, .5), -30, gy + 124, 0, g);
  mesh(new THREE.CylinderGeometry(3.5, 8, 116, 4), m, 40, gy + 58, 0, g).rotation.y = Math.PI / 4;
  mesh(new THREE.ConeGeometry(3.5, 12, 4), m, 40, gy + 122, 0, g).rotation.y = Math.PI / 4;
  mesh(new THREE.CylinderGeometry(.4, .7, 18, 8), mat(GOLD, .4, .3), 40, gy + 137, 0, g);
  floor(g, gy, 260); addLights(g, -90, 120, 150);
  const tl = mesh(new THREE.PlaneGeometry(48, 9.4), new THREE.MeshBasicMaterial({ map: textTex([{ t: '广州  ·  深圳', f: '400 46px "IBM Plex Sans Thai", sans-serif', y: 50, c: '#f1ebdd' }], 512, 100), transparent: true, depthWrite: false }), 0, 84, 0, g); }
A[4] = [new THREE.Vector3(6000, 20, -1800), new THREE.Vector3(6000, 10, -2000)];

// ---------- 5 weeknight: an upholstered sofa, a lamp, tonight's menu on the screen ----------
{ const g = group('tv', 8000, 0, -2000), fab = mat(TAUPE, .9), cush = mat(0x9a8e80, .92);
  mesh(rbox(88, 12, 32, 4), fab, 0, -34, 22, g); mesh(rbox(88, 26, 10, 4), fab, 0, -18, 38, g);
  for (const x of [-46, 46]) mesh(rbox(10, 20, 32, 4), fab, x, -30, 22, g);
  for (const x of [-20.5, 20.5]) mesh(rbox(40, 6, 28, 2.5), cush, x, -25, 20, g);
  for (const x of [-20, 20]) mesh(rbox(36, 18, 6, 3), cush, x, -12, 31, g);
  const menu = textTex([{ t: 'Tonight', f: '400 34px "Cormorant Garamond", serif', y: 50, x: 48, a: 'left', c: '#f1ebdd' }]
    .concat(['Silo', 'Severance', 'The Gentlemen'].map((t, i) => ({ t, f: '400 22px Inter, sans-serif', y: 104 + i * 34, x: 64, a: 'left', c: i === 1 ? '#0b1323' : '#b7b1a8' }))), 512, 288, { bg: '#121a2e' });
  { const c = menu.image.getContext('2d'); c.globalCompositeOperation = 'destination-over'; }
  const mc = document.createElement('canvas'); mc.width = 512; mc.height = 288; { const q = mc.getContext('2d'); q.drawImage(menu.image, 0, 0); q.fillStyle = '#f1ebdd'; q.fillRect(48, 104 + 34 - 15, 220, 30); q.fillStyle = '#0b1323'; q.font = '500 22px Inter, sans-serif'; q.textBaseline = 'middle'; q.fillText('Severance', 64, 138); }
  const mt = new THREE.CanvasTexture(mc); mt.colorSpace = THREE.SRGBColorSpace;
  mesh(rbox(94, 54, 3, 1), mat(0x0d111c, .4, .2), 0, 10, -52, g);
  const scr = mesh(new THREE.PlaneGeometry(88, 49.5), new THREE.MeshBasicMaterial({ map: mt }), 0, 10, -50.3, g);
  mesh(new THREE.BoxGeometry(14, 2, 8), mat(0x0d111c, .5), 0, -18, -52, g);
  mesh(new THREE.CylinderGeometry(.8, .8, 70, 12), mat(GOLD, .4, .3), 64, -8, 30, g); mesh(new THREE.CylinderGeometry(5, 8, 10, 32, 1, true), mat(STONE, .9, 0, { side: THREE.DoubleSide, emissive: 0xffd6a0, emissiveIntensity: .35 }), 64, 30, 30, g);
  const lamp = new THREE.PointLight(0xffcf98, 9000, 260, 2); lamp.position.set(62, 26, 34); g.add(lamp);
  floor(g, -42, 300); addLights(g, -90, 80, 140, 0xc8d4ff, .5); g.userData = { scr }; }
A[5] = [new THREE.Vector3(8000, 26, -1820), new THREE.Vector3(8000, -2, -2010)];

// ---------- 6 coffee milk: a ceramic cup, the swirl only on the coffee ----------
let stirV = REDUCE ? 0 : .4;
{ const g = group('cup', 10000, 0, -2000), cer = mat(IVORY, .5, 0, { side: THREE.DoubleSide });
  const prof = [V(0, -25), V(25, -25), V(27, -22), V(31, 0), V(34, 24), V(34.6, 25.5), V(33, 25.5), V(30, 2), V(26, -21), V(0, -21)].map(v => new THREE.Vector2(v.x, v.y));
  mesh(new THREE.LatheGeometry(prof, 72), cer, 0, 0, 0, g);
  const handle = mesh(new THREE.TorusGeometry(11, 2.8, 20, 48, Math.PI * 1.1), cer, 35, 2, 0, g); handle.rotation.z = -Math.PI * .55;
  const sauc = [V(0, -30), V(50, -30), V(54, -27.5), V(52, -27), V(30, -27), V(0, -27)].map(v => new THREE.Vector2(v.x, v.y));
  mesh(new THREE.LatheGeometry(sauc, 72), mat(IVORY, .55), 0, 0, 0, g);
  const c = document.createElement('canvas'); c.width = c.height = 512; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const top = mesh(new THREE.CircleGeometry(32.6, 72), new THREE.MeshStandardMaterial({ map: tex, roughness: .35 }), 0, 20, 0, g); top.rotation.x = -Math.PI / 2;
  const steam = []; for (let i = 0; i < 3; i++) { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 40 }, () => V(0, 30, 0))), LM(IVORY, .2)); l.userData.x = (i - 1) * 9; l.userData.ph = i * 2.1; g.add(l); steam.push(l); }
  floor(g, -30, 240); addLights(g, -70, 110, 120); g.userData = { c, tex, steam }; }
function paintCoffee(tw) { const { c, tex } = G.cup.userData, q = c.getContext('2d');
  const r0 = q.createRadialGradient(256, 256, 20, 256, 256, 256); r0.addColorStop(0, '#9a6a46'); r0.addColorStop(1, '#6e4630'); q.fillStyle = r0; q.fillRect(0, 0, 512, 512);
  q.lineCap = 'round'; for (let a = 0; a < 3; a++) { q.beginPath(); for (let k = 0; k <= 160; k++) { const t = k / 160, r = t * 236, ang = a * 2.094 + t * tw; const x = 256 + Math.cos(ang) * r, y = 256 + Math.sin(ang) * r; k ? q.lineTo(x, y) : q.moveTo(x, y); }
    q.strokeStyle = 'rgba(240,226,206,.8)'; q.lineWidth = 14; q.stroke(); q.strokeStyle = 'rgba(240,226,206,.35)'; q.lineWidth = 30; q.stroke(); }
  tex.needsUpdate = true; }
paintCoffee(3);
A[6] = [new THREE.Vector3(10000, 95, -1880), new THREE.Vector3(10000, 0, -2000)];

// ---------- 7 two orbits: slim solid rings, each with a point riding on it ----------
let ringA = 0, ringAV = 0;
{ const g = group('rings', 12000, 0, -2000);
  const mk = (r, c) => { const o = new THREE.Group(); o.add(new THREE.Mesh(new THREE.TorusGeometry(r, .9, 16, 220), mat(c, .5, .1))); const p = mesh(new THREE.SphereGeometry(2.6, 24, 16), new THREE.MeshBasicMaterial({ color: c === GOLD ? WARM : 0xffffff }), r, 0, 0, o); o.userData.p = p; return o; };
  const r1 = mk(52, STONE), r2 = mk(44, GOLD); g.add(r1, r2); addLights(g, -80, 90, 140); g.userData = { r1, r2 }; }
A[7] = [new THREE.Vector3(12000, 0, -1840), new THREE.Vector3(12000, 0, -2000)];

// ---------- 8 shelf: a close shelf, solid spines, one gold book leaning ----------
{ const g = group('shelf', 14000, 0, -2000), wood = mat(0x6e6156, .8);
  for (const y of [-30, 12]) mesh(rbox(150, 3, 28, .8), wood, 0, y, 0, g);
  mesh(rbox(150, 86, 2, .5), mat(0x18203a, .95), 0, -6, -14, g);
  const cols = [0x2f3b5c, 0x8a7f74, 0xcbbfae, 0x45506e, 0x6b5f57, 0xa89c8c, 0x34405f, 0x9c8f80];
  let x = -66; for (let i = 0; i < 11; i++) { const w = rand(4.5, 8), h = rand(26, 36), d = rand(16, 22); mesh(rbox(w, h, d, .6), mat(cols[i % cols.length], .85), x + w / 2, -28.5 + h / 2, 0, g); x += w + .6; }
  const gb = mesh(rbox(6, 34, 21, .6), mat(GOLD, .45, .25), x + 8, -28.5 + 17, 0, g); gb.rotation.z = -.16;
  x = -30; for (let i = 0; i < 9; i++) { const w = rand(4.5, 7.5), h = rand(24, 34), d = rand(16, 22); mesh(rbox(w, h, d, .6), mat(cols[(i + 3) % cols.length], .85), x + w / 2, 13.5 + h / 2, 0, g); x += w + .6; }
  mesh(rbox(16, 10, 16, 2), mat(STONE, .6), 52, 18.5, 0, g);
  floor(g, -54, 260); addLights(g, -70, 90, 130); const lamp = new THREE.PointLight(0xffc890, 5000, 220, 2); lamp.position.set(50, 60, 50); g.add(lamp); }
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
  if (G.river.visible) { const still = cur === 9 ? 0 : 1;
    for (const b of G.river.userData.boats) { b.position.x += b.userData.v * dt * mo * still; if (Math.abs(b.position.x) > 1200) b.position.x *= -.98; }
    for (const r of G.river.userData.refl) r.material.opacity = .28 + .1 * Math.sin(T * 1.1 * mo + r.userData.ph);
    const rp = G.river.userData.rise; rp.visible = cur === 1; if (rp.visible) { const a = rp.geometry.attributes.position.array; for (let i = 1; i < a.length; i += 3) { a[i] += dt * 14 * mo; if (a[i] > 900) a[i] = 40; } rp.geometry.attributes.position.needsUpdate = true; } }
  if (G.name.visible || cur === 0) { const u = nameStars.userData; u.t = REDUCE ? 1 : Math.min(1, u.t + dt / .7); const q = 1 - Math.pow(1 - u.t, 3), p = nameStars.geometry.attributes.position.array;
    for (let i = 0; i < p.length; i++) p[i] = u.start[i] + (u.tgt[i] - u.start[i]) * q; nameStars.geometry.attributes.position.needsUpdate = true;
    const s = Math.max(0, Math.min(1, (u.t - .8) / .2)); nameType.material.opacity = nameType.material.map ? s : 0; nameStars.material.opacity = .95 * (1 - s * .96); }
  if (G.fly.visible) { flyV = Math.max(REDUCE ? 0 : .3, flyV - dt * 1.2); const u = G.fly.userData; u.wheel.rotation.z -= flyV * dt * 1.6; u.crank.rotation.z -= flyV * dt * .6;
    const f = Math.min(1, flyV / 14), beat = REDUCE ? 0 : Math.pow(.5 + .5 * Math.sin(T * (2.2 + f * 2.6) * Math.PI), 4) * (.15 + .25 * f);
    for (const l of u.leds) l.material.opacity = .55 + .3 * f + beat; u.haze.material.opacity = .35 + .25 * f + beat * .6; u.rim.intensity = 4000 + 3000 * f + beat * 4000; }
  if (G.lift.visible) { liftOpen += (liftTarget - liftOpen) * Math.min(1, dt * 2.5); const u = G.lift.userData;
    u.L.position.x = -14 - liftOpen * 26; u.Rr.position.x = 14 + liftOpen * 26; u.inside.material.emissiveIntensity = liftOpen * .9; u.glow.intensity = liftOpen * 4000;
    const want = liftTarget ? 'Off duty' : 'Work'; if (want !== u.last) { u.last = want; u.ind.material.map = u.draw(want); u.ind.material.needsUpdate = true; } }
  if (G.cup.visible) { stirV *= Math.pow(.6, dt); swirl += stirV * dt * 6; KK.swirl = swirl; if (Math.abs(stirV) > .02 || !G.cup.userData.p) { paintCoffee(swirl); G.cup.userData.p = 1; }
    for (const l of G.cup.userData.steam) { const p = l.geometry.attributes.position.array, ph = l.userData.ph;
      for (let i = 0; i < 40; i++) { const t = i / 39; p[i * 3] = l.userData.x + Math.sin(t * 6 + T * .9 * mo + ph) * 3 * t; p[i * 3 + 1] = 30 + t * 46; p[i * 3 + 2] = 0; }
      l.geometry.attributes.position.needsUpdate = true; l.material.opacity = .12 + .06 * Math.sin(T * .7 * mo + ph); } }
  if (G.rings.visible) { const { r1, r2 } = G.rings.userData; ringAV *= Math.pow(.5, dt); ringA += ringAV * dt;
    r1.rotation.x = ringA + T * .25 * mo; r1.rotation.y = T * .12 * mo;
    r2.rotation.x = ringA * .6 + 1.2 + T * .18 * mo; r2.rotation.y = -ringA * .4 + T * .08 * mo; KK.ring = ringA;
    r1.rotation.z = T * .5 * mo; r2.rotation.z = -T * .6 * mo; }
  if (G.shelf.visible) G.shelf.rotation.y = Math.sin(T * .2) * .06 * mo;
  renderer.render(scene, camera); window.__ready = true; requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
