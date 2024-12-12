import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ProductItems from "../components/ProductItems";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../context/UserContext";
import { jwtDecode } from "jwt-decode";
import CategoryList from "../components/CategoryList";
import NewProductList from "../components/NewProductList";
import VerticalCardProduct from "../components/VerticalCardProduct";
import TopSellingProduct from "../components/TopSellingProduct";
import CategoryFilter from "../components/CategoryFilter";
import SummaryApi from "../api";
import ReanimatedSlider from "../components/ReanimatedSlider";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        setUserId(userId);
      }
    };

    fetchUser();
  }, []);

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
    setAddress(dataApi?.data);
  };
  const handleSearchNavigate = () => {
    navigation.navigate("Search");
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses(userId);
    }
  }, [userId, modalVisible]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView>
          <View
            style={{
              backgroundColor: "#00CED1",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: "white",
                borderRadius: 3,
                height: 38,
                flex: 1,
              }}
              onPress={handleSearchNavigate}
            >
              <AntDesign
                style={{ paddingLeft: 10 }}
                name="search1"
                size={22}
                color="black"
              />
              <TextInput editable={false} placeholder="Tìm kiếm ở đây" />
            </Pressable>

            <Feather name="mic" size={24} color="black" />
          </View>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#AFEEEE",
            }}
          >
            <Entypo name="location-pin" size={24} color="black" />

            <Pressable>
              {selectedAddress ? (
                <Text
                  numberOfLines={2}
                  style={{ width: 310, fontSize: 13, textAlign: "center" }}
                >
                  Giao đến {selectedAddress?.fullAddress} -{" "}
                  {selectedAddress?.fullName}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Thêm địa chỉ
                </Text>
              )}
            </Pressable>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>

          <CategoryList />

          {/* <ReanimatedSlider /> */}

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Sản phẩm mới
          </Text>

          <NewProductList />

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Điện Thoại Nổi Bật
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <VerticalCardProduct category={"mobiles"} />
          </ScrollView>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <View>
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
              Sản phẩm bán chạy
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TopSellingProduct />
          </ScrollView>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <CategoryFilter />
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 500 }}>
              Chọn vị trí của bạn
            </Text>
            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Chọn địa điểm giao hàng
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {address?.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedAdress(item);
                  setModalVisible(false);
                }}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor:
                    selectedAddress === item ? "#FBCEB1" : "white",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.fullName}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Địa chỉ: {item?.fullAddress}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Số nhà, đường: {item?.detailAddress}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Giao tới: {item?.addressType}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Số điện thoại: {item?.phone}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Thêm Địa chỉ
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: 400 }}>
                Enter an VietName code
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: 400 }}>
                Use My Currect location
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: 400 }}>
                Delivery outside VietNames
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
