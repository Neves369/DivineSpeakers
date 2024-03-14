import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AuthContext from "../context/auth";
import MyCarousel from "../components/Carousel";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { Divider, Layout, Spinner, Text } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);
  const { theme }: any = useContext(AuthContext);

  const getData = async () => {
    firestore()
      .collection("autores")
      .where("atributos", "array-contains", theme.ref)
      .onSnapshot((query: any) => {
        if (query.docs.length > 0) {
          let filter: [] = query.docs.map((item: any) => item._data);
          //@ts-ignore
          filter.unshift(theme);
          setData(filter);

          setShow(true);
        } else {
          setShow(true);
        }
      });
  };

  useEffect(() => {
    if (data.length == 0 && theme) {
      getData();
    }
  }, [theme]);

  const renderHeader = (data: any) => {
    if (show) {
      return <MyCarousel navigation={navigation} data={data} />;
    } else {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="giant" status="warning" />
        </View>
      );
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>{renderHeader(data)}</Layout>
      <Divider />
      <ScrollView style={styles.list}>
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Pregadores");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            resizeMode="cover"
            resizeMethod="auto"
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/pregador.png")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              PREGADORES
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.itemReverse]}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Confissões");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            resizeMode="stretch"
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/confissao.webp")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              CONFISSÕES DE FÉ
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Credos");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/credo.jpg")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              CREDOS
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.itemReverse]}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Catecismos");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/catecismo.jpg")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              CATECISMOS
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Outros");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            resizeMode="stretch"
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/outros.webp")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              OUTROS
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.itemReverse]}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Sobre");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/sobre.jpg")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              SOBRE
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Contato");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/contato.jpg")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              CONTATO
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.itemReverse]}
          activeOpacity={0.95}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Doação");
          }}
        >
          <ImageBackground
            style={styles.itemSection}
            imageStyle={{ borderRadius: 3 }}
            source={require("../assets/doacao.webp")}
          />
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle} category="h5">
              DOAÇÃO
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginHorizontal: "3%",
  },
  item: {
    minHeight: 100,
    flexDirection: "row",
  },
  itemReverse: {
    flexDirection: "row-reverse",
  },
  itemSection: {
    flex: 1,
    padding: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
