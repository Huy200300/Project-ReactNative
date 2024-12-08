import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext";
import SummaryApi from "../api";

export default function AddAddressScreen() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const fetchAddresses = async (userId) => {
    const res = await fetch(
      `${SummaryApi.address_user.url}/${userId}/address`,
      {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const dataApi = await res.json();
    setAddresses(dataApi?.data);
  };

  useEffect(() => {
    fetchAddresses(userId);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses(userId);
    }, [userId])
  );
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Chọn địa chỉ nhận hàng</Text>
      </Pressable>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Địa chỉ</Text>
        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text>Thêm địa chỉ mới</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>
        <Pressable>
          {addresses?.map((item, index) => (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
              key={index}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.fullName}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Địa chỉ: {item?.fullAddress}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Số nhà, đường: {item?.detailAddress}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Giao tới: {item?.addressType}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Số điện thoại: {item?.phone}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 7,
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Sửa</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Xóa</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Đặt làm mặc định</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button_back: {
    height: 50,
    backgroundColor: "white", // Màu xám nhạt
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    gap: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
});
