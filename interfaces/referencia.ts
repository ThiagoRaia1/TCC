export interface IReferencia {
  id: number;
  tipo: "Artigo" | "Livro" | "Notícia" | "Site" | "Vídeo" | "Outro";
  nome: string;
  url?: string;
}

export interface ICriarReferencia {
  tipo: "Artigo" | "Livro" | "Notícia" | "Site" | "Vídeo" | "Outro";
  nome: string;
  url?: string;
}

export interface IUpdateReferencia {
  tipo?: "Artigo" | "Livro" | "Notícia" | "Site" | "Vídeo" | "Outro";
  nome?: string;
  url?: string;
}