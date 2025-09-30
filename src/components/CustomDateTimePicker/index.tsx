import React, { useState, useEffect } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Modal, Platform, View } from "react-native";
import { style } from "./style"; // ✅ Ajuste o caminho se necessário

interface Props {
  type: "date" | "time";
  onDateChange: (date: Date) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

const CustomDateTimePicker: React.FC<Props> = ({
  type,
  onDateChange,
  show,
  setShow,
}) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (onDateChange && date instanceof Date) {
      onDateChange(date);
    }
  }, [date, onDateChange]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // No Android, o picker retorna event.type === 'dismissed' se o usuário cancelar
    if (event?.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);
      setShow(false); // Fecha o picker após selecionar
    }
  };

  return (
    <Modal
      transparent={true}
      visible={show}
      onRequestClose={() => setShow(false)}
    >
      <View style={style.modalOverlay}>
        <View
          style={[
            style.container,
            Platform.OS === "android" && { backgroundColor: "transparent" },
          ]}
        >
          <DateTimePicker
            value={date}
            mode={type}
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onChange}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomDateTimePicker;
