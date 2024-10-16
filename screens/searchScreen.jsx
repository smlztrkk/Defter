import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyContext } from "../MyProvider";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Loading from "../Components/Loading";
import Toast from "react-native-toast-message";

const SearchScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { setName, amountType, setAmountType } = useContext(MyContext);
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  const screenWidth = Dimensions.get("window").width;
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
    getRecords(amountType);
  }, [amountType, search]);
  const getRecords = async (amountType) => {
    setIsLoading(true);
    try {
      const recordRef = doc(
        FIREBASE_DB,
        "moneyRecords",
        "nfeQjjQlX2bllB7Er6IB"
      );
      const docSnap = await getDoc(recordRef);

      if (docSnap.exists()) {
        const recordData = docSnap.data();
        let updatedArray;

        if (search.length === 0) {
          updatedArray = amountType === 2 ? recordData.given : recordData.taken;
        } else if (amountType === 2) {
          updatedArray = recordData.given.filter(
            (item) => item.name === search
          );
        } else {
          updatedArray = recordData.taken.filter(
            (item) => item.name === search
          );
        }

        setData(updatedArray);
      } else {
        Toast.show({
          type: "errorToast",
          text1: "Döküman bulunamadı",
        });
      }
    } catch (error) {
      Toast.show({
        type: "errorToast",
        text1: "Bir hata oluştu " + error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async (amountType) => {
    setRefreshing(true);
    await getRecords(amountType);
    setRefreshing(false);
  }, []);
  const goDetail = (item) => {
    setName(item);
    navigation.navigate("DetailScreen");
  };
  const useArrayChangeListener = () => {
    useEffect(() => {
      setIsLoading(true);
      // Belge referansı
      const docRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");

      // Önceki değerleri saklamak için değişkenler
      let previousGiven = [];
      let previousTaken = [];

      // onSnapshot ile belgeyi dinle
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          const currentGiven = docData.given || [];
          const currentTaken = docData.taken || [];
          // Eğer `given` arrayi değişmişse
          if (amountType == 2) {
            getRecords(amountType);
            setIsLoading(false);

            previousGiven = currentGiven;
          }

          if (amountType == 1) {
            getRecords(amountType);
            setIsLoading(false);

            previousTaken = currentTaken;
          }
        } else {
          Toast.show({
            type: "errorToast",
            text1: "Belge bulunamadı!",
          });
          setIsLoading(false);
        }
      });

      // Component unmount edildiğinde dinleyiciyi kapat
      return () => unsubscribe();
    }, [amountType]);
  };
  useArrayChangeListener();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screens}>
        <TouchableOpacity
          style={[
            styles.screensBtn,
            amountType == 1
              ? { borderColor: "rgb(77, 182, 172)" }
              : { borderColor: "gray" },
          ]}
          onPress={() => setAmountType(1)}
        >
          <Text
            style={[
              styles.screensText,
              amountType == 1
                ? { color: "rgb(0, 105, 92)" }
                : { color: "black" },
            ]}
          >
            Alınacaklar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.screensBtn,
            amountType == 2
              ? { borderColor: "rgb(229, 115, 115)" }
              : { borderColor: "gray" },
          ]}
          onPress={() => setAmountType(2)}
        >
          <Text
            style={[
              styles.screensText,
              amountType == 2
                ? { color: "rgb(198, 40, 40)" }
                : { color: "black" },
            ]}
          >
            Verilecekler
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.search, { width: screenWidth * 0.8 }]}>
        <TextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.searchInput,
            isFocused && {
              borderBottomWidth: 3,
              borderColor: "rgb(144, 164, 174)",
            },
          ]}
          onChangeText={(text) => setSearch(text)}
          multiline={false}
          placeholder={"ara..."}
          placeholderTextColor={"rgb(96, 125, 139)"}
        />
      </View>
      {data.exists || isLoading ? (
        <View style={styles.flatListContainer}>
          <Loading
            item={require("../assets/Lottie/4.json")}
            size={{ width: 400, height: 400 }}
          />
        </View>
      ) : (
        <View style={styles.info}>
          <FlatList
            data={data}
            style={{
              flex: 1,
              paddingHorizontal: 21,
            }}
            renderItem={({ item }) => {
              return (
                <View style={styles.flatListContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      goDetail(item.name);
                    }}
                  >
                    <View
                      style={[
                        styles.user,
                        { width: screenWidth * 0.89 },
                        amountType == 2
                          ? {
                              backgroundColor: "rgba(198, 40, 40,0.6)",
                              borderColor: "rgba(229, 115, 115,0.5)",
                            }
                          : {
                              backgroundColor: "rgba(0, 105, 92,0.6)",
                              borderColor: "rgba(77, 182, 172,0.5)",
                            },
                      ]}
                    >
                      <Text style={styles.userText}>
                        {amountType == 1 ? "Borçlu: " : "Alacaklı: "}
                        {item.name}
                      </Text>
                      <Text style={styles.userText}>
                        Borç: {item.amount} {item.amountType}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh(amountType)}
              />
            }
          />
        </View>
      )}
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },

  screens: {
    width: "80%",
    flexDirection: "row",
  },
  screensBtn: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  screensText: {
    color: "black",
  },
  search: { marginVertical: 15 },
  searchInput: {
    backgroundColor: "rgb(176, 190, 197)",
    borderColor: "rgb(176, 190, 197)",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 3,
    borderRadius: 25,
    color: "rgb(38, 50, 56)",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  info: { flex: 1, paddingBottom: 70 },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  user: {
    width: 350,
    height: 60,
    flexDirection: "row",
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 4,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  userText: { fontSize: 16, fontWeight: "500", color: "white" },
});
