import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import fetchReviewStats from "../helpers/fetchReviewStats";
import { useNavigation } from "@react-navigation/native";

const VerticalCardProduct = ({ category }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const fetchData = async (category) => {
    const categoryProduct = await fetchCategoryWiseProduct(category);
    const products = categoryProduct?.data || [];
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviewStats = await fetchReviewStats(product._id);
        return { ...product, ...reviewStats };
      })
    );
    setData(productsWithReviews);
  };

  useEffect(() => {
    fetchData(category);
  }, [category]);
  const handleDetailProduct = (id) => {
    navigation.navigate("Info", {
      id: id,
    });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignContent: "center",
        gap: 5,
        paddingHorizontal: 7,
      }}
    >
      {data?.map((item, index) => (
        <Pressable
          onPress={() => handleDetailProduct(item?._id)}
          key={index}
          style={{
            marginVertical: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 100, height: 100, resizeMode: "contain" }}
            source={{ uri: item?.productImage[0] || item?.productName }} // Thêm url mặc định nếu không có ảnh
          />
          <View
            style={{
              backgroundColor: "#E31837",
              paddingVertical: 5,
              width: 130,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              borderRadius: 4,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 13,
                fontWeight: "bold",
              }}
            >
              {item.productName}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default VerticalCardProduct;

const styles = StyleSheet.create({});
