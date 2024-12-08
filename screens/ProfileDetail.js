import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const ProfileDetail = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Thông tin cá nhân</Text>
      </Pressable>

      <View style={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {user?.avatar ? (
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={100} color="#BDBDBD" />
          )}
          <Text style={styles.name}>{user?.name || "Không có tên"}</Text>
        </View>

        <TouchableOpacity
          style={styles.infoRow}
          onPress={() =>
            navigation.navigate("EditEmail", { email: user?.email })
          }
        >
          <Text style={styles.label}>Email:</Text>
          <View style={styles.infoRight}>
            <Text style={styles.value}>{user?.email || "Không có email"}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoRow}
          onPress={() =>
            navigation.navigate("EditPhone", { phone: user?.phone })
          }
        >
          <Text style={styles.label}>Số điện thoại:</Text>
          <View style={styles.infoRight}>
            <Text style={styles.value}>
              {user?.phone || "Không có số điện thoại"}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { user })}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.editButtonText}>Chỉnh sửa toàn bộ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  button_back: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  label: {
    fontSize: 16,
    color: "#616161",
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  value: {
    fontSize: 16,
    color: "#424242",
    marginRight: 5,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
});
