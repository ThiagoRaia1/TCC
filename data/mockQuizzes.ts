import { IQuiz } from "../interfaces/quiz/quiz";

export const mockQuizzes: IQuiz[] = [
  {
    id: 1,
    titulo: "Fundamentos do Xadrez",
    descricao:
      "Teste seus conhecimentos sobre o tabuleiro, peças, movimentos e regras básicas do xadrez.",
    quantidadeQuestoes: 5,
    etapa: 1,

    questoes: [
      {
        id: 1,
        enunciado: "Quantas casas possui um tabuleiro de xadrez?",
        ordem: 1,

        alternativas: [
          {
            id: 1,
            texto: "32 casas",
            correta: false,
            ordem: 1,
          },
          {
            id: 2,
            texto: "48 casas",
            correta: false,
            ordem: 2,
          },
          {
            id: 3,
            texto: "64 casas",
            correta: true,
            ordem: 3,
          },
          {
            id: 4,
            texto: "72 casas",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 2,
        enunciado: "Qual peça pode se mover em formato de 'L'?",
        ordem: 2,

        alternativas: [
          {
            id: 5,
            texto: "Bispo",
            correta: false,
            ordem: 1,
          },
          {
            id: 6,
            texto: "Torre",
            correta: false,
            ordem: 2,
          },
          {
            id: 7,
            texto: "Cavalo",
            correta: true,
            ordem: 3,
          },
          {
            id: 8,
            texto: "Dama",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 3,
        enunciado: "Qual é o objetivo principal de uma partida de xadrez?",
        ordem: 3,

        alternativas: [
          {
            id: 9,
            texto: "Capturar todas as peças adversárias",
            correta: false,
            ordem: 1,
          },
          {
            id: 10,
            texto: "Dar xeque-mate no rei adversário",
            correta: true,
            ordem: 2,
          },
          {
            id: 11,
            texto: "Chegar com um peão à última fileira",
            correta: false,
            ordem: 3,
          },
          {
            id: 12,
            texto: "Capturar a dama adversária",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 4,
        enunciado: "Qual peça possui maior mobilidade no tabuleiro?",
        ordem: 4,

        alternativas: [
          {
            id: 13,
            texto: "Peão",
            correta: false,
            ordem: 1,
          },
          {
            id: 14,
            texto: "Cavalo",
            correta: false,
            ordem: 2,
          },
          {
            id: 15,
            texto: "Bispo",
            correta: false,
            ordem: 3,
          },
          {
            id: 16,
            texto: "Dama",
            correta: true,
            ordem: 4,
          },
        ],
      },

      {
        id: 5,
        enunciado:
          "Qual peça não pode voltar para trás durante seu movimento normal?",
        ordem: 5,

        alternativas: [
          {
            id: 17,
            texto: "Rei",
            correta: false,
            ordem: 1,
          },
          {
            id: 18,
            texto: "Torre",
            correta: false,
            ordem: 2,
          },
          {
            id: 19,
            texto: "Peão",
            correta: true,
            ordem: 3,
          },
          {
            id: 20,
            texto: "Cavalo",
            correta: false,
            ordem: 4,
          },
        ],
      },
    ],

    tentativas: [
      {
        id: 1,
        pontuacao: 4,
        totalQuestoes: 5,
        percentual: 80,
        concluido: true,
        iniciadoEm: "2026-09-15T19:00:00.000Z",
        finalizadoEm: "2026-09-15T19:08:32.000Z",

        quiz: {} as IQuiz,

        respostas: [],
      },
    ],
  },

  {
    id: 2,
    titulo: "Movimentos das Peças",
    descricao:
      "Avalie seus conhecimentos sobre os movimentos específicos de cada peça do xadrez.",
    quantidadeQuestoes: 5,
    etapa: 2,

    questoes: [
      {
        id: 6,
        enunciado: "Como a torre se movimenta?",
        ordem: 1,

        alternativas: [
          {
            id: 21,
            texto: "Na diagonal",
            correta: false,
            ordem: 1,
          },
          {
            id: 22,
            texto: "Em linha reta, horizontal ou vertical",
            correta: true,
            ordem: 2,
          },
          {
            id: 23,
            texto: "Em formato de L",
            correta: false,
            ordem: 3,
          },
          {
            id: 24,
            texto: "Apenas uma casa por vez",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 7,
        enunciado: "Como o bispo se movimenta?",
        ordem: 2,

        alternativas: [
          {
            id: 25,
            texto: "Na diagonal",
            correta: true,
            ordem: 1,
          },
          {
            id: 26,
            texto: "Horizontalmente",
            correta: false,
            ordem: 2,
          },
          {
            id: 27,
            texto: "Verticalmente",
            correta: false,
            ordem: 3,
          },
          {
            id: 28,
            texto: "Em formato de L",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 8,
        enunciado: "Quantas casas o rei pode se mover normalmente por turno?",
        ordem: 3,

        alternativas: [
          {
            id: 29,
            texto: "Uma casa",
            correta: true,
            ordem: 1,
          },
          {
            id: 30,
            texto: "Duas casas",
            correta: false,
            ordem: 2,
          },
          {
            id: 31,
            texto: "Três casas",
            correta: false,
            ordem: 3,
          },
          {
            id: 32,
            texto: "Qualquer quantidade",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 9,
        enunciado: "Como o cavalo realiza seu movimento?",
        ordem: 4,

        alternativas: [
          {
            id: 33,
            texto: "Em linha reta",
            correta: false,
            ordem: 1,
          },
          {
            id: 34,
            texto: "Na diagonal",
            correta: false,
            ordem: 2,
          },
          {
            id: 35,
            texto: "Em formato de L",
            correta: true,
            ordem: 3,
          },
          {
            id: 36,
            texto: "Somente uma casa para frente",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 10,
        enunciado:
          "Qual peça pode se mover tanto na diagonal quanto em linha reta?",
        ordem: 5,

        alternativas: [
          {
            id: 37,
            texto: "Bispo",
            correta: false,
            ordem: 1,
          },
          {
            id: 38,
            texto: "Torre",
            correta: false,
            ordem: 2,
          },
          {
            id: 39,
            texto: "Dama",
            correta: true,
            ordem: 3,
          },
          {
            id: 40,
            texto: "Peão",
            correta: false,
            ordem: 4,
          },
        ],
      },
    ],

    tentativas: [
      {
        id: 2,
        pontuacao: 3,
        totalQuestoes: 5,
        percentual: 60,
        concluido: true,
        iniciadoEm: "2026-09-16T19:00:00.000Z",
        finalizadoEm: "2026-09-16T19:07:14.000Z",

        quiz: {} as IQuiz,

        respostas: [],
      },
    ],
  },

  {
    id: 3,
    titulo: "Estratégias de Abertura",
    descricao:
      "Teste seus conhecimentos sobre princípios e estratégias para os primeiros movimentos de uma partida.",
    quantidadeQuestoes: 5,
    etapa: 3,

    questoes: [
      {
        id: 11,
        enunciado: "Qual é um princípio importante durante a abertura?",
        ordem: 1,

        alternativas: [
          {
            id: 41,
            texto: "Mover a mesma peça várias vezes sem necessidade",
            correta: false,
            ordem: 1,
          },
          {
            id: 42,
            texto: "Desenvolver as peças",
            correta: true,
            ordem: 2,
          },
          {
            id: 43,
            texto: "Mover somente os peões das laterais",
            correta: false,
            ordem: 3,
          },
          {
            id: 44,
            texto: "Deixar o rei no centro sempre",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 12,
        enunciado: "Por que o controle do centro é importante?",
        ordem: 2,

        alternativas: [
          {
            id: 45,
            texto: "Permite maior mobilidade para as peças",
            correta: true,
            ordem: 1,
          },
          {
            id: 46,
            texto: "Impede qualquer movimento do adversário",
            correta: false,
            ordem: 2,
          },
          {
            id: 47,
            texto: "Garante a vitória imediatamente",
            correta: false,
            ordem: 3,
          },
          {
            id: 48,
            texto: "Elimina a necessidade de desenvolver as peças",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 13,
        enunciado: "O que significa desenvolver uma peça?",
        ordem: 3,

        alternativas: [
          {
            id: 49,
            texto: "Capturar uma peça adversária",
            correta: false,
            ordem: 1,
          },
          {
            id: 50,
            texto: "Colocar a peça em uma posição ativa e útil",
            correta: true,
            ordem: 2,
          },
          {
            id: 51,
            texto: "Retirar a peça do tabuleiro",
            correta: false,
            ordem: 3,
          },
          {
            id: 52,
            texto: "Trocar a peça por um peão",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 14,
        enunciado:
          "Qual é uma forma comum de proteger o rei durante a abertura?",
        ordem: 4,

        alternativas: [
          {
            id: 53,
            texto: "Roque",
            correta: true,
            ordem: 1,
          },
          {
            id: 54,
            texto: "Promoção",
            correta: false,
            ordem: 2,
          },
          {
            id: 55,
            texto: "En passant",
            correta: false,
            ordem: 3,
          },
          {
            id: 56,
            texto: "Xeque-mate",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 15,
        enunciado: "O que deve ser evitado durante os primeiros movimentos?",
        ordem: 5,

        alternativas: [
          {
            id: 57,
            texto: "Desenvolver peças menores",
            correta: false,
            ordem: 1,
          },
          {
            id: 58,
            texto: "Controlar o centro",
            correta: false,
            ordem: 2,
          },
          {
            id: 59,
            texto: "Mover a mesma peça repetidamente sem necessidade",
            correta: true,
            ordem: 3,
          },
          {
            id: 60,
            texto: "Proteger o rei",
            correta: false,
            ordem: 4,
          },
        ],
      },
    ],

    tentativas: [],
  },

  {
    id: 4,
    titulo: "Táticas de Xadrez",
    descricao:
      "Desafie seus conhecimentos sobre táticas e situações comuns durante uma partida.",
    quantidadeQuestoes: 5,
    etapa: 4,

    questoes: [
      {
        id: 16,
        enunciado: "O que é um garfo no xadrez?",
        ordem: 1,

        alternativas: [
          {
            id: 61,
            texto: "Uma jogada que ataca duas ou mais peças ao mesmo tempo",
            correta: true,
            ordem: 1,
          },
          {
            id: 62,
            texto: "Uma troca de damas",
            correta: false,
            ordem: 2,
          },
          {
            id: 63,
            texto: "Uma forma de empate",
            correta: false,
            ordem: 3,
          },
          {
            id: 64,
            texto: "Um movimento especial do rei",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 17,
        enunciado: "O que é um ataque descoberto?",
        ordem: 2,

        alternativas: [
          {
            id: 65,
            texto: "Quando uma peça se move e revela o ataque de outra",
            correta: true,
            ordem: 1,
          },
          {
            id: 66,
            texto: "Quando o rei captura uma peça",
            correta: false,
            ordem: 2,
          },
          {
            id: 67,
            texto: "Quando duas peças são trocadas",
            correta: false,
            ordem: 3,
          },
          {
            id: 68,
            texto: "Quando um peão é promovido",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 18,
        enunciado: "O que caracteriza um xeque?",
        ordem: 3,

        alternativas: [
          {
            id: 69,
            texto: "O rei está sob ataque",
            correta: true,
            ordem: 1,
          },
          {
            id: 70,
            texto: "A dama foi capturada",
            correta: false,
            ordem: 2,
          },
          {
            id: 71,
            texto: "Um peão chegou à última fileira",
            correta: false,
            ordem: 3,
          },
          {
            id: 72,
            texto: "A partida terminou empatada",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 19,
        enunciado: "O que acontece quando ocorre xeque-mate?",
        ordem: 4,

        alternativas: [
          {
            id: 73,
            texto: "O jogador troca a dama",
            correta: false,
            ordem: 1,
          },
          {
            id: 74,
            texto: "A partida termina",
            correta: true,
            ordem: 2,
          },
          {
            id: 75,
            texto: "O rei pode ser capturado",
            correta: false,
            ordem: 3,
          },
          {
            id: 76,
            texto: "Todos os peões são removidos",
            correta: false,
            ordem: 4,
          },
        ],
      },

      {
        id: 20,
        enunciado: "Qual peça é frequentemente utilizada para realizar garfos?",
        ordem: 5,

        alternativas: [
          {
            id: 77,
            texto: "Cavalo",
            correta: true,
            ordem: 1,
          },
          {
            id: 78,
            texto: "Rei",
            correta: false,
            ordem: 2,
          },
          {
            id: 79,
            texto: "Torre",
            correta: false,
            ordem: 3,
          },
          {
            id: 80,
            texto: "Peão",
            correta: false,
            ordem: 4,
          },
        ],
      },
    ],

    tentativas: [],
  },
];
