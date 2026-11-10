import { useEffect, useRef, useState } from "react";

const THEME_LIGHT = {
  color: 0x2f62d4,
  backgroundColor: 0xf3f5f9,
};

const THEME_DARK = {
  color: 0x6f9bff,
  backgroundColor: 0x12161d,
};

type Theme =
  | "claro"
  | "oscuro"
  | "verde"
  | "verde-oscuro"
  | "morado"
  | "morado-oscuro"
  | "naranja"
  | "naranja-oscuro"
  | "rosa"
  | "rosa-oscuro";

// Paleta de la malla por tema: base clara u oscura con el acento del color.
const PALETTES: Record<Theme, { color: number; backgroundColor: number }> = {
  claro: THEME_LIGHT,
  oscuro: THEME_DARK,
  verde: { color: 0x2f8f5b, backgroundColor: 0xf3f5f9 },
  "verde-oscuro": { color: 0x5fd39a, backgroundColor: 0x12161d },
  morado: { color: 0x7c4dcc, backgroundColor: 0xf3f5f9 },
  "morado-oscuro": { color: 0xa982f0, backgroundColor: 0x12161d },
  naranja: { color: 0xd4712f, backgroundColor: 0xf3f5f9 },
  "naranja-oscuro": { color: 0xf5a05f, backgroundColor: 0x12161d },
  rosa: { color: 0xd44f86, backgroundColor: 0xf3f5f9 },
  "rosa-oscuro": { color: 0xff8fb5, backgroundColor: 0x12161d },
};

const THEME_IDS: readonly string[] = Object.keys(PALETTES);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  if (value === "light") return "claro";
  if (value === "dark") return "oscuro";
  return THEME_IDS.includes(value ?? "") ? (value as Theme) : "claro";
}

interface VantaBackgroundProps {
  // "subtle" reduce la densidad de puntos para no competir con el contenido.
  variant?: "hero" | "subtle";
}

// Fondo 3D animado (Vanta NET) con la paleta del tema activo. Se omite si el
// usuario reduce el movimiento, y se reconstruye al cambiar de tema.
export default function VantaBackground({
  variant = "hero",
}: VantaBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  // El tema vive en un atributo de <html>: se observa para re pintar el fondo.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(readTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;

    if (!el || prefersReducedMotion()) {
      return;
    }

    const palette = PALETTES[theme];
    const subtle = variant === "subtle";
    let disposed = false;
    let effect: { destroy: () => void } | null = null;

    // three.js y vanta pesan bastante: se importan bajo demanda y solo en las
    // pantallas que usan el fondo animado.
    Promise.all([import("vanta/dist/vanta.net.min"), import("three")]).then(
      ([vanta, THREE]) => {
        if (disposed) {
          return;
        }

        effect = vanta.default({
          el,
          THREE,
          color: palette.color,
          backgroundColor: palette.backgroundColor,
          backgroundAlpha: 0,
          points: subtle ? 6 : 9,
          maxDistance: subtle ? 15 : 16.5,
          spacing: subtle ? 26 : 21,
          scale: 1,
          scaleMobile: 1,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
        });
      },
    );

    return () => {
      disposed = true;
      effect?.destroy();
    };
  }, [theme, variant]);

  return <div ref={containerRef} className="vantaBackground" aria-hidden="true" />;
}
