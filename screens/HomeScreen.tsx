import React, { memo, useCallback, useEffect, useState } from "react";
import { Spinner, Text } from "@ui-kitten/components";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
const { width } = Dimensions.get("screen");
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  clearCache,
  retrieveDataFromCache,
  storeDataInCache,
} from "../components/cache";

const Home = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setIndex(roundIndex);
    },
    []
  );

  const getData = async () => {
    // await clearCache();
    // let carossel: any = await retrieveDataFromCache("caroussel");
    if (false) {
      // setData(carossel);
      setShow(true);
    } else {
      firestore()
        .collection("autores")
        .where("principais", "==", true)
        .onSnapshot((query: any) => {
          if (query.docs.length > 0) {
            let filter = query.docs.map((item: any) => item._data);
            setData(filter);
            // storeDataInCache(filter, "caroussel");
            setShow(true);
          } else {
            setShow(true);
          }
        });
    }
  };

  const renderCarousel = (data: any) => {
    const renderItem = useCallback(({ item, index }: any) => {
      return (
        <TouchableOpacity
          key={`item-${index}`}
          style={{ justifyContent: "flex-end" }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Archive", item);
          }}
        >
          <View
            style={{
              width,
              height: 300,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              backgroundColor: "rgba(0,0,0, 0)",
              paddingHorizontal: 24,
              paddingBottom: 0,
            }}
          >
            <Text category="h1" status="control">
              {item.nome}
            </Text>
            <Text category="h6" status="control">
              {item.titulo}
            </Text>
            <Text
              style={{ marginTop: 25, textAlign: "justify" }}
              category="s2"
              status="control"
            >
              {item.descricao}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }, []);

    if (show) {
      return (
        <>
          <View style={[StyleSheet.absoluteFillObject]}>
            <Image
              key={`image-${index}`}
              cachePolicy={"disk"}
              source={{
                uri: data[index].foto,
              }}
              style={[
                StyleSheet.absoluteFillObject,
                { opacity: 1, backgroundColor: "black" },
              ]}
              blurRadius={0}
            />
          </View>
          <FlatList
            data={data}
            onScroll={onScroll}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
          <View
            style={{
              height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 25,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(200, 200, 200, 0.05)",
                height: 5,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {data?.map((item: any, indx: any) => {
                return (
                  <View
                    key={`dot-${indx}`}
                    style={{
                      width: indx == index ? 15 : 10,
                      height: indx == index ? 15 : 10,
                      borderRadius: 15,
                      backgroundColor:
                        indx == index
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.5)",
                    }}
                  />
                );
              })}
            </View>
          </View>
        </>
      );
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

  useEffect(() => {
    if (data.length == 0) {
      getData();
    }
  }, []);

  return (
    <View style={styles.container}>
      {renderCarousel(data)}
      <View
        style={{
          flexDirection: "row",
          height: 50,
          width: "100%",
          position: "absolute",
          top: 50,
          alignItems: "center",
          paddingLeft: 12,
        }}
      >
        <Entypo
          name="menu"
          size={30}
          color="white"
          style={{ position: "absolute", left: 8 }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Menu");
          }}
        />
        <Ionicons
          style={{ position: "absolute", right: 8 }}
          name="settings-sharp"
          size={30}
          color="white"
        />
      </View>
    </View>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
});
