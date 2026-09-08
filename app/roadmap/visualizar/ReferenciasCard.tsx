import { ChevronUp, ChevronDown } from "lucide-react-native";
import {
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../../styles/colors";
import {
  getIconReferencia,
  TipoReferencia,
  tiposReferencia,
} from "../../../utils/tiposReferencia";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { useState } from "react";
import { IReferencia } from "../../../interfaces/referencia";

const styles = StyleSheet.create({
  cardTitulo: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
  },
});

type ReferenciasCardProps = {
  item: {
    id: number;
    referencias?: IReferencia[];
  };

  tipoItem: "objetivo" | "etapa";

  onAdicionarReferencia: (
    itemId: number,
    tipo: TipoReferencia,
    nome: string,
    url: string,
  ) => void;
};

export default function ReferenciasCard({
  item,
  tipoItem,
  onAdicionarReferencia,
}: ReferenciasCardProps) {
  const globalStyles = getGlobalStyles();

  const [tipoReferencia, setTipoReferencia] =
    useState<TipoReferencia>("Artigo");
  const [nomeReferencia, setNomeReferencia] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const adicionarReferencia = () => {
    if (!nomeReferencia.trim() || !urlReferencia.trim()) return;

    onAdicionarReferencia(
      item.id,
      tipoReferencia,
      nomeReferencia.trim(),
      urlReferencia.trim(),
    );

    setNomeReferencia("");
    setUrlReferencia("");
  };

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.cardTitulo}>Referências e Materiais</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          height: 32,
          margin: 12,
          zIndex: 2,
        }}
      >
        {/* DROPDOWN */}
        <View style={{ position: "relative" }}>
          <Pressable
            style={[
              globalStyles.secondaryButton,
              {
                height: "100%",
                width: 140,
                zIndex: 2,
                boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
              },
            ]}
            onPress={() => setDropdownAberto((prev) => !prev)}
          >
            {getIconReferencia(tipoReferencia)}

            <Text style={globalStyles.secondaryButtonText}>
              {tipoReferencia}
            </Text>

            {dropdownAberto ? (
              <ChevronUp color="black" size={18} />
            ) : (
              <ChevronDown color="black" size={18} />
            )}
          </Pressable>

          {dropdownAberto && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "white",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#ddd",
                width: "100%",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <View style={{ height: 30 }} />

              {tiposReferencia.map((referencia) => (
                <Pressable
                  key={referencia.tipo}
                  style={({ hovered }: any) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: hovered ? "#F1F5F9" : "white",
                  })}
                  onPress={() => {
                    setTipoReferencia(referencia.tipo);
                    setDropdownAberto(false);
                  }}
                >
                  {referencia.icon}

                  <Text style={{ color: "black" }}>{referencia.tipo}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* NOME */}
        <TextInput
          style={[globalStyles.input, { flex: 3 }]}
          placeholder="Nome (ex: Artigo React)"
          placeholderTextColor={colors.placeholderTextColor}
          value={nomeReferencia}
          onChangeText={setNomeReferencia}
        />

        {/* URL */}
        <TextInput
          style={[globalStyles.input, { flex: 3 }]}
          placeholder="URL (https://...)"
          placeholderTextColor={colors.placeholderTextColor}
          value={urlReferencia}
          onChangeText={setUrlReferencia}
        />

        {/* ADICIONAR */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.lightBlue,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 12,
          }}
          onPress={adicionarReferencia}
        >
          <Text style={{ color: "white" }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* REFERÊNCIAS */}
      {item.referencias && item.referencias.length > 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 12,
            borderColor: "#ccc",
            backgroundColor: "#f8f8f8",
            padding: 12,
            marginHorizontal: 12,
            gap: 8,
          }}
        >
          {item.referencias.map((referencia, index) => (
            <View
              key={referencia.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                minHeight: 32,
                borderBottomWidth:
                  index === item.referencias!.length - 1 ? 0 : 2,
                borderBottomColor: "#ddd",
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {getIconReferencia(referencia.tipo)}

                <Text
                  style={[globalStyles.secondaryButtonText, { flexShrink: 1 }]}
                >
                  [{referencia.tipo}] - {referencia.nome} →{" "}
                  <Text
                    style={{ color: "blue" }}
                    onPress={() => {
                      if (referencia.url) {
                        Linking.openURL(referencia.url);
                      }
                    }}
                  >
                    {referencia.url}
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text
          style={{
            color: colors.placeholderTextColor,
            marginHorizontal: 12,
          }}
        >
          Este {tipoItem} ainda não possui referências.
        </Text>
      )}
    </View>
  );
}
