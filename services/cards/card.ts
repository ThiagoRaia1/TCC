import { ICard, ICreateCard, IUpdateCard } from "../../interfaces/cards/card";
import { httpClient } from "../httpclient";

export async function listarCards(): Promise<ICard[]> {
  return await httpClient("/card", {
    method: "GET",
  });
}

export async function buscarCard(id: number): Promise<ICard> {
  return await httpClient(`/card/${id}`, {
    method: "GET",
  });
}

export async function criarCard(dados: ICreateCard) {
  return await httpClient("/card", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function atualizarCard(id: number, dados: IUpdateCard) {
  return await httpClient(`/card/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export async function excluirCard(id: number) {
  return await httpClient(`/card/${id}`, {
    method: "DELETE",
  });
}
