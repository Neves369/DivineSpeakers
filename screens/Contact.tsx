import {
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import { Linking, TouchableOpacity } from "react-native";
import data from "../data.json";
import React, { useState, memo } from "react";

const Contact = () => {
  const styles = useStyleSheet(themedStyles);

  return (
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
  );
};

export default memo(Contact);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
});
