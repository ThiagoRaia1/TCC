import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import { ITentativaQuiz } from "../../interfaces/quiz/tentativaQuiz";

type IResultadoQuizTemporario = Omit<ITentativaQuiz, "id"> & {
  id: number | null;
};

interface ResultadoQuizContextData {
  resultadoTemporario: IResultadoQuizTemporario | null;
  salvarResultadoTemporario: (
    resultado: IResultadoQuizTemporario,
  ) => void;
  limparResultadoTemporario: () => void;
}

const ResultadoQuizContext =
  createContext<ResultadoQuizContextData>(
    {} as ResultadoQuizContextData,
  );

export function ResultadoQuizProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [resultadoTemporario, setResultadoTemporario] =
    useState<IResultadoQuizTemporario | null>(null);

  function salvarResultadoTemporario(
    resultado: IResultadoQuizTemporario,
  ) {
    setResultadoTemporario(resultado);
  }

  function limparResultadoTemporario() {
    setResultadoTemporario(null);
  }

  return (
    <ResultadoQuizContext.Provider
      value={{
        resultadoTemporario,
        salvarResultadoTemporario,
        limparResultadoTemporario,
      }}
    >
      {children}
    </ResultadoQuizContext.Provider>
  );
}

export function useResultadoQuiz() {
  return useContext(ResultadoQuizContext);
}