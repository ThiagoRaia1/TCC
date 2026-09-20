import { IEtapa } from "../etapa";
import { IRoadmap } from "../roadmap";
import { IQuestao } from "./questao";
import { ITentativaQuiz } from "./tentativaQuiz";

export interface IQuiz {
  id: number;
  titulo: string;
  descricao?: string;
  quantidadeQuestoes: number;
  etapas?: IEtapa[];
  roadmap?: IRoadmap;
  questoes: IQuestao[];
  tentativas?: ITentativaQuiz[];
  usuarioId: number;
}

export interface ICriarQuiz {
  titulo: string;
  descricao?: string;
  quantidadeQuestoes?: number;
  etapaIds?: number[] | null;
  roadmapId?: number;
  questoes?: IQuestao[];
  tentativas?: ITentativaQuiz[];
  usuarioId: number;
}
