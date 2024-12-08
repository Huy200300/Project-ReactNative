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
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const LoginScreen = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigation = useNavigation();
  const { showToast } = useCustomToast();
  const handleOnChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Main");
        }
      } catch (error) {
        console.log("error message", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const dataReponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataApi = await dataReponse.json();
    if (dataApi?.success) {
      showToast(dataApi.message, "success");
      const token = dataApi.data;
      AsyncStorage.setItem("authToken", token);
      navigation.replace("Main");
    } else if (dataApi?.error) {
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
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Đăng nhập</Text>
      </Pressable>

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 150,
        }}
      >
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Chào mừng bạn đến với Shop
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Đăng nhập vào tài khoản của bạn.
            </Text>
          </View>

          <View style={{ marginTop: 40 }}>
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

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* <Text>Keep me Logged in</Text> */}
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Quên mật khẩu
            </Text>
          </View>

          <View style={{ marginTop: 50 }} />

          <Pressable
            onPress={handleLogin}
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
              Đăng nhập
            </Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Bạn chưa có tài khoản ? <Text style={{color:"red"}}>Đăng ký</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginScreen;

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
});
