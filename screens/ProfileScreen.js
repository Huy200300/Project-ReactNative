import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { UserType } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";
import UserHeader from "../components/UserHeader";

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const { showToast } = useCustomToast();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#00CED1",
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png",
          }}
        />
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginRight: 12,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />

          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`${SummaryApi.current_user.url}/${userId}`, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataApi = await response.json();
      setUser(dataApi.data);
    };

    fetchUserProfile();
  }, [userId]);

  const logout = async () => {
    await clearAuthToken();
  };

  const clearAuthToken = async () => {
    const res = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const dataApi = await res.json();
    if (dataApi.success) {
      showToast(dataApi.message, "success");
      const n = await AsyncStorage.removeItem("authToken");
      console.log("auth token cleared", n);
      setUserId("");
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } else {
      showToast(dataApi.message, "error");
    }
  };

  const handleEditProfile = () => {
    if (userId) {
      navigation.navigate("ProfileDetail", { user });
    } else {
      showToast("Bạn chưa đăng nhập tài khoản của mình", "error");
    }
  };

  const statuses = [
    { key: "Pending", label: "Chờ xác nhận" },
    { key: "Processing", label: "Đang xử lý" },
    { key: "Shipping", label: "Vận chuyển" },
    { key: "Shipped", label: "Chờ giao hàng" },
    { key: "Delivered", label: "Hoàn thành" },
    { key: "Cancelled", label: "Đã hủy" },
  ];

  const handleOrder = (status) => {
    if (userId) {
      navigation.navigate("Order", { selectedStatus: status });
    } else {
      showToast("Bạn chưa đăng nhập tài khoản của mình", "error");
    }
  };
  return (
    <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
      <SafeAreaView>
        <UserHeader user={user} />
      </SafeAreaView>

      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Pressable
          onPress={() => handleOrder("Delivered")}
          style={{
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              Đơn mua
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.text, { fontSize: 14, color: "#1976D2" }]}>
              Xem lịch sử mua hàng
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color="#1976D2"
            />
          </View>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 16,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {statuses?.map((status, index) => (
            <Pressable
              onPress={() => handleOrder(status.key)}
              key={index}
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <FontAwesome5
                name={
                  index === 0
                    ? "hourglass-half"
                    : index === 1
                    ? "inbox"
                    : index === 2
                    ? "shipping-fast"
                    : index === 3
                    ? "box"
                    : "check-circle"
                }
                size={24}
                color={index === 4 ? "green" : "#616161"}
              />
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 14,
                    color: index === 4 ? "green" : "#616161",
                    marginTop: 8,
                  },
                ]}
              >
                {status.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {["Tài khoản của bạn"].map((item, index) => (
            <Pressable
              key={index}
              style={{ marginVertical: 10 }}
              onPress={item === "Tài khoản của bạn" ? handleEditProfile : null}
            >
              <Text style={[styles.text, { fontSize: 16, color: "#1976D2" }]}>
                {item}
              </Text>
            </Pressable>
          ))}

          {!userId ? (
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.text, { fontSize: 16, color: "#E53935" }]}>
                Đăng nhập
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={logout}>
              <Text style={[styles.text, { fontSize: 16, color: "#E53935" }]}>
                Đăng xuất
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
