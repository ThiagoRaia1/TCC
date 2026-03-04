import { httpClient } from "./httpclient";

// export const gerarRoadmap = async (tema: string) => {
//   try {
//     const response = await fetch("http://localhost:3000/roadmap", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ tema }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Erro ao gerar roadmap:", error);
//   }
// };

export async function gerarRoadmap(tema: string, usuarioId: number) {
  return await httpClient("/roadmap", {
    method: "POST",
    body: JSON.stringify({ tema, usuarioId }),
  });
}
