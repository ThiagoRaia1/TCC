import { IAlternativa } from "./alternativa";
import { IQuestao } from "./questao";

export interface IRespostaQuiz {
  id: number;
  correta: boolean;
  questao: IQuestao;
  alternativa: IAlternativa;
}
