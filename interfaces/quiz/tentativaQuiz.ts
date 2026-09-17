import { IQuiz } from "./quiz";
import { IRespostaQuiz } from "./respostaQuiz";

export interface ITentativaQuiz {
  id: number;
  pontuacao: number;
  totalQuestoes: number;
  percentual: number;
  concluido: boolean;
  iniciadoEm: string;
  finalizadoEm: string | null;
  quiz: IQuiz;
  respostas: IRespostaQuiz[];
}
