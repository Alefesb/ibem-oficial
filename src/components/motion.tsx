import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/*  Cursor glow — a soft golden light that follows the mouse globally  */
/* ------------------------------------------------------------------ */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40 h-[520px] w-[520px] rounded-full opacity-60 mix-blend-screen hidden md:block"
      style={{
        background:
          "radial-gradient(circle at center, oklch(0.85 0.15 88 / 0.35), transparent 60%)",
        filter: "blur(40px)",
        transition: "opacity .4s ease",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TiltCard — 3D perspective tilt following the cursor                */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  intensity = 10,
  style,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !inner.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    inner.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (shine.current) {
      shine.current.style.background = `radial-gradient(600px circle at ${px * 100}% ${py * 100}%, oklch(0.85 0.15 88 / 0.18), transparent 40%)`;
    }
  };

  const onLeave = () => {
    if (inner.current) inner.current.style.transform = "rotateX(0) rotateY(0)";
    if (shine.current) shine.current.style.background = "transparent";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: 1000, ...style }}
    >
      <div
        ref={inner}
        className="relative h-full w-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div
          ref={shine}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MagneticButton — button that leans toward the cursor               */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={"inline-block transition-transform duration-300 ease-out will-change-transform " + (className ?? "")}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Reveal — fade + rise on scroll into view                           */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
        transition: `opacity .8s ease ${delay}ms, transform .8s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingOrbs — parallax 3D orbs reacting to mouse                  */
/* ------------------------------------------------------------------ */
export function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.querySelectorAll<HTMLElement>("[data-depth]").forEach((n) => {
        const d = parseFloat(n.dataset.depth || "1");
        n.style.transform = `translate3d(${x * d * 60}px, ${y * d * 60}px, 0) rotate(${x * d * 8}deg)`;
      });
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={containerRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      
      <div
        data-depth="0.8"
        className="absolute top-1/3 right-[-120px] h-[520px] w-[520px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, oklch(0.35 0.12 260 / 0.7), transparent 65%)",
          filter: "blur(30px)",
          animation: "float-slow 18s ease-in-out infinite reverse",
        }}
      />
      <div
        data-depth="2"
        className="absolute bottom-[-100px] left-1/3 h-[300px] w-[300px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, oklch(0.9 0.1 88 / 0.35), transparent 65%)",
          filter: "blur(24px)",
          animation: "float-slow 12s ease-in-out infinite",
        }}
      />
    </div>
  );
}
