import { View, StyleSheet, ScrollView, Modal } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Text,
  Button,
  Divider,
  Card,
  List,
  ListItem,
} from "@ui-kitten/components";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import useColorScheme from "../../hooks/useColorScheme";
import Ads from "../../components/Ads";

const CreedArchive = ({ route, navigation }: any) => {
  const [show, setShow] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [documento, setDocumento] = useState(route.params);
  const [textoSelecionado, setTextoSelecionado] = useState("");
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {}, []);

  const renderHeader = () => {
    return (
      <>
        <Layout style={styles.header} level="1">
          <View style={styles.profileDetailsContainer}>
            <Text
              category="h5"
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
        <View
          style={{
            backgroundColor: "#0000004d",
            height: 250,
            width: "100%",
            position: "absolute",
            top: -20,
          }}
        />
        <Divider style={{ elevation: 2 }} />
      </>
    );
  };

  const changeFont = (item: any) => {
    setFontSize(fontSize + item);
  };

  const selectCap = (item: any) => {
    setTitulo(item);
    setTextoSelecionado(documento.texto);
    setShow(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
      }}
    >
      {renderHeader()}
      <ScrollView>
        <Card style={{ margin: 7, elevation: 1 }}>
          <Text style={{ textAlign: "justify", letterSpacing: 0.5 }}>
            {documento.descricao}
          </Text>
        </Card>
        <Card style={{ margin: 7, elevation: 1 }}>
          <Text style={{ textAlign: "justify", fontWeight: "bold" }}>
            Texto
          </Text>
          <ListItem
            title={`1 - ${documento.titulo}`}
            onPress={() => {
              selectCap(documento.titulo);
            }}
          />
        </Card>
      </ScrollView>

      <Modal visible={show} style={styles.backdrop}>
        <StatusBar
          backgroundColor={useColorScheme() == "light" ? "#FFFFFF" : "#1A2138"}
        />
        <Card disabled={true} style={{ width: "100%", height: "100%" }}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {titulo}
          </Text>
          <View style={{ height: 10 }} />
          <ScrollView showsVerticalScrollIndicator style={{ minHeight: "90%" }}>
            <Text
              style={{
                textAlign: "justify",
                fontSize: fontSize,
                paddingBottom: 10,
              }}
            >
              {textoSelecionado.replaceAll("<br />", "\n")}
            </Text>
          </ScrollView>
          <View
            style={{
              borderTopColor: "grey",
              borderTopWidth: 1,
              height: 80,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <AntDesign
              name="minuscircleo"
              size={30}
              color={useColorScheme() == "light" ? "black" : "white"}
              onPress={() => {
                changeFont(-1);
              }}
            />
            <AntDesign
              name="menufold"
              size={30}
              color={useColorScheme() == "light" ? "black" : "white"}
              onPress={() => {
                setShow(false);
              }}
            />
            <AntDesign
              name="pluscircleo"
              size={30}
              color={useColorScheme() == "light" ? "black" : "white"}
              onPress={() => {
                changeFont(1);
              }}
            />
          </View>
        </Card>
      </Modal>
      <Ads />
    </View>
  );
};

export default CreedArchive;

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
