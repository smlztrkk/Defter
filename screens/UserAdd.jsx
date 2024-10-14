import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_DB } from "../Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Loading from "../Components/Loading";
import { Feather } from "@expo/vector-icons";
const UserAdd = ({ navigation }) => {
  const [userAdd, setUserAdd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toastConfig = {
    errorToast: ({ text1, props }) => (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "rgb(255, 100, 100)",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {text1}
        </Text>
      </View>
    ),

    tomatoToast: ({ text1, props }) => (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "rgb(120, 255, 120)",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {text1}
        </Text>
      </View>
    ),
  };

  async function addOrUpdateUserDocument() {
    setIsLoading(true);
    try {
      if (!userAdd.trim()) {
        Toast.show({
          type: "errorToast",
          text1: "Kullanıcı adı boş olamaz",
        });
        setIsLoading(false);
        return;
      }
      const docRef = doc(FIREBASE_DB, "profiles", "mBEfqZUlf7j4CD21TxOY");
      const docSnap = await getDoc(docRef);

      let existingUsers = [];
      if (docSnap.exists()) {
        existingUsers = docSnap.data().users || [];
      }

      if (!existingUsers.includes(userAdd) && UserAdd !== "") {
        const newUsers = [...existingUsers, userAdd];
        Toast.show({
          type: "tomatoToast",
          text1: "Kullanıcı Kayıdı Başarılı",
        });
        await setDoc(
          docRef,
          {
            users: newUsers,
          },
          { merge: true }
        );

        setIsLoading(false);
      } else {
        Toast.show({
          type: "errorToast",
          text1: "Kullanıcı zaten mevcut",
        });
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: "errorToast",
        text1: "kayıt yapılamıyor " + error.message,
      });
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Feather name="arrow-left-circle" size={40} color="rgb(58, 70, 76)" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Kullanıcı Ekle</Text>
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => setUserAdd(text)}
        style={[
          styles.userAdd,
          isFocused && {
            borderBottomWidth: 7,
            borderColor: "rgba(31,67,200,0.7)",
          },
        ]}
        value={userAdd}
        placeholder="isim giriniz"
        placeholderTextColor={"rgb(96, 125, 139)"}
      />

      <TouchableOpacity
        style={styles.kaydetbtn}
        onPress={() => addOrUpdateUserDocument()}
      >
        {isLoading ? (
          <Loading
            item={require("../assets/Lottie/4.json")}
            size={{ width: 200, height: 200 }}
          />
        ) : (
          <Text style={styles.kayitText}>Kaydet</Text>
        )}
      </TouchableOpacity>
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default UserAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },
  headerText: { fontSize: 30, fontWeight: "900", color: "rgb(38, 50, 56)" },
  kayitText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgb(38, 50, 56)",
    textAlign: "center",
  },
  userAdd: {
    width: "60%",
    height: 60,
    backgroundColor: "rgb(176, 190, 197)",
    borderColor: "rgb(176, 190, 197)",
    borderRadius: 25,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 7,
    fontSize: 18,
    color: "black",
    paddingHorizontal: 20,
    margin: 50,
  },
  kaydetbtn: {
    backgroundColor: "rgb(144, 164, 174)",
    width: "60%",
    height: 50,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  back: { position: "absolute", top: 65, left: 15, padding: 15 },
});
