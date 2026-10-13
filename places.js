/* places.js: "Places we go together". Canvas globe with links from Bangkok, one card per place, want to go/been/next trip in localStorage. Classic script; never throws. */
(function () {
  'use strict';
  // Months, journey times and stops were checked on 13 Oct 2026 against the sources in src; monNote/flyNote hold the detail.
  // Fit lines use known facts only: shopping, modern cities, tech, Interstellar, her spin class, Lululemon, coffee milk, weeknight series, the river view at home.
  // nyeEn/nyeTh: the New Year's Eve line, only from that file's confirmed NYE table (Reykjavik and Tokyo, no more).
  // img: card art, 800x1000. A place without img gets its name set in a 1px frame; adding img: 'img/sel.webp' later is all it takes.
  // pos: focal point for the crop (x for the tall phone crop, y for the wide one); alt/altTh describe the photograph.
  var P = [
    { id: 'tyo', lat: 35.68, lon: 139.69, en: 'Tokyo', th: 'โตเกียว', s: 'Tokyo', sTh: 'โตเกียว',
      img: 'img/tyo.webp', pos: '50% 50%', alt: 'Shibuya Crossing from high above at night, neon screens and lit streets',
      altTh: 'สี่แยกชิบุยะมุมสูงยามค่ำคืน จอนีออนและถนนที่สว่างไสว', credit: ['Sarmat Batagov', 'https://unsplash.com/photos/busy-shibuya-crossing-at-night-with-neon-lights-keRAW9X0OlM'],
      nyeEn: '~6h direct. Around midnight, temple bells are rung 108 times: joya no kane.',
      nyeTh: '~6 ชม. บินตรง ราวเที่ยงคืนวัดตีระฆัง 108 ครั้ง เรียกว่า โจยะ โนะ คาเนะ',
      whyEn: 'Ginza, Shibuya and teamLab: shopping, design and digital art in one city.',
      whyTh: 'กินซ่า ชิบุยะ และ teamLab ช้อปปิ้ง ดีไซน์ และศิลปะดิจิทัลในเมืองเดียว',
      monEn: 'Mid Nov to early Dec', monTh: 'กลาง พ.ย. ถึงต้น ธ.ค.', monNote: 'for autumn colour; peak varies', monNoteTh: 'สำหรับใบไม้เปลี่ยนสี ช่วงพีคแต่ละปีไม่เท่ากัน',
      fly: 'About 6h · nonstop · HND or NRT', flyTh: 'ราว 6 ชม. · บินตรง · HND หรือ NRT',
      src: ['flightroutes.com', 'flightsfrom.com', 'flightmapper.net'],
      doEn: 'Ginza flagships by day, the Shibuya crossing at night, teamLab the next morning.',
      doTh: 'กลางวันเดินร้านแฟล็กชิปย่านกินซ่า กลางคืนข้ามแยกชิบุยะ เช้าวันต่อมาไป teamLab' },
    { id: 'sel', lat: 37.57, lon: 126.98, en: 'Seoul', th: 'โซล', s: 'Seoul', sTh: 'โซล',
      img: 'img/sel.webp', pos: '50% 50%', alt: 'N Seoul Tower lit blue against the night sky', altTh: 'หอคอยเอ็นโซลเปิดไฟสีน้ำเงินตัดกับฟ้ายามค่ำ', credit: ['Fili Santillán', 'https://unsplash.com/photos/a-tall-tower-with-a-blue-light-on-top-of-it-z_-dKly3dic'],
      whyEn: 'Gangnam and Seongsu, for beauty and tech.',
      whyTh: 'กังนัมกับซองซู เมืองของบิวตี้และเทคโนโลยี',
      monEn: 'Late Mar to Apr, or Oct to Nov', monTh: 'ปลาย มี.ค. ถึง เม.ย. หรือ ต.ค. ถึง พ.ย.', monNote: 'cherry blossom or autumn leaves', monNoteTh: 'ช่วงซากุระบาน หรือช่วงใบไม้เปลี่ยนสี',
      fly: 'About 5 to 5.5h · nonstop · ICN', flyTh: 'ราว 5 ถึง 5.5 ชม. · บินตรง · ICN',
      src: ['flightq.app', 'kayak', 'getyourguide.com'],
      doEn: 'Gangnam in the afternoon, Seongsu cafés and pop-up stores the next day.',
      doTh: 'บ่ายเดินกังนัม วันต่อมาไปคาเฟ่และป๊อปอัปสโตร์ที่ซองซู' },
    { id: 'sin', lat: 1.29, lon: 103.85, en: 'Singapore', th: 'สิงคโปร์', s: 'Singapore', sTh: 'สิงคโปร์',
      img: 'img/sin.webp', pos: '50% 50%', alt: 'Marina Bay at sunset from above, the city lights coming on across the water', altTh: 'มารีนาเบย์มุมสูงยามพระอาทิตย์ตก ไฟเมืองเริ่มสว่างริมน้ำ', credit: ['Dennis Schmidt', 'https://unsplash.com/photos/an-aerial-view-of-a-city-at-night-1It2Nt6dRpk'],
      whyEn: 'The closest city on the list, about two and a half hours away.',
      whyTh: 'ใกล้ที่สุดในลิสต์ บินราวสองชั่วโมงครึ่ง',
      monEn: 'Feb to Apr', monTh: 'ก.พ. ถึง เม.ย.', monNote: 'driest months', monNoteTh: 'ช่วงที่ฝนน้อยที่สุด',
      fly: 'About 2.5h · nonstop · SIN', flyTh: 'ราว 2.5 ชม. · บินตรง · SIN',
      src: ['eoob.sg', 'kayak.sg', 'bangkokknowledge.com'],
      doEn: 'Orchard Road by day, Gardens by the Bay in the evening, Marina Bay to finish.',
      doTh: 'กลางวันเดินถนนออร์ชาร์ด เย็นไป Gardens by the Bay ปิดท้ายที่มารีน่าเบย์' },
    { id: 'sha', lat: 31.24, lon: 121.50, en: 'Shanghai', th: 'เซี่ยงไฮ้', s: 'Shanghai', sTh: 'เซี่ยงไฮ้',
      img: 'img/sha.webp', pos: '50% 50%', alt: 'The Lujiazui skyline from the Bund at dawn, mirrored in the Huangpu River', altTh: 'เส้นขอบฟ้าลู่เจียจุ่ยมองจากเดอะบันด์ยามรุ่งสาง สะท้อนบนแม่น้ำหวงผู่', credit: ['Freeman Zhou', 'https://unsplash.com/photos/lujiazui-skyline-at-the-bund-shanghai-oV9hp8wXkPE'],
      whyEn: 'Another river city: the Bund on one bank, Lujiazui on the other.',
      whyTh: 'อีกเมืองริมแม่น้ำ เดอะบันด์อยู่ฝั่งหนึ่ง ลู่เจียจุ่ยอยู่อีกฝั่ง',
      monEn: 'Oct to Nov', monTh: 'ต.ค. ถึง พ.ย.', monNote: 'mild and settled; spring also mild but rainier', monNoteTh: 'อากาศกำลังสบาย ไม่ค่อยแปรปรวน หน้าใบไม้ผลิก็สบายเหมือนกันแต่ฝนเยอะกว่า',
      fly: 'About 4.5h · nonstop · PVG', flyTh: 'ราว 4.5 ชม. · บินตรง · PVG',
      src: ['airportoverview.com', '2lnr.com', 'Google Flights'],
      doEn: 'A walk along the Bund after dark, Lujiazui lit across the river.',
      doTh: 'เดินริมเดอะบันด์ตอนค่ำ มองลู่เจียจุ่ยเปิดไฟอยู่อีกฝั่ง' },
    { id: 'dxb', lat: 25.20, lon: 55.27, en: 'Dubai, UAE', th: 'ดูไบ ยูเออี', s: 'Dubai', sTh: 'ดูไบ',
      img: 'img/dxb.webp', pos: '50% 50%', alt: 'The Museum of the Future at dusk, its steel ring cut with Arabic calligraphy', altTh: 'พิพิธภัณฑ์แห่งอนาคตยามพลบค่ำ วงแหวนโลหะฉลุอักษรอาหรับ', credit: ['Malik Shibly', 'https://unsplash.com/photos/a-large-metal-sculpture-in-front-of-a-tall-building-f_S_d_piyfM'],
      whyEn: 'Dubai Mall and the Museum of the Future, six hours from home.',
      whyTh: 'ดูไบมอลล์กับพิพิธภัณฑ์แห่งอนาคต บินจากบ้านราวหกชั่วโมง',
      monEn: 'Nov to Mar', monTh: 'พ.ย. ถึง มี.ค.', monNote: 'cooler months', monNoteTh: 'ช่วงที่อากาศเย็นกว่า',
      fly: 'About 6h · nonstop · DXB', flyTh: 'ราว 6 ชม. · บินตรง · DXB',
      src: ['emirates.com', '2lnr.com', 'agoda'],
      doEn: 'The Museum of the Future in the morning, Dubai Mall in the afternoon.',
      doTh: 'เช้าไปพิพิธภัณฑ์แห่งอนาคต บ่ายเดินดูไบมอลล์' },
    { id: 'nyc', lat: 40.71, lon: -74.01, en: 'New York', th: 'นิวยอร์ก', s: 'New York', sTh: 'นิวยอร์ก',
      img: 'img/nyc.webp', pos: '50% 50%', alt: 'A SoHo cast-iron facade seen from below against a pale sky', altTh: 'ด้านหน้าตึกเหล็กหล่อย่านโซโหมองจากด้านล่างตัดกับฟ้าสีอ่อน', credit: ['Ilse', 'https://unsplash.com/photos/low-angle-photo-of-high-rise-building-1IqnWACggZs'],
      whyEn: 'An autumn walk through SoHo, with time to stop for coffee.',
      whyTh: 'เดินเล่นโซโหในฤดูใบไม้ร่วง แวะพักกินกาแฟกันระหว่างทาง',
      monEn: 'Sep to Nov', monTh: 'ก.ย. ถึง พ.ย.', monNote: 'autumn; October mildest', monNoteTh: 'ฤดูใบไม้ร่วง ตุลาคมอากาศสบายที่สุด',
      fly: 'About 20 to 21h · 1 stop · JFK', flyTh: 'ราว 20 ถึง 21 ชม. · ต่อเครื่อง 1 ครั้ง · JFK',
      src: ['flightroutes.com', 'momondo.com', 'weather.gov normals'],
      doEn: 'Window shopping along Fifth Avenue.',
      doTh: 'เดินดูร้านไปตามฟิฟท์อเวนิว' },
    { id: 'kef', lat: 64.15, lon: -21.94, en: 'Reykjavik, Iceland', th: 'เรคยาวิก ไอซ์แลนด์', s: 'Reykjavik', sTh: 'เรคยาวิก',
      img: 'img/kef.webp', pos: '50% 50%', alt: 'Hallgrímskirkja at the top of a Reykjavik street under a soft sky',
      altTh: 'โบสถ์ฮัลล์กรีมสเคิร์กจาที่ปลายถนนในเรคยาวิก ใต้ฟ้านุ่มนวล', credit: ['Stan Jacobs', 'https://unsplash.com/photos/hallgrimskirkja-church-towers-over-reykjavik-iceland-HPfgggvCj2c'],
      nyeEn: 'Inside aurora season. At midnight, residents set off fireworks across the whole city.',
      nyeTh: 'อยู่ในฤดูแสงเหนือ เที่ยงคืนชาวเมืองจุดพลุกันทั่วทั้งเมือง',
      whyEn: 'We both love Interstellar. One evening, just looking up.',
      whyTh: 'ชอบ Interstellar เหมือนกัน ลองไปดูท้องฟ้าจริงกันสักคืน',
      monEn: 'For northern lights: Sep to Mar', monTh: 'ช่วงดูแสงเหนือ: ก.ย. ถึง มี.ค.', monNote: 'season runs into April; weather dependent', monNoteTh: 'ฤดูยาวไปถึงเมษายน ขึ้นกับสภาพอากาศ',
      fly: 'About 18 to 21h · 1 stop · KEF', flyTh: 'ราว 18 ถึง 21 ชม. · ต่อเครื่อง 1 ครั้ง · KEF', flyNote: 'longer connections possible', flyNoteTh: 'บางเส้นทางต่อเครื่องนานกว่านี้',
      src: ['visiticeland.com', 'flightroutes.com', 'flightsfrom.com', 'flightmapper.net'],
      doEn: 'Drive past the city lights on a clear night with a thermos of coffee milk, and wait for the sky to move.',
      doTh: 'ขับรถออกนอกเมืองคืนฟ้าใส พกกระติกกาแฟนมไปด้วย แล้วนั่งรอให้ฟ้าเริ่มขยับ' },
    { id: 'tek', lat: -44.0, lon: 170.48, en: 'Lake Tekapo, New Zealand', th: 'ทะเลสาบเทคาโป นิวซีแลนด์', s: 'Lake Tekapo', sTh: 'ทะเลสาบเทคาโป',
      img: 'img/tek.webp', pos: '50% 50%', alt: 'The Church of the Good Shepherd under a starry sky with the southern lights glowing pink and green',
      altTh: 'โบสถ์ Church of the Good Shepherd ใต้ฟ้าเต็มดาว มีแสงออโรราสีชมพูและเขียว', credit: ['Sebastian Knoll', 'https://unsplash.com/photos/a-house-with-a-pink-and-green-aurora-light-in-the-background-zVzu0F9z44I'],
      whyEn: 'For our Interstellar habit, with hot pools afterwards.',
      whyTh: 'ดูดาวให้เต็มตา แล้วไปแช่น้ำอุ่นกัน',
      monEn: 'Jun to Aug', monTh: 'มิ.ย. ถึง ส.ค.', monNote: 'for winter stargazing', monNoteTh: 'สำหรับดูดาวหน้าหนาว',
      fly: 'About 14 to 16h · 1 stop · CHC', flyTh: 'ราว 14 ถึง 16 ชม. · ต่อเครื่อง 1 ครั้ง · CHC', flyNote: 'then about 3 to 4h by road', flyNoteTh: 'แล้วขับรถอีกราว 3 ถึง 4 ชม.',
      src: ['newzealand.com', 'flightroutes.com', 'flightsfrom.com', 'flightmapper.net'],
      doEn: 'A stargazing tour, then hot pools under the same sky.',
      doTh: 'ทัวร์ดูดาว แล้วแช่บ่อน้ำอุ่นใต้ฟ้าเดียวกัน' }
  ];
  // UI copy as [en, th].
  var TX = {
    title: ['Places we go together', 'ที่ที่อยากไปด้วยกัน'],
    hint: ['Drag to spin. No spin class required.', 'ลากเพื่อหมุน ไม่ต้องเข้าคลาสสปิน'],
    close: ['Close', 'ปิด'],
    intro: ['Eight ideas for a trip together.', 'แปดไอเดียสำหรับทริปด้วยกัน'],
    pick: ['Choose a city to begin.', 'เลือกเมืองเพื่อเริ่มดู'],
    spin: ['Surprise me', 'สุ่มให้หน่อย'],
    next: ['Next trip: ', 'ทริปต่อไป: '],
    saved: ['Saved on this device', 'บันทึกไว้ในเครื่องนี้'],
    best: ['When', 'ช่วงเวลา'],
    from: ['From Bangkok', 'จากกรุงเทพฯ'],
    tog: ['Together', 'ทำด้วยกัน'],
    places: ['Places', 'สถานที่'],
    mark: ['Mark this place', 'ทำเครื่องหมายที่นี่'],
    globe: ['Globe with links from Bangkok to eight places', 'ลูกโลกพร้อมเส้นเชื่อมจากกรุงเทพฯ ไปแปดที่'],
    showing: ['. Showing ', ' กำลังดู '],
    home: ['Bangkok', 'กรุงเทพฯ'],
    planned: ['Want to go', 'อยากไป'],
    been: ['Been there', 'ไปมาแล้ว'],
    nextBtn: ['Pick for next trip', 'เลือกเป็นทริปถัดไป'], nextOn: ['Our next trip', 'ทริปถัดไปของเรา'], city: ['City', 'เมือง'], map: ['View map', 'ดูแผนที่'], mapClose: ['Close map', 'ปิดแผนที่'], explore: ['Drag to explore', 'ลากเพื่อหมุนดู'], details: ['Details', 'รายละเอียด'],
    nye: ['New Year’s Eve', 'ส่งท้ายปี'],
    links: ['Destination links, not flight routes', 'เส้นเชื่อมจุดหมาย ไม่ใช่เส้นทางบิน'],
    key: ['Key', 'สัญลักษณ์'],
    selected: ['Selected', 'ที่เลือก'],
    src: ['Sources, checked 13 Oct 2026', 'แหล่งข้อมูล ตรวจเมื่อ 13 ต.ค. 2026'],
    month: ['Month', 'เดือน'],
    anyMonth: ['Any', 'ไม่ระบุ'],
    days: ['Days', 'จำนวนวัน'],
    clear: ['Clear', 'ล้าง'],
    undo: ['Undo', 'เลิกทำ'],
    was: ['Was ', 'เดิมคือ '],
    cleared: ['Next trip cleared.', 'ล้างทริปต่อไปแล้ว'],
    restored: ['Restored.', 'กลับเป็นเหมือนเดิมแล้ว'],
    on: ['on', 'เลือกแล้ว'],
    off: ['off', 'เอาออกแล้ว'],
    mute: ['Mute', 'ปิดเสียง'],
    unmute: ['Unmute', 'เปิดเสียง'],
    lang: ['Language', 'ภาษา']
  };
  var MON = [['Jan', 'ม.ค.'], ['Feb', 'ก.พ.'], ['Mar', 'มี.ค.'], ['Apr', 'เม.ย.'], ['May', 'พ.ค.'], ['Jun', 'มิ.ย.'],
    ['Jul', 'ก.ค.'], ['Aug', 'ส.ค.'], ['Sep', 'ก.ย.'], ['Oct', 'ต.ค.'], ['Nov', 'พ.ย.'], ['Dec', 'ธ.ค.']];
  // Flight-time sources differ by city now, so each place lists all of its own in src; kept empty so render() is unchanged.
  var SRC_FLY = [];
  var BKK = { lat: 13.75, lon: 100.5 };
  // Land mask: 2 degree grid from Natural Earth 110m land (public domain), 90 rows x 180 cols, 45 hex chars per row.
  var LAND_HEX = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f800ffc0000000000000000000000000000000000017ff3fffffe00000000000004000000000000000000061df0ffffff0000f8000000003c000000000000000030027c3ffffff80002000000000060000000000000000038afc007ffff00000000030007ffc001d80000000000e88b7b003fffe000000000c003ffffec00000080180009fc33fc00fffa00000300041dffffffeffc80100fffbfe725d8f00fff800001ff000edfffffffffffdfe0ffffffffff87c1ff8000007ffebffdfffffffffffff31fffffffffd1f80fc01e000f9ebfffffffffffffffff00fffffffff8034078000003e7fffffffffffffffffff01fdffffffe01e0038000007e7ffffffffffffffff2f0007807ffffe01e4000000007e3ffffffffffffff82200001001fffff80fe000000182c7fffffffffffffe00f000080007fffff9ff8000003820ffffffffffffffc00e000000007fffff9ffc000006cfffffffffffffffffc08000000003ffffffffc000000dfffffffffffffffff4000000000017ffffff460000007fffffffffffffffff400000000000fffffffc10000007ffffffffffffffffe400000000000fffffff600000007f7f97fffffffffffc000000000000ffffffe00000007f19f03fffffffffff8c00000000000ffffffc00000003c26f7fffffffffffe0800000000000ffffff000000007c02dfffffffffff8408000000000007fffff0000000018740fffffffffffe630000000000003fffff000000001fe022ffffffffffc4f0000000000001ffffc000000003ff000ffffffffffc180000000000000ffff8000000007ffef7ffffffffffe0000000000000003fc04000000007ffffffdffffffffe0000000000000005f80400000001fffffefe7fffffffc0000000000000002f80000000001fffffe7f41ffffffc0000000000000000780c00000003ffffff7ff07fffff20000000000000000786100000007ffffffbfe07fcff0000000000000000003cc020000003ffffff9fe03f07e8000000000000000000fc000000003ffffff9f801e07f02000000000000000000f000000007ffffffde001c01f020000000000000000003000000003ffffffe8001c01f8200000000000000000010f0000003fffffff3000c013008000000000000000000aff000001fffffffe000a0120000000000000000000001ff800000fffffffe00020000080000000000000000001fff00000687ffffc000002c1800000000000000000001fff80000001ffff800000143800000000000000000003fff80000001ffff000000187a00000000000000000003fffe0000003fffe0000000c7818000000000000000003ffffc000001fffc00000006762b800000000000000007fffff000000fffc000000020101e00000000000000003fffff800000fffc00000001c001f08000000000000001fffff000000fffc000000000880d02000000000000001ffffe0000007ffc000000000000000000000000000000ffffe000000fffc20000000001c400000000000000000ffffe000000fffc2000000000fc6004000000000000003fffc000000fff8e000000001fe6000000000000000001fffc000000fff0e000000001ffe000000000000000001fffc0000007ff0c00000000ffff808000000000000001fff00000007ff0c00000001ffff800000000000000001ffc00000007fe0800000001ffffc00000000000000001ffc00000003fc0000000001ffffe00000000000000003ff800000003fc0000000001ffffe00000000000000003ff800000001f80000000000ffffe00000000000000003ff000000001f00000000000f07fc00000000000000003f8000000000000000000000801f800800000000000007fc000000000000000000000000f800400000000000007e00000000000000000000000000000600000000000007a00000000000000000000000003000c00000000000003c0000000000000000000000000100180000000000000780000000000000000000000000000300000000000000780000000000000000000000000000000000000000000f00000000000000000800000000000000000000000000e000000000000000000000000000000000000000000007000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000c00000000000001e00020ff9ffe000000000000000000c0000000000013fff87fffffffff00000000000000003e00000001ffffffff3fffffffffffc000000000038400f000001ffffffffffffffffffffffe000000ffff4ffffc000007ffffffffffffffffffffff800001ffffffffe000001ffffffffffffffffffffffff00004fffffffffe00070fffffffffffffffffffffffff000000fffffffffe0080ffffffffffffffffffffffffc000007fffffffffffffffffffffffffffffffffffffff80ff803ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  var LAND = (function () { var out = []; for (var r = 0; r < 90; r++) for (var c = 0; c < 45; c++) { var v = parseInt(LAND_HEX.charAt(r * 45 + c), 16);
    for (var b = 0; b < 4; b++) if (v & (8 >> b)) { var la = 89 - r * 2, col = c * 4 + b, step = Math.max(1, Math.round(1 / Math.max(.15, Math.cos(la * Math.PI / 180)))); if (col % step === 0) out.push([la, -179 + col * 2]); } } return out; })();
  var KEY = 'kk_places', TAU = Math.PI * 2, rad = Math.PI / 180;
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var st = load(); if (!st.marks || typeof st.marks !== 'object') st.marks = {};
  if (!st.plan || typeof st.plan !== 'object') st.plan = {};
  // marks[id] was one word ('planned' or 'been'); it is now a space-separated set, so old saves read the same and both can coexist.
  function marks(id) { var v = st.marks[id]; return typeof v === 'string' ? v.split(' ').filter(Boolean) : []; }
  function has(id, k) { return marks(id).indexOf(k) > -1; }
  function setMark(id, k, on) { var m = marks(id).filter(function (x) { return x !== k; }); if (on) m.push(k);
    if (m.length) st.marks[id] = m.join(' '); else delete st.marks[id]; }
  var undo = null, undoT = 0;
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
  // One mark, drawn the same on the globe and in the legend: gold point for want to go or next, a hairline ring for been,
  // a gold ring for the next trip, a wider ivory ring for the chosen place. Returns how far the mark reaches.
  function mark(c, x, y, pr, o) { var r = o.on ? pr + .6 : pr, ring = o.on ? r + 5.5 : o.nx || o.been ? r + 3.5 : r;
    c.fillStyle = o.on || o.nx || o.want ? GOLD : IVORY; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    if (ring > r) { c.strokeStyle = o.on ? 'rgba(244,236,220,.8)' : o.nx ? GOLD : 'rgba(244,236,220,.45)'; c.lineWidth = .75; c.beginPath(); c.arc(x, y, ring, 0, TAU); c.stroke(); }
    return ring; }

  function css() {
    var s = document.createElement('style'), LB = 'font:400 10.5px/1.4 var(--sans);letter-spacing:.12em;text-transform:uppercase;', SEP = '{content:" \\00b7  "}';
    s.textContent =
      '#places{position:fixed;inset:0;z-index:35;display:none;flex-direction:column;color:var(--ivory);padding:0 var(--sar) 0 var(--sal);background:var(--ink)}' +
      '#places.open{display:flex;animation:plIn .8s var(--ease) both}@keyframes plIn{from{opacity:0}to{opacity:1}}' +
      '#places .en{font-weight:inherit}#places .th{font-family:var(--thai)}' +
      '#places [hidden]{display:none!important}' +
      // header: one serif headline, a quiet line beneath, and the text links where the page keeps its top controls
      '#places .plHead{flex:none;display:flex;align-items:flex-start;gap:8px;padding:calc(18px + var(--sat)) 6px 0 24px}' +
      '#places .plHead>div{flex:1;min-width:0;padding-top:6px}' +
      '#places h2{font:400 30px/1.08 var(--serif);letter-spacing:-.005em}#places h2 .th{font:400 20px/1.4 var(--thai)}' +
      '#plHint{margin-top:8px;font:400 12.5px/1.5 var(--sans);color:var(--ivory2)}' +
      // sound, language and close: three text links that drive the page's own controls
      '#places .plCtl{flex:none;display:flex;align-items:center}' +
      '#places .plCtl button{flex:none;min-width:44px;min-height:44px;padding:0 8px;border:0;border-radius:0;background:none;color:var(--ivory);cursor:pointer;' + LB + '}' +
      '#places .plCtl button>span{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:7px;text-decoration-color:var(--line2)}#places .plCtl .th{font:400 14px/1.4 var(--thai)}' +
      '#plMute,#plLang{color:var(--ivory2)!important}' +
      '#plWrap{flex:1 1 auto;min-height:150px;display:flex;flex-direction:column}' +
      '#plStage{position:relative;flex:1 1 auto;min-height:0}' +
      '#plGlobe{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab}#plGlobe.drag{cursor:grabbing}#plGlobe.hot{cursor:pointer}' +
      // under the globe: what the lines mean, then the marks, drawn by the same function as the pins
      '#plKey{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:2px 16px;padding:4px 20px 8px}' +
      '#plKey .kc{font:400 11px/1.5 var(--sans);color:var(--ivory3)}#plKey .kc .th{font-family:var(--thai)}' +
      '#plKey ul{display:flex;flex-wrap:wrap;gap:2px 14px;list-style:none}' +
      '#plKey li{display:inline-flex;align-items:center;gap:4px;font:400 9px/1.4 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ivory2)}#plKey li .th{font:400 11px/1.4 var(--thai)}' +
      '#plKey canvas{flex:none;display:block;width:18px;height:18px}' +
      // names wrap onto rows, no sideways scrolling; the chosen one is underlined in gold
      '#plList{flex:none;display:flex;flex-wrap:wrap;padding:3px 12px;border-top:1px solid var(--line)}' +
      '#plList button{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 10px;border:0;border-radius:0;background:none;color:var(--ivory2);white-space:nowrap;cursor:pointer;' + LB + 'transition:color .8s var(--ease)}' +
      '#plList button .th{font:400 14px/1.4 var(--thai)}#plList .co{display:none}#places.idx #plList .co{display:block;margin-top:-4px;font:500 10.5px/14px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}#places.idx #plList .co .th{font:400 12.5px/1.5 var(--thai);letter-spacing:0;text-transform:none}' +
      '#plList button>.th,#plList button>.en{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:8px;text-decoration-color:transparent;transition:text-decoration-color .8s var(--ease)}' +
      '#plList button.on{color:var(--ivory)}#plList button.on>.th,#plList button.on>.en{text-decoration-color:var(--gold)}' +
      '#plList .tg{display:inline-flex}#plList .tg:empty{display:none}' +
      // status is a quiet word in gold, never a symbol
      '#places .mk{font:400 9px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}#places .mk .th{font:400 11.5px/1 var(--thai)}' +
      // next trip: one compact line that stays put whichever card is open
      '#plTrip{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:0 14px;padding:0 20px;border-top:1px solid var(--line)}' +
      '#plTrip .tb,#plUndo{display:contents}' +
      '#plTrip .lbl{' + LB + 'color:var(--gold)}#plTrip .lbl .th{font:400 12.5px/1.4 var(--thai)}' +
      '#plTrip .tn{font:400 14px/1.4 var(--sans)}#plTrip .tn .th{font-family:var(--thai)}' +
      '#plTrip .fl{display:inline-flex;align-items:center;gap:8px;min-height:44px;cursor:pointer}#plTrip .fl .lbl{color:var(--ivory3)}' +
      '#plTrip select,#plTrip input{-webkit-appearance:none;appearance:none;min-height:44px;padding:0 2px;border:0;border-bottom:1px solid var(--line2);border-radius:0;background:none;color:var(--ivory);font:400 16px/1.4 var(--sans);cursor:pointer}' +
      '#plTrip select{min-width:4em}#plTrip option{background:var(--ink);color:var(--ivory)}' +
      '#plTrip input{width:3em;-moz-appearance:textfield;cursor:text;user-select:text;-webkit-user-select:text}' +
      '#plTrip input::-webkit-inner-spin-button,#plTrip input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}' +
      '#plTrip .tl{min-height:44px;padding:0 4px;border:0;border-radius:0;background:none;color:var(--ivory2);cursor:pointer;' + LB + '}#plTrip .tl .th{font:400 13px/1.3 var(--thai)}' +
      '#plTrip .tl>span{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:7px;text-decoration-color:var(--line2)}' +
      '#plUndoB{color:var(--gold)!important}#plUndoB>span{text-decoration-color:var(--gold)!important}' +
      '#plTrip .um{font:400 13px/1.4 var(--sans);color:var(--ivory2)}#plTrip .um .th{font-family:var(--thai)}' +
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
      '#plCard h3 .nm{font:400 30px/1.06 var(--serif);letter-spacing:-.005em}#plCard h3 .nm .th{font:400 21px/1.35 var(--thai)}' +
      '#plCard h3 .ctry{' + LB + 'color:var(--gold)}#plCard h3 .ctry .th{font:400 12.5px/1.4 var(--thai)}' +
      '#plCard .why{margin-top:12px;font:400 14.5px/1.6 var(--sans)}' +
      '#plCard .facts{display:grid;gap:16px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}' +
      '#plCard .lbl{display:block;margin-bottom:6px;' + LB + 'color:var(--gold)}#plCard .lbl .th{font:400 12.5px/1.4 var(--thai)}' +
      '#plCard dd{font:400 14px/1.5 var(--sans)}#plCard dd small{display:block;margin-top:4px;font-size:12.5px;line-height:1.45;color:var(--ivory2)}' +
      '#plCard .nye{margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}' +
      '#plCard .ntag{display:inline-block;padding:6px 10px 5px;border:1px solid var(--gold);border-radius:0;font:400 9.5px/1.2 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}#plCard .ntag .th{font:400 12px/1.2 var(--thai)}' +
      '#plCard .nye p{margin-top:12px;font:400 14px/1.55 var(--sans)}' +
      '#plCard .do{margin-top:18px;padding-top:16px;border-top:1px solid var(--line);font:400 14px/1.6 var(--sans)}' +
      // sources: a closed hairline row at the foot of the card
      '#plCard .src{margin-top:18px;border-top:1px solid var(--line)}' +
      '#plCard .src summary{display:flex;align-items:center;gap:10px;min-height:44px;list-style:none;cursor:pointer;' + LB + 'color:var(--ivory2)}' +
      '#plCard .src summary::-webkit-details-marker{display:none}#plCard .src summary .th{font:400 12.5px/1.4 var(--thai)}' +
      '#plCard .src summary::before{content:"";flex:none;width:12px;height:1px;background:var(--gold);transition:width .8s var(--ease)}#plCard .src[open] summary::before{width:24px}' +
      '#plCard .src ul{display:flex;flex-wrap:wrap;gap:4px 16px;padding:2px 0 4px 22px;list-style:none}' +
      '#plCard .src li{font:400 12.5px/1.5 var(--sans);color:var(--ivory2);user-select:text;-webkit-user-select:text}' + '#plCard .src li a{color:inherit;text-decoration:none}' +
      '#plCard .actw{flex:none;padding:0 8px var(--sab);border-top:1px solid var(--line)}#plCard .acts{display:flex}' +
      '#plCard .saved{padding:0 0 8px;text-align:center;font:400 9.5px/1.3 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ivory3)}#plCard .saved .th{font:400 11.5px/1.3 var(--thai)}' +
      '#plCard .acts button{flex:1 1 0;min-width:0;min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:4px 6px;border:0;background:none;color:var(--ivory2);cursor:pointer;' + LB + 'transition:color .8s var(--ease)}' +
      '#plCard .acts .th{font:400 13px/1.3 var(--thai)}' +
      '#plCard .acts .tx{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:7px;text-decoration-color:var(--line2);transition:text-decoration-color .8s var(--ease)}' +
      '#plCard .acts [aria-pressed="true"]{color:var(--gold)}#plCard .acts [aria-pressed="true"] .tx{text-decoration-color:var(--gold)}' +
      // the opening card, before a place is chosen
      '#plCard .intro{padding:24px 24px calc(24px + var(--sab))}' +
      '#plCard .lead{font:400 16.5px/1.6 var(--sans)}' +
      '#plCard .pick{margin-top:20px;font:400 14px/1.55 var(--sans);color:var(--ivory2)}' +
      '#plSpin{margin-top:16px}' +
      '#plCard .note{margin-top:20px;font:400 11.5px/1.5 var(--sans);color:var(--ivory3)}' +
      '#places button:focus-visible,#places select:focus-visible,#places input:focus-visible,#places summary:focus-visible,#plCard .plBody:focus-visible{outline:1px solid var(--gold);outline-offset:3px}#plCard .plBody:focus-visible{outline-offset:-4px}' +
      '#places .vh{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}' +
      'html[data-lang="en"] #places .th{display:none}html[data-lang="th"] #places .en{display:none}' +
      'html[data-lang="both"] #places .sub{display:block;margin-top:2px;font-size:.88em;color:var(--ivory2)}' +
      'html[data-lang="both"] #places .lbl .en::before,html[data-lang="both"] #plCard .ctry .en::before,html[data-lang="both"] #plCard .ntag .en::before,' +
        'html[data-lang="both"] #plCard .note .en::before,html[data-lang="both"] #plCard .saved .en::before,html[data-lang="both"] #plCard .src summary .en::before,' +
        'html[data-lang="both"] #plKey .kc .en::before,html[data-lang="both"] #plTrip .tn .en::before,html[data-lang="both"] #plTrip .um .en::before' + SEP +
      'html[data-lang="both"] #plList button>.en{font-size:9px;opacity:.7}html[data-lang="both"] #places .mk .en,html[data-lang="both"] #plClose .en,html[data-lang="both"] #plMute .en,' +
        'html[data-lang="both"] #plTrip .tl .en,html[data-lang="both"] #plKey li .en{display:none}' +
      'html[data-lang="both"] #plSpin{flex-direction:column;gap:3px}html[data-lang="both"] #plSpin .en{font-size:9.5px}' +
      'html[data-lang="both"] #plCard .acts .tx{display:flex;flex-direction:column;align-items:center;gap:3px}html[data-lang="both"] #plCard .acts .en{font-size:9px}' +
      '@media (min-width:600px){#plCard .facts{grid-template-columns:1fr 1fr;gap:16px 20px}}' +
      // landscape phones and desktops: globe on the left, list and card on the right; the art becomes a wide header
      '@media (orientation:landscape) and (min-width:640px){' +
        '#places.open{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,min(440px,42vw));grid-template-rows:auto auto auto minmax(0,1fr);grid-template-areas:"globe head" "globe list" "globe trip" "globe card"}' +
        '#places .plHead{grid-area:head;padding:calc(22px + var(--sat)) 6px 18px 28px}#plWrap{grid-area:globe;min-height:0;border-right:1px solid var(--line)}#plList{grid-area:list}#plTrip{grid-area:trip}' +
        '#plCard{grid-area:card;height:auto;min-height:0}#plCard .plMain{flex-direction:column}' +
        '#plCard .art{flex:none;height:clamp(120px,30vh,260px)}#plCard .art.type{padding:16px 16px 0}' +
        '#plCard .plate b{font-size:clamp(40px,6vw,60px);writing-mode:horizontal-tb}#plCard .plate small{display:block}' +
        '#plCard .plBody{padding:20px 28px 24px}}' +
      /* editorial pass: one column, image first, globe and city index behind their own buttons */
      '#places{--ink:#0B1323;--ivory:#F1EBDD;--ivory2:#B7B1A8;--gold:#B99A68;--line:rgba(241,235,221,.12);--line2:rgba(241,235,221,.24);background:#0B1323}' +
      '#places.open{display:block!important;overflow-y:auto;overscroll-behavior:contain;animation-duration:.3s}' +
      '#places *{letter-spacing:0}#places .th,#places [lang="th"]{letter-spacing:0!important;text-transform:none!important;line-height:1.6}' +
      '#places .plHead{display:flex!important;flex-direction:column-reverse;align-items:stretch;gap:0;padding:var(--sat) 12px 0 24px!important}' +
      '#places .plHead>div{padding:8px 12px 0 0}#places .plCtl{height:48px;justify-content:flex-end;gap:0}' +
      '#places .plCtl button{min-width:44px;min-height:44px;padding:0 10px;font:400 13px/16px var(--sans);letter-spacing:0;text-transform:none;color:var(--ivory2);transition:color .18s linear}' +
      '#plMute svg{width:18px;height:18px;display:block}#places .plCtl button>span{text-decoration:none}#places .plCtl button:hover{color:var(--ivory)}#places .plCtl .th{font:400 14px/1.4 var(--thai)}' +
      '#plTitle{font:400 32px/36px var(--serif)!important;letter-spacing:0}#plTitle .th{font:400 26px/1.4 var(--thaiSerif,var(--thai))!important}#plHint{display:none}' +
      '#plCity{display:flex;align-items:stretch;justify-content:space-between;margin:24px 24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}' +
      '#plCityB{flex:1;display:flex;align-items:center;gap:16px;min-height:48px;padding:0;border:0;background:none;color:var(--ivory);cursor:pointer;text-align:left}' +
      '#plCityB .lbl{font:400 13px/16px var(--sans);color:var(--ivory2);letter-spacing:0;text-transform:none;margin:0}#plCityB .cn{font:400 17px/24px var(--sans)}#plCityB .cn .th{font:400 17px/1.6 var(--thai)}' +
      '#plCityB .chev{width:7px;height:7px;margin:-4px 0 0 2px;border-right:1px solid var(--ivory2);border-bottom:1px solid var(--ivory2);transform:rotate(45deg);transition:transform .24s cubic-bezier(.2,0,0,1)}' +
      '#places.idx #plCityB .chev{transform:rotate(225deg);margin-top:4px}' +
      '#places .tl{min-height:44px;padding:0;border:0;background:none;color:var(--ivory);cursor:pointer;font:400 15px/22px var(--sans)}#places .tl>span{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:6px;text-decoration-color:var(--line2)}' +
      '#plMapB{padding-left:16px!important}' +
      /* map view: full screen, globe, legend and caption live here only */
      '#plWrap{display:none!important}#places.map #plWrap{display:flex!important;position:fixed;inset:0;z-index:5;flex-direction:column;background:#0B1323;padding:var(--sat) 0 var(--sab)}' +
      '#plWrap .mapBar{flex:none;display:flex;align-items:center;justify-content:space-between;height:48px;padding:0 24px}#plWrap .mh{font:400 13px/16px var(--sans);color:var(--ivory2)}' +
      '#plKey .kc{display:none!important}#places.map #plStage{flex:1 1 auto;min-height:0}#plKey{padding:16px 24px 24px}#plKey .kc{font:400 13px/18px var(--sans)!important;letter-spacing:0!important;text-transform:none!important;color:var(--ivory2)}' +
      '#plKey li{font:400 13px/18px var(--sans)!important;letter-spacing:0!important;text-transform:none!important}' +
      /* city index: two columns of square thumbnails */
      '#plList{display:none!important}' +
      '#places.idx #plList{display:grid!important;grid-template-columns:1fr 1fr;gap:24px 12px;margin:0;padding:24px;border:0}' +
      '#places.idx #plList~#plTrip,#places.idx #plList~#plCard{display:none!important}' +
      '#places.idx #plList button{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:0;padding:0;white-space:normal;font:400 15px/22px var(--sans);letter-spacing:0;text-transform:none;color:var(--ivory2);transition:color .18s linear}' +
      '#places.idx #plList button>.th,#places.idx #plList button>.en{text-decoration:none}#places.idx #plList button .th{font:400 15px/1.6 var(--thai)}' +
      '#places.idx #plList .thm{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:1/1;background:#111b30 center/cover no-repeat;border:1px solid var(--line)}' +
      '#places.idx #plList .thm b{font:400 22px/1 var(--serif);color:var(--ivory)}' +
      '#places.idx #plList button.on{color:var(--ivory)}#places.idx #plList button.on .thm{border-color:var(--ivory)}' +
      '#places.idx #plList button.on::after{content:"";position:absolute;right:10px;top:8px;width:6px;height:12px;border-right:1px solid var(--ivory);border-bottom:1px solid var(--ivory);transform:rotate(45deg)}' +
      '#places.idx #plList .tg{display:none}' +
      /* the card: full-width 4:5 art, then name, note and three groups */
      '#plCard{display:block!important;height:auto!important;overflow:visible!important;border-top:0!important;padding-bottom:calc(96px + 16px + var(--sab))}' +
      '#plCard .plMain{display:block!important}' +
      '#plCard .art{display:block;position:relative;width:auto;margin:24px 24px 0;aspect-ratio:4/5;flex:none!important;height:auto!important;background:#111b30}' +
      '#plCard .art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}' +
      '#plCard .art.type{display:flex;padding:0!important;border:1px solid var(--line)}#plCard .art.type .plate{border:0}#plCard .plate b{writing-mode:horizontal-tb!important;font-size:44px!important}#plCard .plate small{display:block!important;font:500 12px/16px var(--sans);letter-spacing:.08em;color:var(--ivory2)}' +
      '#plCard .plBody{overflow:visible!important;height:auto!important;padding:24px 24px 0!important;mask:none!important;-webkit-mask:none!important}' +
      '#plCard h3{gap:8px}#plCard h3 .nm{font:400 30px/34px var(--serif)!important}#plCard h3 .nm .th{font:400 24px/1.5 var(--thaiSerif,var(--thai))!important}' +
      '#plCard h3 .ctry{font:500 12px/16px var(--sans)!important;letter-spacing:.08em!important;text-transform:uppercase;color:var(--ivory2)!important}#plCard h3 .ctry .th{font:500 13px/1.6 var(--thai)!important;text-transform:none}' +
      '#plCard .why,#plCard .lead{margin-top:16px;font:400 16px/25px var(--sans)!important;color:var(--ivory)}#plCard .why .th,#plCard .lead .th{font:400 16px/1.6 var(--thai)}' +
      '#plCard .facts{display:block!important;margin-top:24px;padding-top:24px;border-top:1px solid var(--line)}#plCard .facts>div+div{margin-top:24px}' +
      '#plCard .lbl{display:block;margin-bottom:8px;font:400 13px/16px var(--sans)!important;letter-spacing:0!important;text-transform:none!important;color:var(--ivory2)!important}' +
      '#plCard dd{font:400 16px/25px var(--sans)!important}#plCard dd small{font:400 13px/19px var(--sans)!important;color:var(--ivory2)}' +
      '#plCard .do{margin-top:24px;padding-top:0;border-top:0;font:400 16px/25px var(--sans)!important}' +
      '#plCard .nye{margin-top:24px;padding-top:24px}#plCard .ntag{padding:0;border:0;font:400 13px/16px var(--sans)!important;letter-spacing:0;text-transform:none;color:var(--gold)}#plCard .nye p{font:400 16px/25px var(--sans)!important}' +
      '#plCard .src{margin-top:24px}#plCard .src summary{font:400 13px/16px var(--sans)!important;letter-spacing:0!important;text-transform:none!important}#plCard .src summary::before{background:var(--ivory2)}' +
      '#plCard .src .chk{font:400 13px/19px var(--sans);color:var(--ivory2);padding:0 0 8px 22px}#plCard .src li{font:400 13px/19px var(--sans)!important}' +
      '#plCard .intro{padding:24px!important}#plCard .pick{font:400 15px/22px var(--sans)!important}#plCard .note{display:none}' +
      /* actions: one primary, two quiet toggles, pinned to the foot */
      '#plCard .actw{position:fixed;left:0;right:0;bottom:0;z-index:3;padding:12px 24px calc(12px + var(--sab))!important;background:#0B1323;border-top:1px solid var(--line)}' +
      '#plCard .acts{display:flex;flex-direction:column;gap:4px}' +
      '#plCard .acts>button[data-a="next"]{min-height:48px;width:100%;background:#F1EBDD;color:#0B1323;font:500 16px/20px var(--sans)!important;letter-spacing:0!important;text-transform:none!important;transition:opacity .09s linear}' +
      '#plCard .acts>button[data-a="next"]:active{opacity:.8}#plCard .acts>button[data-a="next"] .tx{text-decoration:none}#plCard .acts>button[data-a="next"] .th{font:500 16px/1.4 var(--thai)}' +
      '#plCard .acts>button[data-a="next"][aria-pressed="true"]{background:none;color:var(--ivory);border:1px solid var(--line2)}' +
      '#plCard .acts .sec{display:flex;justify-content:center;gap:24px}' +
      '#plCard .acts .sec button{flex:none;min-height:44px;padding:0;border:0;background:none;color:var(--ivory2);cursor:pointer;font:400 15px/22px var(--sans)!important;letter-spacing:0!important;text-transform:none!important;display:inline-flex;align-items:center;gap:8px;transition:color .24s cubic-bezier(.2,0,0,1)}' +
      '#plCard .acts .sec .th{font:400 15px/1.5 var(--thai)}#plCard .acts .sec .tx{text-decoration:none}' +
      '#plCard .acts .sec button::before{content:"";width:4px;height:4px;border-radius:50%;background:transparent;transition:background .24s cubic-bezier(.2,0,0,1)}' +
      '#plCard .acts .sec button[aria-pressed="true"]{color:var(--ivory)}#plCard .acts .sec button[aria-pressed="true"]::before{background:var(--gold)}' +
      '#plTrip{margin:16px 24px 0}' +
      '#plIntro,#plSurW{display:none}#places.idx #plIntro{display:block;margin:24px 24px 0;font:400 24px/30px var(--serif);color:var(--ivory)}#places.idx #plIntro .th{font:400 20px/1.6 var(--thaiSerif,var(--thai))}' +
      '#places.idx #plSurW{display:block;padding:0 24px calc(40px + var(--sab))}' +
      '#places.idx #plList{gap:24px 12px}#places.idx #plList .tg,#places.idx~* .tg{display:none}' +
      '#places button:focus:not(:focus-visible),#plClose:focus:not(:focus-visible){outline:none!important}#places button:focus{outline:none}#places button:focus-visible{outline:2px solid var(--gold)!important;outline-offset:3px!important}' +
      '#plCard .sec2{display:flex;gap:24px;margin-top:24px;padding-top:16px;border-top:1px solid var(--line)}' +
      '#plCard .sec2 button{min-height:44px;padding:0;border:0;background:none;color:var(--ivory2);cursor:pointer;font:400 15px/22px var(--sans);display:inline-flex;align-items:center;gap:8px}' +
      '#plCard .sec2 button .th{font:400 15px/1.5 var(--thai)}#plCard .sec2 button::before{content:"";width:12px;height:12px;border:1px solid var(--line2);transition:background .24s,border-color .24s}' +
      '#plCard .sec2 button[aria-pressed="true"]{color:var(--ivory)}#plCard .sec2 button[aria-pressed="true"]::before{background:var(--gold);border-color:var(--gold)}' +
      '#plCard{padding-bottom:calc(72px + 16px + var(--sab))!important}#plCard .actw{padding:12px 24px calc(12px + var(--sab))!important}#plCard .acts .sec{display:none!important}' +
      '@media (min-width:760px){#plIntro,#places.idx #plIntro,#plSurW,#places.idx #plSurW{max-width:960px;margin-left:auto!important;margin-right:auto!important}#places .plHead,#plCity,#plTrip,#plCard,#places.idx #plList{max-width:960px!important}#places.idx #plList{gap:24px!important}#plCity{margin-left:auto!important;margin-right:auto!important;width:calc(100% - 48px)}#places .plHead{padding-left:24px!important;padding-right:24px!important}}' +
      '#plSpin{margin-top:24px;min-height:44px;padding:0!important;border:0!important;background:none!important;color:var(--ivory)!important;font:400 15px/22px var(--sans)!important;letter-spacing:0!important;text-transform:none!important;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:6px;text-decoration-color:var(--line2)}' +
      '@media (min-width:760px){#places .plHead,#plCity,#plTrip,#plCard,#places.idx #plList{max-width:880px;margin-left:auto!important;margin-right:auto!important}#places .plHead{padding-left:24px!important}' +
        '#plCard .plMain{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;padding:0 24px}#plCard .art{margin:40px 0 0}#plCard .plBody{padding:40px 0 0!important}' +
        '#places.idx #plList{grid-template-columns:repeat(4,1fr)}#plCard .actw{left:50%;transform:translateX(-50%);max-width:880px;width:100%}}' +
      '@media (prefers-reduced-motion:reduce){#places.open{animation:none}#places button,#plCard .art img{transition:none}}';
    document.head.appendChild(s);
  }
  function build() {
    var d = document.createElement('div'); d.id = 'places'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'plTitle');
    d.innerHTML = '<header class="plHead"><div><h2 id="plTitle">' + T(TX.title[0], TX.title[1]) + '</h2><p id="plHint">' + T(TX.hint[0], TX.hint[1]) + '</p></div>' +
      '<div class="plCtl"><button id="plMute" type="button"></button><button id="plLang" type="button"></button>' +
      '<button id="plClose" type="button">' + L(TX.close[0], TX.close[1]) + '</button></div></header>' +
      '<div id="plCity"><button id="plCityB" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="plList"><span class="lbl">' + L(TX.city[0], TX.city[1]) + '</span><span class="cn" id="plCityN"></span><span class="chev" aria-hidden="true"></span></button>' +
      '<button id="plMapB" type="button" class="tl"><span>' + L(TX.map[0], TX.map[1]) + '</span></button></div>' +
      '<div id="plWrap"><div class="mapBar"><p class="mh">' + L(TX.explore[0], TX.explore[1]) + '</p><button id="plMapX" type="button" class="tl"><span>' + L(TX.mapClose[0], TX.mapClose[1]) + '</span></button></div><div id="plStage"><canvas id="plGlobe" role="img"></canvas></div>' +
      '<div id="plKey"><p class="kc">' + L(TX.links[0], TX.links[1]) + '</p><ul id="plKeyL">' +
        [['on', 'selected'], ['want', 'planned'], ['been', 'been'], ['nx', 'nextBtn']].map(function (k) {
          return '<li><canvas data-k="' + k[0] + '" aria-hidden="true"></canvas>' + L(TX[k[1]][0], TX[k[1]][1]) + '</li>'; }).join('') + '</ul></div></div>' +
      '<p id="plIntro">' + T(TX.intro[0], TX.intro[1]) + '</p><div id="plList" role="group">' + P.map(function (p) { return '<button type="button" data-id="' + p.id + '" aria-pressed="false"><span class="thm" aria-hidden="true"' + (p.img ? ' style="background-image:url(' + p.img + ');background-position:' + (p.pos || '50% 50%') + '"' : '') + '>' + (p.img ? '' : '<b>' + p.s + '</b>') + '</span>' + L(p.s, p.sTh) + (p.en.indexOf(', ') > 0 ? '<span class="co">' + L(p.en.split(', ')[1], p.th.slice(p.th.lastIndexOf(' ') + 1)) + '</span>' : '') + '<span class="tg"></span></button>'; }).join('') + '</div>' +
      '<div id="plSurW"><button type="button" id="plSur" class="tl"><span>' + L(TX.spin[0], TX.spin[1]) + '</span></button></div><div id="plTrip" role="group" aria-labelledby="plTripL" hidden><span class="tb" id="plTripB">' +
        '<span class="lbl" id="plTripL">' + L(TX.nextBtn[0], TX.nextBtn[1]) + '</span><span class="tn" id="plTripN"></span>' +
        '<label class="fl"><span class="lbl">' + L(TX.month[0], TX.month[1]) + '</span><select id="plMonth"><option value=""></option>' +
          MON.map(function (m, i) { return '<option value="' + (i + 1) + '"></option>'; }).join('') + '</select></label>' +
        '<label class="fl"><span class="lbl">' + L(TX.days[0], TX.days[1]) + '</span><input id="plDays" type="number" min="1" max="365" step="1" inputmode="numeric"></label>' +
        '<button type="button" id="plClear" class="tl"><span>' + L(TX.clear[0], TX.clear[1]) + '</span></button></span>' +
        '<span id="plUndo" hidden><span class="um" id="plUndoM"></span><button type="button" id="plUndoB" class="tl"><span>' + L(TX.undo[0], TX.undo[1]) + '</span></button></span></div>' +
      '<div id="plCard"></div><p id="plLive" class="vh" aria-live="polite"></p>';
    document.body.appendChild(d);
    cv = $('plGlobe'); g = cv.getContext('2d');
    $('plClose').addEventListener('click', function () { close(); });
    // The overlay's sound and language links press the page's own buttons, so state lives in one place (audio.js and the lang toggle).
    $('plMute').addEventListener('click', function () { press($('mute')); ctl(); });
    $('plLang').addEventListener('click', function () { press($('lang')); ctl(); });
    var mb = $('mute'); if (mb && window.MutationObserver) new MutationObserver(ctl).observe(mb, { attributes: true, attributeFilter: ['data-muted', 'class'] });
    function mode(m, on) { var d = $('places'); d.classList.toggle(m, on); if (m === 'idx') $('plCityB').setAttribute('aria-expanded', on ? 'true' : 'false');
      if (m === 'map' && on) { size(); draw(); kick(); setTimeout(function () { $('plMapX').focus({ preventScroll: true }); }, 30); }
      if (m === 'idx' && on) { var o = $('plList').querySelector('.on') || $('plList').querySelector('button'); if (o) setTimeout(function () { o.focus({ preventScroll: true }); }, 30); } }
    window.__plMode = mode;
    $('plCityB').addEventListener('click', function () { mode('idx', !$('places').classList.contains('idx')); });
    $('plMapB').addEventListener('click', function () { mode('map', true); });
    $('plSur').addEventListener('click', function () { surprise(); mode('idx', false); $('plCityB').focus({ preventScroll: true }); $('places').scrollTop = 0; });
    $('plMapX').addEventListener('click', function () { mode('map', false); $('plMapB').focus({ preventScroll: true }); });
    var list = $('plList');
    list.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button[data-id]'); if (b) { pick(b.getAttribute('data-id'), true); if ($('places').classList.contains('idx')) { mode('idx', false); $('plCityB').focus({ preventScroll: true }); var d = $('places'); d.scrollTop = 0; } } });
    list.addEventListener('keydown', function (e) { // arrows walk the chips across rows; Enter or Space picks
      var cs = [].slice.call(list.children), i = cs.indexOf(document.activeElement), j = -1; if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % cs.length; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i + cs.length - 1) % cs.length;
      else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = cs.length - 1;
      if (j < 0) return; e.preventDefault(); cs[j].focus({ preventScroll: true }); });
    $('plCard').addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button'); if (!b) return;
      if (b.id === 'plSpin') surprise(); else if (b.hasAttribute('data-a')) act(b.getAttribute('data-a')); });
    $('plMonth').addEventListener('change', function () { var v = parseInt(this.value, 10); if (v >= 1 && v <= 12) st.plan.month = v; else delete st.plan.month; save(); });
    $('plDays').addEventListener('input', function () { var v = parseInt(this.value, 10); if (v >= 1 && v <= 365) st.plan.days = v; else delete st.plan.days; save(); });
    $('plClear').addEventListener('click', clearTrip);
    $('plUndoB').addEventListener('click', undoIt);
    legend();
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
      if (e.key === 'Escape') { e.preventDefault(); var d = $('places'); if (d.classList.contains('idx')) { window.__plMode('idx', false); $('plCityB').focus(); } else if (d.classList.contains('map')) { window.__plMode('map', false); $('plMapB').focus(); } else close(); } else if (e.key === 'Tab') trap(e);
      e.stopPropagation(); });
    // Phone back button or swipe closes the overlay instead of leaving the gift.
    addEventListener('popstate', function () {
      if (backing) { backing = false; if (isOpen() && !pushed) push(); return; }
      if (isOpen()) { pushed = false; close(true); } });
    function onResize() { if (isOpen()) { size(); draw(); fit(); } }
    if (window.ResizeObserver) new ResizeObserver(onResize).observe($('plStage'));
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
    g.save(); g.beginPath(); g.arc(cx, cy, R - .5, 0, TAU); g.clip(); routes(); g.restore(); pins();
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
    for (var i = 0; i <= n; i++) { q = view(pts[i]); if (q.z < 0 || q.out) { on = false; continue; } if (on) g.lineTo(q.x, q.y); else { g.moveTo(q.x, q.y); on = true; } }
    return q; }
  // Links are great-circle (slerp) arcs from home; they show where, not how the flights go.
  function routes() { g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = .75;
    P.forEach(function (p) { if (true) return; var nx = st.next === p.id;
      g.strokeStyle = nx ? 'rgba(184,149,106,.6)' : has(p.id, 'planned') ? 'rgba(184,149,106,.36)' : has(p.id, 'been') ? 'rgba(244,236,220,.26)' : 'rgba(184,149,106,.16)';
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
  // Pins: see mark(). Home is a hairline ring around a small ivory point.
  function pins() {
    var pr = clamp(R * .018, 2, 3), hq = view(HOME), items = [], boxes = [], th = lang() !== 'en';
    if (hq.z > .02) { g.globalAlpha = fade(hq.z); g.strokeStyle = 'rgba(244,236,220,.55)'; g.lineWidth = .75; g.beginPath(); g.arc(hq.x, hq.y, 4.5, 0, TAU); g.stroke();
      g.fillStyle = IVORY; g.beginPath(); g.arc(hq.x, hq.y, 1.4, 0, TAU); g.fill(); boxes.push(box(hq.x, hq.y, 7)); }
    P.slice().sort(function (a, b) { return (a.id === sel) - (b.id === sel); }).forEach(function (p) {
      var q = view(GEO[p.id].v); if (q.z <= .02) return;
      var on = p.id === sel, nx = st.next === p.id, ring;
      g.globalAlpha = fade(q.z);
      ring = mark(g, q.x, q.y, pr, { on: on, nx: nx, want: has(p.id, 'planned'), been: has(p.id, 'been') });
      boxes.push(box(q.x, q.y, ring + 1)); items.push({ p: p, q: q, on: on, nx: nx, ext: ring });
    });
    // Labels: the chosen place first, then home, the next trip, then whatever faces us most. A label that would collide is skipped.
    items.sort(function (a, b) { return (b.on - a.on) || (b.nx - a.nx) || (b.q.z - a.q.z); });
    if (hq.z > .02) items.splice(items.length && items[0].on ? 1 : 0, 0, { home: true, q: hq, ext: 6 });
    g.textBaseline = 'middle'; g.lineJoin = 'round';
    // Keep labels clear of the canvas edge, with room for the 3px outline and Thai marks above the line.
    var my = th ? 7 : 4, inside = function (b) { return b.x >= 6 && b.y >= my && b.x + b.w <= W - 6 && b.y + b.h <= H - my; };
    items.forEach(function (it) {
      var t = it.home ? tx('home') : th ? it.p.sTh : it.p.s, fs = th ? (it.on ? 13 : 12) : (it.on ? 10.5 : 9.5), ls = th ? 0 : fs * .18,
        h = fs + 8, gp = it.ext + 6, x = it.q.x, y = it.q.y, at = null, w, c, i, bx;
      if (!th) t = t.toUpperCase();
      g.font = (it.on ? '400 ' : '300 ') + fs + 'px ' + (th ? '"IBM Plex Sans Thai",Inter' : 'Inter,"IBM Plex Sans Thai"') + ',system-ui,sans-serif';
      w = textW(t, ls); c = [[x + gp, y - h / 2], [x - gp - w, y - h / 2], [x - w / 2, y - gp - h], [x - w / 2, y + gp]];
      for (i = 0; i < c.length && !at; i++) { bx = { x: c[i][0], y: c[i][1], w: w, h: h };
        if (!inside(bx)) continue;
        if (boxes.some(function (o) { return bx.x < o.x + o.w && bx.x + bx.w > o.x && bx.y < o.y + o.h && bx.y + bx.h > o.y; })) continue;
        at = bx; }
      // The chosen place and Bangkok always get a label: the first spot that fits the canvas, else pulled inside the edges.
      if (!at && (it.on || it.home)) for (i = 0; i < c.length && !at; i++) { bx = { x: c[i][0], y: c[i][1], w: w, h: h }; if (inside(bx)) at = bx; }
      if (!at && (it.on || it.home)) at = { x: clamp(c[0][0], 6, W - w - 6), y: clamp(c[0][1], my, H - h - my), w: w, h: h };
      if (!at) return;
      boxes.push({ x: at.x - 3, y: at.y, w: w + 6, h: h });
      g.globalAlpha = fade(it.q.z) * (it.on ? 1 : it.home ? .85 : .7);
      g.lineWidth = 3; g.strokeStyle = 'rgba(11,19,36,.9)'; text(t, at.x, at.y + h / 2, ls, true);
      g.fillStyle = it.home ? GOLD : IVORY; text(t, at.x, at.y + h / 2, ls, false);
    });
    g.globalAlpha = 1;
  }
  // Chip status is one quiet word (next trip first); a second state is still read out to screen readers.
  function tags(p) { var ks = [], h = '';
    if (st.next === p.id) ks.push('nextBtn'); if (has(p.id, 'planned')) ks.push('planned'); if (has(p.id, 'been')) ks.push('been');
    if (ks.length) h = '<i class="mk">' + L(TX[ks[0]][0], TX[ks[0]][1]) + '</i>';
    ks.slice(1).forEach(function (k) { h += '<span class="vh">' + L(', ' + TX[k][0].toLowerCase(), ', ' + TX[k][1]) + '</span>'; });
    return h; }
  // Reflect state in place, so a focused chip or button keeps focus.
  function sync() { var cn = $('plCityN'), sp = byId(sel); if (cn) cn.innerHTML = sp ? L(sp.s, sp.sTh) : L('Choose', 'เลือก');
    if (!built) return; var nb = $('placesNext'), nx = byId(st.next);
    [].forEach.call($('plList').children, function (b) { var id = b.getAttribute('data-id'), on = id === sel;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.querySelector('.tg').innerHTML = tags(byId(id)); });
    [].forEach.call($('plCard').querySelectorAll('[data-a]'), function (b) { var a = b.getAttribute('data-a');
      var pr = (a === 'next' ? st.next === sel : has(sel, a)); b.setAttribute('aria-pressed', pr ? 'true' : 'false');
      if (a === 'next') b.querySelector('.tx').innerHTML = pr ? L(TX.nextOn[0], TX.nextOn[1]) : L(TX.nextBtn[0], TX.nextBtn[1]); });
    if (nb) nb.innerHTML = nx ? L(TX.next[0] + nx.s, TX.next[1] + nx.sTh) : '';
    trip(); labels(); kick(); }
  // The next-trip line: destination, an optional month and number of days, Clear, and for a few seconds after a change, Undo.
  function trip() { if (!built) return; var nx = byId(st.next), m = $('plMonth'), d = $('plDays'), mv = String(st.plan.month || ''), dv = String(st.plan.days || '');
    $('plTrip').hidden = !nx && !undo; $('plTripB').hidden = !nx; $('plUndo').hidden = !undo;
    if (nx) { $('plTripN').innerHTML = L(nx.s, nx.sTh); if (m.value !== mv) m.value = mv; if (document.activeElement !== d && d.value !== dv) d.value = dv; }
    if (undo) $('plUndoM').innerHTML = L(undo.en, undo.th); }
  function labels() { if (!built) return; var p = byId(sel), a = $('plCard').querySelector('.acts'), im = $('plCard').querySelector('.art img'), en = lang() === 'en';
    $('plList').setAttribute('aria-label', tx('places'));
    cv.setAttribute('aria-label', tx('globe') + (p ? tx('showing') + (en ? p.en : p.th) : ''));
    if (a) a.setAttribute('aria-label', tx('mark'));
    if (im && p) im.alt = alt(p);
    $('plKeyL').setAttribute('aria-label', tx('key'));
    [].forEach.call($('plMonth').options, function (o, i) { o.textContent = i ? MON[i - 1][en ? 0 : 1] : tx('anyMonth'); });
    ctl(); }
  // Mirror the page's mute and language buttons; their own handlers (audio.js, the inline script) keep the state.
  function ctl() { if (!built) return; var m = $('mute'), lb = $('lang'), b = $('plMute'), pl = $('plLang'), off = !!m && (m.getAttribute('data-muted') === '1' || m.classList.contains('off'));
    b.hidden = !m; var sv = m && m.querySelector(off ? '.i-off' : '.i-on'); b.innerHTML = sv ? sv.outerHTML.replace(/class="[^"]*"/, '') : ''; b.setAttribute('aria-label', off ? tx('unmute') : tx('mute'));
    pl.hidden = !lb; pl.innerHTML = '<span>' + (lb ? lb.textContent : '') + '</span>'; pl.setAttribute('aria-label', tx('lang') + ': ' + (lb ? lb.textContent : '')); }
  function press(el) { if (!el) return; try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); } catch (e) { el.click(); } }
  function legend() { var dpr = Math.min(window.devicePixelRatio || 1, 2);
    [].forEach.call($('plKey').querySelectorAll('canvas'), function (c) { var k = c.getAttribute('data-k'), x = c.getContext('2d'), o = {}; o[k] = true;
      c.width = c.height = Math.round(18 * dpr); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, 18, 18); mark(x, 9, 9, 2.2, o); }); }
  function fact(k, v, vTh, n, nTh) { return '<div><dt class="lbl">' + L(TX[k][0], TX[k][1]) + '</dt><dd>' + T(v, vTh) + (n ? '<small>' + T(n, nTh) + '</small>' : '') + '</dd></div>'; }
  function actBtn(a, k) { return '<button type="button" data-a="' + a + '" aria-pressed="false"><span class="tx">' + L(TX[k][0], TX[k][1]) + '</span></button>'; }
  function alt(p) { return (lang() === 'en' ? p.alt : p.altTh) || ''; }
  // Card art: the photograph when the place has img, lazy and faded in; otherwise (or if the file is missing) the name in a 1px frame.
  function plate(p) { var c = p.en.split(', '); return '<div class="art type" aria-hidden="true"><div class="plate"><b>' + c[0] + '</b><small>' + (c[1] || '') + '</small></div></div>'; }
  function art(p) { return p.img ? '<figure class="art"><img src="' + p.img + '" alt="' + alt(p).replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" style="object-position:' + (p.pos || '50% 60%') + '"></figure>' : plate(p); }
  // Rebuilt only when the place changes; marking a place goes through sync().
  function render() {
    var el = $('plCard'), p = byId(sel), c, i, h, im, dt;
    if (!p) h = '<div class="plMain"><div class="plBody intro"><p class="lead">' + T(TX.intro[0], TX.intro[1]) + '</p>' +
      '<p class="pick">' + T(TX.pick[0], TX.pick[1]) + '</p><button type="button" id="plSpin" class="btn">' + L(TX.spin[0], TX.spin[1]) + '</button>' +
      '</div></div>';
    else { c = p.en.split(', '); i = p.th.lastIndexOf(' '); if (i < 0) i = p.th.length;
      h = '<div class="plMain">' + art(p) + '<div class="plBody"><h3 id="plName"><span class="nm">' + T(c[0], p.th.slice(0, i)) + '</span>' +
        (c[1] ? '<span class="ctry">' + L(c[1], p.th.slice(i + 1)) + '</span>' : '') + '</h3>' +
        '<p class="why">' + T(p.whyEn, p.whyTh) + '</p>' +
        '<dl class="facts">' + fact('best', p.monEn, p.monTh, p.monNote, p.monNoteTh) + fact('from', p.fly, p.flyTh, p.flyNote, p.flyNoteTh) + '</dl>' +
        (p.nyeEn ? '<div class="nye"><span class="ntag">' + L(TX.nye[0], TX.nye[1]) + '</span><p>' + T(p.nyeEn, p.nyeTh) + '</p></div>' : '') +
        '<p class="do"><span class="lbl">' + L(TX.tog[0], TX.tog[1]) + '</span>' + T(p.doEn, p.doTh) + '</p>' +
        '<div class="sec2" role="group">' + actBtn('planned', 'planned') + actBtn('been', 'been') + '</div><details class="src"><summary>' + L(TX.details[0], TX.details[1]) + '</summary><p class="chk">' + L(TX.src[0], TX.src[1]) + '</p><ul>' +
          (p.src || []).concat(SRC_FLY).map(function (s) { return '<li>' + s + '</li>'; }).join('') + (p.credit ? '<li class="cr">Photo: <a href="' + p.credit[1] + '" target="_blank" rel="noopener">' + p.credit[0] + ' / Unsplash</a></li>' : '') + '</ul></details></div></div>' +
        '<div class="actw"><div class="acts" role="group">' + actBtn('next', 'nextBtn') + '</div>' +
        '</div>'; }
    el.innerHTML = h;
    el.querySelector('.plBody').addEventListener('scroll', fit, { passive: true });
    dt = el.querySelector('details'); if (dt) dt.addEventListener('toggle', fit);
    im = el.querySelector('.art img');
    if (im) { var shown = function () { im.classList.add('in'); }, missing = function () { var f = im.parentNode; if (f && f.parentNode) f.outerHTML = plate(p); };
      if (im.complete) { if (im.naturalWidth) shown(); else missing(); } else { im.addEventListener('load', shown); im.addEventListener('error', missing); } }
    fit(); }
  // When the card text overflows: make it keyboard-scrollable and fade the bottom edge until the end is reached.
  function fit() { var b = built && $('plCard').querySelector('.plBody'); if (!b) return; var over = b.scrollHeight > b.clientHeight + 2;
    if (over) { b.setAttribute('tabindex', '0'); b.setAttribute('role', 'region'); b.setAttribute('aria-labelledby', $('plName') ? 'plName' : 'plTitle'); }
    else { b.removeAttribute('tabindex'); b.removeAttribute('role'); b.removeAttribute('aria-labelledby'); }
    b.classList.toggle('more', over && b.scrollTop + b.clientHeight < b.scrollHeight - 4); }
  // Want to go and Been there toggle on their own and can both be on; Next trip is one place at most.
  // Focus stays on the pressed button: sync() only updates attributes and text around it.
  function act(a) { var p = byId(sel), on, prev = st.next, msg = ''; if (!p) return;
    if (a === 'next') { on = st.next !== p.id;
      if (on && prev && byId(prev)) { stash(TX.was[0] + byId(prev).s + '.', TX.was[1] + byId(prev).sTh); msg = ' ' + (lang() === 'en' ? undo.en : undo.th); } else endUndo();
      st.next = on ? p.id : null; }
    else { on = !has(p.id, a); setMark(p.id, a, on); }
    save(); sync();
    var k = a === 'next' ? 'nextBtn' : a; live(p.s + ': ' + TX[k][0] + ', ' + TX[on ? 'on' : 'off'][0] + '.' + msg, p.sTh + ': ' + TX[k][1] + ' ' + TX[on ? 'on' : 'off'][1] + msg); }
  function live(en, th) { var el = $('plLive'); if (el) el.textContent = lang() === 'en' ? en : th; }
  // Undo keeps the previous next trip and its month and days for six seconds.
  function stash(en, th) { clearTimeout(undoT); undo = { next: st.next, plan: JSON.parse(JSON.stringify(st.plan)), en: en, th: th }; undoT = setTimeout(endUndo, 6000); }
  function endUndo() { clearTimeout(undoT); if (!undo) return; var f = document.activeElement, inU = !!(f && f.closest && f.closest('#plUndo')); undo = null; trip(); if (inU) refocus(); }
  function undoIt() { if (!undo) return; var u = undo; clearTimeout(undoT); undo = null; st.next = u.next; st.plan = u.plan; save(); sync(); refocus();
    var nx = byId(st.next); live(TX.restored[0] + (nx ? ' ' + TX.next[0] + nx.s + '.' : ''), TX.restored[1] + (nx ? ' ' + TX.next[1] + nx.sTh : '')); }
  function clearTrip() { if (!st.next) return; stash(TX.cleared[0], TX.cleared[1]); st.next = null; st.plan = {}; save(); sync();
    live(TX.cleared[0], TX.cleared[1]); var u = $('plUndoB'); if (u) u.focus({ preventScroll: true }); }
  // When the focused control goes away, land on the nearest thing that still makes sense.
  function refocus() { var t = $('plCard').querySelector('[data-a="next"]'), c = $('plClear');
    if (!t && c && c.getClientRects().length) t = c; t = t || $('plList').querySelector('.on') || $('plClose'); if (t) t.focus({ preventScroll: true }); }
  function say(p) { var el = $('plLive'), en = lang() === 'en'; if (el) el.textContent = (en ? p.en + '. ' + p.whyEn : p.th + ' ' + p.whyTh); }
  function pick(id, turn, extra) {
    var p = byId(id); if (!p || !ensure()) return; drift = false;
    if (sel !== id) { sel = id; arcP = still() ? 1 : 0; arcT0 = performance.now(); render(); say(p); }
    sync(); if (turn) turnTo(p, extra); }
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
  function trap(e) { var f = [].filter.call($('places').querySelectorAll('button,select,input,summary,[tabindex="0"]'), function (x) { return !x.disabled && x.getClientRects().length; }), i;
    if (!f.length) return; i = f.indexOf(document.activeElement);
    if (e.shiftKey ? i <= 0 : (i < 0 || i === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); } }
  function open() {
    if (!ensure() || isOpen()) return;
    opener = document.activeElement; $('places').classList.add('open'); setInert(true);
    if (!backing) push(); // if a back() from the last close is still landing, popstate pushes once it does
    drift = !sel; lastT = 0; size(); render(); sync(); draw(); if (window.__plMode) window.__plMode('idx', true);
    setTimeout(function () { var c = $('plClose'); if (c && isOpen()) c.focus({ preventScroll: true, focusVisible: false }); }, 30); }
  function close(fromHistory) {
    if (!isOpen()) return;
    $('places').classList.remove('open', 'idx', 'map'); setInert(false); cancelAnimationFrame(raf); raf = 0; spin = fling = drag = null; lastT = 0;
    if (pushed) { pushed = false; if (fromHistory !== true) { backing = true; try { history.back(); } catch (e) { backing = false; } } }
    var b = opener && opener !== document.body && document.contains(opener) ? opener : $('placesBtn'); opener = null;
    if (b && b.focus) b.focus({ preventScroll: true }); }
  function ensure() { if (built) return true; try { css(); build(); built = true; render(); sync(); } catch (e) { return false; } return true; }
  function init() { if (!ensure()) return; var b = $('placesBtn'); if (b) b.addEventListener('click', function () { open(); }); }
  window.__places = { open: open, close: function () { close(); }, pick: function (id) { pick(id, true); }, data: P };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
