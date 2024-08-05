import {
  Button,
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
import { Feather } from "@expo/vector-icons";
import { MyContext } from "../MyProvider";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Loading from "../Components/Loading";
import AntDesign from "@expo/vector-icons/AntDesign";
const DetailScreen = ({ navigation }) => {
  const { name, setName } = useContext(MyContext);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { amountType } = useContext(MyContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [duzenle, setDuzenle] = useState(false);
  const [dname, setDname] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getRecords(); // Verileri yenilemek için işlevi çağır
    setRefreshing(false);
  }, []);
  useEffect(() => {
    getRecords();
  }, [name]);

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
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Feather name="arrow-left-circle" size={40} color="rgb(58, 70, 76)" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.borcText}>Borç Detayları</Text>
      </View>
      {isLoading ? (
        <Loading
          item={require("../assets/Lottie/4.json")}
          size={{ width: 400, height: 400 }}
        />
      ) : (
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
                  {item.name}
                </Text>
                {duzenle ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "red",
                    }}
                  >
                    <AntDesign
                      name="arrowright"
                      size={16}
                      color="rgb(67, 160, 71)"
                    />
                    <TextInput
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={[
                        styles.addCommon,
                        isFocused && {
                          borderBottomWidth: 7,
                          borderColor: "rgba(31,67,200,0.7)",
                        },
                      ]}
                      value={dname == "" ? item.name : dname}
                      onChangeText={(text) => setDname(text)}
                      multiline={false}
                      placeholder="Borçlu Adı"
                      placeholderTextColor={"rgb(96, 125, 139)"}
                    />
                  </View>
                ) : (
                  ""
                )}
              </View>
              <View style={styles.amountView}>
                <Text style={styles.amount}> Borç Miktarı: {item.amount}</Text>
                <Text style={styles.amountType}>{item.amountType}</Text>
              </View>
              <View style={styles.duzenleme}>
                <Text style={styles.date}>
                  Düzenleme Tarihi: {formatDate(item.date)}
                </Text>
              </View>
              <View style={styles.duzenleme}>
                <Text style={styles.organizedBy}>
                  düzenleyen Kişi: {item.OrganizedBy}
                </Text>
              </View>
              <View style={styles.duzenleme}>
                <Text style={styles.note}>
                  Not: {item.note == "" ? `" "` : item.note}
                </Text>
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
      )}
      {duzenle ? (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.kaydet}
            onPress={() => setDuzenle(false)}
          >
            <Text style={styles.buttonsText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.duzenle}
            onPress={() => setDuzenle(true)}
          >
            <Text style={styles.buttonsText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sil}>
            <Text style={styles.buttonsText}>Sil</Text>
          </TouchableOpacity>
        </View>
      )}
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
  back: { position: "absolute", top: 80, left: 30 },
  borcText: { fontSize: 40, fontWeight: "900", color: "rgb(38, 50, 56)" },
  header: { marginVertical: 40 },
  flatList: { width: "80%", marginVertical: 50 },
  flatView: {
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 30,
    borderColor: "black",
    //gap: 20,
    paddingHorizontal: 20,
  },
  duzenleme: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    //borderStyle: "dashed",
    height: 50,
    borderBottomWidth: 1,
    gap: 10,
    //backgroundColor: "red",
  },
  amountView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
  },
  buttons: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    marginVertical: 50,
    gap: 15,
  },
  duzenle: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    backgroundColor: "rgb(56, 142, 60)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  kaydet: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    backgroundColor: "rgb(25, 118, 210)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sil: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    backgroundColor: "rgb(211, 47, 47)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonsText: { fontSize: 16, fontWeight: "500", color: "white" },
  addCommon: {
    width: "45%",
    backgroundColor: "rgb(176, 190, 197)",
    borderColor: "rgb(176, 190, 197)",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 20,
    color: "rgb(38, 50, 56)",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});
