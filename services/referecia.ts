import { IUpdateReferencia } from "../interfaces/referencia";
import { httpClient } from "./httpclient";

export async function updateReferencia(
  referenciaId: number,
  referencia: IUpdateReferencia,
) {
  return await httpClient(`/referencias/${referenciaId}`, {
    method: "PATCH",
    body: JSON.stringify(referencia),
  });
}

export async function deleteReferencia(id: number) {
  return await httpClient(`/referencias/${id}`, {
    method: "DELETE",
  });
}
