import { IUpdateObjetivo } from "../interfaces/objetivo";
import { httpClient } from "./httpclient";

export async function updateObjetivo(id: number, objetivo: IUpdateObjetivo) {
  return await httpClient(`/objetivo/${id}`, {
    method: "PATCH",
    body: JSON.stringify(objetivo),
  });
}
