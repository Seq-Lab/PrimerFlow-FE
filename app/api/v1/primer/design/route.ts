import { NextResponse } from "next/server";

// Mock primer design endpoint that echoes user input while staying lightweight.
export async function POST(request: Request) {
  const body = await request.json();
  console.log("프론트에서 받은 요청:", body);

  const templateSequence: string =
    (body?.basic?.templateSequence ?? "") as string;
  const cleanSequence = templateSequence.replace(/\s+/g, "");
  const length = cleanSequence.length || 1; // keep non-zero for calculations

  // Simple relative feature windows
  const region = (startPct: number, endPct: number) => ({
    start_bp: Math.max(1, Math.floor(length * startPct)),
    end_bp: Math.max(1, Math.floor(length * endPct)),
  });

  const featureA = region(0.1, 0.2);
  const featureB = region(0.35, 0.45);

  // Dummy primer candidates positioned inside the sequence
  const primerLen = Math.max(18, Math.min(28, Math.floor(length * 0.02) || 20));
  const fStart = Math.max(1, Math.floor(length * 0.15));
  const fEnd = Math.min(length, fStart + primerLen);
  const rEnd = Math.max(1, length - Math.floor(length * 0.1));
  const rStart = Math.max(1, rEnd - primerLen);

  const mockResponse = {
    genome: {
      id: "gene_mock",
      name: body?.basic?.targetOrganism ?? "Mock Gene",
      sequence: cleanSequence || "N/A",
      length_bp: length,
      tracks: [
        {
          id: "regions",
          name: "Relative Windows",
          features: [
            {
              id: "window_A",
              start: featureA.start_bp,
              end: featureA.end_bp,
              color: "#38bdf8",
            },
            {
              id: "window_B",
              start: featureB.start_bp,
              end: featureB.end_bp,
              color: "#c084fc",
            },
          ],
        },
      ],
    },
    candidates: [
      {
        id: "primer_fwd",
        sequence: cleanSequence.slice(fStart - 1, fEnd) || "ATGCATGCATGC",
        start_bp: fStart,
        end_bp: fEnd,
        strand: "forward",
        metrics: { tm_c: 60.5, gc_percent: 50 },
      },
      {
        id: "primer_rev",
        sequence: cleanSequence.slice(rStart - 1, rEnd) || "CGTACGTACGTA",
        start_bp: rStart,
        end_bp: rEnd,
        strand: "reverse",
        metrics: { tm_c: 59.8, gc_percent: 48 },
      },
    ],
    meta: {
      timestamp: new Date().toISOString(),
      params: body,
    },
  };

  // 1초 뒤에 응답 (네트워크 지연 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(mockResponse);
}
