import {
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import data from "../data.json";
import { ToastAndroid } from "react-native";
import React, { useState, memo } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { TouchableOpacity } from "react-native";

const Donate = () => {
  const styles = useStyleSheet(themedStyles);

  const copyToClipboard = (value: any) => {
    Clipboard.setString(value);
    ToastAndroid.show("Copiado para área de tranferência", ToastAndroid.SHORT);
  };

  return (
    <Layout style={styles.container}>
      <Card>
        <Text>
          O aplicativo Divine Speakers é e sempre será gratuito. Todo trabalho
          foi feito e disponibilizado por um único desenvolvedor, que percebeu
          em seu ofício uma forma de espalhar o evangelho e conservar a história
          da igreja, contar um pouco do testemunho dos santos homens de Deus e
          compartilhar obras que foram fundamentais para a igreja ao longo da
          história.
          {"\n\n"}O intuito do app é somente a glória de nosso Senhor Jesus
          Cristo!!!
          {"\n\n"}
          Se este aplicativo de alguma forma abençoou ou tem abençoado sua vida,
          e caso você sinta o desejo de abençoar a vida desse desenvolvedor,
          você pode contribuir para o crescimento do projeto através da chave
          pix, um cafézinho para me manter acordado enquanto trabalho neste
          projeto já ajuda 😉
        </Text>
        <TouchableOpacity onPress={() => copyToClipboard(data.pix)}>
          <Text>{`\n\n ${data.pix}`}</Text>
        </TouchableOpacity>
      </Card>
    </Layout>
  );
};

export default memo(Donate);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
});
