import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text } from "@ui-kitten/components";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Animated,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const Home = () => {
  const flatlistRef = useRef();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);
  const [timerCount, setTimer] = useState<number>(10);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setIndex(roundIndex);
    },
    []
  );

  async function getData() {
    const data: any = await firestore()
      .collection("autores")
      .where("principais", "==", true)
      .get();
    setData(data._docs);
    setShow(true);
  }

  const scrollToIndex = () => {
    let ind = index + 1;
    if (ind >= data.length) {
      ind = 0;
    }
    flatlistRef.current.scrollToIndex({ animated: true, index: ind });

    return setTimer(10);
  };

  function renderCarousel(data: any) {
    const renderItem = useCallback(({ item, index }: any) => {
      return (
        <TouchableOpacity
          key={`item-${index}`}
          style={{ justifyContent: "flex-end" }}
          onPress={() => {
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
              {item._data.nome}
            </Text>
            <Text category="h6" status="control">
              {item._data.titulo}
            </Text>
            <Text
              style={{ marginTop: 25, textAlign: "justify" }}
              category="s2"
              status="control"
            >
              {item._data.descricao}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }, []);

    if (show) {
      return (
        <>
          <View style={[StyleSheet.absoluteFillObject]}>
            <Animated.Image
              key={`image-${index}`}
              source={{
                uri: data[index]._data.foto,
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
            ref={flatlistRef}
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
      return <></>;
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Atualiza o temporizador
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     if (timerCount == 0) {
  //       scrollToIndex();
  //     }
  //     if (timerCount > 0) {
  //       setTimer((lastTimerCount) => {
  //         lastTimerCount <= 1 && clearInterval(interval);
  //         return lastTimerCount - 1;
  //       });
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [timerCount]);

  return (
    <View style={styles.container}>
      {renderCarousel(data)}
      <View
        style={{
          // backgroundColor: "red",
          height: 50,
          width: "100%",
          position: "absolute",
          top: 50,
          justifyContent: "center",
          paddingLeft: 12,
        }}
      >
        <Entypo
          name="menu"
          size={30}
          color="white"
          onPress={() => {
            navigation.navigate("Menu");
          }}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
});
