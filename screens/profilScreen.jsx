import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MyContext } from "../MyProvider";
import { FIREBASE_DB } from "../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import Loading from "../Components/Loading";

const ProfilScreen = ({ navigation }) => {
  const { users, setUsers } = useContext(MyContext);
  const [recUsers, setRecUsers] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await readUserDocument(); // Verileri yenilemek için işlevi çağır
    setRefreshing(false);
  }, []);
  const toastConfig = {
    tomatoToast: ({ text1, props }) => (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "rgb(100, 255, 100)",
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
  };
  useEffect(() => {
    readUserDocument();
  }, []);

  async function readUserDocument() {
    setIsLoading(true);
    try {
      const docRef = doc(FIREBASE_DB, "profiles", "mBEfqZUlf7j4CD21TxOY");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRecUsers(docSnap.data().users);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "errorToast",
          text1: "Döküman bulunamadı",
        });
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: "errorToast",
        text1: "Kullanıcı silme hatası:" + error,
      });
      setIsLoading(false);
    }
  }
  const profil = (item) => {
    setUsers(item);
    navigation.navigate("MainScreen");
  };
  async function removeUser(item) {
    setIsLoading(true);
    try {
      const docRef = doc(FIREBASE_DB, "profiles", "mBEfqZUlf7j4CD21TxOY");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingUsers = docSnap.data().users || [];
        const updatedUsers = existingUsers.filter((u) => u !== item);

        await updateDoc(docRef, {
          users: updatedUsers,
        });
        readUserDocument();
        Toast.show({
          type: "tomatoToast",
          text1: "Kullanıcı silme başarılı",
        });
        setIsLoading(false);
      } else {
        Toast.show({
          type: "errorToast",
          text1: "hata",
        });
      }
      setIsLoading(false);
    } catch (error) {
      Toast.show({
        type: "errorToast",
        text1: "Kullanıcı silme başarısız " + error,
      });
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.girisText}>Giriş Yap</Text>
      </View>
      <View style={styles.flatlist}>
        {isLoading ? (
          <Loading
            item={require("../assets/Lottie/4.json")}
            size={{ width: 400, height: 400 }}
          />
        ) : recUsers != "" ? (
          <FlatList
            data={recUsers}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.profiles}>
                  <TouchableOpacity onPress={() => profil(item)}>
                    <View style={styles.user}>
                      <Text style={styles.userText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeUser(item)}>
                    <View style={styles.userDel}>
                      <MaterialIcons
                        name="delete-forever"
                        size={28}
                        color="rgb(255, 138, 128)"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Text>kullanıcı yok oluşturunuz</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("UserAdd")}>
        <View style={styles.ekle}>
          <Text style={styles.ekleText}>kullanıcı ekle</Text>
          <AntDesign name="adduser" size={32} color="black" />
        </View>
      </TouchableOpacity>
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },
  ekle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 260,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 30,
    margin: 50,
    borderRadius: 30,
    backgroundColor: "rgb(144, 164, 174)",
  },
  user: {
    width: 220,
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: "rgb(96, 125, 139)",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userDel: {
    width: 50,
    height: 60,
    paddingLeft: 5,
    paddingRight: 5,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "rgb(120, 144, 156)",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profiles: { flex: 1, flexDirection: "row" },
  userText: { fontSize: 20, fontWeight: "700", color: "white" },
  ekleText: { fontSize: 20 },
  girisText: { fontSize: 40, fontWeight: "900", color: "rgb(38, 50, 56)" },
  header: { marginVertical: 50 },
  flatlist: { flex: 1 },
});
