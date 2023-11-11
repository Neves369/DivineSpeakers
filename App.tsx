import Routes from "./routes";
import * as eva from "@eva-design/eva";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/auth";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { ModalPermission } from "./components/permissions-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

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
    if (!enviou) {
      firestore()
        .collection("tokens")
        .where("token", "==", token)
        .onSnapshot((query: any) => {
          if (query.docs.length < 0) {
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
      <ApplicationProvider {...eva} theme={eva.light}>
        <StatusBar translucent />
        <AuthProvider>
          <Routes />
          <ModalPermission />

          <BannerAd
            unitId={"ca-app-pub-9187411594153289/1764293873"}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </AuthProvider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
