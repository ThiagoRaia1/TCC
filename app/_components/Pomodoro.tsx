import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from "react-native";

import { colors } from "../../styles/colors";

import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Settings,
  X,
  Minimize2,
} from "lucide-react-native";

type PomodoroMode = "foco" | "pausa";

export default function Pomodoro() {
  const [minimizado, setMinimizado] = useState(true);
  const [configurando, setConfigurando] = useState(false);
  const [modalPausa, setModalPausa] = useState(false);

  const [minutosFoco, setMinutosFoco] = useState("25");
  const [minutosPausa, setMinutosPausa] = useState("5");

  const [modo, setModo] = useState<PomodoroMode>("foco");
  const [segundos, setSegundos] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);

  const renderModalPausa = () => {
    return (
      <Modal
        visible={modalPausa}
        transparent
        animationType="fade"
        onRequestClose={continuarEstudando}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalPausa}>
            <Brain color={colors.lightBlue} size={60} />

            <Text style={styles.modalTitulo}>Hora de descansar!</Text>

            <Text style={styles.modalDescricao}>
              Você concluiu seu período de foco.
            </Text>

            <Text style={styles.modalLabel}>Tempo de descanso</Text>

            <Text style={styles.modalTimer}>{formatarTempo()}</Text>

            <Pressable
              style={styles.continuarButton}
              onPress={continuarEstudando}
            >
              <Play size={20} color="white" />

              <Text style={styles.continuarText}>Continuar estudando</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (!rodando) return;

    const interval = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          if (modo === "foco") {
            // Terminou o foco → inicia a pausa
            setModo("pausa");
            setModalPausa(true);

            return Number(minutosPausa) * 60;
          }

          // Terminou a pausa → inicia um novo ciclo de foco
          setModalPausa(false);
          setModo("foco");

          return Number(minutosFoco) * 60;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rodando, modo, minutosFoco, minutosPausa]);

  // ==========================================
  // CONFIGURAÇÃO
  // ==========================================

  const abrirConfiguracao = () => {
    setRodando(false);
    setConfigurando(true);
  };

  const salvarConfiguracao = () => {
    const foco = Math.max(1, Number(minutosFoco) || 25);
    const pausa = Math.max(1, Number(minutosPausa) || 5);

    setMinutosFoco(String(foco));
    setMinutosPausa(String(pausa));

    setModo("foco");
    setSegundos(foco * 60);

    setConfigurando(false);
  };

  // ==========================================
  // CONTROLES
  // ==========================================

  const iniciar = () => {
    setRodando(true);
  };

  const pausar = () => {
    setRodando(false);
  };

  const resetar = () => {
    setRodando(false);
    setModo("foco");
    setSegundos(Number(minutosFoco) * 60);
  };

  const continuarEstudando = () => {
    setModalPausa(false);

    setModo("foco");
    setSegundos(Number(minutosFoco) * 60);

    setRodando(true);
  };

  // ==========================================
  // FORMATAR TEMPO
  // ==========================================

  const formatarTempo = () => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(
      segundosRestantes,
    ).padStart(2, "0")}`;
  };

  return (
    <>
      {!modalPausa && (
        <>
          {minimizado ? (
            // MENU MINIMIZADO
            <Pressable
              style={styles.painelMinimizado}
              onPress={() => setMinimizado(false)}
            >
              <Brain color={colors.lightBlue} size={38} />

              <View style={styles.timerMinimizadoContainer}>
                <Text style={styles.modoMinimizado}>
                  {modo === "foco" ? "Foco" : "Pausa"}
                </Text>

                <Text style={styles.timerMinimizado}>{formatarTempo()}</Text>
              </View>
            </Pressable>
          ) : configurando ? (
            // CONFIGURAÇÃO
            <View style={styles.painel}>
              <View style={styles.header}>
                <View style={styles.headerTitulo}>
                  <Brain color={colors.lightBlue} size={30} />

                  <Text style={styles.titulo}>Configurar Pomodoro</Text>
                </View>

                <Pressable onPress={() => setConfigurando(false)}>
                  <X size={24} color="#666" />
                </Pressable>
              </View>

              <View style={styles.configContainer}>
                <View style={styles.configItem}>
                  <Text style={styles.label}>Tempo de foco</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      value={minutosFoco}
                      onChangeText={setMinutosFoco}
                      keyboardType="numeric"
                      style={styles.input}
                    />

                    <Text style={styles.minutos}>minutos</Text>
                  </View>
                </View>

                <View style={styles.configItem}>
                  <Text style={styles.label}>Tempo de pausa</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      value={minutosPausa}
                      onChangeText={setMinutosPausa}
                      keyboardType="numeric"
                      style={styles.input}
                    />

                    <Text style={styles.minutos}>minutos</Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={styles.salvarButton}
                onPress={salvarConfiguracao}
              >
                <Text style={styles.salvarText}>Salvar configuração</Text>
              </Pressable>
            </View>
          ) : (
            // TIMER NORMAL
            <View style={styles.painelTimer}>
              <View style={styles.timerInfo}>
                <Brain color={colors.lightBlue} size={35} />

                <View>
                  <Text style={styles.modo}>
                    {modo === "foco" ? "Foco" : "Pausa"}
                  </Text>

                  <Text style={styles.timer}>{formatarTempo()}</Text>
                </View>
              </View>

              <View style={styles.controles}>
                <Pressable
                  style={styles.controleButton}
                  onPress={rodando ? pausar : iniciar}
                >
                  {rodando ? (
                    <Pause size={22} color={colors.lightBlue} />
                  ) : (
                    <Play size={22} color={colors.lightBlue} />
                  )}
                </Pressable>

                <Pressable style={styles.controleButton} onPress={resetar}>
                  <RotateCcw size={20} color={colors.lightBlue} />
                </Pressable>

                <Pressable
                  style={styles.controleButton}
                  onPress={abrirConfiguracao}
                >
                  <Settings size={20} color={colors.lightBlue} />
                </Pressable>

                <Pressable
                  style={styles.controleButton}
                  onPress={() => setMinimizado(true)}
                >
                  <Minimize2 size={20} color={colors.lightBlue} />
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}

      {/* MODAL DE PAUSA */}
      {renderModalPausa()}
    </>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // BOTÃO FECHADO
  // ==========================================

  container: {
    position: "absolute",

    bottom: 20,
    right: 20,

    width: 250,
    height: 90,

    backgroundColor: "white",

    borderRadius: 50,

    borderColor: colors.lightBlue,
    borderWidth: 2,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",

    gap: 15,

    elevation: 10,
    zIndex: 999,
  },

  botaoInfo: {
    flex: 1,
  },

  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  subtitulo: {
    marginTop: 3,
    fontSize: 13,
    color: "#777",
  },

  // ==========================================
  // PAINEL
  // ==========================================

  painel: {
    position: "absolute",

    bottom: 20,
    right: 20,

    width: 400,

    backgroundColor: "white",

    borderRadius: 20,

    borderWidth: 2,
    borderColor: colors.lightBlue,

    padding: 20,

    elevation: 10,
    zIndex: 999,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  configContainer: {
    marginTop: 20,

    flexDirection: "row",

    gap: 20,
  },

  configItem: {
    flex: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#ddd",

    borderRadius: 10,

    paddingHorizontal: 8,

    gap: 8,
  },

  input: {
    flex: 2,
    width: 80,

    fontSize: 18,

    paddingVertical: 10,

    color: "#222",

    outlineStyle: "none" as any,
  },

  minutos: {
    flex: 1,
    fontSize: 13,
    color: "#777",
  },

  salvarButton: {
    marginTop: 20,

    height: 45,

    borderRadius: 10,

    backgroundColor: colors.lightBlue,

    alignItems: "center",
    justifyContent: "center",
  },

  salvarText: {
    color: "white",
    fontWeight: "700",
  },

  // ==========================================
  // TIMER
  // ==========================================

  painelTimer: {
    position: "absolute",

    bottom: 20,
    right: 20,

    gap: 16,

    backgroundColor: "white",

    borderRadius: 50,

    borderColor: colors.lightBlue,
    borderWidth: 2,

    paddingVertical: 12,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 10,
    zIndex: 999,
  },

  timerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  modo: {
    fontSize: 13,
    color: "#777",
  },

  timer: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginTop: -8,
  },

  controles: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  controleButton: {
    width: 38,
    height: 38,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#ddd",

    alignItems: "center",
    justifyContent: "center",
  },

  // ==========================================
  // PAINEL MINIMIZADO
  // ==========================================

  painelMinimizado: {
    position: "absolute",

    bottom: 20,
    right: 20,

    backgroundColor: "white",

    borderRadius: 40,

    borderWidth: 2,
    borderColor: colors.lightBlue,

    paddingVertical: 12,
    paddingHorizontal: 24,

    flexDirection: "row",
    alignItems: "center",

    elevation: 10,
    zIndex: 999,
  },

  timerMinimizadoContainer: {
    flex: 1,

    marginLeft: 10,
  },

  modoMinimizado: {
    fontSize: 12,
    color: "#777",
  },

  timerMinimizado: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: -4,
  },

  abrirButton: {
    width: 38,
    height: 38,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#ddd",

    alignItems: "center",
    justifyContent: "center",
  },

  //   MODAL PAUSA
  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.45)",

    alignItems: "center",
    justifyContent: "center",
  },

  modalPausa: {
    width: 420,

    backgroundColor: "white",

    borderRadius: 24,

    padding: 30,

    alignItems: "center",

    borderWidth: 2,
    borderColor: colors.lightBlue,

    elevation: 20,
  },

  modalTitulo: {
    marginTop: 15,

    fontSize: 26,

    fontWeight: "700",

    color: "#222",
  },

  modalDescricao: {
    marginTop: 8,

    fontSize: 15,

    color: "#777",

    textAlign: "center",
  },

  modalLabel: {
    marginTop: 25,

    fontSize: 14,

    color: "#777",
  },

  modalTimer: {
    marginTop: 2,

    fontSize: 52,

    fontWeight: "700",

    color: colors.lightBlue,
  },

  continuarButton: {
    marginTop: 25,

    height: 50,

    paddingHorizontal: 25,

    borderRadius: 12,

    backgroundColor: colors.lightBlue,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },

  continuarText: {
    color: "white",

    fontSize: 15,

    fontWeight: "700",
  },
});
