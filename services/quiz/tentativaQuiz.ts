import { ITentativaQuiz } from "../../interfaces/quiz/tentativaQuiz";
import { httpClient } from "../httpclient";

export async function getTentativasQuiz(
  quizId: number,
): Promise<ITentativaQuiz[]> {
  return await httpClient(`/tentativa-quiz/quiz/${quizId}`, {
    method: "GET",
  });
}
