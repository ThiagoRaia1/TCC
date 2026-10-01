import { ICriarQuiz, IQuiz } from "../../interfaces/quiz/quiz";
import { httpClient } from "../httpclient";

export async function criarQuiz(quiz: ICriarQuiz): Promise<IQuiz> {
  return await httpClient("/quiz", {
    method: "POST",
    body: JSON.stringify(quiz),
  });
}

interface CriarQuizData {
  titulo: string;
  descricao?: string;
  roadmapId: number;
  etapaIds?: number[];
  usuarioId: number
}

export async function gerarQuiz(data: CriarQuizData) {
  return await httpClient("/quiz/gerar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllQuizzes(
  usuarioId: number,
  roadmapId: number,
): Promise<IQuiz[]> {
  return await httpClient(`/quiz/usuario/${usuarioId}/${roadmapId}`, {
    method: "GET",
  });
}
