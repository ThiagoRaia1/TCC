export interface IUsuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
  ativo: boolean;
}

export interface ICreateUsuario {
  email: string;
  senha: string;
  nome: string;
  ativo: boolean;
}

export interface IEditUsuario {
  email?: string;
  senha?: string;
  nome?: string;
  ativo?: boolean;
}

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  email: string;
  nome: string;
}
