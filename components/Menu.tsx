import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Ionicons,
  Fontisto,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const { width } = Dimensions.get("screen");
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const imageW = width * 0.7;
const imageH = imageW * 1.54;

const Menu: React.FC = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(false);
  const [opacity] = useState(new Animated.Value(0));
  const [buttonSize] = useState(new Animated.Value(1));

  const handleMenu = () => {
    Animated.sequence([
      Animated.timing(buttonSize, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(buttonSize, {
        toValue: 1,
        useNativeDriver: false,
      }),

      Animated.timing(opacity, {
        toValue: opacity._value == 0 ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
    setMenu(!menu);
  };

  return (
    <View style={{ position: "absolute", bottom: 0 }}>
      <Animated.View style={[styles.subMenuContainer, { opacity }]}>
        <TouchableOpacity
          style={[styles.secundaryButton, { marginTop: 50, marginRight: -20 }]}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Pregadores");
          }}
        >
          <Fontisto name="person" size={20} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secundaryButton, { marginTop: 10 }]}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Em breve");
          }}
        >
          <FontAwesome5 name="book-reader" size={20} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secundaryButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Credos");
          }}
        >
          <MaterialIcons name="menu-book" size={20} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secundaryButton, { marginTop: 10 }]}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Catecismos");
          }}
        >
          <MaterialCommunityIcons
            name="shield-cross-outline"
            size={20}
            color={"white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secundaryButton, { marginTop: 50, marginLeft: -20 }]}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Em breve");
          }}
        >
          <MaterialCommunityIcons name="book-cross" size={20} color={"white"} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.secundaryButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Sobre");
          }}
        >
          <AntDesign name="infocirlce" size={20} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secundaryButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Contato");
          }}
        >
          <Entypo name="mail" size={20} color={"white"} />
        </TouchableOpacity>

        <View style={{ position: "relative" }}>
          <Animated.View
            style={[styles.menu, { transform: [{ scale: buttonSize }] }]}
          >
            <Entypo
              name="plus"
              size={50}
              color="white"
              style={{
                transform: [{ rotate: menu == true ? "45deg" : "0deg" }],
              }}
              onPress={() => {
                handleMenu();
              }}
            />
          </Animated.View>
        </View>

        <TouchableOpacity
          style={styles.secundaryButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Doação");
          }}
        >
          <FontAwesome5 name="hand-holding-heart" size={20} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secundaryButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Configurações");
          }}
        >
          <Ionicons name="settings-sharp" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Menu;

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
  menuContainer: {
    gap: 15,
    bottom: 0,
    height: 100,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subMenuContainer: {
    gap: 5,
    height: 40,
    width: 400,
    marginBottom: 45,
    flexDirection: "row",
    justifyContent: "center",
  },
  menu: {
    width: 80,
    height: 80,
    marginTop: -40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0080ff",
    backgroundColor: "#0080ff48",
  },
  secundaryButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0080ff",
    backgroundColor: "#0080ff48",
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
