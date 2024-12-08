import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";

const RegisterScreen = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const navigation = useNavigation();
  const { showToast } = useCustomToast();

  const handleOnChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const res = await fetch(SummaryApi.signUp.url, {
      method: SummaryApi.signUp.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataApi = await res.json();
    if (dataApi.success) {
      showToast(dataApi.message, "success");
      navigation.goBack();
    } else {
      showToast(dataApi.message, "error");
    }
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Đăng ký tài khoản
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Rất vui khi tham gia cùng bạn!
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingVertical: 5,
                backgroundColor: "#D0D0D0",
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <FontAwesome
                style={{ paddingLeft: 10 }}
                name="user"
                size={24}
                color="black"
              />

              <TextInput
                value={data.name}
                onChangeText={(text) => handleOnChange("name", text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: data.name ? 16 : 16,
                }}
                placeholder="Tên"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingVertical: 5,
                backgroundColor: "#D0D0D0",
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <Ionicons
                style={{ paddingLeft: 10 }}
                name="mail"
                size={24}
                color="black"
              />

              <TextInput
                value={data.email}
                onChangeText={(text) => handleOnChange("email", text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: data.email ? 16 : 16,
                }}
                placeholder="Email"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingVertical: 5,
                backgroundColor: "#D0D0D0",
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <FontAwesome
                style={{ paddingLeft: 10 }}
                name="phone"
                size={24}
                color="black"
              />

              <TextInput
                value={data.phone}
                onChangeText={(text) => handleOnChange("phone", text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: data.phone ? 16 : 16,
                }}
                placeholder="Điện thoại"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingVertical: 5,
                backgroundColor: "#D0D0D0",
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                style={{ paddingLeft: 10 }}
                name="unlock"
                size={24}
                color="black"
              />

              <TextInput
                value={data.password}
                onChangeText={(text) => handleOnChange("password", text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: data.password ? 16 : 16,
                }}
                placeholder="Password"
              />
            </View>
          </View>

          {/* <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me Logged in</Text>
          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View> */}

          <View style={{ marginTop: 50 }} />

          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "red",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Đăng ký
            </Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Bạn đã có tài khoản ?{" "}
              <Text style={{ color: "red" }}>Đăng nhập</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default RegisterScreen;
