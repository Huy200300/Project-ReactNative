import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserHeader = ({ user, onEdit }) => {
  return (
    <View
      style={{
        backgroundColor: "#F5F5F5",
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      {user?.avatar ? (
        <Image
          source={{ uri: user?.avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
            marginRight: 10,
          }}
        />
      ) : (
        <Ionicons
          name="person-circle"
          size={50}
          color="black"
          style={{ marginRight: 10 }}
        />
      )}

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Chào mừng {user?.name || "Khách hàng"}
        </Text>
      </View>

      {/* Nút chỉnh sửa */}
      {/* <TouchableOpacity onPress={onEdit}>
        <Ionicons name="pencil" size={24} color="#333" />
      </TouchableOpacity> */}
    </View>
  );
};

export default UserHeader;
