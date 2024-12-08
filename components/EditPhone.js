import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const EditPhone = ({ route }) => {
  const navigation = useNavigation();
  const { phone } = route.params; // Số điện thoại hiện tại
  const [newPhone, setNewPhone] = useState(phone);

  const handleSave = () => {
    // Logic lưu số điện thoại mới
    console.log("Số điện thoại mới:", newPhone);
    navigation.goBack(); // Quay lại màn hình trước
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <TouchableOpacity style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.header}>Chỉnh sửa Số điện thoại</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Số điện thoại hiện tại:</Text>
      <TextInput
        style={styles.input}
        value={newPhone}
        onChangeText={setNewPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button_back: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#616161",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditPhone;
