import React, { useEffect, useState } from "react";
import checkVersion from "../utils/CheckStoreVersion";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Modal, Text } from "@ui-kitten/components";
import { Entypo, Ionicons } from "@expo/vector-icons";

const UpdateModal: React.FC = () => {
  const [update, setUpdate] = useState(false);

  const verifyUpdateStore = async () => {
    try {
      const check = await checkVersion();
      if (check.result === "new") {
        setUpdate(true);
      }
    } catch (e) {}
  };

  useEffect(() => {
    verifyUpdateStore();
  }, []);

  const Header = (props: any): React.ReactElement => (
    <View {...props}>
      <Text style={{ textAlign: "center" }} category="h6">
        Nova Atualização Disponível!
      </Text>
    </View>
  );

  const Footer = (props: any): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size="small"
        status="basic"
        onPress={() => {
          setUpdate(false);
        }}
      >
        Cancelar
      </Button>
      <Button
        style={styles.footerControl}
        size="small"
        status="warning"
        accessoryLeft={() =>
          Platform.OS == "android" ? (
            <Entypo name="google-play" size={24} color="white" />
          ) : (
            <Ionicons name="logo-apple-appstore" size={24} color="white" />
          )
        }
        onPress={() => {
          Linking.openURL("market://details?id=com.neves369.divinespeakers"),
            setUpdate(false);
        }}
      >
        Atualizar
      </Button>
    </View>
  );

  return (
    <Modal
      visible={update}
      backdropStyle={styles.backdrop}
      // onBackdropPress={() => setVisible(false)}
    >
      <Card style={styles.card} header={Header} footer={Footer}>
        <Text>
          Há uma atualização disponível, para melhor experiência recomendamos
          sempre manter o aplicativo atualizado.
        </Text>
      </Card>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "red",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerControl: {
    width: 120,
    marginHorizontal: 2,
  },
});
