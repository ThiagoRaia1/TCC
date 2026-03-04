export interface IUsuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
}

export interface ICreateUsuario {
  email: string;
  senha: string;
  nome: string;
}

export interface IEditUsuario {
  email?: string;
  senha?: string;
  nome?: string;
}

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  email: string;
  nome: string;
}
