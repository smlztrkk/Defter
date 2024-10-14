import { StatusBar, StyleSheet } from "react-native";
import ProfilScreen from "./Screens/ProfilScreen";
import MainScreen from "./Screens/MainScreen";
import MyProvider from "./MyProvider";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import UserAdd from "./Screens/UserAdd";
import DetailScreen from "./Screens/DetailScreen";
import HistoryDetail from "./Screens/HistoryDetail";

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
          <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar
        barStyle="dark-content" // içerikteki ikon ve yazıların rengini ayarlamak için
        backgroundColor="rgb(207, 216, 220)" // Android için arka plan rengini ayarlar
      />
    </MyProvider>
  );
}

const styles = StyleSheet.create({});
