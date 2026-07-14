/* The Commit Window diagram — shared by index.html (embedded) and duel.html (full-screen).
   window.initCommitWindow(cfg) — cfg: { svg, capH, capP, dots, prev, next, avg, elite,
   keyboard: bool, deepLink: bool, finalNote: string } */
(function () {
'use strict';
const svgNS = 'http://www.w3.org/2000/svg';

const MODES = {
  avg:   { commit: 420, leak: 130, N: 2, label: 'AVERAGE' },
  elite: { commit: 560, leak: 0,   N: 4, label: 'ELITE' },
};
// the same four decisions the "Jump the move" game uses
const OPTIONS = ['drive left', 'pull-up', 'drive right', 'pass'];
const BASE = 180, BITMS = 100, CLOSE = 100, DEAD = 850;

const BEATS = [
  { h: 'Two players. One clock. Both reading the future.',
    p: 'Above the line: the offense. Below: the defense. Picture a point guard sizing up his defender at the top of the key — the whole duel happens in under a second.',
    op: { off: 1, def: 1, brk: 0.25, refan: 0.25, verdict: 1 } },
  { h: '1 · The anticipation window',
    p: 'Before the commit, the offense is downloading cues — piecing together a prediction. A hitter reads the pitcher\'s grip and release point, not the ball in flight; a keeper reads the striker\'s hips before the boot swings. Better players stare further, and more accurately, into the future — the biggest reason time "slows down" for the elite.',
    op: { off: 1, def: 0.18, brk: 0.12, refan: 0.12, verdict: 0.15 } },
  { h: '2 · The defense is running the same loop',
    p: 'They anticipate too — and they hide their own tells. A weak-side defender about to jump the passing lane doesn\'t turn his shoulders; his eyes stay on the midline. Cat and mouse: each side gathering information while revealing none.',
    op: { off: 0.18, def: 1, brk: 0.4, refan: 0.12, verdict: 0.5 } },
  { h: '3 · All disguise is, is possibility',
    p: 'Chris Paul commits later, leaks nothing, and keeps the drive, the pull-up, and the pocket pass all alive — and Hick\'s law bills the defender for every live option. Watch the window of certainty collapse. (This beat switches the diagram from average to elite.)',
    op: { off: 1, def: 1, brk: 1, refan: 0.15, verdict: 1 }, toElite: true },
  { h: '4 · The window repeats',
    p: 'The commit isn\'t the end. The drive becomes a step-back; the step-back becomes a lob. A good player carries more routes out of every route — the duel resets at full speed, over and over until the play dies.',
    op: { off: 1, def: 0.35, brk: 0.2, refan: 1, verdict: 0.3 } },
  { h: 'Maximize the information you gather. Minimize the information you reveal.',
    p: 'That duality is the whole duel — in every dynamic game, at every moment. Anticipation isn\'t just seeing the future early. It\'s making yours unreadable while you read theirs.',
    op: { off: 1, def: 1, brk: 1, refan: 0.7, verdict: 1 } },
];

window.initCommitWindow = function (cfg) {
  const scene = cfg.svg;
  let mode = 'avg', P = Object.assign({}, MODES.avg), beat = 0, lerpAnim = null;

  function el(tag, attrs, parent) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    (parent || scene).appendChild(n); return n;
  }
  function txt(x, y, s, attrs, parent) {
    const t = el('text', Object.assign({ x, y, fill: 'var(--ink-2)', 'font-size': 20 }, attrs), parent);
    t.textContent = s; return t;
  }

  const X = t => 140 + 1320 * (t / 1000);
  const yO = 260, yD = 640, CONE = 118;

  function draw() {
    scene.innerHTML = '';
    const op = BEATS[beat].op;
    const readable = Math.max(0, P.commit - P.leak);
    const decide = BASE + BITMS * Math.log2(P.N + 1);
    const tDef = readable + decide;
    const finish = tDef + CLOSE;
    const beaten = finish > DEAD;

    for (let t = 0; t <= 1000; t += 250) {
      el('line', {x1: X(t), y1: 90, x2: X(t), y2: 810, stroke: 'var(--grid)', 'stroke-width': 1});
      txt(X(t), 845, t + ' ms', {'font-size': 17, fill: 'var(--muted)', 'text-anchor': 'middle'});
    }
    el('line', {x1: 100, y1: 450, x2: 1500, y2: 450, stroke: '#383835', 'stroke-width': 1});
    el('line', {x1: X(DEAD), y1: 70, x2: X(DEAD), y2: 815, stroke: 'var(--ink-2)', 'stroke-width': 2});
    txt(X(DEAD), 52, 'THE PLAY ARRIVES', {'font-size': 19, 'font-weight': 700, fill: 'var(--ink)', 'text-anchor': 'middle', 'letter-spacing': '2'});

    /* ---------- OFFENSE ---------- */
    const gOff = el('g', {opacity: op.off});
    el('circle', {cx: 108, cy: yO, r: 13, fill: 'var(--blue)'}, gOff);
    txt(108, yO - 28, 'OFFENSE', {'font-size': 19, 'font-weight': 700, fill: 'var(--blue)', 'text-anchor': 'middle', 'letter-spacing': '2'}, gOff);
    const ax = 128;
    el('path', {d: `M ${ax} ${yO} L ${X(P.commit)} ${yO - CONE} L ${X(P.commit)} ${yO + CONE} Z`,
                fill: 'rgba(57,135,229,0.10)', stroke: 'rgba(57,135,229,0.35)', 'stroke-width': 1.5}, gOff);
    for (let i = 0; i < P.N; i++) {
      const f = P.N === 1 ? 0 : (i / (P.N - 1)) * 2 - 1;
      const ey = yO + f * (CONE - 26);
      el('line', {x1: ax, y1: yO, x2: X(P.commit), y2: ey, stroke: 'var(--blue)', 'stroke-width': 2, opacity: 0.5}, gOff);
      txt(X(P.commit) - 12, ey + (f <= 0 ? -8 : 18), OPTIONS[i],
          {'font-size': 16, fill: 'var(--ink-2)', 'text-anchor': 'end', opacity: 0.9}, gOff);
    }
    txt((ax + X(P.commit)) / 2, yO - CONE - 16, 'READING THE FUTURE — ' + P.N + ' LIVE OPTION' + (P.N > 1 ? 'S' : ''),
        {'font-size': 18, fill: 'var(--ink-2)', 'text-anchor': 'middle', 'letter-spacing': '1.5'}, gOff);
    if (P.leak > 2) {
      el('line', {x1: X(readable), y1: yO + CONE + 12, x2: X(P.commit), y2: yO + CONE + 12,
                  stroke: '#d95926', 'stroke-width': 3, 'stroke-dasharray': '7 6'}, gOff);
      txt((X(readable) + X(P.commit)) / 2, yO + CONE + 40, 'cues leaking — eyes on the lane, shoulders turned',
          {'font-size': 16.5, fill: '#d95926', 'text-anchor': 'middle'}, gOff);
    }
    el('line', {x1: X(P.commit), y1: yO - CONE - 6, x2: X(P.commit), y2: yO + CONE + 6, stroke: 'var(--ink)', 'stroke-width': 3.5}, gOff);
    txt(X(P.commit), yO - CONE - 44, 'COMMIT', {'font-size': 19, 'font-weight': 750, fill: 'var(--ink)', 'text-anchor': 'middle', 'letter-spacing': '2'}, gOff);
    el('line', {x1: X(P.commit), y1: yO, x2: X(DEAD) - 6, y2: yO, stroke: 'var(--blue)', 'stroke-width': 5, 'stroke-linecap': 'round'}, gOff);
    el('path', {d: `M ${X(DEAD) - 2} ${yO} l -20 -9 l 5 9 l -5 9 z`, fill: 'var(--blue)'}, gOff);
    txt(X(P.commit) + 16, yO - 16, 'the move: ' + OPTIONS[P.N - 1], {'font-size': 16, fill: 'var(--ink-2)'}, gOff);

    const gRefan = el('g', {opacity: op.refan});
    const rfX = X(P.commit + (DEAD - P.commit) * 0.45);
    [-34, -17, 8].forEach(ang => {
      const r = ang * Math.PI / 180;
      el('line', {x1: rfX, y1: yO, x2: rfX + 130 * Math.cos(r), y2: yO + 130 * Math.sin(r),
                  stroke: 'var(--blue)', 'stroke-width': 2, opacity: 0.55, 'stroke-dasharray': '6 5'}, gRefan);
    });
    txt(rfX + 10, yO - 52, 'step-back? lob? — the window repeats', {'font-size': 16.5, fill: 'var(--ink-2)'}, gRefan);

    /* ---------- DEFENSE ---------- */
    const gDef = el('g', {opacity: op.def});
    el('circle', {cx: 108, cy: yD, r: 13, fill: '#d95926'}, gDef);
    txt(108, yD + 42, 'DEFENSE', {'font-size': 19, 'font-weight': 700, fill: '#d95926', 'text-anchor': 'middle', 'letter-spacing': '2'}, gDef);
    const dEnd = Math.min(tDef, 1000);
    el('path', {d: `M ${ax} ${yD} L ${X(dEnd)} ${yD - CONE} L ${X(dEnd)} ${yD + CONE} Z`,
                fill: 'rgba(217,89,38,0.10)', stroke: 'rgba(217,89,38,0.35)', 'stroke-width': 1.5}, gDef);
    for (let i = 0; i < 4; i++) {
      const f = (i / 3) * 2 - 1;
      el('line', {x1: ax, y1: yD, x2: X(dEnd), y2: yD + f * (CONE - 26),
                  stroke: '#d95926', 'stroke-width': 2, opacity: 0.4}, gDef);
    }
    txt((ax + X(readable)) / 2, yD + CONE + 34, 'COVERING EVERY FUTURE — AND HIDING THEIR OWN',
        {'font-size': 17, fill: 'var(--ink-2)', 'text-anchor': 'middle', 'letter-spacing': '1'}, gDef);
    el('line', {x1: X(readable), y1: yD - CONE - 6, x2: X(readable), y2: yD + CONE + 6, stroke: 'var(--ink-2)', 'stroke-width': 2, 'stroke-dasharray': '5 4'}, gDef);
    txt(X(readable), yD - CONE - 18, 'sees intent', {'font-size': 16.5, fill: 'var(--ink-2)', 'text-anchor': 'middle'}, gDef);
    const barY = yD - CONE - 58;
    const tDefC = Math.min(tDef, 990);
    el('rect', {x: X(readable), y: barY, width: Math.max(0, X(tDefC) - X(readable) - 2), height: 20, rx: 4, fill: 'var(--yellow)'}, gDef);
    txt((X(readable) + X(tDefC)) / 2, barY - 10, 'DECIDE — Hick’s law: ' + Math.round(decide) + ' ms for ' + P.N + ' option' + (P.N > 1 ? 's' : ''),
        {'font-size': 16.5, fill: 'var(--ink-2)', 'text-anchor': 'middle'}, gDef);
    if (finish <= 1000) el('rect', {x: X(tDefC), y: barY, width: Math.max(0, X(finish) - X(tDefC) - 2), height: 20, rx: 4, fill: 'var(--violet)'}, gDef);
    el('line', {x1: X(tDefC), y1: yD - CONE - 6, x2: X(tDefC), y2: yD + CONE + 6, stroke: 'var(--ink)', 'stroke-width': 3.5}, gDef);
    const cfEnd = tDefC > 800;
    txt(X(tDefC) + (cfEnd ? -12 : 12), yD + 34, 'COMMIT (forced)',
        {'font-size': 17, 'font-weight': 700, fill: 'var(--ink)', 'text-anchor': cfEnd ? 'end' : 'start'}, gDef);
    if (!beaten) {
      el('line', {x1: X(tDefC), y1: yD, x2: X(DEAD) - 4, y2: yO + 46,
                  stroke: '#d95926', 'stroke-width': 5, 'stroke-linecap': 'round'}, gDef);
    } else {
      el('line', {x1: X(tDefC), y1: yD, x2: X(tDefC) + 85, y2: yD - 85,
                  stroke: '#d95926', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '10 8'}, gDef);
    }

    const gV = el('g', {opacity: op.verdict});
    const vy = beaten ? 350 : yO + 46;
    el('circle', {cx: X(DEAD), cy: vy, r: 15, fill: beaten ? 'var(--critical)' : 'var(--good)'}, gV);
    txt(X(DEAD), vy + 7, beaten ? '✕' : '✓', {'font-size': 20, 'font-weight': 800, fill: '#fff', 'text-anchor': 'middle'}, gV);
    if (beaten) txt(X(DEAD) - 26, vy + 7, 'BEATEN — DEFENSE IS ' + Math.round(finish - DEAD) + ' ms LATE',
        {'font-size': 18, 'font-weight': 750, fill: 'var(--critical)', 'text-anchor': 'end'}, gV);
    else txt(X(DEAD) + 26, vy + 7, 'IN POSITION — ' + Math.round(DEAD - finish) + ' ms TO SPARE',
        {'font-size': 17, 'font-weight': 750, fill: 'var(--good)'}, gV);

    const gB = el('g', {opacity: op.brk});
    const by = 790;
    el('path', {d: `M ${X(readable)} ${by - 10} L ${X(readable)} ${by} L ${X(DEAD)} ${by} L ${X(DEAD)} ${by - 10}`,
                fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2}, gB);
    txt((X(readable) + X(DEAD)) / 2, by - 16, 'THE DEFENSE’S WINDOW OF CERTAINTY: ' + Math.max(0, Math.round(DEAD - readable)) + ' ms',
        {'font-size': 18, 'font-weight': 700, fill: 'var(--ink)', 'text-anchor': 'middle', 'letter-spacing': '1'}, gB);

    txt(1490, 100, (P.label || MODES[mode].label) + ' PLAYER', {'font-size': 18, 'font-weight': 750, fill: 'var(--muted)', 'text-anchor': 'end', 'letter-spacing': '2'});
  }

  function setMode(m, animate) {
    mode = m;
    if (cfg.avg) cfg.avg.classList.toggle('on', m === 'avg');
    if (cfg.elite) cfg.elite.classList.toggle('on', m === 'elite');
    const from = Object.assign({}, P), to = MODES[m];
    cancelAnimationFrame(lerpAnim);
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      P = Object.assign({}, to); draw(); return;
    }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const u = Math.min(1, (now - t0) / dur), e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      P = {
        commit: from.commit + (to.commit - from.commit) * e,
        leak: from.leak + (to.leak - from.leak) * e,
        N: Math.round(from.N + (to.N - from.N) * e),
        label: to.label,
      };
      draw();
      if (u < 1) lerpAnim = requestAnimationFrame(step);
    };
    lerpAnim = requestAnimationFrame(step);
  }

  if (cfg.dots) BEATS.forEach(() => cfg.dots.appendChild(document.createElement('i')));
  function setBeat(b) {
    beat = Math.max(0, Math.min(BEATS.length - 1, b));
    if (cfg.dots) [...cfg.dots.children].forEach((d, i) => d.classList.toggle('on', i === beat));
    cfg.capH.textContent = BEATS[beat].h;
    cfg.capP.textContent = BEATS[beat].p + (beat === BEATS.length - 1 && cfg.finalNote ? ' ' + cfg.finalNote : '');
    if (BEATS[beat].toElite && mode !== 'elite') setMode('elite', true);
    else draw();
    cfg.next.textContent = beat === BEATS.length - 1 ? 'Start over' : 'Next beat →';
  }
  cfg.next.addEventListener('click', () => {
    if (beat === BEATS.length - 1) { setMode('avg', false); setBeat(0); }
    else setBeat(beat + 1);
  });
  cfg.prev.addEventListener('click', () => setBeat(beat - 1));
  if (cfg.avg) cfg.avg.addEventListener('click', () => setMode('avg', true));
  if (cfg.elite) cfg.elite.addEventListener('click', () => setMode('elite', true));
  if (cfg.keyboard) {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); cfg.next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setBeat(beat - 1); }
      if (e.key === 'm' || e.key === 'M') setMode(mode === 'avg' ? 'elite' : 'avg', true);
    });
  }
  if (cfg.deepLink) {
    const q = new URLSearchParams(location.search);
    if (q.get('mode') && MODES[q.get('mode')]) setMode(q.get('mode'), false);
    setBeat(+(q.get('beat') || 0));
  } else setBeat(0);
  return { setBeat, setMode };
};
})();
