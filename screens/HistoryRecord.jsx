import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_DB } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Components/Loading";
import Toast from "react-native-toast-message";
import { MyContext } from "../MyProvider";

const HistoryRecord = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { setName, amountHistoryType, setAmountHistoryType } =
    useContext(MyContext);
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
  const onRefresh = useCallback(async (amountHistoryType) => {
    setRefreshing(true);
    await gethistoryRecords(amountHistoryType);
    setRefreshing(false);
  }, []);
  const goDetail = (item) => {
    setName(item);
    navigation.navigate("HistoryDetail");
  };
  const gethistoryRecords = async (amountHistoryType) => {
    setIsLoading(true);
    try {
      const recordRef = doc(
        FIREBASE_DB,
        "historyRecords",
        "pEIb2hhe8sXdDjkG1dnS"
      );
      const docSnap = await getDoc(recordRef);

      if (docSnap.exists()) {
        const recordData = docSnap.data();
        let updatedArray;

        if (search.length === 0) {
          updatedArray =
            amountHistoryType === 2 ? recordData.given : recordData.taken;
        } else if (amountHistoryType === 2) {
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
  useEffect(() => {
    gethistoryRecords(amountHistoryType);
  }, [amountHistoryType, search]);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.headerText}>Borç Geçmişi</Text>
      </View>
      <View style={styles.screens}>
        <TouchableOpacity
          style={[
            styles.screensBtn,
            amountHistoryType == 1
              ? { borderColor: "rgb(77, 182, 172)" }
              : { borderColor: "gray" },
          ]}
          onPress={() => setAmountHistoryType(1)}
        >
          <Text
            style={[
              styles.screensText,
              amountHistoryType == 1
                ? { color: "rgb(0, 105, 92)" }
                : { color: "black" },
            ]}
          >
            Alınanlar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.screensBtn,
            amountHistoryType == 2
              ? { borderColor: "rgb(229, 115, 115)" }
              : { borderColor: "gray" },
          ]}
          onPress={() => setAmountHistoryType(2)}
        >
          <Text
            style={[
              styles.screensText,
              amountHistoryType == 2
                ? { color: "rgb(198, 40, 40)" }
                : { color: "black" },
            ]}
          >
            Verilenler
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
                        { width: screenWidth * 1 },
                        amountHistoryType == 2
                          ? {
                              backgroundColor: "rgb(176, 190, 197)",
                              borderColor: "rgb(69, 90, 100)",
                            }
                          : {
                              backgroundColor: "rgb(176, 190, 197)",
                              borderColor: "rgb(69, 90, 100)",
                            },
                      ]}
                    >
                      <Text style={styles.userText}>
                        {amountHistoryType == 1 ? "Veren: " : "Alan: "}
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
                onRefresh={() => onRefresh(amountHistoryType)}
              />
            }
          />
        </View>
      )}
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default HistoryRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },
  headerText: { fontSize: 40, fontWeight: "900", color: "rgb(38, 50, 56)" },
  userText: { fontSize: 16, fontWeight: "500", color: "white" },
  screens: {
    width: "100%",
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
    height: 60,
    flexDirection: "row",
    paddingHorizontal: 30,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderStyle: "dashed",
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
