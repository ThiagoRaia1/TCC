import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IRoadmap } from "../../interfaces/roadmap";
import { useLoading } from "./loading";

type ContextType = {
  roadmapSelecionado?: IRoadmap;
  setRoadmapSelecionado: (r?: IRoadmap) => void;
  loading: boolean;
};

const RoadmapContext = createContext<ContextType>({
  roadmapSelecionado: undefined,
  setRoadmapSelecionado: () => {},
  loading: true,
});

export function RoadmapProvider({ children }: any) {
  const [roadmapSelecionado, setRoadmapSelecionadoState] = useState<IRoadmap>();
  const { showLoading, hideLoading } = useLoading();
  const [loading, setLoading] = useState(true);

  // carregar ao iniciar
  useEffect(() => {
    const carregarRoadmap = async () => {
      try {
        setLoading(true);
        showLoading();

        const data = await AsyncStorage.getItem("roadmap");

        if (data) {
          setRoadmapSelecionadoState(JSON.parse(data));
        }
      } catch (error: any) {
        console.error("Erro ao carregar roadmap:", error);
        alert("Erro ao carregar dados salvos");
      } finally {
        setLoading(false); // 👈 importante
        hideLoading();
      }
    };

    carregarRoadmap();
  }, []);

  // salvar sempre que mudar
  const setRoadmapSelecionado = async (r?: IRoadmap) => {
    try {
      setRoadmapSelecionadoState(r);

      if (r) {
        await AsyncStorage.setItem("roadmap", JSON.stringify(r));
      } else {
        await AsyncStorage.removeItem("roadmap");
      }
    } catch (error) {
      console.error("Erro ao salvar roadmap:", error);
    }
  };

  return (
    <RoadmapContext.Provider
      value={{ roadmapSelecionado, setRoadmapSelecionado, loading }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export const useRoadmap = () => useContext(RoadmapContext);
