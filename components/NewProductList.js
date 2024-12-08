import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import fetchReviewStats from "../helpers/fetchReviewStats";
import SummaryApi from "../api";
import displayCurrency from "../helpers/displayCurrency";
import { useNavigation } from "@react-navigation/native";

const NewProductList = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const fetchData = async (limit = 4, days = 50) => {
    const res = await fetch(SummaryApi.get_new_product.url, {
      method: SummaryApi.get_new_product.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ limit, days }),
    });
    const dataApi = await res.json();
    if (dataApi?.success) {
      const products = dataApi?.data || [];
      const productsWithReviews = await Promise.all(
        products.map(async (product) => {
          const reviewStats = await fetchReviewStats(product._id);
          return { ...product, ...reviewStats };
        })
      );
      setData(productsWithReviews);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDetailProduct = (id) => {
    navigation.navigate("Info", {
      id: id,
    });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {data?.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => handleDetailProduct(item?._id)}
          style={{
            marginVertical: 10,
            flexDirection: "column",
            alignItems: "center",
            width: "48%",
          }}
        >
          <Image
            style={{ width: 100, height: 100, resizeMode: "contain" }}
            source={{ uri: item?.productImage[0] }}
          />
          <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
            {item.productName}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                textDecorationLine: "line-through",
                fontSize: 12,
                color: "gray",
              }}
            >
              {displayCurrency(item?.price)}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
              {displayCurrency(item?.sellingPrice)}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default NewProductList;

const styles = StyleSheet.create({});
