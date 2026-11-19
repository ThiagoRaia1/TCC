export interface ICard {
  id: number;
  pergunta: string;
  resposta: string;
  etapa: {
    id: number;
    titulo: string;
  };
  objetivo?: {
    id: number;
    titulo: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateCard {
  pergunta: string;
  resposta: string;
  usuarioId: number;
  etapaId?: number;
  objetivoId?: number;
}

export interface IUpdateCard {
  pergunta?: string;
  resposta?: string;
  etapaId?: number;
  objetivoId?: number | null;
}