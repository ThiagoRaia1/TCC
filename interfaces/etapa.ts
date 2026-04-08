import { ICriarObjetivo, IObjetivo } from "./objetivo";
import { ICriarRecursoSugerido, IRecursoSugerido } from "./recursoSugerido";

export interface IEtapa {
  id: number;
  titulo: string;
  ordem: number;
  descricao: string;
  duracao: string;
  objetivos: IObjetivo[];
  recursosSugeridos: IRecursoSugerido[];
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
  recursosSugeridos: ICriarRecursoSugerido[];
  concluido: boolean;

  anotacoes?: {
    plainText: string;
    editorState: string | null;
  };
}
