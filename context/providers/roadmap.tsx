import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { IRoadmap } from "../../interfaces/roadmap";

interface RoadmapContextProps {
  roadmapContext: IRoadmap | undefined;
  setRoadmapContext: Dispatch<SetStateAction<IRoadmap | undefined>>;
}

interface RoadmapProviderProps {
  children: ReactNode;
}

const RoadmapContext = createContext<RoadmapContextProps | undefined>(
  undefined,
);

export function RoadmapProvider({ children }: RoadmapProviderProps) {
  const [roadmapContext, setRoadmapContext] = useState<IRoadmap | undefined>(
    undefined,
  );

  return (
    <RoadmapContext.Provider value={{ roadmapContext, setRoadmapContext }}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);

  if (!context) {
    throw new Error("useRoadmap deve ser utilizado dentro de RoadmapProvider");
  }

  return context;
}
