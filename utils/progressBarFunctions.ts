import { IRoadmap } from "../interfaces/roadmap";

export const getProgressColor = (porcentagem: number) => {
  if (porcentagem <= 25) {
    // Vermelho -> Laranja
    const t = porcentagem / 25;

    const r = 239;
    const g = Math.round(68 + t * (130 - 68));
    const b = Math.round(68 - t * 68);

    return `rgb(${r}, ${g}, ${b})`;
  }

  if (porcentagem <= 50) {
    // Laranja -> Amarelo
    const t = (porcentagem - 25) / 25;

    const r = Math.round(239 + t * (234 - 239));
    const g = Math.round(130 + t * (179 - 130));
    const b = Math.round(0 + t * 8);

    return `rgb(${r}, ${g}, ${b})`;
  }

  if (porcentagem <= 75) {
    // Amarelo -> Verde claro
    const t = (porcentagem - 50) / 25;

    const r = Math.round(234 - t * (234 - 76));
    const g = Math.round(179 + t * (175 - 179));
    const b = Math.round(8 + t * (80 - 8));

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Verde claro -> Verde
  const t = (porcentagem - 75) / 25;

  const r = Math.round(76 - t * 76);
  const g = Math.round(175 + t * (175 - 175));
  const b = Math.round(80 - t * 80);

  return `rgb(${r}, ${g}, ${b})`;
};

export const calcularProgresso = (roadmap: IRoadmap) => {
  const total = roadmap.etapas.flatMap((e) => e.objetivos).length;
  const concluidos = roadmap.etapas
    .flatMap((e) => e.objetivos)
    .filter((o) => o.concluido).length;

  if (total === 0) return 0;

  return (concluidos / total) * 100;
};
