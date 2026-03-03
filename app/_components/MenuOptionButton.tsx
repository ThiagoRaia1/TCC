import {
  Pressable,
  Text,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface MenuOptionButtonProps {
  containerStyle: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  onPress: () => void;
  enabled?: boolean;
}

export default function MenuOptionButton({
  containerStyle,
  hoverStyle = { opacity: 0.7 },
  pressedStyle = { opacity: 0.5 },
  labelStyle,
  label,
  icon,
  onPress,
  enabled = true,
}: MenuOptionButtonProps) {
  return (
    <Pressable
      disabled={!enabled}
      style={(state: any) => [
        containerStyle,
        !enabled && { opacity: 0.5, cursor: "not-allowed" },
        enabled && Platform.OS === "web" && state.hovered && hoverStyle,
        enabled && state.pressed && pressedStyle,
      ]}
      onPress={enabled ? onPress : undefined}
    >
      {icon}
      <Text style={labelStyle} selectable={false}>
        {label}
      </Text>
    </Pressable>
  );
}