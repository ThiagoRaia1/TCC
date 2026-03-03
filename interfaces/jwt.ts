export interface IJwtPayload {
  sub: number;
  email: string;
  nome: string;
  nivelDeAcesso: number;
  exp: number;
}