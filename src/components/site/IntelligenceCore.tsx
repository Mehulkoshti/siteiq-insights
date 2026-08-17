import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SITEIQ INTELLIGENCE CORE — conceptual brand visualization.
 * Purely decorative: it never displays audit data, scores or findings.
 */

type Category = "SEO" | "SECURITY" | "PERFORMANCE" | "ACCESSIBILITY" | "INFRASTRUCTURE";

export const CATEGORIES: Category[] = [
  "SEO",
  "SECURITY",
  "PERFORMANCE",
  "ACCESSIBILITY",
  "INFRASTRUCTURE",
];

const CATEGORY_COLOR: Record<Category, [number, number, number]> = {
  SEO: [37, 99, 235], // electric blue
  SECURITY: [6, 182, 212], // cyan
  PERFORMANCE: [7, 20, 38], // deep navy
  ACCESSIBILITY: [124, 58, 237], // violet (sparing)
  INFRASTRUCTURE: [30, 64, 150], // deep blue
};

type Shape = "dot" | "square" | "hex";

type Vec = { x: number; y: number; z: number };

type Particle = {
  cat: Category;
  shape: Shape;
  size: number;
  scatter: Vec;
  struct: Vec;
  stream: Vec;
  core: Vec;
  word: Vec;
  phase: number;
  pos: Vec;
};

const LOOP = 8.4; // seconds

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Sample points that form the SITEIQ wordmark. */
function sampleWord(count: number): Vec[] {
  if (typeof document === "undefined") return [];
  const w = 620;
  const h = 200;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 122px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("SITEIQ", w / 2, h / 2 - 14);
  ctx.font = "500 22px 'JetBrains Mono', monospace";
  ctx.fillText("WEBSITE INTELLIGENCE", w / 2, h / 2 + 62);
  const data = ctx.getImageData(0, 0, w, h).data;
  const hits: Vec[] = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        hits.push({ x: (x - w / 2) * 0.62, y: (y - h / 2) * 0.62, z: rand(-6, 6) });
      }
    }
  }
  const out: Vec[] = [];
  for (let i = 0; i < count; i++) out.push(hits[Math.floor(Math.random() * hits.length)] ?? { x: 0, y: 0, z: 0 });
  return out;
}

/** Abstract website blueprint: a main page plane plus satellite page planes. */
function structPoint(i: number, n: number): Vec {
  const r = i / n;
  if (r < 0.52) {
    // main page: stacked sections
    const rows = 6;
    const row = Math.floor(rand(0, rows));
    const yTop = -150;
    const y = yTop + row * 52 + rand(-10, 10);
    const width = row === 0 ? 230 : row === 1 ? 210 : 200;
    return { x: rand(-width / 2, width / 2), y, z: rand(-14, 14) };
  }
  if (r < 0.82) {
    // satellite pages orbiting behind/in front
    const k = Math.floor(rand(0, 4));
    const cx = [-190, 195, -160, 175][k];
    const cy = [-90, -40, 105, 130][k];
    const cz = [-130, -90, 120, 150][k];
    return { x: cx + rand(-52, 52), y: cy + rand(-38, 38), z: cz + rand(-18, 18) };
  }
  // ambient structural signals
  const a = rand(0, Math.PI * 2);
  const rr = rand(150, 300);
  return { x: Math.cos(a) * rr, y: rand(-190, 200), z: Math.sin(a) * rr };
}

function streamPoint(cat: Category): Vec {
  const idx = CATEGORIES.indexOf(cat);
  const a = (idx / CATEGORIES.length) * Math.PI * 2;
  const r = rand(90, 250);
  const spin = a + r * 0.012;
  return { x: Math.cos(spin) * r, y: rand(-1, 1) * r * 0.35 + (idx - 2) * 22, z: Math.sin(spin) * r };
}

function corePoint(i: number, n: number): Vec {
  const y = 1 - (i / Math.max(1, n - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = i * 2.399963;
  const R = 62 + rand(-4, 10);
  return { x: Math.cos(theta) * radius * R, y: y * R, z: Math.sin(theta) * radius * R };
}

export function IntelligenceCore({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const hovered = useRef<Category | null>(null);
  const [hoverLabel, setHoverLabel] = useState<Category | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    hovered.current = hoverLabel;
  }, [hoverLabel]);

  const isTouch = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    const mobile = window.innerWidth < 768;
    const COUNT = prefersReduced ? 520 : mobile ? 420 : 1100;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

    const word = sampleWord(COUNT);
    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => {
      const cat = CATEGORIES[i % CATEGORIES.length];
      const shape: Shape = i % 11 === 0 ? "hex" : i % 4 === 0 ? "square" : "dot";
      const a = rand(0, Math.PI * 2);
      const b = Math.acos(rand(-1, 1));
      const r = rand(180, 340);
      return {
        cat,
        shape,
        size: shape === "dot" ? rand(0.9, 2.1) : rand(1.6, 2.8),
        scatter: {
          x: Math.sin(b) * Math.cos(a) * r,
          y: Math.sin(b) * Math.sin(a) * r * 0.8,
          z: Math.cos(b) * r,
        },
        struct: structPoint(i, COUNT),
        stream: streamPoint(cat),
        core: corePoint(i, COUNT),
        word: word[i] ?? { x: 0, y: 0, z: 0 },
        phase: rand(0, Math.PI * 2),
        pos: { x: 0, y: 0, z: 0 },
      };
    });

    // Precomputed link pairs between nearby structural nodes.
    const links: [number, number][] = [];
    for (let i = 0; i < particles.length; i += 3) {
      for (let j = i + 3; j < Math.min(i + 60, particles.length); j += 7) {
        const a = particles[i].struct;
        const b = particles[j].struct;
        const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
        if (d < 3400) links.push([i, j]);
        if (links.length > (mobile ? 130 : 380)) break;
      }
      if (links.length > (mobile ? 130 : 380)) break;
    }

    let W = 0;
    let H = 0;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = wrap.getBoundingClientRect();
      mouse.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (!isTouch && !prefersReduced) window.addEventListener("pointermove", onMove);

    const DIST = 620;
    const project = (p: Vec, yaw: number, pitch: number) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const x1 = p.x * cy - p.z * sy;
      const z1 = p.x * sy + p.z * cy;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y1 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      const f = (DIST * Math.min(W, H)) / 620 / (z2 + DIST);
      return { x: W / 2 + x1 * f, y: H / 2 + y1 * f, depth: z2, f };
    };

    let raf = 0;
    const start = performance.now();

    const draw = (nowMs: number) => {
      const elapsed = prefersReduced ? 2.4 : ((nowMs - start) / 1000) % LOOP;
      const t = elapsed;

      // stage progressions
      const assemble = easeInOut(seg(t, 0.2, 1.9)); // scatter -> structure
      const scan = seg(t, 2.4, 4.1);
      const toStream = easeInOut(seg(t, 4.1, 5.0));
      const toCore = easeInOut(seg(t, 5.0, 5.9));
      const toWord = easeInOut(seg(t, 6.2, 7.0));
      const disperse = easeInOut(seg(t, 7.9, LOOP));

      mouse.current.x = lerp(mouse.current.x, mouse.current.tx, 0.05);
      mouse.current.y = lerp(mouse.current.y, mouse.current.ty, 0.05);

      const yaw = (prefersReduced ? 0.5 : t * 0.16) + mouse.current.x * 0.16;
      const pitch = -0.12 + mouse.current.y * 0.1;

      ctx.clearRect(0, 0, W, H);

      const scanY = lerp(-230, 230, scan);
      const hoverCat = hovered.current;

      // resolve positions
      for (const p of particles) {
        let x = lerp(p.scatter.x, p.struct.x, assemble);
        let y = lerp(p.scatter.y, p.struct.y, assemble);
        let z = lerp(p.scatter.z, p.struct.z, assemble);

        if (toStream > 0) {
          x = lerp(x, p.stream.x, toStream);
          y = lerp(y, p.stream.y, toStream);
          z = lerp(z, p.stream.z, toStream);
        }
        if (toCore > 0) {
          x = lerp(x, p.core.x, toCore);
          y = lerp(y, p.core.y, toCore);
          z = lerp(z, p.core.z, toCore);
        }
        if (toWord > 0) {
          x = lerp(x, p.word.x, toWord);
          y = lerp(y, p.word.y, toWord);
          z = lerp(z, p.word.z, toWord);
        }
        if (disperse > 0) {
          x = lerp(x, p.scatter.x, disperse);
          y = lerp(y, p.scatter.y, disperse);
          z = lerp(z, p.scatter.z, disperse);
        }
        const drift = prefersReduced ? 0 : Math.sin(t * 1.1 + p.phase) * 2.2 * (1 - toWord);
        p.pos = { x, y: y + drift, z };
      }

      // connection lines (structure / scan stages)
      const linkAlpha = Math.min(assemble, 1) * (1 - Math.max(toStream, toWord)) * 0.5;
      if (linkAlpha > 0.02) {
        ctx.lineWidth = 0.7;
        for (const [i, j] of links) {
          const a = project(particles[i].pos, yaw, pitch);
          const b = project(particles[j].pos, yaw, pitch);
          const near = Math.abs(particles[i].pos.y - scanY) < 60 && scan > 0 && scan < 1;
          ctx.strokeStyle = near
            ? `rgba(6,182,212,${linkAlpha * 0.9})`
            : `rgba(37,99,235,${linkAlpha * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // core glow
      const coreGlow = Math.min(toCore, 1) * (1 - toWord);
      if (coreGlow > 0.01) {
        const c = project({ x: 0, y: 0, z: 0 }, yaw, pitch);
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 150);
        g.addColorStop(0, `rgba(6,182,212,${0.28 * coreGlow})`);
        g.addColorStop(0.45, `rgba(37,99,235,${0.16 * coreGlow})`);
        g.addColorStop(1, "rgba(37,99,235,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      // particles, painter-sorted back to front
      const sorted = particles
        .map((p) => ({ p, pr: project(p.pos, yaw, pitch) }))
        .sort((a, b) => b.pr.depth - a.pr.depth);

      for (const { p, pr } of sorted) {
        const depthT = clamp01((pr.depth + 320) / 640);
        const [r, g, b] = CATEGORY_COLOR[p.cat];
        let alpha = lerp(0.24, 0.85, 1 - depthT);
        const scanned = scan > 0 && scan < 1 && Math.abs(p.pos.y - scanY) < 46;
        if (scanned) alpha = Math.min(1, alpha + 0.35);
        if (hoverCat) alpha = p.cat === hoverCat ? Math.min(1, alpha + 0.3) : alpha * 0.28;
        if (toWord > 0.5) alpha = Math.min(1, alpha + 0.2);

        const s = Math.max(0.5, p.size * pr.f * (scanned ? 1.5 : 1));
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        if (p.shape === "dot") {
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, s, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(pr.x - s, pr.y - s, s * 2, s * 2);
        } else {
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a2 = (k / 6) * Math.PI * 2 + 0.4;
            const px = pr.x + Math.cos(a2) * s * 1.25;
            const py = pr.y + Math.sin(a2) * s * 1.25;
            k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // scanning ring
      if (scan > 0 && scan < 1) {
        const c = project({ x: 0, y: scanY, z: 0 }, yaw, pitch);
        const rr = 250 * c.f;
        ctx.strokeStyle = `rgba(6,182,212,${0.55 * Math.sin(scan * Math.PI)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, rr, rr * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // conceptual category labels during structure stage
      const labelAlpha = Math.min(assemble, 1) * (1 - Math.max(toStream, 0)) * 0.75;
      if (labelAlpha > 0.05) {
        ctx.font = "500 9.5px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        CATEGORIES.forEach((cat, i) => {
          const a = (i / CATEGORIES.length) * Math.PI * 2;
          const anchor = { x: Math.cos(a) * 250, y: (i - 2) * 62, z: Math.sin(a) * 250 };
          const pr = project(anchor, yaw, pitch);
          const [r, g, b] = CATEGORY_COLOR[cat];
          const active = hoverCat === cat;
          ctx.fillStyle = `rgba(${r},${g},${b},${labelAlpha * (active ? 1 : 0.6)})`;
          ctx.fillText(cat, pr.x, pr.y);
        });
      }

      if (!prefersReduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [isTouch]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-square w-full", className)}
      role="img"
      aria-label="Abstract particle visualization: a website's structure is scanned, separated into SEO, security, performance, accessibility and infrastructure signals, and converged into the SiteIQ intelligence core."
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.715 0.128 215.2 / 0.10), transparent 70%)",
        }}
      />
      <canvas ref={canvasRef} className="relative size-full" />

      <ul className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {CATEGORIES.map((c) => (
          <li key={c}>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onMouseEnter={() => setHoverLabel(c)}
              onMouseLeave={() => setHoverLabel(null)}
              className={cn(
                "font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-colors",
                hoverLabel === c ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>

      {reduced ? (
        <span className="sr-only">Animation paused because reduced motion is enabled.</span>
      ) : null}
    </div>
  );
}
