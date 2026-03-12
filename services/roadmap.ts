import { ICriarRoadmap, IRoadmap } from "../interfaces/roadmap";
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
