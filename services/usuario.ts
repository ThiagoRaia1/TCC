import { ICreateUsuario } from "../interfaces/usuario";
import { httpClient } from "./httpclient";

export async function criarConta(usuario: ICreateUsuario) {
  return await httpClient("/usuario", {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}
