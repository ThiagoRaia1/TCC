import { createContext, useContext, useState } from "react";

import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

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

      <Modal transparent visible={visible} animationType="none">
        <View style={styles.overlay}>
          <ActivityIndicator size={100} color="#fff" />
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
