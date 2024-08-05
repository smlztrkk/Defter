import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ProfilScreen from "./Screens/ProfilScreen";
import MainScreen from "./Screens/MainScreen";
import MyProvider from "./MyProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import UserAdd from "./Screens/UserAdd";
import DetailScreen from "./Screens/DetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("ProfilScreen");

  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="ProfilScreen" component={ProfilScreen} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="UserAdd" component={UserAdd} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
  },
});
