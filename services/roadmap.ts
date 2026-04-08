import { ICriarRoadmap, IRoadmap, IUpdateRoadmap } from "../interfaces/roadmap";
import { httpClient } from "./httpclient";

export async function criarRoadmap(tema: string) {
  return await httpClient("/roadmap", {
    method: "POST",
    body: JSON.stringify(tema),
  });
}

export async function salvarRoadmap(roadmap: ICriarRoadmap) {
  return await httpClient("/roadmap/salvar", {
    method: "POST",
    body: JSON.stringify(roadmap),
  });
}

export async function getAllRoadmap(): Promise<IRoadmap[]> {
  return await httpClient("/roadmap", {
    method: "GET",
  });
}

export async function updateRoadmap(roadmap: IUpdateRoadmap) {
  return await httpClient(`/roadmap/${roadmap.id}`, {
    method: "PATCH",
    body: JSON.stringify(roadmap),
  });
}

export async function deleteRoadmap(id: number) {
  return await httpClient(`/roadmap/${id}`, {
    method: "DELETE",
  });
}

export async function salvarAnotacao(
  etapaId: number,
  anotacao: {
    plainText: string;
    editorState: string | null;
  },
) {
  return await httpClient(`/etapa/${etapaId}/anotacao`, {
    method: "PATCH",
    body: JSON.stringify(anotacao),
  });
}
