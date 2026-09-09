import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CircleX, Sparkles } from "lucide-react-native";
import { getGlobalStyles } from "../../styles/globalStyles";
import { colors } from "../../styles/colors";

type GerarRoadmapModalProps = {
  visible: boolean;
  onClose: () => void;
  onGerar: (tema: string) => void;
};

const { height } = Dimensions.get("window");

export default function GerarRoadmapModal({
  visible,
  onClose,
  onGerar,
}: GerarRoadmapModalProps) {
  const [tema, setTema] = useState("");
  const globalStyles = getGlobalStyles();

  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Começa fora da tela
      translateY.setValue(height);
      opacity.setValue(0);

      // Entrada
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const fecharModal = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const gerarRoadmap = () => {
    const temaFormatado = tema.trim();

    if (!temaFormatado) {
      return;
    }

    onGerar(temaFormatado);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={fecharModal}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity,
          },
        ]}
      >
        {/* Área externa clicável */}
        <Pressable style={StyleSheet.absoluteFill} onPress={fecharModal} />

        {/* Conteúdo do modal */}
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Gerar novo roadmap</Text>

                <Text style={styles.subtitle}>
                  Informe o que você deseja aprender
                </Text>
              </View>
            </View>

            {/* Input */}
            <View style={styles.content}>
              <Text style={styles.label}>Tema do roadmap</Text>

              <TextInput
                style={globalStyles.input}
                value={tema}
                onChangeText={setTema}
                placeholder="Ex: JavaScript, React Native, Xadrez..."
                placeholderTextColor={colors.placeholderTextColor}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={gerarRoadmap}
              />

              <Text style={styles.helper}>
                A IA criará um roadmap completo baseado nesse tema.
              </Text>
            </View>

            {/* Botões */}
            <View style={styles.buttons}>
              <Pressable style={styles.cancelButton} onPress={fecharModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.generateButton,
                  !tema.trim() && styles.generateButtonDisabled,
                ]}
                onPress={gerarRoadmap}
                disabled={!tema.trim()}
              >
                <Sparkles size={18} color="white" />

                <Text style={styles.generateButtonText}>Gerar roadmap</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },

  content: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  helper: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 28,
  },

  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },

  generateButtonDisabled: {
    opacity: 0.5,
  },

  generateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
