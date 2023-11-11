import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import AuthContext from "../context/auth";
const { width } = Dimensions.get("screen");
import {
  Button,
  Divider,
  MenuItem,
  OverflowMenu,
  Spinner,
  Text,
} from "@ui-kitten/components";
import {
  AntDesign,
  Entypo,
  Ionicons,
  Fontisto,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const Home = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>([]);
  const { theme }: any = useContext(AuthContext);
  const [visibleMenu, setVisibleMenu] = useState(false);

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

  const renderCarousel = (data: any) => {
    const renderItem = useCallback(({ item, index }: any) => {
      return (
        <TouchableOpacity
          key={`item-${index}`}
          style={{
            justifyContent: "flex-end",
          }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Arquivos", item);
          }}
          disabled={index == 0 ? true : false}
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
            <Text category="h6" status="control" style={{ color: "gray" }}>
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
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
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
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(255, 255, 255, 0.1)",
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

  const renderToggleButton = (): React.ReactElement => (
    <Entypo
      name="menu"
      size={30}
      color="white"
      style={{ position: "absolute", left: 8 }}
      onPress={() => {
        //@ts-ignore
        setVisibleMenu(true);
      }}
    />
  );

  useEffect(() => {
    if (data.length == 0 && theme) {
      getData();
    }
  }, [theme]);

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
        <OverflowMenu
          anchor={renderToggleButton}
          visible={visibleMenu}
          style={{ maxHeight: 420, width: 200 }}
          onBackdropPress={() => setVisibleMenu(false)}
        >
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Pregadores");
            }}
            accessoryLeft={() => (
              <Fontisto name="person" size={24} color="black" />
            )}
            title={"PREGADORES"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Em breve");
            }}
            accessoryLeft={() => (
              <FontAwesome5 name="book-reader" size={24} color="black" />
            )}
            title={"CONFSSÕES DE FÉ"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Credos");
            }}
            accessoryLeft={() => (
              <MaterialIcons name="menu-book" size={24} color="black" />
            )}
            title={"CREDOS"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Catecismos");
            }}
            accessoryLeft={() => (
              <MaterialCommunityIcons
                name="shield-cross-outline"
                size={24}
                color="black"
              />
            )}
            title={"CATECISMOS"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Em breve");
            }}
            accessoryLeft={() => (
              <MaterialCommunityIcons
                name="book-cross"
                size={24}
                color="black"
              />
            )}
            title={"OUTROS"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Sobre");
            }}
            accessoryLeft={() => (
              <AntDesign name="infocirlce" size={24} color="black" />
            )}
            title={"SOBRE"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Contato");
            }}
            accessoryLeft={() => <Entypo name="mail" size={24} color="black" />}
            title={"CONTATO"}
          />
          <Divider />
          <MenuItem
            onPress={() => {
              setVisibleMenu(false);
              //@ts-ignore
              navigation.navigate("Doação");
            }}
            accessoryLeft={() => (
              <FontAwesome5 name="hand-holding-heart" size={24} color="black" />
            )}
            title={"DOAÇÃO"}
          />
        </OverflowMenu>

        <Ionicons
          name="settings-sharp"
          size={30}
          color="white"
          style={{ position: "absolute", right: 25, top: 25 }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Configurações");
          }}
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
