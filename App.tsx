import Routes from "./routes";
import * as eva from "@eva-design/eva";
import { AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/auth";
import React, { useEffect, useRef } from "react";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { ModalPermission } from "./components/permissions-modal";

export default function App() {
  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        <StatusBar translucent />
        <AuthProvider>
          <Routes />
          <ModalPermission />
        </AuthProvider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
