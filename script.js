const NIGEL_IMG = "assets/nigel.jpg";

const $ = id => document.getElementById(id);
const age = $("age"), block = $("block"), hole = $("hole"), nigel = $("nigel"),
      crumbs = $("crumbs"), enter = $("enter"), world = $("world"), skip = $("skip"),
      paper = $("paper"), dock = $("dock"), controls = document.querySelector(".controls"), soundBtn = $("sound");
nigel.innerHTML = `<img src="${NIGEL_IMG}" alt="">`;
document.querySelectorAll(".nigel-photo").forEach(img => (img.src = NIGEL_IMG));
const REASON_IMG = "assets/reason.jpg";
document.querySelectorAll(".reason-photo").forEach(img => (img.src = REASON_IMG));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let run = 0;
const sleep = ms => new Promise(r => setTimeout(r, reduce ? Math.min(ms, 60) : ms));

/* ---------- Sound (off by default) ---------- */
let soundOn = true, actx = null;
// browsers only allow audio after a click, so start it on the first one
function ensureAudio() {
  if (!soundOn || actx) return;
  try { actx = new AudioContext(); loadFlip(); } catch { soundOn = false; }
}
addEventListener("pointerdown", ensureAudio);
addEventListener("keydown", ensureAudio);
$("sound").addEventListener("click", e => {
  soundOn = !soundOn;
  e.currentTarget.textContent = "Sound: " + (soundOn ? "on" : "off");
  e.currentTarget.setAttribute("aria-pressed", soundOn);
  if (soundOn && !actx) { try { actx = new AudioContext(); } catch { soundOn = false; } }
  if (soundOn) loadFlip();
});
function noise(dur, freq, gain = .5, type = "bandpass") {
  if (!soundOn || !actx) return;
  const len = Math.floor(actx.sampleRate * dur);
  const buf = actx.createBuffer(1, len, actx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5) * (Math.random() < .35 ? 1 : .25);
  const src = actx.createBufferSource(); src.buffer = buf;
  const f = actx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = .8;
  const g = actx.createGain(); g.gain.value = gain;
  src.connect(f).connect(g).connect(actx.destination); src.start();
}
function crunch() { [0, 70, 150].forEach(t => setTimeout(() => noise(.09, 1400 + Math.random() * 2200, .6), t)); }
function thud() { noise(.35, 140, 1.2); }
// a page turning: a recorded page flip (freesound community, "page-flip")
const FLIP_MP3 = "data:audio/mpeg;base64,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IieDBEwiIkDESInwiIgGCI/4RDHhEMYRDHhEMfAwxhjwMMQYuBhiDF+DAifgwIvCIRAiETCIRcGBFwiETBgRVQAgAAQMASDEpKMSBIwkXjF4dNeDkxKCFICRnMvB014CTdhKMlQEy+CQgSGL//vUxBYALL4FOJnNAAWnQKhHN6AAgQZLDjlBU4GlZmdkuQd+oW+U8bk6cpca+UIg4k7MCPOUSNdDNKIMqLfAUIA5cZYcDQAw5U4GpAMHiIcIy4kffwKnDEpTErxrka86WRMSTGiRiToQmUmIwDS2zpUSYtwgSVVNcJQbLdgA6W5ARFTkYEDBNWCDggkAiCsasCqw0RCCRZIt8YkQYkmW5MQTARGDkIwqTLdKqFuS3zlqxjRCDFOC3Q0kRXCghy0GUIS36jTljSQt2NEFYFYoPGRKhkmabJ2nv4gEfx/pI5RbpFaDHKLdOUquqr7S0rxGBXYle0xpD+P/JHTo3wonxdONNWavGYzR0D4Ou1Z06KNM5jT40D5RiMpWSb2mNMafJ1D2zP58mk//////////////////////8GQbBn///////////////////8Hwe5QAApuKUZw4mEtBquMEHZjgSYCdmSCwQ4DS8Y4cGcCQQ4GckplxcYm4hBMECIBvldUycsJoqcGSOnolHpOgIghCFTpkkiBEYOFvwE4LfgBIaUQADqBJVVFZyjOEgElCok3BwB9giUYlIEEzSHUGAgmW6LAgsiqqEXDSnS3BuFxr15kkpkxAVJOQAnYVEjJJBtCFWFCAIIlkzXkgjgNOAhOaRcMQjJOS3Kq5YOlvUGAgkEJoPLfFvAqIUaGiEGmvOmTSjBIBOAgggRLJqNjCUsiWRGREHIreqqgQUbchBhAirC5KsLTkqDAAAaHbOVgUrFGFDlIqxuUqqgTVVg6DYMgxylV1YYP9y0VXJUbcmDAEnQbGRCsI0RQJgIgg0hA5asBZODH99pMkknv5JX8f73/aTJ39UOf1drSpMux/ff1pMmQJqwf////////////////////BsGuV////////////////////BkGQeggAAZvcp7mb4MPJkShEqYc4CQGU2Ke5IN0mMTnQBWY1lUKYMq5NbDI/hHArSGjG6Q2YxukbpKzfAyD0g9MH6EETGJxiY0cI//vUxCOB79l6/L3/AAX1L6BB/1m4/yiO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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQVgQAJKokv2IOW+j1sKUTY27FuXOKqZDEZAWBpPrQfeAmsqZFzRGYkWSlQSK7eSXx5uLRmRv/OUsahl9npfRt2DLlbE7cOT9ZrKVRfZKdWxdbNG+d3TvMOZC9UGwE4KtxeURmGTCoUhF1upF4KRtEIghIKoaZC+1tJkjIAwSOnDpwhFSEYnEJaqYGBhUwLn//vUxEeD70nqpExnXsAAADSAAAAEFglDgqmocFgQScIGyB4RJAIdCBi7uM7ThMMAwjzAXFVCEscAQ4gkgwnQLYSaitZmKAaMeUJihI0zRDMbMOgG0A10xCDNBBwBf8vYX/QAKgSuUpZ47cENxUOR1SdUoYO8kjlknYioEj0mirc1ldyDpgRBgjoVTCFEISogCJThcEYAmAUhVUmCRGKEEyoBEUEzSVLjGBzNrjKRzFTQY8MWjMQOBIkcGDBshUCNeFUJiAg0DfhlKPQiBkIgVDoZq8gaRNdWGTRT+Urae2sei7qteaS3Rx3Way8D9wl+n1ljrMOZi3B34EkVmUxy91VMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
let flipBuf = null, flipBufRev = null, flipLoading = null;
function loadFlip() {
  if (flipBuf || !actx) return Promise.resolve();
  if (!flipLoading) {
    const bin = atob(FLIP_MP3.split(",")[1]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    flipLoading = actx.decodeAudioData(bytes.buffer).then(b => {
      flipBuf = b;
      // the same flip played backwards, for turning back
      flipBufRev = actx.createBuffer(b.numberOfChannels, b.length, b.sampleRate);
      for (let c = 0; c < b.numberOfChannels; c++) flipBufRev.getChannelData(c).set(b.getChannelData(c).slice().reverse());
    }).catch(e => console.warn("page flip sound failed", e));
  }
  return flipLoading;
}
function rustle(dir = 1) {
  if (!soundOn || !actx) return;
  loadFlip().then(() => {
    if (!flipBuf) return;
    const src = actx.createBufferSource();
    src.buffer = dir < 0 ? flipBufRev : flipBuf;
    src.connect(actx.destination);
    src.start();
  });
}

/* ---------- Stage 1: age check ---------- */
const idLines = ["Your passport? For a website?", "Nigel has filed that under No.", "Still no. There's another button."];
const faceLines = ["Scanning… 1 face found. Whiskers detected.", "Estimated age: hamster. Verification failed."];
let idN = 0, faceN = 0;
function nope(btn, text) {
  document.querySelectorAll(".age-opt").forEach(b => b.classList.remove("shake"));
  void btn.offsetWidth; btn.classList.add("shake");
  $("age-msg").textContent = text;
}
$("opt-id").addEventListener("click", e => nope(e.currentTarget, idLines[idN++ % idLines.length]));
$("opt-face").addEventListener("click", e => nope(e.currentTarget, faceLines[faceN++ % faceLines.length]));
$("refuse").addEventListener("click", () => { ensureAudio(); sequence(++run); });

// access denied: two falling buzzer tones
function errorBuzz() {
  if (!soundOn || !actx) return;
  const t = actx.currentTime;
  [[0, 247], [.2, 185]].forEach(([dt, hz]) => {
    const o = actx.createOscillator(); o.type = "square"; o.frequency.value = hz;
    const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1600;
    const g = actx.createGain();
    g.gain.setValueAtTime(0, t + dt);
    g.gain.linearRampToValueAtTime(.16, t + dt + .01);
    g.gain.setValueAtTime(.16, t + dt + .16);
    g.gain.linearRampToValueAtTime(0, t + dt + .19);
    o.connect(f).connect(g).connect(actx.destination);
    o.start(t + dt); o.stop(t + dt + .2);
  });
}

/* ---------- The hole: a union of bite marks ---------- */
let cx = 0, cy = 0, R = 120, holeScale = 1, cutBlock = false;
const N = 160;
let bites = []; // each bite in units of R: distance and angle from the centre, bite radius, how far it has opened
function measure() {
  cx = innerWidth / 2;
  cy = innerHeight * .62;
  R = Math.min(innerWidth * .32, innerHeight * .24, 190);
  hole.style.setProperty("--cx", cx + "px");
  hole.style.setProperty("--cy", cy + "px");
  hole.style.setProperty("--R", R + "px");
  enter.style.top = (cy + R + 22) + "px";
}
function planBites() {
  const base = Math.random() * Math.PI * 2;
  bites = [{ d: 0, a: 0, b: .34 }];
  for (let i = 0; i < 7; i++) bites.push({ d: .4 + Math.random() * .1, a: base + i * 2.39996, b: .52 + Math.random() * .08 });
  bites.push({ d: 0, a: 0, b: .66 });
  bites.forEach(bt => { bt.grow = 0; bt.teeth = 9 + Math.floor(Math.random() * 5); bt.seed = Math.random() * 6; });
}
// distance from the centre to the hole's edge in direction a
function radiusAt(a) {
  let best = 0;
  for (const bt of bites) {
    if (bt.grow <= 0) continue;
    const b = bt.b * bt.grow, rel = a - bt.a;
    const along = bt.d * Math.cos(rel), across = bt.d * Math.sin(rel);
    const disc = b * b - across * across;
    if (disc <= 0) continue;
    let t = along + Math.sqrt(disc);
    t -= b * .045 * Math.pow(Math.abs(Math.sin(rel * bt.teeth + bt.seed)), 6); // tooth marks on the rim
    if (t > best) best = t;
  }
  return best;
}
function drawHole() {
  const pts = [];
  let maxR = 0;
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2;
    const rr = radiusAt(a) * R * holeScale;
    if (rr > maxR) maxR = rr;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .92]);
  }
  hole.style.clipPath = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
  hole.style.setProperty("--r", Math.max(1, maxR) + "px");
  // while diving, the error page itself gets the hole cut out of it
  if (cutBlock) {
    const ring = pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
    block.style.clipPath = `path(evenodd, "M0 0 H${innerWidth} V${innerHeight} H0 Z M${ring} Z")`;
  }
}
// a bite snaps open fast and overshoots a touch, like teeth tearing through
function animateBite(bt, dur) {
  return new Promise(done => {
    const t0 = performance.now(), c1 = 1.70158, c3 = c1 + 1;
    (function f() {
      const t = performance.now();
      const p = Math.min(1, Math.max(0, (t - t0) / dur));
      bt.grow = p < 1 ? 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2) : 1;
      drawHole();
      p < 1 ? requestAnimationFrame(f) : done();
    })(t0);
  });
}
// the page recoils away from each bite and settles
function shake(bt, power) {
  if (reduce) return;
  const t0 = performance.now(), dir = bt.a + Math.PI;
  (function f() {
    const t = performance.now();
    const p = Math.max(0, (t - t0) / 260);
    if (p >= 1) { block.style.transform = ""; return; }
    const amp = power * Math.pow(1 - p, 2) * Math.cos(p * 28);
    block.style.transform = `translate(${(Math.cos(dir) * amp).toFixed(2)}px, ${(Math.sin(dir) * amp).toFixed(2)}px) rotate(${(amp * .05).toFixed(3)}deg)`;
    requestAnimationFrame(f);
  })(t0);
}

/* ---------- Crumbs: pieces of the page under gravity ---------- */
const cctx = crumbs.getContext("2d");
let parts = [], partsRunning = false, lastT = 0;
function sizeCrumbs() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  crumbs.width = innerWidth * dpr; crumbs.height = innerHeight * dpr;
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function burst(bt) {
  if (reduce) return;
  const bx = cx + Math.cos(bt.a) * bt.d * R, by = cy + Math.sin(bt.a) * bt.d * R * .92;
  const colors = ["#ffffff", "#f8f9fa", "#e8eaed", "#dadce0", "#bdc1c6", "#202124", "#1a73e8"];
  const n = 14 + Math.floor(Math.random() * 8);
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2, rim = bt.b * R * (.7 + Math.random() * .35);
    const speed = 140 + Math.random() * 360, s = 3 + Math.random() * 9;
    parts.push({
      x: bx + Math.cos(th) * rim, y: by + Math.sin(th) * rim * .92,
      vx: Math.cos(th) * speed, vy: Math.sin(th) * speed * .6 - (180 + Math.random() * 260),
      rot: Math.random() * 6, vr: (Math.random() - .5) * 18,
      shape: [[-s, -s * .6], [s * (.6 + Math.random() * .5), -s * .8], [s, s * .5], [-s * .4, s * (.6 + Math.random() * .4)]],
      color: Math.random() < .12 ? colors[5 + Math.floor(Math.random() * 2)] : colors[Math.floor(Math.random() * 5)]
    });
  }
  for (let i = 0; i < 10; i++) {
    const th = Math.random() * Math.PI * 2;
    parts.push({ dust: true, life: 1, s: 6 + Math.random() * 10,
      x: bx + Math.cos(th) * bt.b * R * .8, y: by + Math.sin(th) * bt.b * R * .75,
      vx: Math.cos(th) * (30 + Math.random() * 60), vy: -20 - Math.random() * 40 });
  }
  if (!partsRunning) { partsRunning = true; lastT = performance.now(); requestAnimationFrame(stepParts); }
}
function stepParts() {
  const t = performance.now();
  const dt = Math.max(0, Math.min(.05, (t - lastT) / 1000)); lastT = Math.max(lastT, t);
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.dust ? p.life > 0 : p.y < innerHeight + 40);
  for (const p of parts) {
    if (p.dust) {
      // fine dust hangs in the air, drifts and fades
      p.vx *= .96; p.vy = p.vy * .96 + 20 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.1;
      cctx.globalAlpha = Math.max(0, p.life) * .25; cctx.fillStyle = "#9aa0a6";
      cctx.beginPath(); cctx.arc(p.x, p.y, p.s * (1.6 - p.life * .6), 0, 7); cctx.fill();
      continue;
    }
    p.vy += 1900 * dt;    // gravity
    p.vx *= 1 - .9 * dt;  // air drag
    p.vr *= 1 - .4 * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    cctx.globalAlpha = 1;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
    cctx.fillStyle = p.color; cctx.strokeStyle = "rgba(60,64,67,.35)"; cctx.lineWidth = .8;
    cctx.beginPath(); p.shape.forEach(([x, y], k) => k ? cctx.lineTo(x, y) : cctx.moveTo(x, y)); cctx.closePath();
    cctx.fill(); cctx.stroke();
    cctx.restore();
  }
  cctx.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(stepParts);
  else { partsRunning = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
}
addEventListener("resize", () => { measure(); sizeCrumbs(); if (!hole.hidden) drawHole(); });
/* ---------- Sequence ---------- */
async function sequence(id) {
  const alive = () => id === run;
  age.classList.add("glitch");
  noise(.42, 2600, .45);
  await sleep(450); if (!alive()) return;
  age.hidden = true; age.classList.remove("glitch");

  block.hidden = false;
  block.classList.remove("slam"); void block.offsetWidth; block.classList.add("slam");
  thud();
  errorBuzz();
  await sleep(1500); if (!alive()) return;

  measure(); sizeCrumbs(); planBites(); holeScale = 1;
  hole.hidden = false;
  for (const bt of bites) {
    crunch();
    shake(bt, bt.d ? 9 : 5);
    animateBite(bt, reduce ? 1 : 120).then(() => burst(bt));
    await sleep(190 + Math.random() * 110); if (!alive()) return;
  }
  await sleep(300); if (!alive()) return;
  nigel.classList.add("up");
  await sleep(700); if (!alive()) return;
  enter.hidden = false;
  enter.focus({ preventScroll: true });
}

// the newspaper waits under the error page: Nigel leaps out, then the hole tears open onto the paper
async function dive() {
  // only once Nigel has finished chewing and the button is showing
  if (hole.hidden || hole.dataset.diving || enter.hidden) return;
  hole.dataset.diving = "1";
  const id = run;
  enter.hidden = true;
  parts = []; cctx.clearRect(0, 0, innerWidth, innerHeight);

  world.hidden = false;
  if (!units.length) build();
  cur = 0; layout();
  paper.classList.remove("landed", "settle");
  paper.classList.add("below");
  cutBlock = true; drawHole();

  nigel.style.transition = "transform .5s cubic-bezier(.3, 0, .2, 1), opacity .42s ease-in";
  nigel.style.transform = "translate(-50%, -62%) scale(2.4)";
  nigel.style.opacity = "0";
  hole.style.transition = "opacity .35s ease";
  hole.style.opacity = "0";
  await sleep(200); if (id !== run) return;

  rustle();
  noise(.55, 1500, .35);
  void paper.offsetWidth;
  paper.classList.add("settle");
  paper.classList.remove("below");
  const to = Math.hypot(innerWidth, innerHeight) / (R * .55);
  const dur = reduce ? 1 : 900, t0 = performance.now();
  await new Promise(done => {
    (function frame() {
      const t = performance.now();
      const p = Math.min(1, Math.max(0, (t - t0) / dur));
      const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      holeScale = 1 + (to - 1) * e; drawHole();
      p < 1 ? requestAnimationFrame(frame) : done();
    })();
  });
  if (id !== run) return;
  block.hidden = true;
  showWorld(true);
  resetHole();
}
hole.addEventListener("click", dive);
hole.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dive(); } });
enter.addEventListener("click", dive);

function resetHole() {
  holeScale = 1; bites = [];
  cutBlock = false;
  block.style.transform = ""; block.style.clipPath = "";
  hole.hidden = true;
  delete hole.dataset.diving;
  hole.style.cssText = "";
  nigel.classList.remove("up");
  nigel.style.transform = ""; nigel.style.opacity = ""; nigel.style.transition = "";
  paper.classList.remove("below", "settle");
  measure();
}

function showWorld(fromDive = false) {
  world.hidden = false;
  if (!units.length) build();
  if (!fromDive) {
    cur = 0; layout();
    paper.classList.remove("landed"); void paper.offsetWidth; paper.classList.add("landed");
    setTimeout(thud, reduce ? 0 : 420);
  }
  controls.hidden = true;
  dock.prepend(soundBtn);
}

skip.addEventListener("click", () => {
  run++;
  age.hidden = true; block.hidden = true; enter.hidden = true;
  resetHole();
  showWorld();
});

$("copy-ca").addEventListener("click", async e => {
  const btn = e.currentTarget, text = $("ca").textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
  catch {
    const sel = getSelection(), range = document.createRange();
    range.selectNodeContents($("ca")); sel.removeAllRanges(); sel.addRange(range);
    btn.textContent = "Selected";
  }
  setTimeout(() => (btn.textContent = "Copy"), 1600);
});

/* ---------- The paper: open spread on wide screens, single sheets on narrow ---------- */
const pageEls = [...document.querySelectorAll("#pages > .page")];

const wideMQ = matchMedia("(min-width: 900px) and (min-aspect-ratio: 5/4)");
let wide = false, cur = 0, units = [];
const moving = new Set();
const CRUMPLE_VARIANTS = 6;
const crumples = [];
let faceCount = 0;

function mkFace(page, cls) {
  const f = document.createElement("div");
  f.className = "face " + cls;
  if (page) f.appendChild(page);
  const c = document.createElement("div");
  c.className = "crumple";
  c.dataset.v = faceCount++ % CRUMPLE_VARIANTS;
  if (crumples[c.dataset.v]) c.style.backgroundImage = `url(${crumples[c.dataset.v]})`;
  // single pages scroll, so their creases live inside the page and move with the print
  (page && !wide ? page : f).appendChild(c);
  return f;
}
function maxCur() { return wide ? units.length : units.length - 1; }
function currentPage() { return units.length ? (wide ? cur * 2 : cur) : 0; }

function build() {
  const pageIdx = currentPage();
  wide = wideMQ.matches;
  const frag = document.createDocumentFragment();
  units = [];
  document.querySelectorAll(".page > .crumple").forEach(c => c.remove());
  if (wide) {
    const L = document.createElement("div"); L.className = "half left";
    L.appendChild(mkFace(pageEls[0], "l"));
    const R = document.createElement("div"); R.className = "half right";
    R.appendChild(mkFace(pageEls[pageEls.length - 1], "r"));
    frag.append(L, R);
    for (let i = 1; i < pageEls.length - 1; i += 2) {
      const leaf = document.createElement("div"); leaf.className = "leaf";
      leaf.append(mkFace(pageEls[i], "front r"), mkFace(pageEls[i + 1], "back l"));
      units.push(leaf); frag.appendChild(leaf);
    }
    cur = Math.floor(pageIdx / 2);
  } else {
    pageEls.forEach(p => {
      const s = document.createElement("div"); s.className = "sheet";
      s.append(mkFace(p, "front"), mkFace(null, "back blank"));
      units.push(s); frag.appendChild(s);
    });
    cur = pageIdx;
  }
  moving.clear();
  paper.replaceChildren(frag);
  paper.classList.toggle("wide", wide);
  layout();
}

function visibleFaces() {
  if (wide) {
    const left = cur === 0 ? paper.querySelector(".half.left .face") : units[cur - 1].querySelector(".back");
    const right = cur === units.length ? paper.querySelector(".half.right .face") : units[cur].querySelector(".front");
    return [left, right];
  }
  return [units[cur].querySelector(".front")];
}

function zFor(k) {
  if (wide) return k < cur ? 10 + k : 10 + units.length - k;
  return k < cur ? 100 + k : units.length - k;
}

function layout() {
  units.forEach((u, k) => {
    u.classList.toggle("flipped", k < cur);
    if (!moving.has(u)) u.style.zIndex = zFor(k);
  });
  const vis = visibleFaces();
  paper.querySelectorAll(".face").forEach(f => (f.inert = !vis.includes(f)));
  const total = pageEls.length;
  $("pageno").textContent = wide ? `Pages ${cur * 2 + 1}–${cur * 2 + 2} of ${total}` : `Page ${cur + 1} of ${total}`;
  $("prev").disabled = cur === 0;
  $("next").disabled = cur === maxCur();
}

function turn(dir) {
  const n = Math.max(0, Math.min(maxCur(), cur + dir));
  if (n === cur) return;
  const u = units[dir > 0 ? cur : cur - 1];
  moving.add(u); u.style.zIndex = 500;
  cur = n; layout(); rustle(dir);
  visibleFaces().forEach(f => { const pg = f.querySelector(".page"); if (pg) pg.scrollTop = 0; });
  setTimeout(() => { moving.delete(u); layout(); }, reduce ? 0 : 1150);
}
async function goto(pageIdx) {
  const target = wide ? Math.floor(pageIdx / 2) : pageIdx;
  while (cur !== target) { turn(target > cur ? 1 : -1); await sleep(200); }
}

$("next").addEventListener("click", () => turn(1));
$("prev").addEventListener("click", () => turn(-1));
document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => goto(+b.dataset.goto)));
addEventListener("keydown", e => {
  if (world.hidden) return;
  if (e.key === "ArrowRight") turn(1);
  if (e.key === "ArrowLeft") turn(-1);
});
let sx = 0, sy = 0;
paper.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
paper.addEventListener("pointerup", e => {
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) return turn(dx < 0 ? 1 : -1);
  // a plain click turns the page: right half forward, left half back (links and buttons still work)
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && !e.target.closest("a, button")) turn(e.clientX > innerWidth / 2 ? 1 : -1);
});
paper.addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse") return;
  const fwd = e.clientX > innerWidth / 2;
  paper.style.cursor = e.target.closest("a, button") ? "" : fwd ? (cur < maxCur() ? "e-resize" : "") : (cur > 0 ? "w-resize" : "");
});
wideMQ.addEventListener("change", build);

/* ---------- Crumpled paper texture ---------- */
function makeCrumple(seed) {
  const S = 1024;
  const c = document.createElement("canvas"); c.width = c.height = S;
  const g = c.getContext("2d");
  let s = seed % 2147483647 || 1;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = "rgb(128,128,128)"; g.fillRect(0, 0, S, S);

  // broad facets: the paper isn't lying flat
  for (let i = 0; i < 34; i++) {
    const n = 3 + Math.floor(rnd() * 3), cx = rnd() * S, cy = rnd() * S, r = 140 + rnd() * 380;
    g.beginPath();
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2 + rnd() * .9;
      g.lineTo(cx + Math.cos(a) * r * (.5 + rnd() * .7), cy + Math.sin(a) * r * (.5 + rnd() * .7));
    }
    g.closePath();
    g.fillStyle = rnd() < .5 ? `rgba(0,0,0,${.03 + rnd() * .06})` : `rgba(255,255,255,${.04 + rnd() * .07})`;
    g.fill();
  }

  // light falling across the sheet, and uneven ageing of the paper
  {
    const lg = g.createLinearGradient(0, 0, S, S);
    lg.addColorStop(0, "rgba(255,255,255,.08)");
    lg.addColorStop(.55, "rgba(255,255,255,0)");
    lg.addColorStop(1, "rgba(0,0,0,.09)");
    g.fillStyle = lg; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 18; i++) {
      const x = rnd() * S, y = rnd() * S, r = 80 + rnd() * 260;
      const rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(120,85,35,${.04 + rnd() * .06})`);
      rg.addColorStop(1, "rgba(120,85,35,0)");
      g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  // show-through: faint print from the other side of the sheet
  {
    const gc = document.createElement("canvas"); gc.width = gc.height = S;
    const gg = gc.getContext("2d");
    gg.fillStyle = "rgba(0,0,0,.075)";
    gg.fillRect(60, 36, S - 120, 52);
    const cols = 3 + Math.floor(rnd() * 2), m = 56, cw = (S - m * 2) / cols;
    for (let ci = 0; ci < cols; ci++) {
      let y = 130 + rnd() * 90;
      if (rnd() < .4) { gg.fillRect(m + ci * cw + 12, y, cw - 24, 120 + rnd() * 160); y += 300; }
      while (y < S - 50) {
        if (rnd() < .06) { y += 26; continue; }
        const w = cw - 24 - (rnd() < .14 ? rnd() * cw * .5 : 0);
        gg.fillRect(m + ci * cw + 12, y, w, 4.5);
        y += 10.5;
      }
    }
    g.save(); g.filter = "blur(1.3px)"; g.globalAlpha = .9;
    g.translate(S, 0); g.scale(-1, 1);
    g.drawImage(gc, 0, 0);
    g.restore();
  }

  // a crease: sharp ridge, shadow on one side, light on the other
  function crease(x, y, ang, len, w, k, taper = true) {
    const o = document.createElement("canvas");
    o.width = Math.max(2, Math.ceil(len)); o.height = Math.max(2, Math.ceil(w * 2));
    const og = o.getContext("2d");
    const lg = og.createLinearGradient(0, 0, 0, w * 2);
    lg.addColorStop(0, "rgba(0,0,0,0)");
    lg.addColorStop(.38, `rgba(0,0,0,${k * .35})`);
    lg.addColorStop(.5, `rgba(0,0,0,${k})`);
    lg.addColorStop(.5, `rgba(255,255,255,${k * 1.15})`);
    lg.addColorStop(.62, `rgba(255,255,255,${k * .35})`);
    lg.addColorStop(1, "rgba(255,255,255,0)");
    og.fillStyle = lg; og.fillRect(0, 0, o.width, o.height);
    if (taper) {
      og.globalCompositeOperation = "destination-in";
      const tg = og.createLinearGradient(0, 0, o.width, 0);
      tg.addColorStop(0, "rgba(0,0,0,0)"); tg.addColorStop(.25, "#000"); tg.addColorStop(.75, "#000"); tg.addColorStop(1, "rgba(0,0,0,0)");
      og.fillStyle = tg; og.fillRect(0, 0, o.width, o.height);
    }
    g.save(); g.translate(x, y); g.rotate(ang); g.drawImage(o, -len / 2, -w); g.restore();
  }

  // main crease networks: chains of segments that bend and branch
  for (let i = 0; i < 16; i++) {
    let x = rnd() * S, y = rnd() * S, a = rnd() * Math.PI;
    const segs = 2 + Math.floor(rnd() * 4), k = .14 + rnd() * .22;
    for (let j = 0; j < segs; j++) {
      const len = 120 + rnd() * 380;
      const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
      crease((x + nx) / 2, (y + ny) / 2, a, len * 1.25, 10 + rnd() * 26, k * (.7 + rnd() * .5));
      if (rnd() < .45) crease(nx, ny, a + (rnd() - .5) * 2.2, 80 + rnd() * 200, 6 + rnd() * 14, k * .6);
      x = nx; y = ny; a += (rnd() - .5) * 1.3;
    }
  }
  // fine wrinkles
  for (let i = 0; i < 140; i++) {
    crease(rnd() * S, rnd() * S, rnd() * Math.PI, 30 + rnd() * 130, 3 + rnd() * 7, .05 + rnd() * .1);
  }
  // the paper's fold across the middle
  crease(S / 2, S / 2 + (rnd() - .5) * 8, (rnd() - .5) * .01, S * 1.1, 34, .42, false);
  crease(S / 2, S / 2 + 3, (rnd() - .5) * .01, S * 1.1, 6, .3, false);

  const out = document.createElement("canvas"); out.width = out.height = S;
  const og = out.getContext("2d");
  og.filter = "blur(0.7px)";
  og.drawImage(c, 0, 0);
  og.filter = "none";

  // paper fibres: short pale and dark strands pressed into the pulp
  for (let i = 0; i < 1100; i++) {
    const x = rnd() * S, y = rnd() * S, a = rnd() * Math.PI, len = 4 + rnd() * 16, bend = (rnd() - .5) * 6;
    og.beginPath();
    og.moveTo(x, y);
    og.quadraticCurveTo(x + Math.cos(a) * len / 2 - Math.sin(a) * bend, y + Math.sin(a) * len / 2 + Math.cos(a) * bend, x + Math.cos(a) * len, y + Math.sin(a) * len);
    og.lineWidth = .5 + rnd() * .8;
    og.strokeStyle = rnd() < .55 ? `rgba(255,255,255,${.22 + rnd() * .2})` : `rgba(40,28,10,${.15 + rnd() * .15})`;
    og.stroke();
  }
  // foxing: a few tiny brown age spots
  for (let i = 0; i < 26; i++) {
    const x = rnd() * S, y = rnd() * S, r = .8 + rnd() * 3.2;
    const rg = og.createRadialGradient(x, y, 0, x, y, r * 2);
    rg.addColorStop(0, `rgba(110,70,25,${.25 + rnd() * .25})`);
    rg.addColorStop(1, "rgba(110,70,25,0)");
    og.fillStyle = rg; og.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
  }
  // surface tooth: fine per-pixel grain
  const img = og.getImageData(0, 0, S, S), px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - .5) * 22;
    px[i] += n; px[i + 1] += n; px[i + 2] += n;
  }
  og.putImageData(img, 0, 0);
  return out.toDataURL("image/jpeg", .9);
}

function applyCrumples() {
  document.querySelectorAll(".crumple").forEach(el => {
    const url = crumples[el.dataset.v];
    if (url) el.style.backgroundImage = `url(${url})`;
  });
}
setTimeout(() => {
  for (let i = 0; i < CRUMPLE_VARIANTS; i++) {
    try { crumples[i] = makeCrumple(9973 * (i + 1) + 17); } catch (e) { console.warn("crumple texture failed", e); }
  }
  applyCrumples();
}, 200);

build();
measure();
