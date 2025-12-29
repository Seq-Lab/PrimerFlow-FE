"use client";

import { useEffect, useRef } from "react";

export type GenomeCanvasProps = {
  width?: number;
  height?: number;
  className?: string;
  // TODO: Define a stable render contract for genome data + view state props.
  onDraw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
};

export default function GenomeCanvas({
  width = 800,
  height = 200,
  className,
  onDraw,
}: GenomeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // TODO: Apply devicePixelRatio scaling for crisp rendering.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // TODO: Implement culling/layout/transform pipeline here or via onDraw.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDraw?.(ctx, canvas);
  }, [width, height, onDraw]);

  // TODO: Add interaction handlers (zoom/pan) once view store is wired.
  return <canvas ref={canvasRef} className={className} />;
}
