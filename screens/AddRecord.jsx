import {
  Button,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyContext } from "../MyProvider";
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase";
import Toast from "react-native-toast-message";
import Loading from "../Components/Loading";

const screenWidth = Dimensions.get("window").width;
const AddRecord = () => {
  const [selectedId, setSelectedId] = useState("");
  const { users, setUsers } = useContext(MyContext);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [common, setCommon] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [value1, setValue1] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);

  const radioButtons = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "Alınacak",
        value: "taken",
      },
      {
        id: "2",
        label: "Verilecek",
        value: "given",
      },
    ],
    []
  );
  const data = [
    { label: "TL", value: "₺" },
    { label: "Dolar", value: "$" },
    { label: "Euro", value: "€" },
  ];
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
  };
  const showDatepicker = () => {
    setShow(true);
  };

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
  //!------------------------------------
  const addRecord = async () => {
    setIsLoading(true);
    try {
      const recordRef = doc(
        FIREBASE_DB,
        "moneyRecords",
        "nfeQjjQlX2bllB7Er6IB"
      );
      const newRecord = {
        name: name,
        date: date, // borç tarihi
        amount: amount, // borç miktarı
        amountType: value1, // borç miktarı
        note: common, // not
        OrganizedBy: users,
      };
      const docSnap = await getDoc(recordRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const existingGivenRecords = data.given || [];
        const existingTakenRecords = data.taken || [];
        if (selectedId == 2) {
          const isNameExistsInGiven = existingGivenRecords.some(
            (item) => item.name === newRecord.name
          );
          if (isNameExistsInGiven) {
            Toast.show({
              type: "errorToast",
              text1:
                "Bu isim verilecek listesinde zaten var! Yeni kayıt eklenmedi.",
            });
            setIsLoading(false);

            return;
          }
        } else {
          const isNameExistsInTaken = existingTakenRecords.some(
            (item) => item.name === newRecord.name
          );
          if (isNameExistsInTaken) {
            Toast.show({
              type: "errorToast",
              text1:
                "Bu isim alınacak listesinde zaten var! Yeni kayıt eklenmedi.",
            });
            setIsLoading(false);

            return;
          }
        }

        if (
          name != "" &&
          date != "" &&
          amount != "" &&
          users != "" &&
          selectedId != ""
        ) {
          const fieldToUpdate = selectedId == 2 ? "given" : "taken";
          Toast.show({
            type: "tomatoToast",
            text1: users + " tarafından başarıyla kaydedildi!",
          });
          await updateDoc(recordRef, {
            [fieldToUpdate]: arrayUnion(newRecord),
          });
          setIsLoading(false);
        } else {
          Toast.show({
            type: "errorToast",
            text1: "Boş kısımları dolrurunuz",
          });
          setIsLoading(false);
        }
      } else {
        Toast.show({
          type: "errorToast",
          text1: "döküman bulunamadı!",
        });
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: "errorToast",
        text1: "Hata oluştu: " + error,
      });
      setIsLoading(false);
    }
  };
  //!------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Borç Kayıt</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          layout="row"
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
          onChangeText={(text) => setName(text)}
          multiline={false}
          placeholder="Borçlu Adı"
          placeholderTextColor={"rgb(96, 125, 139)"}
        />
        <View style={styles.date}>
          <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
            <Text style={styles.dateText}>Borç Tarihini Seç</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDate(new Date())}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>Şimdiki Zaman</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateTime}>
          Seçili Tarih: {date.toLocaleString()}
        </Text>
        <View
          style={[
            styles.addNumber,
            isFocused2 || isFocus
              ? { borderColor: "rgba(31,67,200,0.7)" }
              : { borderColor: "rgb(176, 190, 197)" },
          ]}
        >
          <TextInput
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            style={styles.addNumber2}
            multiline={false}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
            placeholder="Borç Miktarı"
            placeholderTextColor={"rgb(96, 125, 139)"}
          />

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Türü" : "..."}
            value={value1}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue1(item.value);
              setIsFocus(false);
            }}
          />
        </View>

        <TextInput
          onFocus={() => setIsFocused1(true)}
          onBlur={() => setIsFocused1(false)}
          style={[
            styles.addCommon,
            isFocused1 && {
              borderBottomWidth: 7,
              borderColor: "rgba(31,67,200,0.7)",
            },
          ]}
          onChangeText={(text) => setCommon(text)}
          multiline={true}
          placeholder="Not ( isteğe bağlı )"
          placeholderTextColor={"rgb(96, 125, 139)"}
        />
        <TouchableOpacity onPress={addRecord} style={styles.save}>
          {isLoading ? (
            <Loading
              item={require("../assets/Lottie/4.json")}
              size={{ width: 200, height: 200 }}
            />
          ) : (
            <Text style={styles.dateText}>Kaydet</Text>
          )}
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </ScrollView>
      <Toast visibilityTime={3000} config={toastConfig} />
    </SafeAreaView>
  );
};
//? alınacak verilecek düzenleyen kişi borçlu ismi borç miktarı alınma tarihi not ekleme kaydet
export default AddRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(207, 216, 220)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(207, 216, 220)",
    padding: 20,
    gap: 20,
    paddingBottom: 100,
    //width: "100%",
  },
  header: {
    fontSize: 40,
    fontWeight: "900",
    color: "rgb(38, 50, 56)",
  },
  addCommon: {
    width: "70%",
    backgroundColor: "rgb(176, 190, 197)",
    borderColor: "rgb(176, 190, 197)",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 20,
    color: "rgb(38, 50, 56)",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addNumber2: {
    width: "55%",
    borderRightWidth: 1,
  },
  dateTime: { color: "rgb(96, 125, 139)" },
  addNumber: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(176, 190, 197)",
    color: "rgb(38, 50, 56)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "rgb(176, 190, 197)",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 20,
  },
  date: {
    flexDirection: "row",
    gap: 10,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    backgroundColor: "rgb(78, 100, 106)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dateText: { color: "white" },
  save: {
    height: 40,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(78, 100, 106)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  dropdown: {
    width: "35%",
    //height: 50,
    backgroundColor: "rgb(176, 190, 197)",
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
