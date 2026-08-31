import { httpClient } from "./httpclient";

export async function deleteEtapa(id: number) {
  return await httpClient(`/etapa/${id}`, {
    method: "DELETE",
  });
}
