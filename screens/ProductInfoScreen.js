import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import useProduct from "../hooks/useProduct";
import displayCurrency from "../helpers/displayCurrency";
import AntDesign from "@expo/vector-icons/AntDesign";
import calculateDiscount from "../helpers/calculateDiscount";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useCustomToast from "../helpers/useCustomToast";
import { CartContext, CartType } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import { UserType } from "../context/UserContext";

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const [addedToCart, setAddedToCart] = useState(false);
  const { showToast } = useCustomToast();
  const { addToCart } = useContext(CartType);
  const { userId } = useContext(UserType);
  const [user, setUser] = useState(null);
  const {
    data,
    selectedColor,
    availableColors,
    handleColorChange,
    displayPrice,
    uniqueSizes,
    displayOriginalPrice,
    handleStorageChange,
    selectedProductStock,
    getImagesForSelectedColor,
    selectedStorage,
  } = useProduct(route.params.id);

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

  const handleAddToCart = (product) => {
    setAddedToCart(true);
    const filteredColors = product.colors.filter(
      (color) => color.size === selectedStorage
    );

    const colorData = product.colors.find(
      (color) =>
        color.colorName === selectedColor && color.size === selectedStorage
    );

    const price = colorData?.price || product.price;
    const sellingPrice = colorData?.sellingPrice || product.sellingPrice;
    const countInStock = colorData?.stock || product.countInStock;
    const productWithSelections = {
      _id: product._id,
      productName: product.productName,
      price,
      sellingPrice,
      amount: 1,
      selectedColor,
      selectedColorImage:
        colorData?.colorImages?.[0] || product?.productImage?.[0],
      selectedStorage,
      countInStock,
      colors: filteredColors,
    };
    showToast("Đã thêm vào giỏ", "success");
    addToCart(productWithSelections);
    setTimeout(() => {
      setAddedToCart(false);
    }, 40000);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {getImagesForSelectedColor()?.map((item, index) => (
          <View style={{ position: "relative" }} key={index}>
            <Image
              source={{ uri: item }}
              style={{ width, height, marginTop: 25, resizeMode: "contain" }}
            />
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1000,
              }}
            >
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialIcons
                  name="keyboard-backspace"
                  size={24}
                  color="black"
                />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {data.productName}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            color: "rgb(229, 62, 62)",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {displayCurrency(displayPrice)}
        </Text>
        {displayOriginalPrice !== 0 && (
          <Text
            style={{
              textDecorationLine: "line-through",
              color: "gray",
              fontSize: 16,
            }}
          >
            {displayCurrency(displayOriginalPrice)}
          </Text>
        )}
        {calculateDiscount(displayOriginalPrice, displayPrice) > 0 ? (
          <Text
            style={{
              backgroundColor: "#E31837",
              borderRadius: 5,
              paddingVertical: 2,
              paddingHorizontal: 6,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {calculateDiscount(displayOriginalPrice, displayPrice)}%
          </Text>
        ) : (
          ""
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        {data?.colors.length > 0 && (
          <View style={{ flexDirection: "column", gap: 10 }}>
            {uniqueSizes.filter((size) => size !== undefined && size !== null)
              .length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
                >
                  Dung Lượng
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  {uniqueSizes
                    .filter((size) => size !== undefined && size !== null)
                    .map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={{
                          padding: 10,
                          backgroundColor:
                            selectedStorage === size
                              ? "rgb(229, 62, 62)"
                              : "rgb(204, 204, 204)",
                          borderRadius: 8,
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                        onPress={() => handleStorageChange(size)}
                      >
                        <Text style={{ color: "white", fontSize: 14 }}>
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Màu sắc
              </Text>
              {availableColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderColor:
                      selectedColor === color.colorName
                        ? "rgb(229, 62, 62)"
                        : "rgb(204, 204, 204)",
                  }}
                  onPress={() => handleColorChange(color.colorName)}
                >
                  <Image
                    source={{ uri: color.colorImages[0] }}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    {color.colorName}
                  </Text>
                  {selectedColor === color.colorName && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgb(229, 62, 62)",
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign
                        name="check"
                        style={{ color: "white", fontSize: 12 }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          Mô tả sản phẩm
        </Text>
        <Text style={{ fontWeight: "500" }}>{data?.description}</Text>
      </View>

      <Text style={{ color: "green", marginHorizontal: 10, fontWeight: "500" }}>
        IN Stock
      </Text>

      <Pressable
        onPress={() => handleAddToCart(data)}
        style={{
          backgroundColor: "#E31837",
          padding: 10,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
          width: "100%",
        }}
      >
        {addedToCart ? (
          <View>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Đã thêm vào giỏ hàng
            </Text>
          </View>
        ) : (
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Thêm vào giỏ hàng
          </Text>
        )}
      </Pressable>

    </ScrollView>
  );
};

export default ProductInfoScreen;
