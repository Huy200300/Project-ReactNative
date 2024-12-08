import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import SummaryApi from "../api";
import displayCurrency from "../helpers/displayCurrency";
import calculateDiscount from "../helpers/calculateDiscount";
import { useNavigation } from "@react-navigation/native";

const TopSellingProduct = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const fetchData = async (limit = 10) => {
    const res = await fetch(SummaryApi.get_top_selling_product.url, {
      method: SummaryApi.get_top_selling_product.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ limit }),
    });
    const dataApi = await res.json();
    setData(dataApi?.data);
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
    <ScrollView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const discount =
            item.price > item.sellingPrice
              ? calculateDiscount(item.price, item.sellingPrice)
              : 0;

          return (
            <Pressable
              style={styles.card}
              onPress={() => handleDetailProduct(item?._id)}
            >
              <Image
                style={styles.image}
                source={{ uri: item.productImage[0] }}
              />
              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}%</Text>
                </View>
              )}
              <Text style={styles.productName} numberOfLines={1}>
                {item.productName}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>
                  {displayCurrency(item.price)}
                </Text>

                <Text style={styles.sellingPrice}>
                  {displayCurrency(item.sellingPrice)}
                </Text>
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 8,
    width: 150,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 8,
  },

  discountBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E31837",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  sellingPrice: {
    flexWrap: "wrap",
    fontSize: 14,
    fontWeight: "bold",
    color: "#E31837",
  },
});

export default TopSellingProduct;
