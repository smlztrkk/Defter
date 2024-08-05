import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyContext } from "../MyProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "./SearchScreen";
import AddRecord from "./AddRecord";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
const MainScreen = () => {
  const Tab = createBottomTabNavigator();
  const { users, setUsers } = useContext(MyContext);

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
                color={focused ? "rgb(33, 120, 243)" : "rgb(48, 60, 66)"}
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
              }}
            >
              <AntDesign
                name="pluscircleo"
                size={focused ? 32 : 28}
                color={focused ? "rgb(33, 120, 243)" : "rgb(48, 60, 66)"}
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
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
