import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { CartType } from "../context/CartContext";
import displayCurrency from "../helpers/displayCurrency";
import useCustomToast from "../helpers/useCustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyModal from "../components/MyModal";
const CartScreen = () => {
  const { cart, cartLength, updateCart, removeFromCart } = useContext(CartType);
  const navigation = useNavigation();
  const { showToast } = useCustomToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [outOfStockModalVisible, setOutOfStockModalVisible] = useState(false);

  const availableItems = cart?.filter((item) => item.countInStock > 0);

  const Payment = async () => {
    const outOfStockItems = cart?.some((item) => item.countInStock === 0);

    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      setModalVisible(true);
      showToast("Bạn cần đăng nhập để mua hàng", "error");
      return;
    }

    if (cartLength === 0) {
      showToast(
        "Giỏ hàng của bạn chưa có sản phẩm nào. Vui lòng kiểm tra lại.",
        "error"
      );
      return;
    }

    if (outOfStockItems) {
      showToast(
        "Giỏ hàng của bạn có sản phẩm hết hàng. Vui lòng kiểm tra lại.",
        "error"
      );
      setOutOfStockModalVisible(true);
      return;
    } else {
      navigation.navigate("Confirm", { cart: availableItems });
    }
  };

  const ConfirmLogin = async () => {
    navigation.navigate("Login");
  };

  const updateQuantity = (id, type, max, selectedColor, selectedSize) => {
    if (max) {
      return showToast("Số lượng không đủ", "error");
    }
    if (type === "decrease") {
      updateCart({
        productId: id,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        quantityChange: -1,
      });
    } else {
      updateCart({
        productId: id,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        quantityChange: 1,
      });
    }
  };

  const total = cart
    ?.map((item) => item.sellingPrice * item.amount)
    .reduce((curr, prev) => curr + prev, 0);

  return (
    <ScrollView>
      <View>
        <Pressable
          style={styles.button_back}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-backspace" size={24} color="black" />
          <Text style={styles.text}>Giỏ hàng ({cart.length})</Text>
        </Pressable>

        <View
          style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Tổng cộng : </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {displayCurrency(total)}
          </Text>
        </View>
        <Text style={{ marginHorizontal: 10 }}>Chi tiết Shop có sẵn</Text>

        <Pressable
          onPress={Payment}
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Tiến hành mua ({cartLength}) sản phẩm
          </Text>
        </Pressable>
      </View>

      <MyModal
        openModal={() => setModalVisible(true)}
        closeModal={() => setModalVisible(false)}
        modalVisible={modalVisible}
        children={"bạn có muốn đăng nhập để đặt hàng ko ?"}
        confirm={ConfirmLogin}
      />

      <MyModal
        openModal={() => setOutOfStockModalVisible(true)}
        closeModal={() => setOutOfStockModalVisible(false)}
        modalVisible={outOfStockModalVisible}
        children={
          <View>
            <Text className="text-lg font-bold text-center mb-4">
              Một số sản phẩm trong giỏ hàng đã hết hàng
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Bạn có muốn thanh toán với các sản phẩm còn hàng không?
            </Text>
          </View>
        }
        confirm={() => {
          setOutOfStockModalVisible(false);
          navigation.navigate("Confirm", { cart: availableItems });
        }}
      />

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 16,
        }}
      />

      <View style={{ marginHorizontal: 10 }}>
        {cart?.map((item, index) => (
          <View
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              borderBottomColor: "#F0F0F0",
              borderWidth: 2,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderRightWidth: 0,
            }}
            key={index}
          >
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  style={{ width: 140, height: 140, resizeMode: "contain" }}
                  source={{ uri: item?.selectedColorImage }}
                />
              </View>
              <View>
                <Text
                  numberOfLines={3}
                  style={{ width: 150, marginTop: 10, fontWeight: "bold" }}
                >
                  {item?.productName}
                </Text>
                {item?.selectedColor && (
                  <Text style={{ fontWeight: "500" }}>
                    Màu : {item.selectedColor}
                  </Text>
                )}
                {item.selectedStorage && (
                  <View>
                    <Text style={{ fontWeight: "500" }}>
                      Dung lượng : {item.selectedStorage}
                    </Text>
                  </View>
                )}
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                >
                  {displayCurrency(item?.sellingPrice)}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    textDecorationLine: "line-through",
                    fontWeight: "bold",
                    marginTop: 6,
                  }}
                >
                  {displayCurrency(item?.price)}
                </Text>
                <Image
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                  source={{
                    uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                  }}
                />
                {item?.countInStock > 0 ? (
                  <Text style={{ color: "green" }}>Còn hàng</Text>
                ) : (
                  <Text style={{ color: "red" }}>Hết hàng</Text>
                )}
              </View>
            </Pressable>
            <Pressable
              style={{
                marginTop: 15,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 7,
                }}
              >
                {item?.amount > 1 ? (
                  <Pressable
                    onPress={() =>
                      updateQuantity(
                        item._id,
                        "decrease",
                        item.amount === 1,
                        item.selectedColor,
                        item.selectedStorage
                      )
                    }
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => removeFromCart(item._id, item.selectedColor)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </Pressable>
                )}
                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 6,
                  }}
                >
                  <Text>{item?.amount}</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    updateQuantity(
                      item._id,
                      "increase",
                      item?.amount === item?.countInStock,
                      item?.selectedColor,
                      item?.selectedStorage
                    )
                  }
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => removeFromCart(item._id, item.selectedColor)}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Xóa</Text>
              </Pressable>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Lưu lại để xem sau</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Info", { id: item._id })}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Xem thêm như thế này</Text>
              </Pressable>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

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
