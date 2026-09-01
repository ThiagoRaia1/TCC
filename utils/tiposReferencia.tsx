import { JSX } from "react";
import {
  BookOpen,
  EllipsisVertical,
  Globe,
  Newspaper,
  ScrollText,
  Video,
} from "lucide-react-native";

export type TipoReferencia =
  | "Artigo"
  | "Livro"
  | "Notícia"
  | "Site"
  | "Vídeo"
  | "Outro";

export const tiposReferencia: {
  tipo: TipoReferencia;
  icon: JSX.Element;
}[] = [
  {
    tipo: "Artigo",
    icon: <ScrollText color="black" size={16} />,
  },
  {
    tipo: "Vídeo",
    icon: <Video color="black" size={16} />,
  },
  {
    tipo: "Livro",
    icon: <BookOpen color="black" size={16} />,
  },
  {
    tipo: "Site",
    icon: <Globe color="black" size={16} />,
  },
  {
    tipo: "Notícia",
    icon: <Newspaper color="black" size={16} />,
  },
  {
    tipo: "Outro",
    icon: <EllipsisVertical color="black" size={16} />,
  },
];

export const getIconReferencia = (tipoReferencia?: string) => {
  switch (tipoReferencia) {
    case tiposReferencia[0].tipo:
      return tiposReferencia[0].icon;

    case tiposReferencia[1].tipo:
      return tiposReferencia[1].icon;

    case tiposReferencia[2].tipo:
      return tiposReferencia[2].icon;

    case tiposReferencia[3].tipo:
      return tiposReferencia[3].icon;

    case tiposReferencia[4].tipo:
      return tiposReferencia[4].icon;

    default:
      return tiposReferencia[5].icon;
  }
};
