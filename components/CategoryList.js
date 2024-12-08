import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import SummaryApi from "../api";
import { useNavigation } from "@react-navigation/native";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const navigation = useNavigation();

  const fetchCategoryProduct = async () => {
    const dataResponse = await fetch(SummaryApi.category_product.url, {
      method: SummaryApi.category_product.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();
    setCategoryProduct(dataApi?.data || []);
  };
  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categoryProduct.map((item, index) => (
        <Pressable
          onPress={() =>
            navigation.navigate("CategoryProduct", {
              categoryId: item.products[0]._id,
              categoryName: item.category,
            })
          }
          key={index}
          style={{
            margin: 10,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Image
            style={{ width: 50, height: 50, resizeMode: "contain" }}
            source={{ uri: item?.products?.[0]?.productImage?.[0] }}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: "500",
              marginTop: 5,
            }}
          >
            {item?.category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({});
