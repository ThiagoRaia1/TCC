import { ICriarObjetivo, IObjetivo, IUpdateObjetivo } from "./objetivo";
import { ICriarReferencia, IReferencia, IUpdateReferencia } from "./referencia";

export interface IEtapa {
  id: number;
  titulo: string;
  ordem: number;
  descricao: string;
  duracao: string;
  objetivos: IObjetivo[];
  referencias?: IReferencia[];
  concluido: boolean;

  anotacoes?: {
    plainText: string;
    editorState: string | null;
  };
}

export interface ICriarEtapa {
  titulo: string;
  ordem: number;
  descricao: string;
  duracao: string;
  objetivos: ICriarObjetivo[];
  referencias?: ICriarReferencia[];
  concluido: boolean;

  anotacoes?: {
    plainText: string;
    editorState: string | null;
  };
}

export interface IUpdateEtapa {
  titulo?: string;
  ordem?: number;
  descricao?: string;
  duracao?: string;
  objetivos?: IUpdateObjetivo[];
  referencias?: IUpdateReferencia[];
  concluido?: boolean;

  anotacoes?: {
    plainText: string;
    editorState: string | null;
  };
}
