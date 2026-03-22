"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let width = 469;

    const resize = () => {
      const nextWidth = canvas.parentElement?.clientWidth ?? 469;
      if (nextWidth === width) return;
      width = nextWidth;
    };

    resize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.28,
      dark: 0,
      diffuse: 1.1,
      mapSamples: 12000,
      mapBrightness: 6,
      mapBaseBrightness: 0,
      baseColor: [1, 1, 1],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      opacity: 1,
      scale: 0.9,
      markers: [
        { location: [48.8566, 2.3522], size: 0.08 },
        { location: [37.7749, -122.4194], size: 0.08 },
        { location: [51.5072, -0.1276], size: 0.08 },
        { location: [52.52, 13.405], size: 0.08 },
      ],
      onRender: (state) => {
        state.width = width * 2;
        state.height = width * 2;
        state.phi = phi;
        phi += 0.01;
      },
    });

    const observer = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      observer.disconnect();
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
      }}
    />
  );
}
