import { ICadernoRevisao } from "../../interfaces/cadernoRevisao/cadernoRevisao";
import { httpClient } from "../httpclient";

export async function getAllErrosRoadmap(
  usuarioId: number,
  roadmapId: number,
): Promise<ICadernoRevisao[]> {
  return await httpClient(
    `/caderno-erros/${usuarioId}?roadmapId=${roadmapId}`,
    {
      method: "GET",
    },
  );
}

export async function gerarQuizPraticaErros(usuarioId: number, roadmapId?: number) {
  const params = roadmapId ? `?roadmapId=${roadmapId}` : "";

  return await httpClient(`/caderno-erros/${usuarioId}/praticar${params}`, {
    method: "GET",
  });
}
