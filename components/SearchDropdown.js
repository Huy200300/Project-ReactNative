import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import displayCurrency from "../helpers/displayCurrency";
import calculateDiscount from "../helpers/calculateDiscount";
import { AntDesign } from "@expo/vector-icons";

const SearchDropdown = ({
  suggestions,
  search,
  onSearchChange,
  onSearchSelect,
}) => {
  const [inputValue, setInputValue] = useState(search || "");
  const [isVisible, setIsVisible] = useState(false);

  const handleInputChange = (value) => {
    setInputValue(value);
    onSearchChange(value);
    setIsVisible(value && suggestions?.length > 0);
  };

  const handleSearchClick = (suggestion) => {
    setInputValue("");
    onSearchSelect(suggestion);
    setIsVisible(false);
  };
  return (
    <Pressable style={styles.searchBar} onPress={() => setIsVisible(false)}>
      <AntDesign
        style={{ paddingLeft: 10 }}
        name="search1"
        size={22}
        color="black"
      />
      <TextInput
        placeholder="Tìm kiếm ở đây"
        value={inputValue}
        onChangeText={handleInputChange}
        style={styles.input}
      />
      {isVisible && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.suggestionItem}
              onPress={() => handleSearchClick(item)}
            >
              <Image
                source={{ uri: item?.productImage[0] }}
                style={styles.image}
              />
              <View style={styles.suggestionText}>
                <Text style={styles.productName}>{item?.productName}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.sellingPrice}>
                    {displayCurrency(item?.sellingPrice)}
                  </Text>
                  {calculateDiscount(item?.price, item?.sellingPrice) !== 0 && (
                    <Text style={styles.discountBadge}>
                      -{calculateDiscount(item?.price, item?.sellingPrice)}%
                    </Text>
                  )}
                </View>
                <Text style={styles.originalPrice}>
                  {displayCurrency(item?.price)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Pressable>
  );
};

export default SearchDropdown;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
    flex: 1,
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "black",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 3,
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  sellingPrice: {
    fontSize: 12,
    color: "red",
  },
  discountBadge: {
    fontSize: 12,
    color: "green",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
});
