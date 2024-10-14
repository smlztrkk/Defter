import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MyContext } from "../MyProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Loading from "../Components/Loading";
import Toast from "react-native-toast-message";
const HistoryDetail = ({ navigation }) => {
  const { name, amountHistoryType } = useContext(MyContext);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getRecords(); // Verileri yenilemek için işlevi çağır
    setRefreshing(false);
  }, []);
  useEffect(() => {
    getRecords();
  }, [name]);
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
  const getRecords = async () => {
    setIsLoading(true);
    const recordRef = doc(
      FIREBASE_DB,
      "historyRecords",
      "pEIb2hhe8sXdDjkG1dnS"
    );
    const docSnap = await getDoc(recordRef);

    if (docSnap.exists()) {
      const recordData = docSnap.data();
      const { given, taken } = recordData;

      if (amountHistoryType == 1) {
        const filtered = taken.filter((item) => item.name === name);
        setData(filtered);
      } else {
        const filtered = given.filter((item) => item.name === name);
        setData(filtered);
      }

      setIsLoading(false);
    } else {
      Toast.show({
        type: "errorToast",
        text1: "Döküman bulunamadı",
      });

      setIsLoading(false);
    }
  };

  const deleteRecord = async (amountHistoryType, name) => {
    setIsLoading(true);
    const recordRef = doc(
      FIREBASE_DB,
      "historyRecords",
      "pEIb2hhe8sXdDjkG1dnS"
    );
    const docSnap = await getDoc(recordRef);
    if (docSnap.exists()) {
      const recordData = docSnap.data();
      let updatedArray;

      if (amountHistoryType === 1) {
        updatedArray = recordData.taken.filter((item) => item.name !== name);
        await updateDoc(recordRef, { taken: updatedArray });

        getRecords();

        setIsLoading(false);
        navigation.goBack();
      } else {
        updatedArray = recordData.given.filter((item) => item.name !== name);
        await updateDoc(recordRef, { given: updatedArray });

        getRecords();
        setIsLoading(false);
        navigation.goBack();
      }
    } else {
      Toast.show({
        type: "errorToast",
        text1: "Döküman bulunamadı",
      });
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };
  //! ---------------------------------------------------------------------
  //todo: geçmişe başka bigilerde ekle ve veritabana kaydet ve görüntüle   ----------------------------------------------------------------
  //? ---------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Feather name="arrow-left-circle" size={40} color="rgb(58, 70, 76)" />
        </TouchableOpacity>

        <Text style={styles.borcText}>Borç Geçmişi Detayları</Text>
      </View>
      {isLoading ? (
        <Loading
          item={require("../assets/Lottie/4.json")}
          size={{ width: 400, height: 400 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          ></KeyboardAvoidingView>
          <FlatList
            style={styles.flatList}
            data={data}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.flatView,
                  amountHistoryType == 2
                    ? {
                        borderColor: "rgba(229, 115, 115,1)",
                      }
                    : {
                        borderColor: "rgba(77, 182, 172,1)",
                      },
                ]}
              >
                <View style={styles.duzenleme}>
                  <Text style={styles.name}>
                    {amountHistoryType == 1 ? "Borçlu: " : "Alacaklı: "}
                  </Text>

                  <TextInput
                    style={styles.addCommon}
                    onChangeText={(text) => setNameCh(text)}
                    editable={false}
                    multiline={false}
                    placeholder={item.name}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>
                <View style={styles.amountView}>
                  <Text style={styles.amount}> Borç Miktarı: </Text>
                  <View style={styles.amountView1}>
                    <TextInput
                      style={styles.addCommon}
                      onChangeText={(text) => setAmount(text)}
                      editable={false}
                      keyboardType="numeric"
                      multiline={false}
                      placeholder={item.amount + "  " + item.amountType}
                      placeholderTextColor={"rgb(55, 71, 79)"}
                    />
                  </View>
                </View>
                <View style={styles.duzenleme}>
                  <Text style={styles.note}>Not:</Text>

                  <TextInput
                    style={styles.addCommon}
                    onChangeText={(text) => setCommon(text)}
                    editable={false}
                    multiline={false}
                    placeholder={item.note == "" ? `" "` : item.note}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>

                <View style={styles.duzenleme}>
                  <Text style={styles.organizedBy}>düzenleyen Kişi:</Text>

                  <TextInput
                    style={styles.addCommon}
                    editable={false}
                    multiline={false}
                    placeholder={item.OrganizedBy}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>
                <View style={styles.duzenleme}>
                  <Text style={styles.date}>Borç Tarihi:</Text>

                  <TextInput
                    style={styles.addCommon}
                    onChangeText={(text) => setData(text)}
                    editable={false}
                    multiline={false}
                    placeholder={formatDate(item.date)}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>
                <View style={styles.duzenleme}>
                  <Text style={styles.date}>Ödeme Tarihi:</Text>

                  <TextInput
                    style={styles.addCommon}
                    onChangeText={(text) => setData(text)}
                    editable={false}
                    multiline={false}
                    placeholder={formatDate(item.paymentTime)}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.sil}
              onPress={() => deleteRecord(amountHistoryType, name)}
            >
              <Text style={styles.buttonsText}>Sil</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView />
        </View>
      )}
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default HistoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },
  back: { padding: 15 },
  borcText: { fontSize: 32, fontWeight: "900", color: "rgb(38, 50, 56)" },
  header: {
    width: "100%",
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
    paddingHorizontal: "10%",
  },
  flatView: {
    marginVertical: 5,
    borderWidth: 2,
    gap: 20,
    paddingVertical: 20,
    borderStyle: "dashed",
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  duzenleme: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    gap: 10,
  },

  amountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  amountView1: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 50,
    gap: 3,
  },
  buttons: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: "10%",
  },

  sil: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgb(244, 67, 54)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  buttonsText: { fontSize: 16, fontWeight: "500", color: "white" },
  addCommon: {
    backgroundColor: "rgb(176, 190, 197)",
    borderRadius: 10,
    color: "rgb(38, 50, 56)",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  dropdown: {
    width: "35%",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "rgb(176, 190, 197)",
    borderBottomWidth: 3,
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgb(176, 190, 197)",
  },
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
});
