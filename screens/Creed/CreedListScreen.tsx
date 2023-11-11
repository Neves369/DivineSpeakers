import {
  List,
  Input,
  Layout,
  Spinner,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { ToastAndroid, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { CatchismItem } from "../../components/catechismItem";
import React, { useState, useCallback, memo } from "react";

const CreedList = () => {
  const navigation = useNavigation();
  const [offset, setOffset] = useState(null);
  const styles = useStyleSheet(themedStyles);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setisListEnd] = useState(false);

  const getData = async () => {
    if (!loading && !isListEnd) {
      setLoading(true);
      firestore()
        .collection("credos")
        .orderBy("titulo")
        .startAfter(offset)
        .limit(10)
        .get()
        .then((query: any) => {
          if (query.docs.length > 0) {
            let filter = query.docs.map((item: any) => item._data);
            setOffset(query.docs[query.docs.length - 1]);
            setData([...data, ...filter]);
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
          navigation.navigate("Credo", item);
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
    <List
      style={styles.list}
      data={data}
      renderItem={renderItem}
      // ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.5}
      keyExtractor={(item) => `${item.titulo}`}
      onEndReached={() => {
        getData();
      }}
    />
  );
};

export default memo(CreedList);

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
