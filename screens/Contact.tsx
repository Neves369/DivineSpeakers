import {
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import data from "../data.json";
import React, { useState, memo } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const Contact = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <>
      <Layout style={styles.container}>
        <Card>
          <Text>
            O aplicativo Divine Speakers é desenvolvido por Douglas Brian Neves.
            Em caso de problemas, elogios, críticas e sugestões por favor entrar
            em contato:
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`mailto:${data.contato}`);
            }}
          >
            <Text>{`\n ${data.contato}`}</Text>
          </TouchableOpacity>
        </Card>
      </Layout>

      <BannerAd
        unitId={"ca-app-pub-9187411594153289/1764293873"}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </>
  );
};

export default memo(Contact);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
});
