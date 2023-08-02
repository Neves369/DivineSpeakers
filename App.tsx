import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import Routes from "./routes";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/auth";
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
