import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyContext } from "../MyProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Loading from "../Components/Loading";
import Toast from "react-native-toast-message";

const SearchScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { name, setName } = useContext(MyContext);
  const { amountType, setAmountType } = useContext(MyContext);
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
  }, [amountType]);
  const getRecords = async (amountType) => {
    setIsLoading(true);
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const docSnap = await getDoc(recordRef);

    if (docSnap.exists()) {
      const recordData = docSnap.data();

      if (amountType == 2) {
        setData(recordData.given);
        setIsLoading(false);
      } else {
        setData(recordData.taken);
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: "errorToast",
        text1: "Döküman bulunamadı",
      });

      setIsLoading(false);
    }
  };

  const deleteRecord = async (amountType, name, amount) => {
    setIsLoading(true);
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const docSnap = await getDoc(recordRef);
    if (docSnap.exists()) {
      const recordData = docSnap.data();
      let updatedArray;

      if (amountType === 1) {
        updatedArray = recordData.taken.filter(
          (item) => item.name !== name || item.amount !== amount
        );
        await updateDoc(recordRef, { taken: updatedArray });
        Toast.show({
          type: "tomatoToast",
          text1: "Silme işlemi başarılı",
        });
        getRecords(amountType);
        setIsLoading(false);
      } else {
        updatedArray = recordData.given.filter(
          (item) => item.name !== name || item.amount !== amount
        );
        await updateDoc(recordRef, { given: updatedArray });
        Toast.show({
          type: "tomatoToast",
          text1: "Silme işlemi başarılı",
        });
        getRecords(amountType);
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: "errorToast",
        text1: "Döküman bulunamadı",
      });
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async (amountType) => {
    setRefreshing(true);
    await getRecords(amountType);
    setRefreshing(false);
  }, []);
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };
  const goDetail = (item) => {
    setName(item);
    navigation.navigate("DetailScreen");
  };
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
                    onLongPress={() =>
                      deleteRecord(amountType, item.name, item.amount)
                    }
                    onPress={() => {
                      goDetail(item.name);
                    }}
                  >
                    <View
                      style={[
                        styles.user,
                        amountType == 2
                          ? {
                              backgroundColor: "rgba(198, 40, 40,0.7)",
                              borderColor: "rgba(229, 115, 115,0.7)",
                            }
                          : {
                              backgroundColor: "rgba(0, 105, 92,0.7)",
                              borderColor: "rgba(77, 182, 172,0.7)",
                            },
                      ]}
                    >
                      <Text style={styles.userText}>
                        {amountType == 1 ? "Borçlu: " : "Alacaklı: "}
                        {item.name}
                      </Text>
                      <Text style={styles.userText}>Borç: {item.amount}</Text>
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
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  screensText: {
    color: "black",
  },
  info: { flex: 1, paddingBottom: 70 },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  user: {
    width: 350,
    height: 75,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    borderWidth: 4,
    backgroundColor: "rgb(77, 182, 172)",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  userText: { fontSize: 16, fontWeight: "500", color: "white" },
});
