import { ICreateUsuario } from "../interfaces/usuario";
import { httpClient } from "./httpclient";

export async function criarConta(usuario: ICreateUsuario) {
  return await httpClient("/usuario", {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}

export async function updateConta(usuario: ICreateUsuario) {
  return await httpClient("/usuario", {
    method: "PATCH",
    body: JSON.stringify(usuario),
  });
}

export async function deletarConta(id: number) {
  return await httpClient(`/usuario/${id}`, {
    method: "DELETE",
  });
}
