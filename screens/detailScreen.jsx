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
import { Dropdown } from "react-native-element-dropdown";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MyContext } from "../MyProvider";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Loading from "../Components/Loading";
import Toast from "react-native-toast-message";
const DetailScreen = ({ navigation }) => {
  const { name, setName, users, amountType } = useContext(MyContext);
  const [data, setData] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [duzenle, setDuzenle] = useState(false);
  const [nameCh, setNameCh] = useState("");
  const [amount, setAmount] = useState("");
  const [common, setCommon] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getRecords(); // Verileri yenilemek için işlevi çağır
    setRefreshing(false);
  }, []);
  useEffect(() => {
    getRecords();
  }, [name]);
  const data1 = [
    { label: "₺", value: "₺" },
    { label: "$", value: "$" },
    { label: "€", value: "€" },
  ];
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
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const docSnap = await getDoc(recordRef);

    if (docSnap.exists()) {
      const recordData = docSnap.data();
      const { given, taken } = recordData;

      if (amountType == 1) {
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

  const deleteRecord = async (amountType, name) => {
    setIsLoading(true);
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const docSnap = await getDoc(recordRef);
    if (docSnap.exists()) {
      const recordData = docSnap.data();
      let updatedArray;

      if (amountType === 1) {
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
  const historyRecord = async (amountType, name) => {
    setIsLoading(true);
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const historyRef = doc(
      FIREBASE_DB,
      "historyRecords",
      "pEIb2hhe8sXdDjkG1dnS"
    );
    const docSnap = await getDoc(recordRef);

    if (docSnap.exists()) {
      const recordData = docSnap.data();
      let updatedArray;
      let historyArray;

      if (amountType === 1) {
        updatedArray = recordData.taken.filter((item) => item.name !== name);
        historyArray = recordData.taken
          .filter((item) => item.name == name)
          .map((item) => ({
            ...item,
            paymentTime: date, // Yeni eklenen bilgi
          }));

        console.log(updatedArray);

        await updateDoc(recordRef, { taken: updatedArray });

        // forEach yerine for...of döngüsü kullanılıyor
        for (const item of historyArray) {
          await updateDoc(historyRef, { taken: arrayUnion(item) });
        }

        getRecords();
        setIsLoading(false);
        navigation.goBack();
      } else {
        updatedArray = recordData.given.filter((item) => item.name !== name);
        historyArray = recordData.given
          .filter((item) => item.name == name)
          .map((item) => ({
            ...item,
            paymentTime: date, // Yeni eklenen bilgi
          }));

        console.log(updatedArray);

        await updateDoc(recordRef, { given: updatedArray });

        // forEach yerine for...of döngüsü kullanılıyor
        for (const item of historyArray) {
          await updateDoc(historyRef, { given: arrayUnion(item) });
        }

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

  const changeSituation = () => {
    setIsLoading(false);
    setIsFocused1(false);
    setIsFocused2(false);
    setIsFocused(false);
    setIsFocus(false);
    setNameCh("");
    setAmount("");
    setValue("");
    setValue("");
    setCommon("");
  };
  //!!-------------------------------------
  //todo:  güncellme işlemi çalışmıyor düzelt ve görünt
  //??--------------------------------------
  const updateRecord = async () => {
    setIsLoading(true);
    const recordRef = doc(FIREBASE_DB, "moneyRecords", "nfeQjjQlX2bllB7Er6IB");
    const docSnap = await getDoc(recordRef);

    if (docSnap.exists()) {
      setIsLoading(true);
      const recordData = docSnap.data();
      const newRecord = {
        name: nameCh == "" ? name : nameCh,
        date: date,
        amount: amount,
        amountType: value,
        note: common,
        OrganizedBy: users,
      };
      let fieldToUpdate = amountType === 1 ? "taken" : "given";
      let existingRecord = recordData[fieldToUpdate].find(
        (record) => record.name === nameCh
      );
      if (existingRecord) {
        Toast.show({
          type: "errorToast",
          text1: "Aynı isimde bir kayıt zaten var",
        });
        setIsLoading(false);
      } else if (date != "" && amount != "" && users != "" && value != "") {
        let updatedArray = recordData[fieldToUpdate].map((record) =>
          record.name === name ? newRecord : record
        );
        await updateDoc(recordRef, {
          [fieldToUpdate]: updatedArray,
        });

        Toast.show({
          type: "tomatoToast",
          text1: "Kayıt başarıyla güncellendi",
        });
        setName(nameCh == "" ? name : nameCh);
        setDuzenle(false);
        changeSituation();
        getRecords();
      } else {
        Toast.show({
          type: "errorToast",
          text1: "Değişiklik için borç miktarı ve miktar türü seçilmeli",
        });
        changeSituation();
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: "errorToast",
        text1: "Döküman bulunamadı",
      });
      setIsLoading(false);
    }

    setIsLoading(false);
  };
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };
  const formatDateNow = (timestamp) => {
    // `timestamp` eğer Date değilse Date objesi olarak oluşturun
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Feather name="arrow-left-circle" size={40} color="rgb(58, 70, 76)" />
        </TouchableOpacity>

        <Text style={styles.borcText}>Borç Detayları</Text>
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
                  amountType == 2
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
                    {amountType == 1 ? "Borçlu: " : "Alacaklı: "}
                  </Text>

                  <TextInput
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[
                      styles.addCommon,
                      isFocused && {
                        borderBottomWidth: 3,
                        borderColor: "rgba(31,200,67,0.5)",
                      },
                    ]}
                    onChangeText={(text) => setNameCh(text)}
                    editable={duzenle}
                    multiline={false}
                    placeholder={item.name}
                    placeholderTextColor={
                      duzenle ? "rgb(96, 125, 139)" : "rgb(55, 71, 79)"
                    }
                  />
                </View>
                <View style={styles.amountView}>
                  <Text style={styles.amount}> Borç Miktarı: </Text>
                  <View style={styles.amountView1}>
                    <TextInput
                      onFocus={() => setIsFocused1(true)}
                      onBlur={() => setIsFocused1(false)}
                      style={[
                        styles.addCommon,
                        isFocused1 && {
                          borderBottomWidth: 3,
                          borderColor: "rgba(31,200,67,0.7)",
                        },
                      ]}
                      onChangeText={(text) => setAmount(text)}
                      editable={duzenle}
                      keyboardType="numeric"
                      multiline={false}
                      placeholder={item.amount}
                      placeholderTextColor={
                        duzenle ? "rgb(96, 125, 139)" : "rgb(55, 71, 79)"
                      }
                    />
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {
                          borderBottomWidth: 3,
                          borderColor: "rgba(31,200,67,0.7)",
                        },
                      ]}
                      placeholderStyle={[
                        styles.placeholderStyle,
                        {
                          color: duzenle
                            ? "rgb(96, 125, 139)"
                            : "rgb(55, 71, 79)",
                        },
                      ]}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={data1}
                      editable={duzenle}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={isFocus ? "..." : item.amountType}
                      value={value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setValue(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.duzenleme}>
                  <Text style={styles.note}>Not:</Text>

                  <TextInput
                    onFocus={() => setIsFocused2(true)}
                    onBlur={() => setIsFocused2(false)}
                    style={[
                      styles.addCommon,
                      isFocused2 && {
                        borderBottomWidth: 3,
                        borderColor: "rgba(31,200,67,0.7)",
                      },
                    ]}
                    onChangeText={(text) => setCommon(text)}
                    editable={duzenle}
                    multiline={false}
                    placeholder={item.note == "" ? `" "` : item.note}
                    placeholderTextColor={
                      duzenle ? "rgb(96, 125, 139)" : "rgb(55, 71, 79)"
                    }
                  />
                </View>

                <View style={styles.duzenleme}>
                  <Text style={styles.organizedBy}>düzenleyen Kişi:</Text>

                  <TextInput
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[
                      styles.addCommon,
                      duzenle && {
                        borderBottomWidth: 3,
                        borderColor: "rgba(31,200,67,0.7)",
                      },
                    ]}
                    editable={false}
                    multiline={false}
                    placeholder={item.OrganizedBy}
                    placeholderTextColor={"rgb(55, 71, 79)"}
                  />
                </View>
                <View style={styles.duzenleme}>
                  <Text style={styles.date}>Düzenleme Tarihi:</Text>

                  <TextInput
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[
                      styles.addCommon,
                      duzenle && {
                        borderBottomWidth: 3,
                        borderColor: "rgba(31,200,67,0.7)",
                      },
                    ]}
                    onChangeText={(text) => setData(text)}
                    editable={false}
                    multiline={false}
                    placeholder={
                      duzenle ? formatDateNow(date) : formatDate(item.date)
                    }
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

          {duzenle ? (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.kaydet}
                onPress={() => updateRecord()}
              >
                <Text style={styles.buttonsText}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iptal}
                onPress={() => {
                  setDuzenle(false);
                  changeSituation();
                }}
              >
                <Text style={styles.buttonsText}>iptal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.duzenle}
                onPress={() => {
                  setDuzenle(true);
                  Toast.show({
                    type: "tomatoToast",
                    text1: "Düzenleme yapan kullanıcı " + users,
                  });
                }}
              >
                <Text style={styles.buttonsText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.odeme}
                onPress={() => historyRecord(amountType, name)}
              >
                <Text style={styles.buttonsText}>Ödendi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sil}
                onPress={() => deleteRecord(amountType, name)}
              >
                <Text style={styles.buttonsText}>Sil</Text>
              </TouchableOpacity>
            </View>
          )}
          <KeyboardAvoidingView />
        </View>
      )}
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
  },
  back: { padding: 15 },
  borcText: { fontSize: 40, fontWeight: "900", color: "rgb(38, 50, 56)" },
  header: {
    width: "90%",
    marginTop: 50,
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
    paddingHorizontal: "10%",
  },
  flatView: {
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
  duzenle: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    backgroundColor: "rgb(76, 175, 80)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  kaydet: {
    justifyContent: "center",
    alignItems: "center",
    width: "45%",
    backgroundColor: "rgb(33, 150, 243)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sil: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    backgroundColor: "rgb(244, 67, 54)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  odeme: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    backgroundColor: "rgb(255, 152, 0)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  iptal: {
    justifyContent: "center",
    alignItems: "center",
    width: "45%",
    backgroundColor: "rgb(244, 67, 54)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonsText: { fontSize: 16, fontWeight: "500", color: "white" },
  addCommon: {
    backgroundColor: "rgb(176, 190, 197)",
    borderColor: "rgb(176, 190, 197)",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 3,
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
