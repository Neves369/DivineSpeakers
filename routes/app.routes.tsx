import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatechismArchiveScreen from "../screens/CatechismArchiveScreen";
import PreacherArchiveScreen from "../screens/PreacherArchiveScreen";
import CatechismListScreen from "../screens/CatechismListScreen";
import PreacherListScreen from "../screens/PreacherListScreen";
import HomeScreen from "../screens/HomeScreen";
import Settings from "../screens/ConfigScreen";
import Contact from "../screens/Contact";
import Donate from "../screens/Donate";
import About from "../screens/About";
import React from "react";

const AppStack = createNativeStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Dashboard"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <AppStack.Screen name="Pregadores" component={PreacherListScreen} />
      <AppStack.Screen name="Catecismos" component={CatechismListScreen} />
      <AppStack.Screen name="Configurações" component={Settings} />
      <AppStack.Screen name="Doação" component={Donate} />
      <AppStack.Screen name="Contato" component={Contact} />
      <AppStack.Screen name="Sobre" component={About} />
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
    </AppStack.Navigator>
  );
};

export default AppRoutes;
