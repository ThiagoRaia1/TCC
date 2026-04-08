import { ICriarEtapa, IEtapa } from "./etapa";
import { IUsuario } from "./usuario";

type Nivel = "iniciante" | "intermediario" | "avancado";

export interface IRoadmap {
  id: number;
  tema: string;
  descricaoGeral: string;
  duracaoEstimada: string;
  nivel: Nivel;
  etapas: IEtapa[];
  usuario: IUsuario;
  porcentagemConclusao: number;
}

export interface ICriarRoadmap {
  tema: string;
  descricaoGeral: string;
  duracaoEstimada: string;
  nivel: Nivel;
  etapas: ICriarEtapa[];
  usuarioId: number;
}

export interface IUpdateRoadmap {
  id: number;
  tema?: string;
  descricaoGeral?: string;
  duracaoEstimada?: string;
  nivel?: Nivel;
  etapas?: IEtapa[];
  usuario: IUsuario;
  porcentagemConclusao?: number;
}
