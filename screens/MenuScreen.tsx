import React, { useState, useCallback } from "react";
import {
  List,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
  Spinner,
} from "@ui-kitten/components";
import { ToastAndroid, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MessageItem } from "../components/message-item";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Menu = () => {
  const navigation = useNavigation();
  const [offset, setOffset] = useState(null);
  const styles = useStyleSheet(themedStyles);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setisListEnd] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState<string>();

  function getData() {
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
            setOffset(query.docs[query.docs.length - 1]);
            setData([...data, ...query.docs]);
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
          console.error(error);
        });
    }
  }

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setOffset(null);
      setLoading(false);
      setisListEnd(false);
      getData();
    }, [])
  );

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <MessageItem
        style={styles.item}
        message={item}
        onPress={() => {
          //@ts-ignore
          navigation.navigate("Archive", item._data);
        }}
      />
    );
  }, []);

  const renderHeader = (): React.ReactElement => (
    <Layout style={styles.header} level="1">
      <Input
        placeholder="Search"
        value={searchQuery}
        //@ts-nocheck
        accessoryRight={<Ionicons name="search" size={24} />}
      />
    </Layout>
  );

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
    <List
      style={styles.list}
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.5}
      keyExtractor={(item) => `${item.id}`}
      onEndReached={() => {
        getData();
      }}
    />
  );
};

export default Menu;

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
