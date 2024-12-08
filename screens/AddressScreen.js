import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext";
import AnimatedToggle from "../components/AnimatedToggle";
import AddressPicker from "../components/AddressPicker";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);
  const [data, setData] = useState({
    fullName: "",
    addressType: "",
    phone: "",
    defaultAddress: false,
    detailAddress: "",
    fullAddress: "",
  });
  const { userId, setUserId } = useContext(UserType);
  const { showToast } = useCustomToast();
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken._id;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const handleAddAddress = async () => {
    if (userId) {
      const dataResponse = await fetch(SummaryApi.add_new_address.url, {
        method: SummaryApi.add_new_address.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          ...data,
        }),
      });
      const dataApi = await dataResponse.json();
      if (dataApi?.success) {
        showToast(dataApi?.message, "success");
        navigation.navigate("Address");
      } else {
        showToast(dataApi?.message, "error");
      }
    } else {
      showToast("Vui lòng đăng nhập...!", "error");
    }
  };

  const handleOnChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ScrollView>
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Trở lại</Text>
      </Pressable>

      <View style={{ padding: 10, marginTop: 20 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Liên hệ</Text>

        <TextInput
          placeholderTextColor={"black"}
          placeholder="Họ và tên"
          value={data.fullName}
          onChangeText={(text) => handleOnChange("fullName", text)}
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholderTextColor={"black"}
          placeholder="Số điện thoại"
          value={data.phone}
          onChangeText={(text) => handleOnChange("phone", text)}
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
            fontSize: 16,
          }}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Địa chỉ</Text>

          <AddressPicker onChange={handleOnChange} />

          <TextInput
            placeholderTextColor={"black"}
            placeholder="Tên đường,Tòa nhà, Số nhà"
            value={data.detailAddress}
            onChangeText={(text) => handleOnChange("detailAddress", text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
              fontSize: 16,
            }}
          />
        </View>

        <View
          style={{
            marginVertical: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Loại địa chỉ:
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedType === "Văn phòng" && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedType("Văn phòng");
                handleOnChange("addressType", "Văn phòng");
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedType === "Văn phòng" && styles.selectedButtonText,
                ]}
              >
                Văn phòng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                selectedType === "Nhà riêng" && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedType("Nhà riêng");
                handleOnChange("addressType", "Nhà riêng");
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedType === "Nhà riêng" && styles.selectedButtonText,
                ]}
              >
                Nhà riêng
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <AnimatedToggle
            name="defaultAddress"
            handleOnChange={handleOnChange}
          />
        </View>

        <Pressable
          onPress={handleAddAddress}
          style={{
            backgroundColor: "red",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>
            Hoàn thành
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "transparent",
    marginRight: 10,
    borderColor: "gray",
  },
  selectedButton: {
    borderColor: "red",
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
  selectedButtonText: {
    color: "red",
  },
  button_back: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    gap: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
});
