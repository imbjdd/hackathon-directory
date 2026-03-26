"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useCallback } from "react";

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerX = useRef<number | null>(null);
  const phiRef = useRef(0);
  const dragDelta = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerX.current = e.clientX;
    dragDelta.current = 0;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerX.current !== null) {
      // Absorb the drag into phi so it doesn't snap back
      phiRef.current += dragDelta.current;
      dragDelta.current = 0;
    }
    pointerX.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerX.current !== null) {
      dragDelta.current = (e.clientX - pointerX.current) / 200;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId: number;
    const getWidth = () => canvas.offsetWidth;

    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.8 : 2);
    const w = getWidth();

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: w,
      height: w,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 10,
      baseColor: [1, 1, 1],
      markerColor: [0.3, 0.45, 0.85],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0.01,
      markers: [
        { location: [48.8566, 2.3522], size: 0.03 },
        { location: [37.7749, -122.4194], size: 0.03 },
        { location: [51.5072, -0.1276], size: 0.03 },
        { location: [52.52, 13.405], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.03 },
        { location: [35.6762, 139.6503], size: 0.03 },
        { location: [-33.8688, 151.2093], size: 0.03 },
        { location: [25.2048, 55.2708], size: 0.03 },
        { location: [-23.5505, -46.6333], size: 0.03 },
      ],
      arcs: [
        { from: [48.8566, 2.3522], to: [37.7749, -122.4194] },
        { from: [51.5072, -0.1276], to: [40.7128, -74.006] },
        { from: [52.52, 13.405], to: [35.6762, 139.6503] },
        { from: [48.8566, 2.3522], to: [-23.5505, -46.6333] },
      ],
      arcColor: [0.3, 0.45, 0.85],
      arcWidth: 0.5,
      arcHeight: 0.25,
      opacity: 0.7,
    });

    function loop() {
      if (pointerX.current === null) {
        phiRef.current += 0.003;
      }
      const width = getWidth();
      globe.update({ phi: phiRef.current + dragDelta.current, width, height: width });
      frameId = requestAnimationFrame(loop);
    }
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        cursor: "grab",
      }}
    />
  );
}
