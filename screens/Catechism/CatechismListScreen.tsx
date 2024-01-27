import {
  List,
  Input,
  Layout,
  Spinner,
  StyleService,
  useStyleSheet,
  Divider,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { ToastAndroid, View } from "react-native";
import useColorScheme from "../../hooks/useColorScheme";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { CatchismItem } from "../../components/catechismItem";
import React, { useState, useCallback, useEffect, memo } from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const CatechismList = () => {
  const navigation = useNavigation();
  const [offset, setOffset] = useState(null);
  const styles = useStyleSheet(themedStyles);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListEnd, setisListEnd] = useState(false);

  const getData = async () => {
    if (!loading && !isListEnd) {
      setLoading(true);
      firestore()
        .collection("catecismos")
        .orderBy("titulo")
        .startAfter(offset)
        .limit(10)
        .get()
        .then((query: any) => {
          if (query.docs.length > 0) {
            let filter = query.docs.map((item: any) => item._data);
            setOffset(query.docs[query.docs.length - 1]);
            setData([...data, ...filter]);
            setFilter([...data, ...filter]);
            setLoading(false);
          } else {
            setisListEnd(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          ToastAndroid.show(
            "Não foi possível buscar dados!",
            ToastAndroid.SHORT
          );
        });
    }
  };

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <CatchismItem
        key={item.titulo}
        style={styles.item}
        message={item}
        onPress={() => {
          //@ts-ignore
          navigation.navigate("Catecismo", item);
        }}
      />
    );
  }, []);

  const renderFooter = (): React.ReactElement => (
    <View
      style={{
        width: "100%",
        height: 25,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? <Spinner status="warning" /> : <></>}
    </View>
  );

  useEffect(() => {
    if (searchTerm.length == 0) {
      setFilter(data);
    } else {
      const resposta: any = [];
      data.map((credo) => {
        if (
          credo?.titulo
            ?.toLowerCase()
            .normalize()
            .indexOf(searchTerm.toLowerCase().normalize(), 0) >= 0 ||
          credo?.autor
            ?.toLowerCase()
            .normalize()
            .indexOf(searchTerm.toLowerCase().normalize(), 0) >= 0
        ) {
          resposta.push(credo);
        }
      });
      setFilter(resposta);
    }
  }, [searchTerm]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
      }}
    >
      <Input
        value={searchTerm}
        style={{ margin: 5 }}
        placeholder="Pesquisar"
        accessoryRight={
          <Ionicons
            name="search"
            size={24}
            color={useColorScheme() == "light" ? "black" : "white"}
          />
        }
        onChangeText={(value) => setSearchTerm(value)}
      />
      <Divider />
      <List
        style={styles.list}
        data={filter}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => `${item.titulo}`}
        onEndReached={() => {
          if (searchTerm.length == 0) {
            getData();
          }
        }}
      />
      <BannerAd
        unitId={"ca-app-pub-9187411594153289/1764293873"}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

export default memo(CatechismList);

const themedStyles = StyleService.create({
  list: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 8,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "background-basic-color-1",
  },
});
