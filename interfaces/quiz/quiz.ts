import { IQuestao } from "./questao";
import { ITentativaQuiz } from "./tentativaQuiz";

export interface IQuiz {
  id: number;
  titulo: string;
  descricao: string;
  quantidadeQuestoes: number;
  etapa?: number;
  questoes: IQuestao[];
  tentativas?: ITentativaQuiz[];
}
