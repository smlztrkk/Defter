import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { MyContext } from "../MyProvider";
import { FIREBASE_DB } from "../Firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Loading from "../Components/Loading";
const ProfilScreen = ({ navigation }) => {
  const { setUsers } = useContext(MyContext);
  const [recUsers, setRecUsers] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const screenWidth = Dimensions.get("window").width;

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

  const useUserChangeListener = () => {
    useEffect(() => {
      // Belge referansı
      const docRef = doc(FIREBASE_DB, "profiles", "mBEfqZUlf7j4CD21TxOY");

      // Önceki kullanıcıları saklamak için bir değişken
      let previousUsers = [];

      // onSnapshot ile belgeyi dinle
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          const currentUsers = docData.users || [];

          // Eğer `users` arrayi değişmişse, yeni kullanıcıları bul
          if (previousUsers.length !== currentUsers.length) {
            const newUsers = currentUsers.filter(
              (user) => !previousUsers.includes(user)
            );

            if (newUsers.length > 0) {
            }
            readUserDocument();
            // `previousUsers` güncelle
            previousUsers = currentUsers;
          }
        } else {
          Toast.show({
            type: "errorToast",
            text1: "Belge bulunamadı!",
          });
        }
      });

      return () => unsubscribe();
    }, []);
  };
  useUserChangeListener();
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
        ) : Array.isArray(recUsers) && recUsers.length > 0 ? (
          <FlatList
            data={recUsers}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.profiles}>
                  <TouchableOpacity onPress={() => profil(item)}>
                    <View style={[styles.user, { width: screenWidth * 0.65 }]}>
                      <Text style={styles.userText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeUser(item)}>
                    <View
                      style={[styles.userDel, { width: screenWidth * 0.15 }]}
                    >
                      <MaterialIcons
                        name="delete-forever"
                        size={28}
                        color="rgb(255, 108, 108)"
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
          <View style={styles.userAdd}>
            <Text style={styles.userAddText}>
              kullanıcı yok kullanıcı oluşturunuz
            </Text>
            <AntDesign name="arrowdown" size={44} color="gray" />
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("UserAdd")}>
        <View style={[styles.ekle, { width: screenWidth * 0.8 }]}>
          <Text style={styles.ekleText}>kullanıcı ekle</Text>
          <AntDesign name="adduser" size={32} color="white" />
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
    marginVertical: 50,
    borderRadius: 20,
    backgroundColor: "rgb(144, 164, 174)",
  },
  user: {
    width: 220,
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "rgba(0, 200, 83,0.5)",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userAddText: { fontWeight: "700", fontSize: 17, color: "black" },
  userAdd: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  userDel: {
    width: 50,
    height: 60,
    paddingLeft: 5,
    paddingRight: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "rgba(0, 200, 83,0.35)",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profiles: { flex: 1, flexDirection: "row" },
  userText: { fontSize: 20, fontWeight: "700", color: "white" },
  ekleText: { fontSize: 20, color: "white" },
  girisText: { fontSize: 40, fontWeight: "900", color: "rgb(38, 50, 56)" },
  header: { marginVertical: 50 },
  flatlist: { flex: 1 },
});
