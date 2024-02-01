import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import Menu from "../components/Menu";
import AuthContext from "../context/auth";
const { width } = Dimensions.get("screen");
import { Spinner, Text } from "@ui-kitten/components";
import firestore from "@react-native-firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
const imageW = width * 0.7;
const imageH = imageW * 1.54;

const CatechismArchive = () => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);
  const { theme }: any = useContext(AuthContext);
  const [opacity] = useState(new Animated.Value(0));

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setIndex(roundIndex);
    },
    []
  );

  const handleFlip = () => {
    Animated.timing(opacity, {
      toValue: opacity._value == 0 ? 1 : 0,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

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

  const renderCarousel = (data: any) => {
    const renderItem = useCallback(({ item, index }: any) => {
      return (
        <TouchableOpacity
          key={`item-${index}`}
          style={styles.card}
          onPress={() => {
            handleFlip();
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text category="h1" status="control">
              {item.nome}
            </Text>
            <Text category="h6" status="control" style={{ color: "#dbdbdb" }}>
              {item.titulo}
            </Text>
          </View>
          <View style={{ position: "relative" }}>
            <Image
              key={`image-${index}`}
              cachePolicy={"disk"}
              source={{ uri: item.foto }}
              style={styles.image}
            />
            <Animated.View
              style={[
                styles.image,
                styles.backCard,

                { opacity, padding: 25, justifyContent: "center" },
              ]}
            >
              <Text
                style={{
                  textAlign: "auto",
                  width: 230,
                  fontSize: 16,
                  letterSpacing: -0.5,
                }}
                numberOfLines={15}
                category="s1"
                status="control"
              >
                {item.descricao}
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
      );
    }, []);

    if (show) {
      return (
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFillObject}>
            <Image
              key={`image-${index}`}
              cachePolicy={"disk"}
              source={{ uri: data[index].foto }}
              style={[StyleSheet.absoluteFillObject, { opacity: 1 }]}
              blurRadius={10}
            />
          </View>
          <View
            style={{
              top: 30,
              width: "100%",
              position: "absolute",
              alignItems: "center",
              // backgroundColor: "green",
            }}
          >
            <View
              style={{
                height: 20,
                width: imageW,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
                justifyContent: "space-between",
              }}
            >
              {data?.map((item: any, indx: any) => {
                return (
                  <View
                    key={`dot-${indx}`}
                    style={{
                      width: 25,
                      height: indx == index ? 5 : 3,
                      backgroundColor:
                        indx == index
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                );
              })}
            </View>
          </View>
          <FlatList
            horizontal
            data={data}
            pagingEnabled
            onScroll={onScroll}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
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

  return (
    <View style={styles.container}>
      {renderCarousel(data)}
      <Menu />
    </View>
  );
};

export default CatechismArchive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: imageW,
    height: imageH,
    contentFit: "cover",
    borderRadius: 16,
  },
  card: {
    width,
    gap: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  backCard: {
    position: "absolute",
    backgroundColor: "#014181ae",
  },
});
