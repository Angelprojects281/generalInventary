import { useEffect, useRef, useState } from "react";

const THEME_LIGHT = {
  color: 0x2f62d4,
  backgroundColor: 0xf3f5f9,
};

const THEME_DARK = {
  color: 0x6f9bff,
  backgroundColor: 0x12161d,
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
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
  const [theme, setTheme] = useState<"light" | "dark">(() => readTheme());

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

    const palette = theme === "dark" ? THEME_DARK : THEME_LIGHT;
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
