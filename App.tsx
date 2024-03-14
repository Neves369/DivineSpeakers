import Routes from "./routes";
import * as eva from "@eva-design/eva";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/auth";
import React, { useEffect, useState } from "react";
import useColorScheme from "./hooks/useColorScheme";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { ModalPermission } from "./components/permissions-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateModal from "./components/Update-modal";
import PdfModal from "./components/pdf-modal";

export default function App() {
  const setupFirebase = async () => {
    await messaging().registerDeviceForRemoteMessages(); // Somente para iOS
    await messaging().setAutoInitEnabled(true); // Ativar a inicialização automática

    // Obtenha o token do dispositivo (você pode enviar este token para seu servidor)
    const token = await messaging().getToken();
    sendToken(token);
  };

  const sendToken = async (token: string) => {
    let enviou: any = await AsyncStorage.getItem("enviouToken");
    if (enviou !== "true") {
      // console.log("teste: ", token);
      firestore()
        .collection("tokens")
        .where("token", "==", token)
        .onSnapshot((query: any) => {
          // console.log("teste: ", query.docs);
          if (query.docs.length < 1) {
            firestore()
              .collection("tokens")
              .add({ token: token, active: true });
            AsyncStorage.setItem("enviouToken", String(true));
          }
        });
    }
  };

  useEffect(() => {
    setupFirebase();
  }, []);

  return (
    <NavigationContainer>
      <ApplicationProvider
        {...eva}
        theme={useColorScheme() == "light" ? eva.light : eva.dark}
      >
        <StatusBar style="auto" />
        <AuthProvider>
          <Routes />
          <ModalPermission />
          <UpdateModal />
          <PdfModal />
        </AuthProvider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
