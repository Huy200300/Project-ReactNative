import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import calculateDiscount from "../helpers/calculateDiscount";
import { useNavigation } from "@react-navigation/native";

const CategoryFilter = () => {
  const navigation = useNavigation();
  const categories = [
    { label: "Điện thoại", value: "mobiles" },
    { label: "Máy tính xách tay", value: "laptop" },
    { label: "Máy tính bảng", value: "ipad" },
    { label: "Đồng hồ", value: "watches" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("mobiles");
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(4);

  // Fetch products by category
  const fetchProducts = async (category) => {
    const res = await fetchCategoryWiseProduct(category);
    setProducts(res?.data || []);
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
    setVisibleProducts(4);
  }, [selectedCategory]);

  const showMoreProducts = () => {
    setVisibleProducts((prev) => prev + 2);
  };

  const handleDetailProduct = (id) => {
    navigation.navigate("Info", {
      id: id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            onPress={() => setSelectedCategory(category.value)}
            style={[
              styles.categoryButton,
              selectedCategory === category.value &&
                styles.activeCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.value &&
                  styles.activeCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.productList}>
        {products.slice(0, visibleProducts).map((item) => (
          <Pressable
            onPress={() => handleDetailProduct(item?._id)}
            key={item._id}
            style={styles.productCard}
          >
            <Image
              source={{ uri: item.productImage[0] }}
              style={styles.productImage}
            />
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName}
            </Text>
            <View style={styles.priceContainer}>
              {item.price > item.sellingPrice && (
                <Text style={styles.originalPrice}>
                  {item.price.toLocaleString()}₫
                </Text>
              )}
              <Text style={styles.sellingPrice}>
                {item.sellingPrice.toLocaleString()}₫
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {visibleProducts < products.length && (
        <TouchableOpacity
          onPress={showMoreProducts}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreText}>Xem thêm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeCategoryButton: {
    backgroundColor: "#E31837",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    width: "48%",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#888",
    marginRight: 5,
  },
  sellingPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E31837",
  },
  discountText: {
    fontSize: 12,
    color: "#E31837",
    marginTop: 5,
  },
  showMoreButton: {
    backgroundColor: "#E31837",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  showMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CategoryFilter;
