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
import ComingSoon from "../screens/ComingSoon";

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
      <AppStack.Screen name="Credos" component={CreedListScreen} />
      <AppStack.Screen name="Configurações" component={Settings} />
      <AppStack.Screen name="Doação" component={Donate} />
      <AppStack.Screen name="Contato" component={Contact} />
      <AppStack.Screen name="Sobre" component={About} />
      <AppStack.Screen name="Em breve" component={ComingSoon} />

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
