import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatechismArchiveScreen from "../screens/Catechism/CatechismArchiveScreen";
import PreacherArchiveScreen from "../screens/Preacher/PreacherArchiveScreen";
import CatechismListScreen from "../screens/Catechism/CatechismListScreen";
import PreacherListScreen from "../screens/Preacher/PreacherListScreen";
import CreedArchiveScreen from "../screens/Creed/CreedArchiveScreen";
import CreedListScreen from "../screens/Creed/CreedListScreen";
import HomeScreen from "../screens/HomeScreen";
import Settings from "../screens/ConfigScreen";
import Contact from "../screens/Contact";
import Donate from "../screens/Donate";
import About from "../screens/About";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ComingSoon from "../screens/ComingSoon";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";

const AppStack = createNativeStackNavigator();

const AppRoutes: React.FC = () => {
  const navigation = useNavigation();
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Dashboard"
        options={{
          headerTitle: "Divine Speakers",
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
          headerRight: () => (
            <Ionicons
              name="settings-sharp"
              size={30}
              color={useColorScheme() == "light" ? "black" : "white"}
              onPress={() => {
                //@ts-ignore
                navigation.navigate("Configurações");
              }}
            />
          ),
        }}
        component={HomeScreen}
      />
      <AppStack.Screen
        name="Pregadores"
        component={PreacherListScreen}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Catecismos"
        component={CatechismListScreen}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Credos"
        component={CreedListScreen}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Configurações"
        component={Settings}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Doação"
        component={Donate}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Contato"
        component={Contact}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Sobre"
        component={About}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />
      <AppStack.Screen
        name="Em breve"
        component={ComingSoon}
        options={{
          headerStyle: {
            backgroundColor:
              useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
          },
          headerTintColor: useColorScheme() == "light" ? "black" : "white",
        }}
      />

      <AppStack.Screen
        name="Arquivos"
        component={PreacherArchiveScreen}
        options={{ headerTransparent: true, headerTintColor: "white" }}
      />
      <AppStack.Screen
        name="Catecismo"
        component={CatechismArchiveScreen}
        options={{ headerTransparent: true, headerTintColor: "white" }}
      />
      <AppStack.Screen
        name="Credo"
        component={CreedArchiveScreen}
        options={{ headerTransparent: true, headerTintColor: "white" }}
      />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
