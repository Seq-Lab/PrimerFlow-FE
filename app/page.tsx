"use client";

import GenomeCanvas, { type GenomeData } from "@/components/canvas/GenomeCanvas";
import { createBpScale } from "@/lib/math/coords";
import { useViewStore } from "@/store/useViewStore";

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

export default function Home() {
  const viewState = useViewStore((state: ReturnType<typeof useViewStore.getState>) => state.viewState);
  const setViewState = useViewStore((state: ReturnType<typeof useViewStore.getState>) => state.setViewState);
  const resetViewState = useViewStore((state: ReturnType<typeof useViewStore.getState>) => state.resetViewState);

  const minScale = 0.1;
  const maxScale = 50;
  const zoomStep = 1.2;

  const clampScale = (scale: number) => Math.min(maxScale, Math.max(minScale, scale));
  const handleZoomIn = () =>
    setViewState({ ...viewState, scale: clampScale(viewState.scale * zoomStep) });
  const handleZoomOut = () =>
    setViewState({ ...viewState, scale: clampScale(viewState.scale / zoomStep) });

  const genome: GenomeData = {
    length: 12000,
    tracks: [
      {
        id: "track-1",
        name: "Primer 후보군",
        height: 28,
        features: [
          { id: "f1", start: 400, end: 1200, label: "P-01", color: "#2563eb" },
          { id: "f2", start: 1800, end: 2600, label: "P-02", color: "#0ea5e9" },
          { id: "f3", start: 3200, end: 4300, label: "P-03", color: "#22c55e" },
        ],
      },
      {
        id: "track-2",
        name: "Target 구간",
        height: 18,
        features: [
          { id: "t1", start: 1500, end: 5200, label: "Amplicon", color: "#f97316" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Genome Canvas Preview</h1>
          <p className="text-sm text-slate-500">
            더미 데이터를 이용해 GenomeCanvas 렌더링을 확인합니다.
          </p>
        </header>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Zoom: {viewState.scale.toFixed(2)}x
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={handleZoomOut}
            >
              Zoom out
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={handleZoomIn}
            >
              Zoom in
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={resetViewState}
            >
              Reset view
            </button>
          </div>
          <GenomeCanvas
            width={900}
            height={240}
            genome={genome}
            viewState={viewState}
            onViewStateChange={setViewState}
            onDraw={(ctx, _canvas, renderState) => {
              const { data, viewport, viewState } = renderState;
              if (!data) return;

              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.fillStyle = "#f8fafc";
              ctx.fillRect(0, 0, viewport.width, viewport.height);

              const paddingX = 20;
              const headerY = 28;
              const trackStartY = 64;
              const trackGap = 28;
              const bpScale = createBpScale(data.length, viewport.width - paddingX * 2, 0);
              const toScreenX = (bp: number) =>
                paddingX + viewState.offsetX + bpScale.bpToX(bp) * viewState.scale;
              const toScreenWidth = (start: number, end: number) => {
                const rawWidth = bpScale.spanToWidth(start, end, 0) * viewState.scale;
                return Math.max(2, rawWidth);
              };

              ctx.fillStyle = "#0f172a";
              ctx.font = "600 14px ui-sans-serif, system-ui";
              ctx.fillText(`Genome length`, paddingX, headerY - 6);
              ctx.fillStyle = "#475569";
              ctx.font = "12px ui-sans-serif, system-ui";
              ctx.fillText(`${data.length.toLocaleString()} bp`, paddingX, headerY + 10);

              ctx.strokeStyle = "#e2e8f0";
              ctx.lineWidth = 1;
              for (let i = 0; i <= 10; i += 1) {
                const x = paddingX + i * ((viewport.width - paddingX * 2) / 10);
                ctx.beginPath();
                ctx.moveTo(x, trackStartY - 16);
                ctx.lineTo(x, viewport.height - 20);
                ctx.stroke();
              }

              let y = trackStartY + viewState.offsetY;

              data.tracks.forEach((track) => {
                const trackHeight = track.height ?? 18;

                ctx.fillStyle = "#64748b";
                ctx.font = "12px ui-sans-serif, system-ui";
                ctx.fillText(track.name ?? track.id, paddingX, y - 10);

                ctx.strokeStyle = "#e5e7eb";
                ctx.beginPath();
                ctx.moveTo(paddingX, y + trackHeight / 2);
                ctx.lineTo(viewport.width - paddingX, y + trackHeight / 2);
                ctx.stroke();

                track.features.forEach((feature) => {
                  const x = toScreenX(feature.start);
                  const width = toScreenWidth(feature.start, feature.end);
                  const radius = Math.min(6, trackHeight / 2);

                  ctx.fillStyle = feature.color ?? "#38bdf8";
                  drawRoundedRect(ctx, x, y, width, trackHeight, radius);
                  ctx.fill();

                  if (feature.label) {
                    const labelPaddingX = 6;
                    const labelPaddingY = 3;
                    ctx.font = "600 11px ui-sans-serif, system-ui";
                    const metrics = ctx.measureText(feature.label);
                    const labelWidth = metrics.width + labelPaddingX * 2;
                    const labelHeight = 16 + labelPaddingY;
                    const labelX = x + 6;
                    const labelY = y + trackHeight + 6;

                    ctx.fillStyle = "#ffffff";
                    ctx.strokeStyle = "#e2e8f0";
                    drawRoundedRect(ctx, labelX, labelY, labelWidth, labelHeight, 6);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "#0f172a";
                    ctx.fillText(feature.label, labelX + labelPaddingX, labelY + 12);
                  }
                });

                y += trackHeight + trackGap;
              });
            }}
          />
        </div>
      </main>
    </div>
  );
}
