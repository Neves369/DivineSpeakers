import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArchiveScreen from "../screens/ArchiveScreen";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
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
      <AppStack.Screen name="Menu" component={MenuScreen} />
      <AppStack.Screen name="Configurações" component={Settings} />
      <AppStack.Screen name="Doação" component={Donate} />
      <AppStack.Screen name="Contato" component={Contact} />
      <AppStack.Screen name="Sobre" component={About} />
      <AppStack.Screen
        name="Arquivos"
        component={ArchiveScreen}
        options={{ headerTransparent: true, headerTintColor: "white" }}
      />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
