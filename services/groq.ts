import { httpClient } from "./httpclient";

export async function gerarRoadmap(tema: string) {
  return await httpClient("/roadmap", {
    method: "POST",
    body: JSON.stringify({ tema }),
  });
}
