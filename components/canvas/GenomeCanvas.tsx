"use client";

import type { CSSProperties, PointerEvent, WheelEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type GenomeFeature = {
  id?: string;
  start: number;
  end: number;
  label?: string;
  color?: string;
};

export type GenomeTrack = {
  id: string;
  name?: string;
  height?: number;
  features: GenomeFeature[];
};

export type GenomeData = {
  length: number;
  tracks: GenomeTrack[];
};

export type GenomeCanvasViewState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type GenomeCanvasRenderState = {
  data?: GenomeData;
  viewState: GenomeCanvasViewState;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
};

export type GenomeCanvasProps = {
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  genome?: GenomeData;
  viewState?: GenomeCanvasViewState;
  initialViewState?: GenomeCanvasViewState;
  minScale?: number;
  maxScale?: number;
  onViewStateChange?: (nextViewState: GenomeCanvasViewState) => void;
  onDraw?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    renderState: GenomeCanvasRenderState,
  ) => void;
};

const DEFAULT_VIEW_STATE: GenomeCanvasViewState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export default function GenomeCanvas({
  width = 800,
  height = 200,
  className,
  style,
  genome,
  viewState,
  initialViewState,
  minScale = 0.1,
  maxScale = 50,
  onViewStateChange,
  onDraw,
}: GenomeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // 패닝 중 불필요한 리렌더를 막기 위해 포인터 상태를 렌더 밖에서 관리합니다.
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [internalViewState, setInternalViewState] = useState<GenomeCanvasViewState>(
    initialViewState ?? DEFAULT_VIEW_STATE,
  );

  // 제어형/비제어형 뷰 상태 모두 지원합니다.
  const activeViewState = viewState ?? internalViewState;

  const commitViewState = useCallback(
    (nextViewState: GenomeCanvasViewState) => {
      if (!viewState) {
        setInternalViewState(nextViewState);
      }
      onViewStateChange?.(nextViewState);
    },
    [onViewStateChange, viewState],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI에서 선이 선명하도록 디바이스 픽셀 비율로 렌더링합니다.
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // draw 콜백 전에 뷰 변환을 적용합니다.
    ctx.save();
    ctx.translate(activeViewState.offsetX, activeViewState.offsetY);
    ctx.scale(activeViewState.scale, 1);

    const renderState: GenomeCanvasRenderState = {
      data: genome,
      viewState: activeViewState,
      viewport: {
        width,
        height,
        devicePixelRatio,
      },
    };

    onDraw?.(ctx, canvas, renderState);
    ctx.restore();
  }, [activeViewState, genome, height, onDraw, width]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (event.button !== 0) return;
      isPanningRef.current = true;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (!isPanningRef.current || !lastPointerRef.current) return;
      const last = lastPointerRef.current;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      // 패닝 중에는 화면 좌표계 기준으로 오프셋을 갱신합니다.
      commitViewState({
        ...activeViewState,
        offsetX: activeViewState.offsetX + dx,
        offsetY: activeViewState.offsetY + dy,
      });
    },
    [activeViewState, commitViewState],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
    lastPointerRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const zoomIntensity = 0.0015;
      const nextScale = Math.min(
        maxScale,
        Math.max(minScale, activeViewState.scale * Math.exp(-event.deltaY * zoomIntensity)),
      );
      // 줌 중에도 커서 아래 월드 좌표가 고정되도록 합니다.
      const worldX = (pointerX - activeViewState.offsetX) / activeViewState.scale;
      const nextOffsetX = pointerX - worldX * nextScale;
      commitViewState({
        ...activeViewState,
        scale: nextScale,
        offsetX: nextOffsetX,
      });
    },
    [activeViewState, commitViewState, maxScale, minScale],
  );

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: "none", ...style }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    />
  );
}
