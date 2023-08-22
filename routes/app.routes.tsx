import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArchiveScreen from "../screens/ArchiveScreen";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import Settings from "../screens/ConfigScreen";
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
      <AppStack.Screen name="Settings" component={Settings} />
      <AppStack.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{ headerTransparent: true, headerTintColor: "white" }}
      />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
