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
import { PreacherItem } from "../../components/preacherItem";
import React, { useState, useCallback, useEffect, memo } from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const PreacherList = () => {
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
        .collection("autores")
        .orderBy("nome")
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

  useEffect(() => {
    if (data.length == 0) {
      setData([]);
      setOffset(null);
      setLoading(false);
      setisListEnd(false);
      getData();
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length == 0) {
      setFilter(data);
    } else {
      const resposta: any = [];
      data.map((pregador) => {
        if (
          pregador?.nome
            ?.toLowerCase()
            .normalize()
            .indexOf(searchTerm.toLowerCase().normalize(), 0) >= 0
        ) {
          resposta.push(pregador);
        }
      });
      setFilter(resposta);
    }
  }, [searchTerm]);

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <PreacherItem
        style={styles.item}
        message={item}
        onPress={() => {
          //@ts-ignore
          navigation.navigate("Arquivos", item);
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
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => `${item.ref}`}
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

export default memo(PreacherList);

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
    borderBottomColor: "background-basic-color-3",
  },
});
