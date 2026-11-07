// Render one Dockstack run to an MP4 frame by frame, for posting on X.
//   cd tools && npm install
//   node render-video.mjs http://127.0.0.1:8000/ ../media/run.mp4 1920 1080
// Serve the game first (python3 -m http.server 8000 -d dist after ./deploy.sh).
// autoplay.js plays the run; TITLE_S and END_S set how long the title and end cards show.
// A 47 s run at 1080p takes about 7 minutes and about 1 GB of frames beside the output.
// The page's clock (requestAnimationFrame, performance.now and CSS animations) is
// replaced by a virtual one that advances exactly 1/60 s per captured frame, so the
// video is smooth however slow capture is. Every sound the game starts is logged on
// the same clock and mixed afterwards in an OfflineAudioContext with the game's own
// decoded buffers, so picture and sound line up exactly.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [url, outArg, W = 1920, H = 1080] = process.argv.slice(2);
const FPS = 60, STEP = 1000 / FPS;
const TITLE_S = Number(process.env.TITLE_S || 3), END_S = Number(process.env.END_S || 4.5), MAX_S = 110;
const out = path.resolve(outArg);
const tmp = out.replace(/\.mp4$/, '') + '-frames';
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
const page = await browser.newPage({ viewport: { width: +W, height: +H }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.addInitScript(() => {
  const realRAF = window.requestAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance);
  let virtual = false, vt = 0, queue = [];
  window.requestAnimationFrame = (cb) => (virtual ? queue.push(cb) : realRAF((t) => (virtual ? queue.push(cb) : cb(t))));
  performance.now = () => (virtual ? vt : realNow());
  const anims = new Map(); // CSS transitions and animations, started on the virtual clock
  const sounds = [];       // { buffer, rate, loop, t, gain, gains: [[t, value]] }
  const loops = [];
  window.__virtual = () => { vt = realNow(); virtual = true; window.__t0 = vt; };
  window.__step = (ms) => {
    vt += ms;
    const cbs = queue; queue = [];
    for (const cb of cbs) cb(vt);
    for (const a of document.getAnimations()) {
      if (!anims.has(a)) { anims.set(a, vt - ms); a.pause(); }
      a.currentTime = vt - anims.get(a);
    }
    for (const s of loops) { const g = s.node.__dest?.gain?.value ?? 1; if (g !== s.last) { s.gains.push([vt, g]); s.last = g; } }
  };
  const abUrl = new WeakMap();
  const ab = Response.prototype.arrayBuffer;
  Response.prototype.arrayBuffer = async function () { const b = await ab.call(this); abUrl.set(b, this.url); return b; };
  const decode = BaseAudioContext.prototype.decodeAudioData;
  BaseAudioContext.prototype.decodeAudioData = async function (data, ...rest) {
    const url = abUrl.get(data);
    const buf = await decode.call(this, data, ...rest);
    buf.__name = url ? url.split('/').pop() : null;
    return buf;
  };
  const connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest, ...rest) {
    if (this instanceof AudioBufferSourceNode) this.__dest = dest;
    return connect.call(this, dest, ...rest);
  };
  const start = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...a) {
    if (virtual && this.buffer) {
      const g = this.__dest?.gain?.value ?? 1;
      const s = { node: this, buffer: this.buffer, rate: this.playbackRate.value, loop: this.loop, t: vt, gains: [[vt, g]], last: g };
      sounds.push(s);
      if (this.loop) loops.push(s);
    }
    return start.apply(this, a);
  };
  // Mix everything logged since __virtual() into a 16-bit stereo WAV, as base64.
  window.__log = () => JSON.stringify({ t0: window.__t0, sounds: sounds.map((s) => ({ name: s.buffer.__name, rate: s.rate, loop: s.loop, t: s.t, gains: s.gains })) });
});

await page.goto(url);
await page.waitForFunction(() => window.__game?.state?.phase === 'title', null, { timeout: 60000 });
await page.waitForTimeout(1500);
await page.evaluate(() => window.__virtual());

const cdp = await page.context().newCDPSession(page);
let frame = 0, phaseDoneAt = null, botStarted = false;
const shot = async () => {
  if (process.env.NOSHOT) { frame++; return; }
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95 });
  writeFileSync(path.join(tmp, `f${String(frame).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
  frame++;
};
const bot = readFileSync(path.join(here, 'autoplay.js'), 'utf8');
for (;;) {
  const t = frame / FPS;
  if (!botStarted && t >= TITLE_S) { await page.evaluate(bot); botStarted = true; }
  if (botStarted) await page.waitForTimeout(14); // the bot polls every 6 ms, so it reads each frame's state at least twice
  await page.evaluate((ms) => window.__step(ms), STEP);
  await shot();
  if (phaseDoneAt === null && botStarted && (await page.evaluate(() => window.__game.state.phase)) === 'done') phaseDoneAt = t;
  if (phaseDoneAt !== null && t >= phaseDoneAt + END_S) break;
  if (t > MAX_S) throw new Error('run did not finish');
  if (frame % 600 === 0) console.error(`${t.toFixed(0)} s rendered`);
}
const seconds = frame / FPS;
const result = await page.evaluate(() => (({ placed, lost, score }) => ({ placed, lost, score }))(window.__game.state));
const log = JSON.parse(await page.evaluate(() => window.__log()));
await browser.close();
writeFileSync(path.join(tmp, 'sounds.json'), JSON.stringify(log));
// Mix: each sound from its MP3, at its pitch (rate), from its start, under its logged gain steps.
const AR = 48000, N = Math.ceil(seconds * AR), L = new Float32Array(N), R = new Float32Array(N);
const audioDir = new URL('assets/audio/', url);
const pcm = {};
for (const s of log.sounds) {
  if (!pcm[s.name]) {
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', audioDir.href + s.name, '-f', 'f32le', '-ac', '2', '-ar', String(AR), '-'], { maxBuffer: 1 << 30 });
    pcm[s.name] = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
  }
  const src = pcm[s.name], len = src.length / 2;
  const s0 = ((s.t - log.t0) / 1000) * AR;
  const gainAt = s.gains.map(([gt, v]) => [((gt - log.t0) / 1000) * AR, v]);
  let gi = 0;
  for (let i = Math.max(0, Math.floor(s0)); i < N; i++) {
    let pos = (i - s0) * s.rate;
    if (pos < 0) continue;
    if (s.loop) pos %= len; else if (pos >= len - 1) break;
    while (gi + 1 < gainAt.length && gainAt[gi + 1][0] <= i) gi++;
    const g = gainAt[gi][1], k = Math.floor(pos), f = pos - k, k2 = (k + 1) % len;
    L[i] += g * (src[2 * k] * (1 - f) + src[2 * k2] * f);
    R[i] += g * (src[2 * k + 1] * (1 - f) + src[2 * k2 + 1] * f);
  }
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(AR, 24); wav.writeUInt32LE(AR * 4, 28);
wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40);
const lim = (x) => Math.round(Math.max(-1, Math.min(1, x)) * 32767);
for (let i = 0; i < N; i++) { wav.writeInt16LE(lim(L[i]), 44 + i * 4); wav.writeInt16LE(lim(R[i]), 46 + i * 4); }
writeFileSync(path.join(tmp, 'audio.wav'), wav);
const mix = { sounds: log.sounds.length, peak };
if (process.env.NOSHOT) { console.log(JSON.stringify({ seconds, sounds: mix.sounds, peak, result, errors })); process.exit(0); }

execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', 'f%05d.jpg', '-i', 'audio.wav',
  '-map', '0:v', '-map', '1:a', '-vf', 'format=yuv420p',
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '17', '-g', '120',
  '-c:a', 'aac', '-b:a', '192k',
  '-af', `loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=${Math.max(0, seconds - 1.5).toFixed(2)}:d=1.5`, '-ar', '48000',
  '-shortest', '-movflags', '+faststart', out], { cwd: tmp });
console.log(JSON.stringify({ out, frames: frame, seconds: +seconds.toFixed(2), sounds: mix.sounds, peak: +mix.peak.toFixed(3), errors, result }));
