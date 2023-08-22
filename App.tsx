import Routes from "./routes";
import * as eva from "@eva-design/eva";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/auth";
import React, { useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { ModalPermission } from "./components/permissions-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import { Button, View, Text } from "react-native";

// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
//   requestNonPersonalizedAdsOnly: true,
// });

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

  // const loadInterstitial = () => {
  //   const unsubscribeLoaded = interstitial.addAdEventListener(
  //     AdEventType.LOADED,
  //     () => {
  //       setInterstitialLoaded(true);
  //     }
  //   );

  //   const unsubscribeClosed = interstitial.addAdEventListener(
  //     AdEventType.CLOSED,
  //     () => {
  //       setInterstitialLoaded(false);
  //       interstitial.load();
  //     }
  //   );

  //   interstitial.load();

  //   return () => {
  //     unsubscribeClosed();
  //     unsubscribeLoaded();
  //   };
  // };

  useEffect(() => {
    setupFirebase();
    // const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      // unsubscribeInterstitialEvents();
    };
  }, []);

  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        <StatusBar translucent />
        <AuthProvider>
          <Routes />
          <ModalPermission />
          {/* <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {interstitialLoaded ? (
              <Button
                title="Show Interstitial"
                onPress={() => interstitial.show()}
              />
            ) : (
              <Text>Loading Interstitial...</Text>
            )}
          </View> */}
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
