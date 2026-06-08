import { IReferencia } from "./referencia";

export interface IObjetivo {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
  referencias?: IReferencia[]
}

export interface ICriarObjetivo {
  titulo: string;
  descricao?: string;
  concluido: boolean;
  referencias?: IReferencia[]
}

export interface IUpdateObjetivo {
  titulo?: string;
  descricao?: string;
  concluido?: boolean;
  referencias?: IReferencia[]
}
