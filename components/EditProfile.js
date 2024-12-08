import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;

  const handleSave = () => {
    // Logic lưu toàn bộ thông tin
    console.log("Lưu thông tin mới:", user);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <TouchableOpacity style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.header}>Chỉnh sửa Thông tin cá nhân</Text>
      </TouchableOpacity>

      {/* Placeholder để hiển thị thông tin và chỉnh sửa */}
      <Text style={styles.label}>Thông tin chi tiết sẽ được hiển thị ở đây...</Text>

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

export default EditProfile;
