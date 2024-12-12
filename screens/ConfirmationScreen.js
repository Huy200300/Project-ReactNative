import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext";
import { FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";
import SummaryApi from "../api";
import { CartType } from "../context/CartContext";
import displayCurrency from "../helpers/displayCurrency";
import { WebView } from "react-native-webview";
import useCustomToast from "../helpers/useCustomToast";

const ConfirmationScreen = ({ route }) => {
  const steps = [
    { title: "Địa chỉ", content: "Address Form" },
    { title: "Giao Hàng", content: "Delivery Options" },
    { title: "Thanh Toán", content: "Payment Details" },
    { title: "Đặt Hàng", content: "Order Summary" },
  ];
  const { showToast } = useCustomToast();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);
  const { cart } = route.params;
  const [selectedAddress, setSelectedAdress] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const [shippingFee, setShippingFee] = useState(20000);
  const { clearCart } = useContext(CartType);

  const total =
    cart
      ?.map((item) => item.sellingPrice * item.amount)
      .reduce((curr, prev) => curr + prev, 0) + shippingFee;

  useEffect(() => {
    fetchAddresses(userId);
  }, [userId]);

  const fetchAddresses = async (userId) => {
    const res = await fetch(
      `${SummaryApi.address_user.url}/${userId}/address`,
      {
        method: SummaryApi.address_user.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const dataApi = await res.json();
    setAddresses(dataApi?.data);
  };

  const handleShippingMethodChange = (method) => {
    if (!method) return;
    setShippingMethod(method);
    if (method === "FAST") {
      setShippingFee(20000);
    } else if (method === "GO_JEK") {
      setShippingFee(25000);
    }
  };

  const getSelectedProductInfo = (selectedProducts) => {
    return selectedProducts.map((product) => ({
      productId: product._id,
      color: product.selectedColor || "",
      colorImage: product.selectedColorImage || product.productImage,
      stock: product.stock || product?.countInStock,
      price: product.price,
      sellingPrice: product.sellingPrice,
      quantity: product.amount,
      productName: product.productName,
    }));
  };

  const makeApiRequest = async (url, method, body) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  };

  const handlePlaceOrder = async () => {
    const products = getSelectedProductInfo(cart);
    const body = {
      amount: total,
      userId: userId,
      products,
      shipping: shippingFee,
      shippingMethod,
      shippingAddress: selectedAddress,
      sourceApp: "ReactNative",
    };
    const datas = await makeApiRequest(
      SummaryApi.payment_COD.url,
      SummaryApi.payment_COD.method,
      body
    );
    if (datas?.error) {
      showToast(datas.message, "error");
    } else {
      navigation.navigate("OrderStatus");
      clearCart();
    }
  };

  const pay = async (type) => {
    if (type === "MoMo") {
      const products = getSelectedProductInfo(cart);
      const body = {
        amount: total,
        lang: "vi",
        userId: userId,
        products,
        shipping: shippingFee,
        shippingMethod,
        shippingAddress: selectedAddress,
        sourceApp: "ReactNative",
      };

      const datas = await makeApiRequest(
        SummaryApi.payment_momo.url,
        SummaryApi.payment_momo.method,
        body
      );
      if (datas && datas.payUrl) {
        navigation.replace("WebView", {
          url: datas.payUrl,
          type: type,
          orderId: datas.orderId,
        });
      } else {
        showToast(datas.message, "error");
      }
    } else if (type === "VNPay") {
      const products = getSelectedProductInfo(cart);
      const body = {
        amount: total,
        lang: "vn",
        userId: userId,
        products,
        shipping: shippingFee,
        shippingMethod,
        shippingAddress: selectedAddress,
        sourceApp: "ReactNative",
      };
      const datas = await makeApiRequest(
        SummaryApi.payment_vnpay.url,
        SummaryApi.payment_vnpay.method,
        body
      );
      if (datas?.url) {
        navigation.replace("WebView", {
          url: datas.url,
          type: type,
          orderId: datas.orderId,
        });
      } else {
        showToast(datas.message, "error");
      }
    }
  };

  return (
    <ScrollView>
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Thanh Toán</Text>
      </Pressable>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {steps?.map((step, index) => (
            <View
              key={index}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: "green" },
                    index <= currentStep && { backgroundColor: "green" },
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ textAlign: "center", marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Chọn Địa Chỉ Giao Hàng
          </Text>
          <Pressable>
            {addresses?.map((item, index) => (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: "#D0D0D0",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
                key={index}
              >
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAdress(item)}
                    name="circle"
                    size={20}
                    color="gray"
                  />
                )}

                <View style={{ marginLeft: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      {item?.fullName}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>
                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    Địa chỉ: {item?.fullAddress}
                  </Text>

                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    Địa chỉ cụ thể: {item?.detailAddress}
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
                  <View>
                    {selectedAddress && selectedAddress._id === item?._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: "#008397",
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ textAlign: "center", color: "white" }}>
                          Gửi Đến Địa Chỉ Này
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      )}
      {currentStep == 1 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Chọn tùy chọn giao hàng của bạn
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {shippingMethod === "FAST" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setShippingMethod("FAST")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1, fontSize: 16 }}>
              <Text style={{ color: "orange", fontWeight: "500" }}>FAST</Text> -
              Giao hàng tiết kiệm
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {shippingMethod === "GO_JEK" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setShippingMethod("GO_JEK")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1, fontSize: 16 }}>
              <Text style={{ color: "orange", fontWeight: "500" }}>GOJEK</Text>-
              Giao hàng tiết kiệm
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setCurrentStep(2);
              handleShippingMethodChange(shippingMethod);
            }}
            style={{
              backgroundColor: "#DC2626",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
              Tiếp tục
            </Text>
          </Pressable>
        </View>
      )}
      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Chọn phương thức thanh toán của bạn
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Thanh toán khi nhận hàng
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "vnpay" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption("vnpay");
                  Alert.alert("UPI/Debit card", "Pay Online", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel is pressed"),
                    },
                    {
                      text: "OK",
                      onPress: () => pay("VNPay"),
                    },
                  ]);
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Thanh Toán Qua VNPAY
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "momo" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption("momo");
                  Alert.alert("UPI/Debit card", "Pay Online", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel is pressed"),
                    },
                    {
                      text: "OK",
                      onPress: () => pay("MoMo"),
                    },
                  ]);
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Thanh Toán Qua MOMO
            </Text>
          </View>
          <Pressable
            onPress={() => {
              if (!selectedOption) {
                alert("Vui lòng chọn phương thức thanh toán!");
                return;
              }
              setCurrentStep(3);
            }}
            style={{
              backgroundColor: "#DC2626",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
              Tiếp tục
            </Text>
          </Pressable>
        </View>
      )}
      {currentStep === 3 && selectedOption === "cash" && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Đặt Hàng Ngay
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Tiết kiệm 5% và không bao giờ hết
              </Text>
              <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Bật giao hàng tự động
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Vận chuyển đến {selectedAddress?.fullAddress}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Mặt hàng
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>
                {displayCurrency(total)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Phí vận chuyển
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>
                {displayCurrency(shippingFee)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Tổng đơn hàng
              </Text>

              <Text
                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
              >
                {displayCurrency(total)}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Thanh toán bằng</Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              Thanh toán khi nhận hàng (tiền mặt)
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setCurrentStep(4);
              handlePlaceOrder();
            }}
            style={{
              backgroundColor: "#DC2626",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 19 }}>
              Đặt hàng của bạn
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  button_back: {
    height: 50,
    marginBottom: 20,
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
    textAlign: "center",
  },
});
