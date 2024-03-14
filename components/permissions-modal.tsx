import data from "../data.json";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { StyleSheet, ScrollView, View, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, CheckBox, Text } from "@ui-kitten/components";

export const ModalPermission = () => {
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    let perm: any = await AsyncStorage.getItem("setTerms");
    if (perm) {
      setVisible(!perm);
    } else {
      setVisible(true);
    }
  };

  const handleSetPermissions = async () => {
    await AsyncStorage.setItem("setTerms", checked.toString());
    setVisible(false);
  };

  return (
    <Modal visible={visible} style={styles.backdrop}>
      <StatusBar
        backgroundColor={useColorScheme() == "light" ? "white" : "#1A2138"}
      />
      <Card disabled={true} style={{ width: "100%", height: "100%" }}>
        <Text style={{ textAlign: "justify", fontWeight: "bold" }}>
          DivineSpeakers - Termos e Condições de Uso
        </Text>
        <View style={{ height: 20 }} />
        <ScrollView showsVerticalScrollIndicator>
          <Text style={{ textAlign: "justify" }}>{data.termos}</Text>
        </ScrollView>
        <View style={{ height: 80, justifyContent: "center" }}>
          <CheckBox
            status="warning"
            checked={checked}
            onChange={(nextChecked) => setChecked(nextChecked)}
          >
            {`Li e Concordo com os termos de uso`}
          </CheckBox>
          <View style={{ height: 10 }} />
          <Button
            disabled={!checked}
            status="warning"
            onPress={() => {
              handleSetPermissions();
            }}
          >
            ENVIAR
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
});
