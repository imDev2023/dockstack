(() => {
  function support(s, x, w) {
    const l = x - w / 2, r = x + w / 2, under = [];
    if (r > s.deck[0] && l < s.deck[1]) under.push({ l: s.deck[0], r: s.deck[1], top: 0 });
    for (const c of s.stack) if (r > c.x - c.w / 2 && l < c.x + c.w / 2) under.push({ l: c.x - c.w / 2, r: c.x + c.w / 2, top: c.top });
    if (!under.length) return null;
    const top = Math.max(...under.map((u) => u.top)), at = under.filter((u) => u.top === top);
    return { top, lo: Math.max(l, Math.min(...at.map((u) => u.l))), hi: Math.min(r, Math.max(...at.map((u) => u.r))) };
  }
  function spot(s) {
    let best = null;
    for (let x = -4.6 + s.crateW / 2; x <= 0.6 - s.crateW / 2 + 1e-9; x += 0.05) {
      const sup = support(s, x, s.crateW);
      if (!sup || x < sup.lo + 0.3 || x > sup.hi - 0.3) continue;
      const cost = sup.top * 10 + Math.abs(x + 2.0) * 0.1;
      if (!best || cost < best.cost) best = { x, cost };
    }
    return best ? best.x : -2.0;
  }
  let target = null, forIndex = -1, lastBoat = null, lastTick = 0, boatV = 0;
  const id = setInterval(() => {
    const s = window.__game?.state; if (!s) return;
    if (s.phase === 'title') { dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); return; }
    if (false) { clearInterval(id); window.__botDone = true; return; }
    if (lastBoat !== null && s.tick > lastTick) boatV = (s.boatX - lastBoat) / (s.tick - lastTick);
    lastBoat = s.boatX; lastTick = s.tick;
    if (s.phase !== 'swing') return;
    if (forIndex !== s.index) { target = spot(s); forIndex = s.index; }
    const land = s.boatX + boatV * 34;
    const e1 = Math.abs(s.nextHookX - land - target), e2 = Math.abs(s.afterHookX - land - target);
    if (e1 <= e2 && e1 < 0.12) dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
  }, 6);
  return 'bot started';
})()
