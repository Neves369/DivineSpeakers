import {
  Text,
  Layout,
  Divider,
  Toggle,
  Card,
  Button,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import data from "../data.json";
import {
  View,
  Modal,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect, memo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const styles = useStyleSheet(themedStyles);
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState<boolean>(true);

  useEffect(() => {
    getPermissionNotification();
  }, []);

  useEffect(() => {
    handleNotification(notification);
  }, [notification]);

  const getPermissionNotification = async () => {
    let notif = await AsyncStorage.getItem("notifications");
    if (notif) {
      console.log("o que é notif? ", notif);
      setNotification(Boolean(notif));
    }
  };

  const handleNotification = async (not: boolean) => {
    const token = await messaging().getToken();
    firestore()
      .collection("tokens")
      .where("token", "==", token)
      .get()
      .then((query: any) => {
        if (query.docs.length > 0) {
          console.log("not: ", not);
          firestore()
            .collection("tokens")
            .doc(query.docs[0].id)
            .update({ active: not })
            .then(() => {
              AsyncStorage.setItem("notifications", String(not));
            });
        }
      });
  };

  return (
    <Layout style={styles.container}>
      <>
        <TouchableOpacity activeOpacity={1.0} style={styles.option}>
          <Text category="s2">Receber Notificações</Text>
          <Toggle
            checked={notification}
            onChange={() => {
              setNotification(!notification);
            }}
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.option}>
          <Text category="s2">Política de Privacidade</Text>
          <Entypo
            name="eye-with-line"
            size={24}
            color="rgba(51, 102, 255, 0.3)"
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
          style={styles.option}
        >
          <Text category="s2">Termos de uso</Text>
          <Entypo
            name="text-document"
            size={24}
            color="rgba(51, 102, 255, 0.3)"
          />
        </TouchableOpacity>
        <Divider />
        {/* <TouchableOpacity style={styles.option}>
          <Text category="s2">Limpar Cache</Text>
          <Entypo name="trash" size={24} color="rgba(255, 0, 0, 0.3)" />
        </TouchableOpacity> */}
        <Divider />
      </>

      <Modal visible={visible} style={styles.backdrop}>
        <StatusBar backgroundColor="white" />
        <Card
          disabled={true}
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Text style={{ textAlign: "justify", fontWeight: "bold" }}>
            DivineSpeakers - Termos e Condições de Uso
          </Text>
          <View style={{ height: 20 }} />
          <ScrollView showsVerticalScrollIndicator>
            <Text style={{ textAlign: "justify" }}>{data.termos}</Text>
          </ScrollView>
          <View style={{ height: 80, justifyContent: "center" }}>
            <View style={{ height: 10 }} />
            <Button
              status="warning"
              onPress={() => {
                setVisible(false);
              }}
            >
              FECHAR
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

export default memo(Settings);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },

  backdrop: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
});
