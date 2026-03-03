import { createContext, useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingContextProps {
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps>(
  {} as LoadingContextProps,
);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  function showLoading() {
    setVisible(true);
  }

  function hideLoading() {
    setVisible(false);
  }

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}

      {visible && (
        <View style={styles.overlay}>
          <ActivityIndicator size={100} color="#fff" />
        </View>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});
