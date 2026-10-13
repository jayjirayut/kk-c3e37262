/* places.js: "Places we go together". Canvas globe with routes from Bangkok, one card per place, planned/been/next trip in localStorage. Classic script; never throws. */
(function () {
  'use strict';
  // Months, flight times and stops follow places_sources.md word for word; monNote/flyNote hold that table's bracketed detail.
  // Fit lines use known facts only: Interstellar, her spin class/gym/yoga/Lululemon, coffee milk, weeknight series, the floor-31 river view.
  // nyeEn/nyeTh: the New Year's Eve line, only from that file's confirmed NYE table (three places, no more).
  // img: card art, 800x1000. A place without img gets its name set in a 1px frame; adding img: 'img/mel.webp' later is all it takes.
  // pos: focal point for the crop (x for the tall phone crop, y for the wide one); alt/altTh describe the photograph.
  var P = [
    { id: 'kef', lat: 64.15, lon: -21.94, en: 'Reykjavik, Iceland', th: 'เรคยาวิก ไอซ์แลนด์', s: 'Reykjavik', sTh: 'เรคยาวิก',
      img: 'img/kef.webp', pos: '60% 55%', alt: 'Green aurora over a lagoon of floating ice, two figures on the dark shore',
      altTh: 'แสงเหนือสีเขียวเหนือทะเลสาบที่มีก้อนน้ำแข็งลอย มีคนสองคนยืนอยู่บนฝั่ง',
      nyeEn: 'Inside aurora season. At midnight, residents set off fireworks across the whole city.',
      nyeTh: 'อยู่ในฤดูแสงเหนือ เที่ยงคืนชาวเมืองจุดพลุกันทั่วทั้งเมือง',
      whyEn: 'The closest thing to our film\u2019s sky: green light moving over dark ground. Spacesuit optional, warm jacket not.',
      whyTh: 'ท้องฟ้าที่ใกล้ Interstellar ที่สุด แสงเขียวเคลื่อนอยู่เหนือพื้นมืด ชุดอวกาศไม่ต้อง แต่เสื้อกันหนาวต้องมา',
      monEn: 'Sep to Mar', monTh: 'ก.ย. ถึง มี.ค.', monNote: 'aurora season late Aug to late Apr', monNoteTh: 'ฤดูแสงเหนือ ปลาย ส.ค. ถึงปลาย เม.ย.',
      fly: '~17 to 18h, 1 stop', flyTh: '~17 ถึง 18 ชม. ต่อเครื่อง 1 ครั้ง', flyNote: 'no direct', flyNoteTh: 'ไม่มีบินตรง',
      doEn: 'Drive past the city lights on a clear night with a thermos of coffee milk, and wait for the sky to move.',
      doTh: 'ขับรถออกนอกเมืองคืนฟ้าใส พกกระติกกาแฟนมไปด้วย แล้วนั่งรอให้ฟ้าเริ่มขยับ' },
    { id: 'atk', lat: -22.91, lon: -68.2, en: 'San Pedro de Atacama, Chile', th: 'ซานเปโดร เด อาตากามา ชิลี', s: 'Atacama', sTh: 'อาตากามา',
      img: 'img/atk.webp', pos: '40% 62%', alt: 'The Milky Way over a salt flat and a line of mountains, two figures far off',
      altTh: 'ทางช้างเผือกเหนือที่ราบเกลือและแนวภูเขา มีคนสองคนยืนอยู่ไกล ๆ',
      whyEn: 'One of the clearest skies on Earth. Interstellar, minus the wormhole.',
      whyTh: 'ฟ้าใสที่สุดแห่งหนึ่งของโลก Interstellar ฉบับไม่มีรูหนอน',
      monEn: 'Apr to Sep', monTh: 'เม.ย. ถึง ก.ย.', monNote: 'May to Aug clearest; Apr and Sep milder nights', monNoteTh: 'พ.ค. ถึง ส.ค. ฟ้าใสที่สุด ส่วน เม.ย. กับ ก.ย. กลางคืนหนาวน้อยกว่า',
      fly: '~31h+, 2 stops to Calama', flyTh: '~31 ชม. ขึ้นไป ต่อเครื่อง 2 ครั้ง ถึงกาลามา',
      flyNote: 'BKK to Santiago ~26 to 27h, 1 stop; then a domestic flight; then ~1.5h road', flyNoteTh: 'กทม. ถึงซานติอาโก ~26 ถึง 27 ชม. ต่อเครื่อง 1 ครั้ง แล้วต่อเที่ยวบินในประเทศ แล้วนั่งรถอีก ~1.5 ชม.',
      doEn: 'An observatory night near the new moon. The longest flight on the list, and the sky pays it back.',
      doTh: 'คืนดูดาวที่หอดูดาวช่วงใกล้เดือนมืด ไฟลต์ไกลที่สุดในลิสต์ แต่ฟ้าคุ้มทุกชั่วโมงบิน' },
    { id: 'tek', lat: -44.0, lon: 170.48, en: 'Lake Tekapo, New Zealand', th: 'ทะเลสาบเทคาโป นิวซีแลนด์', s: 'Tekapo', sTh: 'เทคาโป',
      img: 'img/tek.webp', pos: '10% 62%', alt: 'The Milky Way over a still lake and snowy peaks, a small stone church lit on the far shore, two figures on the rocks',
      altTh: 'ทางช้างเผือกเหนือทะเลสาบนิ่งและยอดเขาหิมะ โบสถ์หินหลังเล็กเปิดไฟอยู่อีกฝั่ง มีคนสองคนยืนบนโขดหิน',
      whyEn: 'A dark sky reserve with the Milky Way right overhead. Our film, as a documentary.',
      whyTh: 'เขตอนุรักษ์ท้องฟ้ามืด ทางช้างเผือกอยู่เหนือหัวพอดี เหมือนดู Interstellar ฉบับสารคดี',
      monEn: 'Jun to Aug', monTh: 'มิ.ย. ถึง ส.ค.', monNote: 'winter, long dark nights', monNoteTh: 'หน้าหนาว กลางคืนมืดนาน',
      fly: '~14 to 16h to Christchurch, 1 stop, then ~3h drive', flyTh: '~14 ถึง 16 ชม. ถึงไครสต์เชิร์ช ต่อเครื่อง 1 ครั้ง แล้วขับรถ ~3 ชม.', flyNote: 'no direct', flyNoteTh: 'ไม่มีบินตรง',
      doEn: 'A stargazing tour, then hot pools under the same sky. The best cool-down after any leg day.',
      doTh: 'ทัวร์ดูดาว แล้วแช่บ่อน้ำอุ่นใต้ฟ้าเดียวกัน คูลดาวน์ที่ดีที่สุดหลังวันเล่นขา' },
    { id: 'tyo', lat: 35.68, lon: 139.69, en: 'Tokyo, Japan', th: 'โตเกียว ญี่ปุ่น', s: 'Tokyo', sTh: 'โตเกียว',
      img: 'img/tyo.webp', pos: '50% 55%', alt: 'A rain-wet stone path between glowing lanterns, temple halls and a pagoda in the mist, two figures walking',
      altTh: 'ทางเดินหินเปียกฝนระหว่างโคมไฟ มีวิหารและเจดีย์อยู่ในหมอก มีคนสองคนกำลังเดิน',
      nyeEn: '~6h direct. Around midnight, temple bells are rung 108 times: joya no kane.',
      nyeTh: '~6 ชม. บินตรง ราวเที่ยงคืนวัดตีระฆัง 108 ครั้ง เรียกว่า โจยะ โนะ คาเนะ',
      whyEn: 'A city that looks best from high up at night, like our floor 31. Plus very serious coffee.',
      whyTh: 'เมืองที่สวยที่สุดตอนมองจากที่สูงยามค่ำ แบบชั้น 31 ของเรา แถมกาแฟจริงจังมาก',
      monEn: 'Late Nov, also Oct', monTh: 'ปลาย พ.ย. หรือ ต.ค. ก็ได้', monNote: 'autumn leaves', monNoteTh: 'ใบไม้เปลี่ยนสี',
      fly: '~6h direct', flyTh: '~6 ชม. บินตรง',
      doEn: 'A morning ginkgo walk, coffee at an old kissaten, then a night skyline deck to judge against floor 31.',
      doTh: 'เดินชมใบแปะก๊วยตอนเช้า กาแฟร้านเก่าแบบญี่ปุ่น แล้วขึ้นจุดชมวิวตอนค่ำ ตัดสินกันว่าสู้ชั้น 31 ได้ไหม' },
    { id: 'mel', lat: -37.81, lon: 144.96, en: 'Melbourne, Australia', th: 'เมลเบิร์น ออสเตรเลีย', s: 'Melbourne', sTh: 'เมลเบิร์น',
      img: 'img/mel.webp', pos: '50% 55%', alt: 'The Yarra at dusk, city towers lit along the river',
      nyeEn: 'Southern summer. Midnight rooftop fireworks, reflected in the Yarra.',
      nyeTh: 'หน้าร้อนของซีกโลกใต้ พลุเที่ยงคืนจากบนดาดฟ้า สะท้อนในแม่น้ำยาร์รา',
      whyEn: 'A coffee city with a river through it. Our coffee milk is about to meet its rival.',
      whyTh: 'เมืองกาแฟที่มีแม่น้ำไหลผ่ากลาง กาแฟนมของเรากำลังจะเจอคู่แข่ง',
      monEn: 'Mar to May', monTh: 'มี.ค. ถึง พ.ค.',
      fly: '~9h direct', flyTh: '~9 ชม. บินตรง', flyNote: 'Thai Airways', flyNoteTh: 'การบินไทย',
      doEn: 'A laneway coffee crawl, then a slow walk along the Yarra. Coffee and a river: basically home, with more cafés.',
      doTh: 'ตระเวนกาแฟตามตรอก แล้วเดินเล่นริมแม่น้ำยาร์รา กาแฟกับแม่น้ำ ก็เหมือนบ้านเรา แค่ร้านกาแฟเยอะกว่า' },
    { id: 'bud', lat: 47.5, lon: 19.04, en: 'Budapest, Hungary', th: 'บูดาเปสต์ ฮังการี', s: 'Budapest', sTh: 'บูดาเปสต์',
      img: 'img/bud.webp', pos: '50% 55%', alt: 'The Danube and the Chain Bridge at blue hour',
      whyEn: 'Bridges and lights on a river at night. Our view, in another language.',
      whyTh: 'สะพานกับไฟริมแม่น้ำยามค่ำ วิวบ้านเราในอีกภาษา',
      monEn: 'Apr to May, Sep to Oct', monTh: 'เม.ย. ถึง พ.ค. และ ก.ย. ถึง ต.ค.',
      fly: '~13 to 15h, 1 stop', flyTh: '~13 ถึง 15 ชม. ต่อเครื่อง 1 ครั้ง', flyNote: 'no direct', flyNoteTh: 'ไม่มีบินตรง',
      doEn: 'A Danube cruise after dark, then a thermal bath, which absolutely counts as a rest day.',
      doTh: 'ล่องแม่น้ำดานูบตอนค่ำ แล้วแช่บ่อน้ำร้อน ซึ่งนับเป็นวันพักได้เต็ม ๆ' },
    { id: 'yvr', lat: 49.28, lon: -123.12, en: 'Vancouver, Canada', th: 'แวนคูเวอร์ แคนาดา', s: 'Vancouver', sTh: 'แวนคูเวอร์',
      img: 'img/yvr.webp', pos: '10% 55%', alt: 'A seawall path along the water at sunset, mountains across the bay, two people walking',
      altTh: 'ทางเดินเลียบกำแพงริมทะเลตอนพระอาทิตย์ตก ภูเขาอยู่อีกฝั่งอ่าว มีคนสองคนกำลังเดิน',
      whyEn: 'Lululemon\u2019s hometown: it started in Kitsilano in 1998. A whole city that exercises for fun.',
      whyTh: 'บ้านเกิด Lululemon เริ่มต้นที่ย่านคิตซิลาโนเมื่อปี 1998 ทั้งเมืองออกกำลังกายเพราะสนุก',
      monEn: 'May to Sep', monTh: 'พ.ค. ถึง ก.ย.',
      fly: '~13h direct (Air Canada; check season) or ~16 to 19h, 1 stop', flyTh: '~13 ชม. บินตรง (Air Canada เช็กฤดูก่อน) หรือ ~16 ถึง 19 ชม. ต่อเครื่อง 1 ครั้ง',
      doEn: 'Yoga in the morning, then the Stanley Park seawall by bike. Jay\u2019s cardio will be reviewed.',
      doTh: 'โยคะตอนเช้า แล้วปั่นจักรยานเลียบทะเลรอบ Stanley Park คาร์ดิโอของเจจะถูกประเมิน' }
  ];
  // UI copy as [en, th].
  var TX = {
    title: ['Places we go together', 'ที่ที่อยากไปด้วยกัน'],
    hint: ['Drag to spin. No spin class required.', 'ลากเพื่อหมุน ไม่ต้องเข้าคลาสสปิน'],
    close: ['Close', 'ปิด'],
    intro: ['Seven places that fit us: three skies straight out of Interstellar, two coffee cities, a river view like ours, and Lululemon’s hometown.',
      'เจ็ดที่ที่เข้ากับเรา ฟ้าแบบ Interstellar สามที่ เมืองกาแฟสองเมือง วิวแม่น้ำแบบบ้านเราอีกหนึ่ง และบ้านเกิด Lululemon'],
    pick: ['Tap a pin or a name, or let the globe decide.', 'แตะหมุดหรือชื่อ หรือจะให้โลกช่วยเลือกก็ได้'],
    spin: ['Spin for it', 'หมุนวัดดวง'],
    next: ['Next trip: ', 'ทริปต่อไป: '],
    local: ['Saved on this device only.', 'บันทึกไว้ในเครื่องนี้เท่านั้น'],
    best: ['Best time', 'ช่วงที่ดีที่สุด'],
    from: ['From BKK', 'บินจาก กทม.'],
    tog: ['Together', 'ทำด้วยกัน'],
    places: ['Places', 'สถานที่'],
    mark: ['Mark this place', 'ทำเครื่องหมายที่นี่'],
    globe: ['Globe with routes from Bangkok to seven places', 'ลูกโลกพร้อมเส้นทางจากกรุงเทพฯ ไปเจ็ดที่'],
    showing: ['. Showing ', ' กำลังดู '],
    home: ['Bangkok', 'กรุงเทพฯ'],
    planned: ['Planned', 'วางแผนแล้ว'],
    been: ['Been there', 'ไปมาแล้ว'],
    nextBtn: ['Next trip', 'ทริปต่อไป'],
    nye: ['New Year’s Eve', 'ส่งท้ายปี']
  };
  var BKK = { lat: 13.75, lon: 100.5 };
  // Land mask: 2 degree grid from Natural Earth 110m land (public domain), 90 rows x 180 cols, 45 hex chars per row.
  var LAND_HEX = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f800ffc0000000000000000000000000000000000017ff3fffffe00000000000004000000000000000000061df0ffffff0000f8000000003c000000000000000030027c3ffffff80002000000000060000000000000000038afc007ffff00000000030007ffc001d80000000000e88b7b003fffe000000000c003ffffec00000080180009fc33fc00fffa00000300041dffffffeffc80100fffbfe725d8f00fff800001ff000edfffffffffffdfe0ffffffffff87c1ff8000007ffebffdfffffffffffff31fffffffffd1f80fc01e000f9ebfffffffffffffffff00fffffffff8034078000003e7fffffffffffffffffff01fdffffffe01e0038000007e7ffffffffffffffff2f0007807ffffe01e4000000007e3ffffffffffffff82200001001fffff80fe000000182c7fffffffffffffe00f000080007fffff9ff8000003820ffffffffffffffc00e000000007fffff9ffc000006cfffffffffffffffffc08000000003ffffffffc000000dfffffffffffffffff4000000000017ffffff460000007fffffffffffffffff400000000000fffffffc10000007ffffffffffffffffe400000000000fffffff600000007f7f97fffffffffffc000000000000ffffffe00000007f19f03fffffffffff8c00000000000ffffffc00000003c26f7fffffffffffe0800000000000ffffff000000007c02dfffffffffff8408000000000007fffff0000000018740fffffffffffe630000000000003fffff000000001fe022ffffffffffc4f0000000000001ffffc000000003ff000ffffffffffc180000000000000ffff8000000007ffef7ffffffffffe0000000000000003fc04000000007ffffffdffffffffe0000000000000005f80400000001fffffefe7fffffffc0000000000000002f80000000001fffffe7f41ffffffc0000000000000000780c00000003ffffff7ff07fffff20000000000000000786100000007ffffffbfe07fcff0000000000000000003cc020000003ffffff9fe03f07e8000000000000000000fc000000003ffffff9f801e07f02000000000000000000f000000007ffffffde001c01f020000000000000000003000000003ffffffe8001c01f8200000000000000000010f0000003fffffff3000c013008000000000000000000aff000001fffffffe000a0120000000000000000000001ff800000fffffffe00020000080000000000000000001fff00000687ffffc000002c1800000000000000000001fff80000001ffff800000143800000000000000000003fff80000001ffff000000187a00000000000000000003fffe0000003fffe0000000c7818000000000000000003ffffc000001fffc00000006762b800000000000000007fffff000000fffc000000020101e00000000000000003fffff800000fffc00000001c001f08000000000000001fffff000000fffc000000000880d02000000000000001ffffe0000007ffc000000000000000000000000000000ffffe000000fffc20000000001c400000000000000000ffffe000000fffc2000000000fc6004000000000000003fffc000000fff8e000000001fe6000000000000000001fffc000000fff0e000000001ffe000000000000000001fffc0000007ff0c00000000ffff808000000000000001fff00000007ff0c00000001ffff800000000000000001ffc00000007fe0800000001ffffc00000000000000001ffc00000003fc0000000001ffffe00000000000000003ff800000003fc0000000001ffffe00000000000000003ff800000001f80000000000ffffe00000000000000003ff000000001f00000000000f07fc00000000000000003f8000000000000000000000801f800800000000000007fc000000000000000000000000f800400000000000007e00000000000000000000000000000600000000000007a00000000000000000000000003000c00000000000003c0000000000000000000000000100180000000000000780000000000000000000000000000300000000000000780000000000000000000000000000000000000000000f00000000000000000800000000000000000000000000e000000000000000000000000000000000000000000007000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000c00000000000001e00020ff9ffe000000000000000000c0000000000013fff87fffffffff00000000000000003e00000001ffffffff3fffffffffffc000000000038400f000001ffffffffffffffffffffffe000000ffff4ffffc000007ffffffffffffffffffffff800001ffffffffe000001ffffffffffffffffffffffff00004fffffffffe00070fffffffffffffffffffffffff000000fffffffffe0080ffffffffffffffffffffffffc000007fffffffffffffffffffffffffffffffffffffff80ff803ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  var LAND = (function () { var out = []; for (var r = 0; r < 90; r++) for (var c = 0; c < 45; c++) { var v = parseInt(LAND_HEX.charAt(r * 45 + c), 16);
    for (var b = 0; b < 4; b++) if (v & (8 >> b)) { var la = 89 - r * 2, col = c * 4 + b, step = Math.max(1, Math.round(1 / Math.max(.15, Math.cos(la * Math.PI / 180)))); if (col % step === 0) out.push([la, -179 + col * 2]); } } return out; })();
  var KEY = 'kk_places', TAU = Math.PI * 2, rad = Math.PI / 180;
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var st = load(); if (!st.marks || typeof st.marks !== 'object') st.marks = {};
  // The globe opens over home so the routes fan out from Bangkok, and drifts until the first touch.
  var rotLon = BKK.lon, rotLat = 20, sel = null, cv, g, W = 0, H = 0, R = 1, cx = 0, cy = 0, cl = 1, sl = 0, cp = 1, sp = 0;
  var raf = 0, lastT = 0, spin = null, fling = null, drift = true, drag = null, arcP = 1, arcT0 = 0, opener = null, inerted = [], pushed = false, backing = false, built = false;
  var RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function still() { return !!(window.App && window.App.fast) || !!(RM && RM.matches); }
  function $(id) { return document.getElementById(id); }
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function isOpen() { var d = $('places'); return !!d && d.classList.contains('open'); }
  function lang() { var l = document.documentElement.getAttribute('data-lang'); return l === 'th' || l === 'both' ? l : 'en'; }
  // Plain text for aria-labels and the canvas; Thai leads in "both", as in the captions.
  function tx(k) { return lang() === 'en' ? TX[k][0] : TX[k][1]; }
  // Inline pair: CSS shows the current language.
  function L(en, th) { return '<span class="th" lang="th">' + th + '</span><span class="en">' + en + '</span>'; }
  // Stacked pair: in "both" the English drops to a quieter second line.
  function T(en, th) { return '<span class="th" lang="th">' + th + '</span><span class="en sub">' + en + '</span>'; }

  // Geometry. vec() is a unit vector; view() rotates into the screen, z > 0 faces us, "out" is outside the disc (an arc above the limb).
  function vec(lat, lon) { var a = lat * rad, b = lon * rad, c = Math.cos(a); return [c * Math.sin(b), Math.sin(a), c * Math.cos(b)]; }
  function setRot() { cl = Math.cos(rotLon * rad); sl = Math.sin(rotLon * rad); cp = Math.cos(rotLat * rad); sp = Math.sin(rotLat * rad); }
  function view(v) { var x = v[0] * cl - v[2] * sl, z0 = v[2] * cl + v[0] * sl, y = cp * v[1] - sp * z0;
    return { x: cx + x * R, y: cy - y * R, z: sp * v[1] + cp * z0, out: x * x + y * y > 1 }; }
  var HOME = vec(BKK.lat, BKK.lon), GEO = {};
  P.forEach(function (p) { // great-circle route from home, lifted so long flights read as arcs
    var A = HOME, B = vec(p.lat, p.lon), w = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)), sw = Math.sin(w), h = .05 + .16 * w / Math.PI, pts = [];
    for (var i = 0; i <= 64; i++) { var t = i / 64, a = Math.sin((1 - t) * w) / sw, b = Math.sin(t * w) / sw, s = 1 + h * Math.sin(Math.PI * t);
      pts.push([(a * A[0] + b * B[0]) * s, (a * A[1] + b * B[1]) * s, (a * A[2] + b * B[2]) * s]); }
    // Turn to a point a little back along the route, so the place, its arc and (when it can) home share the view.
    var f = Math.min(.35, 35 * rad / w), fa = Math.sin((1 - f) * w) / sw, fb = Math.sin(f * w) / sw, c = [fa * B[0] + fb * A[0], fa * B[1] + fb * A[1], fa * B[2] + fb * A[2]];
    GEO[p.id] = { v: B, arc: pts, lat: Math.asin(clamp(c[1], -1, 1)) / rad, lon: Math.atan2(c[0], c[2]) / rad };
  });
  var LV = new Float32Array(LAND.length * 3), SX = new Float32Array(LAND.length), SY = new Float32Array(LAND.length), SZ = new Float32Array(LAND.length);
  LAND.forEach(function (q, i) { var v = vec(q[0], q[1]); LV[i * 3] = v[0]; LV[i * 3 + 1] = v[1]; LV[i * 3 + 2] = v[2]; });
  var GOLD = '#b8956a', IVORY = '#f4ecdc';

  function css() {
    var s = document.createElement('style'), LB = 'font:300 10.5px/1.4 var(--sans);letter-spacing:.18em;text-transform:uppercase;', SEP = '{content:" \\00b7  "}';
    s.textContent =
      '#places{position:fixed;inset:0;z-index:35;display:none;flex-direction:column;color:var(--ivory);padding:0 var(--sar) 0 var(--sal);background:var(--ink)}' +
      '#places.open{display:flex;animation:plIn .8s var(--ease) both}@keyframes plIn{from{opacity:0}to{opacity:1}}' +
      '#places .en{font-weight:inherit}#places .th{font-family:var(--thai)}' +
      // header: one serif headline, a quiet line beneath, and "Close" as a text link where the page keeps its top controls
      '#places .plHead{flex:none;display:flex;align-items:flex-start;gap:16px;padding:calc(18px + var(--sat)) 10px 0 24px}' +
      '#places .plHead>div{flex:1;min-width:0;padding-top:6px}' +
      '#places h2{font:400 30px/1.08 var(--serif);letter-spacing:-.005em}#places h2 .th{font:300 20px/1.4 var(--thai)}' +
      '#plHint{margin-top:8px;font:300 12.5px/1.5 var(--sans);color:var(--ivory2)}' +
      '#plClose{flex:none;min-height:44px;padding:0 12px;border:0;background:none;color:var(--ivory);cursor:pointer;' + LB + '}' +
      '#plClose>span{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:7px;text-decoration-color:var(--line2)}#plClose .th{font:300 14px/1.4 var(--thai)}' +
      '#plWrap{flex:1 1 auto;min-height:150px;position:relative}' +
      '#plGlobe{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab}#plGlobe.drag{cursor:grabbing}#plGlobe.hot{cursor:pointer}' +
      // one swipeable row of names keeps the globe big on a phone; the chosen one is underlined in gold
      '#plList{flex:none;position:relative;display:flex;overflow-x:auto;overscroll-behavior-x:contain;padding:0 12px;border-top:1px solid var(--line);scroll-snap-type:x proximity;scroll-padding:0 12px;scrollbar-width:none;' +
        '-webkit-mask-image:linear-gradient(90deg,transparent,#000 16px,#000 calc(100% - 16px),transparent);mask-image:linear-gradient(90deg,transparent,#000 16px,#000 calc(100% - 16px),transparent)}' +
      '#plList::-webkit-scrollbar{display:none}' +
      '#plList button{flex:none;scroll-snap-align:start;display:inline-flex;align-items:center;gap:8px;min-height:50px;padding:0 12px;border:0;background:none;color:var(--ivory2);white-space:nowrap;cursor:pointer;' + LB + 'transition:color .8s var(--ease)}' +
      '#plList button .th{font:300 14px/1.4 var(--thai)}' +
      '#plList button>.th,#plList button>.en{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:8px;text-decoration-color:transparent;transition:text-decoration-color .8s var(--ease)}' +
      '#plList button.on{color:var(--ivory)}#plList button.on>.th,#plList button.on>.en{text-decoration-color:var(--gold)}' +
      '#plList .tg{display:inline-flex}#plList .tg:empty{display:none}' +
      // status is a quiet word in gold, never a symbol
      '#places .mk{font:300 9px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}#places .mk .th{font:300 11.5px/1 var(--thai)}' +
      // fixed card height so the globe never jumps between places; the text scrolls, the actions stay put
      '#plCard{flex:none;display:flex;flex-direction:column;height:clamp(240px,44vh,400px);height:clamp(240px,44svh,400px);border-top:1px solid var(--line);overflow:hidden}' +
      '#plCard .plMain{flex:1;min-height:0;display:flex}' +
      '#plCard .plBody{flex:1;min-width:0;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:18px 20px 22px}' +
      '#plCard .plBody.more{-webkit-mask-image:linear-gradient(#000 calc(100% - 36px),transparent);mask-image:linear-gradient(#000 calc(100% - 36px),transparent)}' +
      // art runs full-bleed down the left edge: a photograph, or the name set large inside a 1px frame
      '#plCard .art{position:relative;flex:0 0 36%;margin:0;overflow:hidden;background:var(--ink2)}' +
      '#plCard .art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .9s var(--ease)}#plCard .art img.in{opacity:1}' +
      '#plCard .art.type{display:flex;padding:14px 0 14px 14px;background:none}' +
      '#plCard .plate{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border:1px solid var(--line2);overflow:hidden;container-type:size}' +
      '#plCard .plate b{font:400 clamp(34px,10vw,52px)/1 var(--serif);font-size:min(56px,21cqh);letter-spacing:.01em;white-space:nowrap;writing-mode:vertical-rl}' +
      '#plCard .plate small{display:none;' + LB + 'color:var(--gold)}' +
      '#plCard h3{display:flex;flex-direction:column-reverse;gap:8px;font-weight:300}' +
      '#plCard h3 .nm{font:400 30px/1.06 var(--serif);letter-spacing:-.005em}#plCard h3 .nm .th{font:300 21px/1.35 var(--thai)}' +
      '#plCard h3 .ctry{' + LB + 'color:var(--gold)}#plCard h3 .ctry .th{font:300 12.5px/1.4 var(--thai)}' +
      '#plCard .why{margin-top:12px;font:300 14.5px/1.6 var(--sans)}' +
      '#plCard .facts{display:grid;gap:16px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}' +
      '#plCard .lbl{display:block;margin-bottom:6px;' + LB + 'color:var(--gold)}#plCard .lbl .th{font:300 12.5px/1.4 var(--thai)}' +
      '#plCard dd{font:300 14px/1.5 var(--sans)}#plCard dd small{display:block;margin-top:4px;font-size:12.5px;line-height:1.45;color:var(--ivory2)}' +
      '#plCard .nye{margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}' +
      '#plCard .ntag{display:inline-block;padding:6px 10px 5px;border:1px solid var(--gold);border-radius:2px;font:300 9.5px/1.2 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}#plCard .ntag .th{font:300 12px/1.2 var(--thai)}' +
      '#plCard .nye p{margin-top:12px;font:300 14px/1.55 var(--sans)}' +
      '#plCard .do{margin-top:18px;padding-top:16px;border-top:1px solid var(--line);font:300 14px/1.6 var(--sans)}' +
      '#plCard .acts{flex:none;display:flex;padding:0 8px var(--sab);border-top:1px solid var(--line)}' +
      '#plCard .acts button{flex:1 1 0;min-width:0;min-height:52px;display:inline-flex;align-items:center;justify-content:center;padding:4px 6px;border:0;background:none;color:var(--ivory2);cursor:pointer;' + LB + 'transition:color .8s var(--ease)}' +
      '#plCard .acts .th{font:300 13px/1.3 var(--thai)}' +
      '#plCard .acts .tx{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:7px;text-decoration-color:var(--line2);transition:text-decoration-color .8s var(--ease)}' +
      '#plCard .acts [aria-pressed="true"]{color:var(--gold)}#plCard .acts [aria-pressed="true"] .tx{text-decoration-color:var(--gold)}' +
      // the opening card, before a place is chosen
      '#plCard .intro{padding:24px 24px calc(24px + var(--sab))}' +
      '#plCard .lead{font:300 16.5px/1.6 var(--sans)}' +
      '#plCard .nx{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin-top:20px}#plCard .nx .lbl{margin:0}#plCard .nx>span:last-child{font:300 15px/1.5 var(--sans)}' +
      '#plCard .pick{margin-top:20px;font:300 14px/1.55 var(--sans);color:var(--ivory2)}' +
      '#plSpin{margin-top:16px}' +
      '#plCard .note{margin-top:20px;font:300 11.5px/1.5 var(--sans);color:var(--ivory3)}' +
      '#places button:focus-visible,#plCard .plBody:focus-visible{outline:1px solid var(--gold);outline-offset:3px}#plCard .plBody:focus-visible{outline-offset:-4px}' +
      '#places .vh{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}' +
      'html[data-lang="en"] #places .th{display:none}html[data-lang="th"] #places .en{display:none}' +
      'html[data-lang="both"] #places .sub{display:block;margin-top:2px;font-size:.88em;color:var(--ivory2)}' +
      'html[data-lang="both"] #places .lbl .en::before,html[data-lang="both"] #plCard .ctry .en::before,html[data-lang="both"] #plCard .ntag .en::before,' +
        'html[data-lang="both"] #plCard .nx>span:last-child .en::before,html[data-lang="both"] #plCard .note .en::before' + SEP +
      'html[data-lang="both"] #plList button>.en{font-size:9px;opacity:.7}html[data-lang="both"] #places .mk .en,html[data-lang="both"] #plClose .en{display:none}' +
      'html[data-lang="both"] #plSpin{flex-direction:column;gap:3px}html[data-lang="both"] #plSpin .en{font-size:9.5px}' +
      'html[data-lang="both"] #plCard .acts .tx{display:flex;flex-direction:column;align-items:center;gap:3px}html[data-lang="both"] #plCard .acts .en{font-size:9px}' +
      '@media (min-width:600px){#plCard .facts{grid-template-columns:1fr 1fr;gap:16px 20px}}' +
      // landscape phones and desktops: globe on the left, list and card on the right; the art becomes a wide header
      '@media (orientation:landscape) and (min-width:640px){' +
        '#places.open{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,min(440px,42vw));grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"globe head" "globe list" "globe card"}' +
        '#places .plHead{grid-area:head;padding:calc(22px + var(--sat)) 10px 18px 28px}#plWrap{grid-area:globe;min-height:0;border-right:1px solid var(--line)}#plList{grid-area:list}' +
        '#plCard{grid-area:card;height:auto;min-height:0}#plCard .plMain{flex-direction:column}' +
        '#plCard .art{flex:none;height:clamp(120px,30vh,260px)}#plCard .art.type{padding:16px 16px 0}' +
        '#plCard .plate b{font-size:clamp(40px,6vw,60px);writing-mode:horizontal-tb}#plCard .plate small{display:block}' +
        '#plCard .plBody{padding:20px 28px 24px}}' +
      '@media (prefers-reduced-motion:reduce){#places.open{animation:none}#places button,#plCard .art img{transition:none}}';
    document.head.appendChild(s);
  }
  function build() {
    var d = document.createElement('div'); d.id = 'places'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'plTitle');
    d.innerHTML = '<header class="plHead"><div><h2 id="plTitle">' + T(TX.title[0], TX.title[1]) + '</h2><p id="plHint">' + T(TX.hint[0], TX.hint[1]) + '</p></div>' +
      '<button id="plClose" type="button">' + L(TX.close[0], TX.close[1]) + '</button></header>' +
      '<div id="plWrap"><canvas id="plGlobe" role="img"></canvas></div>' +
      '<div id="plList" role="group">' + P.map(function (p) { return '<button type="button" data-id="' + p.id + '" aria-pressed="false">' + L(p.s, p.sTh) + '<span class="tg"></span></button>'; }).join('') + '</div>' +
      '<div id="plCard"></div><p id="plLive" class="vh" aria-live="polite"></p>';
    document.body.appendChild(d);
    cv = $('plGlobe'); g = cv.getContext('2d');
    $('plClose').addEventListener('click', function () { close(); });
    var list = $('plList');
    list.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button[data-id]'); if (b) pick(b.getAttribute('data-id'), true); });
    list.addEventListener('keydown', function (e) { // arrows walk the chips; Enter or Space picks
      var cs = [].slice.call(list.children), i = cs.indexOf(document.activeElement), j = -1; if (i < 0) return;
      if (e.key === 'ArrowRight') j = (i + 1) % cs.length; else if (e.key === 'ArrowLeft') j = (i + cs.length - 1) % cs.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = cs.length - 1;
      if (j < 0) return; e.preventDefault(); cs[j].focus({ preventScroll: true }); center(cs[j]); });
    $('plCard').addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button'); if (!b) return;
      if (b.id === 'plSpin') surprise(); else if (b.hasAttribute('data-a')) act(b.getAttribute('data-a')); });
    // Drag turns the globe and lets it coast; a tap near a pin picks it.
    cv.addEventListener('pointerdown', function (e) { if (!e.isPrimary) return; drag = { x: e.clientX, y: e.clientY, t: e.timeStamp, moved: 0, vx: 0, vy: 0 };
      spin = fling = null; drift = false; cv.classList.remove('hot'); cv.classList.add('drag'); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener('pointermove', function (e) {
      if (!drag) { if (e.pointerType === 'mouse') { var r0 = cv.getBoundingClientRect(); cv.classList.toggle('hot', !!hit(e.clientX - r0.left, e.clientY - r0.top)); } return; }
      if (!e.isPrimary) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y, dt = Math.max(8, e.timeStamp - drag.t), k = 50 / R;
      drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; drag.t = e.timeStamp;
      rotLon -= dx * k; rotLat = clamp(rotLat + dy * k, -60, 60);
      drag.vx = drag.vx * .5 + clamp(dx * k / dt, -1, 1) * .5; drag.vy = drag.vy * .5 + clamp(dy * k / dt, -1, 1) * .5;
      kick(); });
    cv.addEventListener('pointerup', function (e) { if (!drag || !e.isPrimary) return; var d0 = drag; drag = null; cv.classList.remove('drag');
      if (d0.moved < 8) { var r = cv.getBoundingClientRect(), p = hit(e.clientX - r.left, e.clientY - r.top); if (p) pick(p.id, true); return; }
      if (!still() && e.timeStamp - d0.t < 90) { fling = { vx: d0.vx, vy: d0.vy }; kick(); } });
    cv.addEventListener('pointercancel', function () { drag = null; cv.classList.remove('drag'); });
    // While open: Escape closes, Tab stays inside, and keys never reach the page's scene navigation behind.
    document.addEventListener('keydown', function (e) { if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'Tab') trap(e);
      e.stopPropagation(); });
    // Phone back button or swipe closes the overlay instead of leaving the gift.
    addEventListener('popstate', function () {
      if (backing) { backing = false; if (isOpen() && !pushed) push(); return; }
      if (isOpen()) { pushed = false; close(true); } });
    function onResize() { if (isOpen()) { size(); draw(); fit(); } }
    if (window.ResizeObserver) new ResizeObserver(onResize).observe($('plWrap'));
    addEventListener('resize', onResize);
    if (window.MutationObserver) new MutationObserver(function () { labels(); kick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () { kick(); });
  }
  function size() { if (!cv) return; var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height;
    cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr)); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.max(40, Math.min(W, H) * .41); cx = W / 2; cy = H / 2; }
  function hit(x, y) { setRot(); var best = null, bd = 26; // about a 52px target around each pin
    P.forEach(function (p) { var q = view(GEO[p.id].v); if (q.z < .08) return; var d = Math.sqrt((q.x - x) * (q.x - x) + (q.y - y) * (q.y - y)); if (d < bd) { bd = d; best = p; } });
    return best; }
  function fade(z) { return clamp(z * 4, 0, 1); } // things ease out near the edge of the globe
  // Line art only: a hairline limb, a sparse graticule, very faint land, then routes and pins on top. No fills, no glow.
  function draw() {
    if (!g || !isOpen() || W < 2 || H < 2) return; setRot(); g.clearRect(0, 0, W, H);
    grid(); land();
    g.strokeStyle = 'rgba(244,236,220,.36)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
    routes(); pins();
  }
  function grid() { var k, q, on, la, lo; g.strokeStyle = 'rgba(244,236,220,.075)'; g.lineWidth = .75; g.beginPath();
    for (la = -60; la <= 60; la += 30) { on = false; for (k = 0; k <= 90; k++) { q = view(vec(la, -180 + k * 4)); if (q.z < 0) { on = false; continue; } if (on) g.lineTo(q.x, q.y); else { g.moveTo(q.x, q.y); on = true; } } }
    for (lo = -180; lo < 180; lo += 45) { on = false; for (k = 0; k <= 42; k++) { q = view(vec(-84 + k * 4, lo)); if (q.z < 0) { on = false; continue; } if (on) g.lineTo(q.x, q.y); else { g.moveTo(q.x, q.y); on = true; } } }
    g.stroke(); }
  function land() { // fine dots on the 2 degree grid, a touch brighter where the globe faces us; one path per brightness band
    var n = SZ.length, r = Math.max(.6, R * .0058), i, k, z, X, Y, Z, x, z0;
    for (i = 0; i < n; i++) { X = LV[i * 3]; Y = LV[i * 3 + 1]; Z = LV[i * 3 + 2]; x = X * cl - Z * sl; z0 = Z * cl + X * sl;
      SZ[i] = sp * Y + cp * z0; SX[i] = cx + x * R; SY[i] = cy - (cp * Y - sp * z0) * R; }
    for (k = 0; k < 4; k++) { g.beginPath();
      for (i = 0; i < n; i++) { z = SZ[i]; if (z <= k * .25 || z > k * .25 + .25) continue; g.moveTo(SX[i] + r, SY[i]); g.arc(SX[i], SY[i], r, 0, TAU); }
      g.fillStyle = 'rgba(244,236,220,' + [.07, .11, .15, .2][k] + ')'; g.fill(); } }
  function line(pts, upto) { var n = Math.round((pts.length - 1) * upto), on = false, q = null;
    for (var i = 0; i <= n; i++) { q = view(pts[i]); if (q.z < 0 && !q.out) { on = false; continue; } if (on) g.lineTo(q.x, q.y); else { g.moveTo(q.x, q.y); on = true; } }
    return q; }
  function routes() { g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = .75;
    P.forEach(function (p) { if (p.id === sel) return; var m = st.marks[p.id], nx = st.next === p.id;
      g.strokeStyle = nx ? 'rgba(184,149,106,.6)' : m === 'been' ? 'rgba(244,236,220,.26)' : m === 'planned' ? 'rgba(184,149,106,.36)' : 'rgba(184,149,106,.16)';
      g.setLineDash(nx ? [2, 4] : []); g.beginPath(); line(GEO[p.id].arc, 1); g.stroke(); });
    g.setLineDash([]);
    if (!sel) return; // the chosen route draws itself out from home: one thin gold line, a small point at its head
    var e = 1 - Math.pow(1 - arcP, 3), head;
    g.strokeStyle = GOLD; g.lineWidth = 1.25; g.beginPath(); head = line(GEO[sel].arc, e); g.stroke();
    if (arcP < 1 && head && (head.z > 0 || head.out)) { g.fillStyle = IVORY; g.beginPath(); g.arc(head.x, head.y, 1.6, 0, TAU); g.fill(); } }
  function box(x, y, r) { return { x: x - r, y: y - r, w: r * 2, h: r * 2 }; }
  // Canvas letterSpacing is not on every phone, so Latin capitals are tracked by hand. Thai is never split or spaced.
  function textW(t, ls) { if (!ls) return g.measureText(t).width; for (var i = 0, w = 0; i < t.length; i++) w += g.measureText(t.charAt(i)).width; return w + ls * (t.length - 1); }
  function text(t, x, y, ls, stroke) { if (!ls) { if (stroke) g.strokeText(t, x, y); else g.fillText(t, x, y); return; }
    for (var i = 0, ch; i < t.length; i++) { ch = t.charAt(i); if (stroke) g.strokeText(ch, x, y); else g.fillText(ch, x, y); x += g.measureText(ch).width + ls; } }
  // Pins: ivory points, gold when chosen, planned or next; a hairline ring marks the chosen place, the next trip and places been.
  function pins() {
    var pr = clamp(R * .018, 2, 3), hq = view(HOME), items = [], boxes = [], th = lang() !== 'en';
    if (hq.z > .02) { g.globalAlpha = fade(hq.z); g.strokeStyle = 'rgba(244,236,220,.55)'; g.lineWidth = .75; g.beginPath(); g.arc(hq.x, hq.y, 4.5, 0, TAU); g.stroke();
      g.fillStyle = IVORY; g.beginPath(); g.arc(hq.x, hq.y, 1.4, 0, TAU); g.fill(); boxes.push(box(hq.x, hq.y, 7)); }
    P.slice().sort(function (a, b) { return (a.id === sel) - (b.id === sel); }).forEach(function (p) {
      var q = view(GEO[p.id].v); if (q.z <= .02) return;
      var on = p.id === sel, m = st.marks[p.id], nx = st.next === p.id, r = on ? pr + .6 : pr, ring = on ? r + 5.5 : nx || m === 'been' ? r + 3.5 : r;
      g.globalAlpha = fade(q.z);
      g.fillStyle = on || nx || m === 'planned' ? GOLD : IVORY; g.beginPath(); g.arc(q.x, q.y, r, 0, TAU); g.fill();
      if (ring > r) { g.strokeStyle = on ? 'rgba(244,236,220,.8)' : nx ? GOLD : 'rgba(244,236,220,.45)'; g.lineWidth = .75; g.beginPath(); g.arc(q.x, q.y, ring, 0, TAU); g.stroke(); }
      boxes.push(box(q.x, q.y, ring + 1)); items.push({ p: p, q: q, on: on, nx: nx, ext: ring });
    });
    // Labels: the chosen place first, then home, the next trip, then whatever faces us most. A label that would collide is skipped.
    items.sort(function (a, b) { return (b.on - a.on) || (b.nx - a.nx) || (b.q.z - a.q.z); });
    if (hq.z > .02) items.splice(items.length && items[0].on ? 1 : 0, 0, { home: true, q: hq, ext: 6 });
    g.textBaseline = 'middle'; g.lineJoin = 'round';
    items.forEach(function (it) {
      var t = it.home ? tx('home') : th ? it.p.sTh : it.p.s, fs = th ? (it.on ? 13 : 12) : (it.on ? 10.5 : 9.5), ls = th ? 0 : fs * .18,
        h = fs + 8, gp = it.ext + 6, x = it.q.x, y = it.q.y, at = null, w, c, i, bx;
      if (!th) t = t.toUpperCase();
      g.font = (it.on ? '400 ' : '300 ') + fs + 'px ' + (th ? '"IBM Plex Sans Thai",Inter' : 'Inter,"IBM Plex Sans Thai"') + ',system-ui,sans-serif';
      w = textW(t, ls); c = [[x + gp, y - h / 2], [x - gp - w, y - h / 2], [x - w / 2, y - gp - h], [x - w / 2, y + gp]];
      for (i = 0; i < c.length && !at; i++) { bx = { x: c[i][0], y: c[i][1], w: w, h: h };
        if (bx.x < 4 || bx.y < 2 || bx.x + w > W - 4 || bx.y + h > H - 2) continue;
        if (boxes.some(function (o) { return bx.x < o.x + o.w && bx.x + bx.w > o.x && bx.y < o.y + o.h && bx.y + bx.h > o.y; })) continue;
        at = bx; }
      if (!at) { if (!it.on) return; at = { x: clamp(c[0][0], 4, W - w - 4), y: clamp(c[0][1], 2, H - h - 2), w: w, h: h }; }
      boxes.push({ x: at.x - 3, y: at.y, w: w + 6, h: h });
      g.globalAlpha = fade(it.q.z) * (it.on ? 1 : it.home ? .85 : .7);
      g.lineWidth = 3; g.strokeStyle = 'rgba(11,19,36,.9)'; text(t, at.x, at.y + h / 2, ls, true);
      g.fillStyle = it.home ? GOLD : IVORY; text(t, at.x, at.y + h / 2, ls, false);
    });
    g.globalAlpha = 1;
  }
  // Chip status is one quiet word (next trip first); a second state is still read out to screen readers.
  function tags(p) { var m = st.marks[p.id], nx = st.next === p.id, k = nx ? 'nextBtn' : m === 'planned' || m === 'been' ? m : '', h = '';
    if (k) h = '<i class="mk">' + L(TX[k][0], TX[k][1]) + '</i>';
    if (nx && (m === 'planned' || m === 'been')) h += '<span class="vh">' + L(', ' + TX[m][0].toLowerCase(), ', ' + TX[m][1]) + '</span>';
    return h; }
  // Reflect state in place, so a focused chip or button keeps focus.
  function sync() {
    if (!built) return; var m = st.marks[sel], nb = $('placesNext'), nx = byId(st.next);
    [].forEach.call($('plList').children, function (b) { var id = b.getAttribute('data-id'), on = id === sel;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.querySelector('.tg').innerHTML = tags(byId(id)); });
    [].forEach.call($('plCard').querySelectorAll('[data-a]'), function (b) { var a = b.getAttribute('data-a');
      b.setAttribute('aria-pressed', (a === 'next' ? st.next === sel : m === a) ? 'true' : 'false'); });
    if (nb) nb.innerHTML = nx ? L(TX.next[0] + nx.s, TX.next[1] + nx.sTh) : '';
    labels(); kick(); }
  function labels() { if (!built) return; var p = byId(sel), a = $('plCard').querySelector('.acts'), im = $('plCard').querySelector('.art img');
    $('plList').setAttribute('aria-label', tx('places'));
    cv.setAttribute('aria-label', tx('globe') + (p ? tx('showing') + (lang() === 'en' ? p.en : p.th) : ''));
    if (a) a.setAttribute('aria-label', tx('mark'));
    if (im && p) im.alt = alt(p); }
  function fact(k, v, vTh, n, nTh) { return '<div><dt class="lbl">' + L(TX[k][0], TX[k][1]) + '</dt><dd>' + T(v, vTh) + (n ? '<small>' + T(n, nTh) + '</small>' : '') + '</dd></div>'; }
  function actBtn(a, k) { return '<button type="button" data-a="' + a + '" aria-pressed="false"><span class="tx">' + L(TX[k][0], TX[k][1]) + '</span></button>'; }
  function alt(p) { return (lang() === 'en' ? p.alt : p.altTh) || ''; }
  // Card art: the photograph when the place has img, lazy and faded in; otherwise (or if the file is missing) the name in a 1px frame.
  function plate(p) { var c = p.en.split(', '); return '<div class="art type" aria-hidden="true"><div class="plate"><b>' + c[0] + '</b><small>' + c[1] + '</small></div></div>'; }
  function art(p) { return p.img ? '<figure class="art"><img src="' + p.img + '" alt="' + alt(p).replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" style="object-position:' + (p.pos || '50% 60%') + '"></figure>' : plate(p); }
  // Rebuilt only when the place changes; marking a place goes through sync().
  function render() {
    var el = $('plCard'), p = byId(sel), nx = byId(st.next), c, i, h, im;
    if (!p) h = '<div class="plMain"><div class="plBody intro"><p class="lead">' + T(TX.intro[0], TX.intro[1]) + '</p>' +
      (nx ? '<p class="nx"><span class="lbl">' + L(TX.nextBtn[0], TX.nextBtn[1]) + '</span><span>' + L(nx.en, nx.th) + '</span></p>' : '') +
      '<p class="pick">' + T(TX.pick[0], TX.pick[1]) + '</p><button type="button" id="plSpin" class="btn">' + L(TX.spin[0], TX.spin[1]) + '</button>' +
      '<p class="note">' + L(TX.local[0], TX.local[1]) + '</p></div></div>';
    else { c = p.en.split(', '); i = p.th.lastIndexOf(' ');
      h = '<div class="plMain">' + art(p) + '<div class="plBody"><h3 id="plName"><span class="nm">' + T(c[0], p.th.slice(0, i)) + '</span>' +
        '<span class="ctry">' + L(c[1], p.th.slice(i + 1)) + '</span></h3>' +
        '<p class="why">' + T(p.whyEn, p.whyTh) + '</p>' +
        '<dl class="facts">' + fact('best', p.monEn, p.monTh, p.monNote, p.monNoteTh) + fact('from', p.fly, p.flyTh, p.flyNote, p.flyNoteTh) + '</dl>' +
        (p.nyeEn ? '<div class="nye"><span class="ntag">' + L(TX.nye[0], TX.nye[1]) + '</span><p>' + T(p.nyeEn, p.nyeTh) + '</p></div>' : '') +
        '<p class="do"><span class="lbl">' + L(TX.tog[0], TX.tog[1]) + '</span>' + T(p.doEn, p.doTh) + '</p></div></div>' +
        '<div class="acts" role="group">' + actBtn('planned', 'planned') + actBtn('been', 'been') + actBtn('next', 'nextBtn') + '</div>'; }
    el.innerHTML = h;
    el.querySelector('.plBody').addEventListener('scroll', fit, { passive: true });
    im = el.querySelector('.art img');
    if (im) { var shown = function () { im.classList.add('in'); }, missing = function () { var f = im.parentNode; if (f && f.parentNode) f.outerHTML = plate(p); };
      if (im.complete) { if (im.naturalWidth) shown(); else missing(); } else { im.addEventListener('load', shown); im.addEventListener('error', missing); } }
    fit(); }
  // When the card text overflows: make it keyboard-scrollable and fade the bottom edge until the end is reached.
  function fit() { var b = built && $('plCard').querySelector('.plBody'); if (!b) return; var over = b.scrollHeight > b.clientHeight + 2;
    if (over) { b.setAttribute('tabindex', '0'); b.setAttribute('role', 'region'); b.setAttribute('aria-labelledby', $('plName') ? 'plName' : 'plTitle'); }
    else { b.removeAttribute('tabindex'); b.removeAttribute('role'); b.removeAttribute('aria-labelledby'); }
    b.classList.toggle('more', over && b.scrollTop + b.clientHeight < b.scrollHeight - 4); }
  function act(a) { var p = byId(sel); if (!p) return;
    if (a === 'next') st.next = st.next === p.id ? null : p.id; else st.marks[p.id] = st.marks[p.id] === a ? null : a;
    save(); sync(); }
  function center(b) { var l = $('plList'); if (!b || !l) return; var x = b.offsetLeft - (l.clientWidth - b.offsetWidth) / 2;
    if (l.scrollTo) l.scrollTo({ left: x, behavior: still() ? 'auto' : 'smooth' }); else l.scrollLeft = x; }
  function say(p) { var el = $('plLive'), en = lang() === 'en'; if (el) el.textContent = (en ? p.en + '. ' + p.whyEn : p.th + ' ' + p.whyTh); }
  function pick(id, turn, extra) {
    var p = byId(id); if (!p || !ensure()) return; drift = false;
    if (sel !== id) { sel = id; arcP = still() ? 1 : 0; arcT0 = performance.now(); render(); say(p); }
    sync(); if (turn) turnTo(p, extra);
    center($('plList').querySelector('[data-id="' + id + '"]')); }
  function turnTo(p, extra) { var c = GEO[p.id], dl = ((c.lon - rotLon) % 360 + 540) % 360 - 180 + (extra || 0), ta = clamp(c.lat, -50, 50); fling = null;
    if (still() || !isOpen()) { spin = null; rotLon += dl; rotLat = ta; kick(); return; }
    spin = { t0: performance.now(), d: extra ? 1500 : 900, l0: rotLon, dl: dl, a0: rotLat, da: ta - rotLat }; kick(); }
  function surprise() { // "Spin for it": one extra lap, then a place that is not the current one
    var pool = P.filter(function (p) { return p.id !== sel; }), p = pool[Math.floor(Math.random() * pool.length)];
    pick(p.id, true, 360); var b = $('plList').querySelector('[data-id="' + p.id + '"]'); if (b) b.focus({ preventScroll: true }); }
  // One animation loop for turning, coasting, idle drift and the route drawing in; it sleeps when nothing moves.
  function kick() { if (!raf && isOpen()) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0; var more = false, dt = lastT ? Math.min(50, now - lastT) : 16, k, f; lastT = now;
    if (spin) { k = clamp((now - spin.t0) / spin.d, 0, 1); f = 1 - Math.pow(1 - k, 3); rotLon = spin.l0 + spin.dl * f; rotLat = spin.a0 + spin.da * f; if (k < 1) more = true; else spin = null; }
    else if (fling) { rotLon -= fling.vx * dt; rotLat = clamp(rotLat + fling.vy * dt, -60, 60); f = Math.pow(.93, dt / 16); fling.vx *= f; fling.vy *= f;
      if (Math.abs(fling.vx) + Math.abs(fling.vy) < .004) fling = null; else more = true; }
    else if (drift && !drag && !still()) { rotLon -= dt * .003; more = true; }
    if (arcP < 1) { arcP = still() ? 1 : clamp((now - arcT0) / 900, 0, 1); if (arcP < 1) more = true; }
    draw();
    if (more) kick(); else lastT = 0; }
  function push() { try { history.pushState({ kkPlaces: 1 }, ''); pushed = true; } catch (e) { pushed = false; } }
  function setInert(on) { // the page behind goes quiet for screen readers and Tab while the overlay is up
    if (on) { inerted = [].filter.call(document.body.children, function (el) { return el.id !== 'places' && el.tagName !== 'SCRIPT' && !el.hasAttribute('inert'); });
      inerted.forEach(function (el) { el.setAttribute('inert', ''); }); }
    else { inerted.forEach(function (el) { el.removeAttribute('inert'); }); inerted = []; } }
  function trap(e) { var f = [].filter.call($('places').querySelectorAll('button,[tabindex="0"]'), function (x) { return !x.disabled && x.getClientRects().length; }), i;
    if (!f.length) return; i = f.indexOf(document.activeElement);
    if (e.shiftKey ? i <= 0 : (i < 0 || i === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); } }
  function open() {
    if (!ensure() || isOpen()) return;
    opener = document.activeElement; $('places').classList.add('open'); setInert(true);
    if (!backing) push(); // if a back() from the last close is still landing, popstate pushes once it does
    drift = !sel; lastT = 0; size(); render(); sync(); draw();
    setTimeout(function () { var c = $('plClose'); if (c && isOpen()) c.focus(); }, 30); }
  function close(fromHistory) {
    if (!isOpen()) return;
    $('places').classList.remove('open'); setInert(false); cancelAnimationFrame(raf); raf = 0; spin = fling = drag = null; lastT = 0;
    if (pushed) { pushed = false; if (fromHistory !== true) { backing = true; try { history.back(); } catch (e) { backing = false; } } }
    var b = opener && opener !== document.body && document.contains(opener) ? opener : $('placesBtn'); opener = null;
    if (b && b.focus) b.focus({ preventScroll: true }); }
  function ensure() { if (built) return true; try { css(); build(); built = true; render(); sync(); } catch (e) { return false; } return true; }
  function init() { if (!ensure()) return; var b = $('placesBtn'); if (b) b.addEventListener('click', function () { open(); }); }
  window.__places = { open: open, close: function () { close(); }, pick: function (id) { pick(id, true); }, data: P };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
