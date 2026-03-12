type TipoRecurso = "video" | "artigo" | "app";

export interface IRecursoSugerido {
  id: number;
  titulo: string;
  link?: string;
  tipo?: TipoRecurso;
}

export interface ICriarRecursoSugerido {
  titulo: string;
  link?: string;
  tipo?: TipoRecurso;
}