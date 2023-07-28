import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import Routes from "./routes";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        <StatusBar translucent />
        <Routes />
      </ApplicationProvider>
    </NavigationContainer>
  );
}
