import { ICriarQuiz, IQuiz } from "../../interfaces/quiz/quiz";
import { httpClient } from "../httpclient";

export async function criarQuiz(quiz: ICriarQuiz): Promise<IQuiz> {
  return await httpClient("/quiz", {
    method: "POST",
    body: JSON.stringify(quiz),
  });
}

export async function getAllQuizzes(usuarioId: number): Promise<IQuiz[]> {
  return await httpClient(`/quiz/usuario/${usuarioId}`, {
    method: "GET",
  });
}
