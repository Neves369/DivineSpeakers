import {
  List,
  Text,
  Input,
  Layout,
  Spinner,
  Divider,
  useStyleSheet,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import useColorScheme from "../../hooks/useColorScheme";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid, View, StyleSheet } from "react-native";
import { CatchismItem } from "../../components/catechismItem";
import React, { useState, useCallback, useEffect, memo } from "react";
import Ads from "../../components/Ads";

const ConfissionList = () => {
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
        .collection("confissoes")
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
          navigation.navigate("Confissão", item);
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

  const renderHeader = (): React.ReactElement => (
    <Layout level="1" style={themedStyles.header}>
      <Input
        value={searchTerm}
        style={themedStyles.input}
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
      <Text
        appearance="hint"
        style={{ textAlign: "right", margin: 5, fontSize: 12 }}
      >
        {data.length} Documentos
      </Text>
      <Divider />
    </Layout>
  );

  useEffect(() => {
    if (searchTerm.length == 0) {
      setFilter(data);
    } else {
      const resposta: any = [];
      data.map((conf) => {
        if (
          conf?.titulo
            ?.toLowerCase()
            .normalize()
            .indexOf(searchTerm.toLowerCase().normalize(), 0) >= 0 ||
          conf?.autor
            ?.toLowerCase()
            .normalize()
            .indexOf(searchTerm.toLowerCase().normalize(), 0) >= 0
        ) {
          resposta.push(conf);
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
      <List
        style={styles.list}
        data={filter}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => `${item.titulo}`}
        onEndReached={() => {
          if (searchTerm.length == 0) {
            getData();
          }
        }}
      />
      <Ads />
    </View>
  );
};

export default memo(ConfissionList);

const themedStyles = StyleSheet.create({
  list: {
    flex: 1,
  },
  header: {
    elevation: 5,
    marginBottom: 5,
  },
  item: {
    paddingVertical: 16,
    elevation: 5,
    margin: 5,
    borderRadius: 5,
  },
  input: {
    margin: 5,
    opacity: 0.5,
    borderColor: "#DDD",
    borderWidth: 1,
  },
});
