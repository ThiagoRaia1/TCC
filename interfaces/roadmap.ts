import { ICriarEtapa, IEtapa, IUpdateEtapa } from "./etapa";
import { IUsuario } from "./usuario";

export interface IRoadmap {
  id: number;
  tema: string;
  descricaoGeral: string;
  etapas: IEtapa[];
  usuario: IUsuario;
}

export interface ICriarRoadmap {
  tema: string;
  descricaoGeral?: string;
  etapas?: ICriarEtapa[];
  usuarioId: number;
}

export interface IUpdateRoadmap {
  id: number;
  tema?: string;
  descricaoGeral?: string;
  etapas?: IUpdateEtapa[];
  usuario: IUsuario;
}
