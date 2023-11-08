import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { View, StyleSheet, ScrollView, Modal } from "react-native";
import {
  Layout,
  Text,
  Button,
  Divider,
  Card,
  List,
  ListItem,
} from "@ui-kitten/components";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import data from "../data.json";

const interstitial = InterstitialAd.createForAdRequest(
  "ca-app-pub-9187411594153289/4560480625",
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const CatechismArchive = ({ route, navigation }: any) => {
  const [show, setShow] = useState(false);
  const [capitulos, setCapitulos] = useState<any>([]);
  const [documento, setDocumento] = useState(route.params);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    setCapitulos(Object.keys(documento.texto));
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
              // category="h4"
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

  const renderItem = useCallback(({ item, index }: any) => {
    return <ListItem title={item} onPress={() => {}} />;
  }, []);

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
        <Card style={{ margin: 7 }}>
          <List
            style={styles.list}
            data={capitulos?.sort()}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            ListEmptyComponent={
              <View
                style={{
                  width: "100%",
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center", color: "grey" }}>
                  Nenhum capítulo encontrado
                </Text>
              </View>
            }
          />
        </Card>
      </ScrollView>

      {/* <Modal visible={show} style={styles.backdrop}>
        <StatusBar backgroundColor="white" />
        <Card
          disabled={true}
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {documento.titulo}
          </Text>
          <View style={{ height: 10 }} />
          <ScrollView showsVerticalScrollIndicator>
            <Text style={{ textAlign: "justify", fontSize: 14 }}>
              {documento.texto.replaceAll("<br />", "\n")}
            </Text>
          </ScrollView>
          <View style={{ height: 80, justifyContent: "center" }}>
            <View style={{ height: 10 }} />
            <Button
              status="warning"
              onPress={() => {
                setShow(false);
              }}
            >
              FECHAR
            </Button>
          </View>
        </Card>
      </Modal> */}
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
  backdrop: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
});
