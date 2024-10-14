import { StyleSheet, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Loading = ({ item, size }) => {
  return (
    <View>
      <LottieView source={item} style={size} autoPlay loop />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
