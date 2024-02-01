import {
  Text,
  List,
  Input,
  Layout,
  Spinner,
  useStyleSheet,
  Divider,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { ToastAndroid, View, StyleSheet } from "react-native";
import useColorScheme from "../../hooks/useColorScheme";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { PreacherItem } from "../../components/preacherItem";
import React, { useState, useCallback, useEffect, memo } from "react";
import Ads from "../../components/Ads";

const PreacherList = () => {
  const navigation = useNavigation();
  const [offset, setOffset] = useState(null);
  const styles = useStyleSheet(themedStyles);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListEnd, setisListEnd] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);

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
          console.log(query.docs.length);
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

  const getDocumentCount = async () => {
    try {
      const collectionReference = firestore().collection("autores");

      const querySnapshot = await collectionReference.get();
      const count = querySnapshot.size;

      setDocumentCount(count);
    } catch (error) {
      console.error("Erro ao obter a contagem de documentos:", error);
    }
  };

  useEffect(() => {
    if (data.length == 0) {
      setData([]);
      setOffset(null);
      setLoading(false);
      setisListEnd(false);
      Promise.all([getData(), getDocumentCount()]);
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
        {documentCount} autores
      </Text>
      <Divider />
    </Layout>
  );

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
        keyExtractor={(item) => `${item.ref}`}
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

export default memo(PreacherList);

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
    borderColor: "#ddd",
    borderWidth: 1,
  },
});
