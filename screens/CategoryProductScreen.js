import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Icon
import SummaryApi from "../api";
import displayCurrency from "../helpers/displayCurrency";

const CategoryProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async (category, page = 1, limit = 6) => {
      try {
        const response = await fetch(SummaryApi.filter_product.url, {
          method: SummaryApi.filter_product.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, page, limit }),
        });
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsByCategory(categoryName);
  }, [categoryName]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image
              source={{ uri: item.productImage[0] }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>
                {displayCurrency(item.price)}
              </Text>
              <Text style={styles.productPrice}>
                {displayCurrency(item.sellingPrice)}
              </Text>
            </View>
            <Icon name="cart-outline" size={24} color="#ff5733" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#ff5733",
  },
});
