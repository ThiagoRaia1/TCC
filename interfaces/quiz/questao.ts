import { IAlternativa } from "./alternativa";

export interface IQuestao {
  id: number;
  enunciado: string;
  ordem: number;
  alternativas: IAlternativa[];
}
