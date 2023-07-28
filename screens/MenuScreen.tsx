import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MessageItem } from "../components/message-item";
import firestore from "@react-native-firebase/firestore";

const Menu = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);
  const styles = useStyleSheet(themedStyles);
  const [searchQuery, setSearchQuery] = React.useState<string>();

  async function getData() {
    const data: any = await firestore()
      .collection("autores")
      .orderBy("nome")
      .get();
    setData(data._docs);
    setShow(true);
  }

  useEffect(() => {
    getData();
  }, []);

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <MessageItem
        style={styles.item}
        message={item}
        onPress={() => {
          navigation.navigate("Archive", item);
        }}
      />
    );
  }, []);

  const renderHeader = (): React.ReactElement => (
    <Layout style={styles.header} level="1">
      <Input
        placeholder="Search"
        value={searchQuery}
        accessoryRight={<Ionicons name="search" size={24} color="black" />}
      />
    </Layout>
  );

  if (show) {
    return (
      <List
        style={styles.list}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      />
    );
  } else {
    return <></>;
  }
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
