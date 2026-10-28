import { IAlternativa } from "../quiz/alternativa";
import { IQuestao } from "../quiz/questao";
import { ITentativaQuiz } from "../quiz/tentativaQuiz";

export interface ICadernoRevisao {
  id: number;
  correta: boolean;
  questao: IQuestao;
  alternativa: IAlternativa;
  tentativa: ITentativaQuiz;
}
