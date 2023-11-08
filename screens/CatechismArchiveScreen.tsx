import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import {
  Layout,
  Text,
  Button,
  List,
  Card,
  Spinner,
  Divider,
} from "@ui-kitten/components";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { Image } from "expo-image";
import WebView from "react-native-webview";
import storage from "@react-native-firebase/storage";
import DownloadFile from "../components/downloadFile";
import { ArchiveItem } from "../components/preacherArchiveItem";

const interstitial = InterstitialAd.createForAdRequest(
  "ca-app-pub-9187411594153289/4560480625",
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const CatechismArchive = ({ route, navigation }: any) => {
  const [documento, setDocumento] = useState(route.params);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();
    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  const renderHeader = () => {
    return (
      <>
        <Layout style={styles.header} level="1">
          <View style={styles.profileDetailsContainer}>
            <Text
              category="h4"
              style={{ textAlign: "center", marginHorizontal: 10 }}
            >
              {documento.titulo}
            </Text>
            <Text appearance="hint" category="s1">
              {documento.autor}
            </Text>
          </View>
          <Image
            source={documento.foto}
            cachePolicy={"disk"}
            style={{
              backgroundColor: "black",
              height: 250,
              width: "100%",
              position: "absolute",
              top: -20,
              zIndex: -999,
            }}
          />
        </Layout>
      </>
    );
  };

  const loadInterstitial = () => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    };
  };

  return (
    <>
      {renderHeader()}
      <ScrollView>
        <Card style={{ margin: 7 }}>
          <Text style={{ textAlign: "justify" }}>{documento.descricao}</Text>
        </Card>
      </ScrollView>
    </>
  );
};

export default CatechismArchive;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 7,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: "row",
    marginHorizontal: -16,
    paddingTop: 240,
    marginBottom: 8,
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
});
