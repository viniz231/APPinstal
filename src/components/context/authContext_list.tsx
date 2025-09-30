import React, { createContext, useContext, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Input } from "../../components/input";
import { themas } from "../../global/themes";
import { Flag } from "../../components/Flag";
import CustomDateTimePicker from "../../components/CustomDateTimePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContextList: any = createContext({});

const flags = [
  { caption: "Urgente", color: themas.colors.red },
  { caption: "Opcional", color: themas.colors.blueLight },
];

export const AuthProviderList = (props: any): any => {
  const modalizeRef = useRef<Modalize>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("Urgente");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [item, setItem] = useState(0);

  const onOpen = () => {
    modalizeRef?.current?.open();
  };

  const onClose = () => {
    modalizeRef?.current?.close();
  };

  const _renderFlags = () => {
    return flags.map((item, index) => (
      <TouchableOpacity key={index} onPress={() => setSelectedFlag(item.caption)}>
        <Flag
          caption={item.caption}
          color={item.color}
          selected={selectedFlag === item.caption}
        />
      </TouchableOpacity>
    ));
  };

  const handleDateChange = (date: Date) => {
    setSelectedTime(date);
  };

  const handleTimeChange = (date: Date) => {
    setSelectedTime(date); // ✅ CORRIGIDO: era setSelected
  };

  const handleSave = async () => {
    const newItem = {
      id: Date.now(),
      title,
      description,
      flag: selectedFlag,
      deadline: `${selectedDate.toLocaleDateString()} ${selectedTime.toLocaleTimeString()}`,
    };

    console.log(newItem);

    try {
      const saved = await AsyncStorage.getItem("@tasks");
      const parsed = saved ? JSON.parse(saved) : [];
      const updated = [...parsed, newItem];
      await AsyncStorage.setItem("@tasks", JSON.stringify(updated));
      onClose(); // fecha modal após salvar
    } catch (e) {
      console.error("Erro ao salvar tarefa:", e);
    }
  };

  const _container = () => {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={30} />
          </TouchableOpacity>

          <Text style={styles.title}>Criar Tarefa</Text>

          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="check" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Input
            title="Titulo"
            labelStyle={styles.label}
            value={title}
            onChangeText={setTitle}
          />
          <Input
            title="Descrição"
            labelStyle={styles.label}
            height={100}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 10 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ flex: 1 }}
            >
              <Input
                title="Data Limite"
                labelStyle={styles.label}
                editable={false}
                value={
                  selectedDate instanceof Date
                    ? selectedDate.toLocaleDateString()
                    : ""
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 120 }}
              onPress={() => setShowTimePicker(true)}
            >
              <Input
                title="Hora Limite"
                labelStyle={styles.label}
                editable={false}
                value={
                  selectedTime instanceof Date
                    ? selectedTime.toLocaleTimeString()
                    : ""
                }
              />
            </TouchableOpacity>
          </View>

          <CustomDateTimePicker
            onDateChange={handleDateChange}
            setShow={setShowDatePicker}
            show={showDatePicker}
            type={"date"}
          />
          <CustomDateTimePicker
            onDateChange={handleTimeChange}
            setShow={setShowTimePicker}
            show={showTimePicker}
            type={"time"}
          />
        </View>

        <View style={styles.containerFlag}>
          <Text style={styles.label}>Flags:</Text>
          <View style={styles.rowFlags}>{_renderFlags()}</View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <AuthContextList.Provider value={{ onOpen }}>
      {props.children}
      <Modalize
        ref={modalizeRef}
        childrenStyle={{
          height: Dimensions.get("window").height / 1.3,
        }}
        adjustToContentHeight
      >
        {_container()}
      </Modalize>
    </AuthContextList.Provider>
  );
};

export const useAuth = () => useContext(AuthContextList);

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    width: "100%",
    height: 40,
    paddingHorizontal: 40,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    paddingHorizontal: 20,
  },
  containerFlag: {
    width: "100%",
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  rowFlags: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
