'use client';
import { useEffect, useRef, useState } from 'react';

const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const lerp = (a, b, v) => a + (b - a) * v;
const smooth = n => { n = clamp(n); return n * n * (3 - 2 * n); };

const points = [];
for (let ring = 0; ring < 53; ring++) {
  const r = .08 + ring / 53 * .92, n = Math.round(40 + r * 150);
  for (let j = 0; j < n; j++) points.push({ r, a: j / n * Math.PI * 2, band: Math.min(3, Math.floor(ring / 13.25)) });
}

export default function Landing() {
  const canvasRef = useRef(null);
  const motionRef = useRef(null);
  const progressRef = useRef(null);
  const footerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!contactOpen) return;
    const close = e => { if (e.type === 'keydown' ? e.key === 'Escape' : !footerRef.current.contains(e.target)) setContactOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [contactOpen]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const slides = [...document.querySelectorAll('.slide')];
    const footer = document.querySelector('footer');
    let w = 1, h = 1, t = 0, isPaused = reduce.matches, frame = 0, last = 0, px = 0, py = 0, tx = 0, ty = 0, progress = 0, spread = 0, scrollPending = false;

    function size() {
      w = innerWidth; h = innerHeight;
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      updateScroll(); draw(0);
    }

    function updateScroll() {
      scrollPending = false;
      const y = scrollY, mid = slides[1].offsetTop, end = slides[2].offsetTop;
      progress = clamp(y < mid ? y / mid : 1 + (y - mid) / (end - mid), 0, 2);
      document.body.classList.toggle('past-opening', y > mid * .62);
      progressRef.current.style.transform = `scaleX(${clamp(y / (document.documentElement.scrollHeight - h))})`;
      slides.forEach((s, i) => {
        const local = (y - s.offsetTop) / h, c = s.querySelector('.slide-content');
        if (!reduce.matches) {
          c.style.opacity = i === 0 ? clamp(1 - local * 1.8) : clamp(Math.min((local + 1.1) * 2.2, (1 - local) * 2));
          c.style.transform = `translate3d(0,${clamp(-local, -1, 1) * 35}px,0) scale(${i === 0 ? 1 - clamp(local) * .06 : 1})`;
        }
      });
      if (isPaused) { spread = smooth(progress - 1); draw(0); }
    }

    function draw(dt) {
      t += dt; px += (tx - px) * .04; py += (ty - py) * .04;
      const reveal = smooth(progress), layer = smooth(progress - 1);
      spread += (layer - spread) * .07;
      ctx.clearRect(0, 0, w, h);
      // keep the field above the footer rule
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, footer.getBoundingClientRect().top - 12); ctx.clip();
      const mobile = w < 621;
      const slideY = s => (s.offsetTop - scrollY + s.offsetHeight - 245) / h;
      const mobileY = clamp(lerp(slideY(slides[1]), slideY(slides[2]), layer), .50, .95);
      let cx = lerp(w * .5, mobile ? w * .47 : w * .73, reveal), cy = lerp(h * .52, mobile ? h * mobileY : h * .51, reveal);
      let scale = lerp(Math.max(w * .57, h * .64), mobile ? w * .44 : Math.min(w * .24, h * .47), reveal);
      // layers state: fit the field (spans -.83..+1.18 x scale around cy) between the text/header and the footer rule
      const fin = slides[2], sb = fin.offsetTop + fin.offsetHeight - scrollY;
      const bottom = (mobile ? sb : h) - (fin.offsetHeight - footer.offsetTop) - 16, top = mobile ? sb - 420 : 100;
      const wide = w > 1100, fit = Math.min(scale, (bottom - top) / 2.01, wide ? w * .2 : Infinity);
      if (wide) cx = lerp(cx, w * .79, spread); // tags sit left of the field
      scale = lerp(scale, fit, spread); cy = lerp(cy, (top + bottom) / 2 - .175 * fit, spread);
      const rotation = -.34 + Math.sin(t * .14) * .12 + px * .13, co = Math.cos(rotation), si = Math.sin(rotation);
      for (const p of points) {
        const a = p.a + t * .035, r = p.r, ripple = Math.sin(a * 3 + r * 7 + t * .65) * .085 + Math.cos(a * 5 - r * 5 - t * .32) * .04, rr = r * (1 + ripple), x = Math.cos(a) * rr, z = Math.sin(a) * rr, elev = .27 * Math.sin(r * 5.4 - a * 1.5 + t * .24) + .1 * Math.cos(a * 3 + r * 9), xr = x * co - z * si, zr = x * si + z * co;
        const sx = cx + xr * scale * (1 - spread * .13) + px * 8, sy = cy + zr * scale * lerp(.77, .48, reveal) - elev * scale * (1 - spread * .65) + (p.band - 1.5) * spread * .36 * scale + py * 9;
        const centerDistance = Math.hypot((sx - w * .5) / (w * .32), (sy - h * .46) / (h * .38));
        const clearCenter = lerp(clamp((centerDistance - .55) * .9, .035, .42), 1, reveal);
        const alpha = (.28 + (zr + 1) * .16 + (1 - r) * .12) * clearCenter;
        const accent = p.band === 1 || Math.sin(a * 2 + r * 10 + t * .5) > .72;
        ctx.fillStyle = accent ? `rgba(166,78,45,${alpha})` : `rgba(58,64,52,${alpha})`;
        const dot = Math.max(.7, Math.min(1.4, scale / 250)) * (.78 + (zr + 1) * .13);
        ctx.fillRect(sx, sy, dot, dot);
      }
      ctx.restore();
    }

    function loop(now) {
      const dt = last ? Math.min((now - last) / 1000, .04) : 0; last = now; draw(dt);
      if (!isPaused && !document.hidden) frame = requestAnimationFrame(loop);
    }
    function start() { cancelAnimationFrame(frame); if (!isPaused && !document.hidden) { last = 0; frame = requestAnimationFrame(loop); } }
    function sync() { document.body.classList.toggle('motion-paused', isPaused); setPaused(isPaused); }

    const onScroll = () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } };
    const onMove = e => { tx = e.clientX / w - .5; ty = e.clientY / h - .5; };
    const onLeave = () => { tx = ty = 0; };
    const onToggle = () => { isPaused = !isPaused; sync(); start(); };
    const onReduce = e => { if (e.matches) { isPaused = true; sync(); start(); } updateScroll(); };
    const btn = motionRef.current;

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', size);
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', start);
    btn.addEventListener('click', onToggle);
    reduce.addEventListener('change', onReduce);
    size(); sync(); start();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', size);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', start);
      btn.removeEventListener('click', onToggle);
      reduce.removeEventListener('change', onReduce);
      document.body.classList.remove('past-opening', 'motion-paused');
    };
  }, []);

  return (
    <>
      <div className="background" aria-hidden="true"><canvas id="field" ref={canvasRef} /></div>
      <header id="header">
        <a className="brand" href="#opening" aria-label="GeoAce Studio home"><span className="brand-mark" aria-hidden="true" /><span>GeoAce<small>STUDIO</small></span></a>      </header>
      <main>
        <section className="slide opening" id="opening" aria-labelledby="brand-name">
          <div className="slide-content identity">
            <div className="hero-mark" role="img" aria-label="GeoAce logo" />
            <h1 id="brand-name">GeoAce</h1>
            <p className="studio-name">STUDIO PVT LTD</p>
            <p className="catchphrase">Connecting dots. Brewing new perspectives.</p>
          </div>
          <a className="scroll-cue" href="#idea"><span>SCROLL TO LOOK CLOSER</span><span className="scroll-line" aria-hidden="true" /></a>
        </section>
        <section className="slide idea" id="idea" aria-labelledby="idea-title">
          <div className="slide-content copy">
            <div className="eyebrow"><span aria-hidden="true">+</span> 01 / BEYOND THE SURFACE</div>
            <h2 id="idea-title">There’s more<br />to a <em>place.</em></h2>
            <p className="intro">Before the first line is drawn.<br />Before the first decision is made.</p>
            <a className="discover" href="#layers"><span className="button-symbol" aria-hidden="true">✳</span>Look a little deeper</a>
          </div>
          <div className="visual-caption"><span>SHIFT YOUR PERSPECTIVE</span><span aria-hidden="true">⌖</span></div>
        </section>
        <section className="slide layers" id="layers" aria-labelledby="layers-title">
          <div className="slide-content copy">
            <div className="eyebrow"><span aria-hidden="true">+</span> 02 / CONNECT THE LAYERS</div>
            <h2 id="layers-title">Different<br />perspectives.<br />A clearer <em>picture.</em></h2>
            <p className="explanation">Connecting people across architecture, engineering and technology—bringing their knowledge, questions and experiences into a shared conversation.</p>
          </div>
          <div className="layer-tags" aria-hidden="true"><span>ARCHITECTURE</span><span>ENGINEERING</span><span>TECHNOLOGY</span></div>
          <footer ref={footerRef}>
            <p>It all starts with a conversation. <button type="button" className="contact-btn" aria-expanded={contactOpen} aria-controls="contact-menu" onClick={() => setContactOpen(o => !o)}>Get in touch?</button></p>
            <span>GeoAce Studio Pvt Ltd</span>
            {contactOpen && (
              <div className="contact-menu" id="contact-menu" role="group" aria-label="Contact options">
                <a href="mailto:contact@geoacestudio.com"><small>MAIL</small><strong>contact@geoacestudio.com</strong></a>
                <a href="tel:+917676460252"><small>CALL</small><strong>+91 7676460252</strong></a>
                <a href="https://wa.me/917676460252" target="_blank" rel="noopener noreferrer"><small>WHATSAPP</small><strong>wa.me/917676460252</strong></a>
              </div>
            )}
          </footer>
        </section>
      </main>
      <div className="page-controls">
        <button id="motion" ref={motionRef} aria-label={paused ? 'Resume animation' : 'Pause animation'} aria-pressed={paused}>
          <span id="motion-icon" aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
          <span id="motion-label">{paused ? 'Motion off' : 'Motion on'}</span>
        </button>
      </div>
      <div className="progress" aria-hidden="true"><span id="progress-bar" ref={progressRef} /></div>
    </>
  );
}
