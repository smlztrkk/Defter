import { StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "./SearchScreen";
import AddRecord from "./AddRecord";
import {
  MaterialCommunityIcons,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import HistoryRecord from "./HistoryRecord";
const MainScreen = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgb(144, 164, 174)",
          position: "absolute",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgb(144, 164, 174)",
          height: 60,
          elevation: 5,
          left: 20,
          right: 20,
          bottom: 20,
        },
      }}
    >
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <MaterialCommunityIcons
                name="notebook-outline"
                size={focused ? 32 : 28}
                color={focused ? "rgb(132, 255, 255)" : "rgb(48, 60, 66)"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AddRecord"
        component={AddRecord}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "-50%",
                padding: 20,
                backgroundColor: "rgb(144, 164, 174)",
                borderWidth: 3,
                borderColor: "rgb(207, 216, 220)",
                borderRadius: 50,
              }}
            >
              <AntDesign
                name="pluscircleo"
                size={32}
                color={focused ? "rgb(132, 255, 255)" : "rgb(48, 60, 66)"}
              />
              {/* <FontAwesome
                name="search"
                size={focused ? 32 : 24}
                color={focused ? "aqua" : "rgb(29, 87, 159)"}
              /> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="HistoryRecord"
        component={HistoryRecord}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <Octicons
                name="history"
                size={focused ? 32 : 28}
                color={focused ? "rgb(132, 255, 255)" : "rgb(48, 60, 66)"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
