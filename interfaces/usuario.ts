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
  nome: string;
  email: string;
  senhaAtual?: string;
  novaSenha?: string;
  confirmarNovaSenha?: string;
}

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  email: string;
  nome: string;
}
