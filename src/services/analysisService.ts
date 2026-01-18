// eslint-disable-next-line @typescript-eslint/no-unused-vars -- keep import for the future real request
import api from "@/lib/axios";

export interface AnalyzeRequest {
  target_sequence: string;
  species: string;
  analysis_type?: string;
  reference_genome?: string;
  notes?: string;
}

export interface AnalyzeResponse {
  result: string;
  score: number;
  details: Record<string, unknown> | string;
}

const ANALYSIS_ENDPOINT = "/api/v1/analysis";

export const analyzeGenome = async (
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> => {
  // Uncomment the lines below when the backend is ready.
  // const response = await api.post<AnalyzeResponse>(ANALYSIS_ENDPOINT, payload);
  // return response.data;

  const mockResponse: AnalyzeResponse = {
    result: "Success",
    score: 98.5,
    details: {
      summary: "Mock genome analysis completed.",
      analysis_endpoint: ANALYSIS_ENDPOINT,
      target_sequence_preview: payload.target_sequence.slice(0, 20),
      species: payload.species,
      detected_markers: ["BRCA1", "TP53"],
      gc_content: "51.2%",
    },
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockResponse), 1500);
  });
};
