import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { IJwtPayload } from "../interfaces/jwt";
import { ILoginRequest } from "../interfaces/usuario";
import { httpClient } from "../services/httpclient";

interface IAuthContext {
  isAuthenticated: boolean;
  usuario: IJwtPayload | null;
  login: (usuario: ILoginRequest) => Promise<IJwtPayload>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  usuario: null,
  login: async (_usuario: ILoginRequest) => {
    throw new Error("AuthProvider não encontrado");
  },
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<IJwtPayload | null>(null);

  // Valida token ao iniciar o app
  useEffect(() => {
    async function carregarSessao() {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          return;
        }

        const decoded = jwtDecode<IJwtPayload>(token);

        // verifica expiração
        if (decoded.exp * 1000 < Date.now()) {
          await logout();
          return;
        }

        setUsuario(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        await logout();
      }
    }

    carregarSessao();
  }, []);

  const login = async (usuarioLogin: ILoginRequest) => {
    const response = await httpClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(usuarioLogin),
    });

    const token: string = response.token;

    if (token === "Usuário ou senha inválidos") {
      throw new Error("Usuário ou senha inválidos");
    }

    await AsyncStorage.setItem("token", token);

    const decoded = jwtDecode<IJwtPayload>(token);

    setUsuario(decoded);
    setIsAuthenticated(true);

    return decoded;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUsuario(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
