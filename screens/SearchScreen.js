import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SummaryApi from "../api";
import AntDesign from "react-native-vector-icons/AntDesign";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem("searchHistory");
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    };
    loadSearchHistory();
  }, []);

  const saveSearchHistory = async (query) => {
    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ].slice(0, 10);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        "searchHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const fetchProductSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${SummaryApi.getSearchName.url}?query=${query}`,
        {
          method: SummaryApi.getSearchName.method,
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result?.success) {
        setFilteredSuggestions(result?.data);
      }
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
    }
  };

  const handleSearchChange = useCallback((value) => {
    setSearchText(value);
    if (value) {
      fetchProductSuggestions(value);
    } else {
      setFilteredSuggestions([]);
    }
  }, []);

  const handleSearchSelect = (suggestion) => {
    saveSearchHistory(searchText);
    setFilteredSuggestions([]);
    navigation.navigate("Info", {
      id: suggestion?._id,
    });
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredSuggestions([]);
  };

  const handleSearchSubmit = () => {
    if (searchText) {
      saveSearchHistory(searchText);
      fetchProductSuggestions(searchText);
    }
  };

  const handleClearHistory = async () => {
    setSearchHistory([]);
    await AsyncStorage.removeItem("searchHistory");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          }}
        >
          <TextInput
            value={searchText}
            onChangeText={(text) => handleSearchChange(text)}
            placeholder="Tiềm kiếm ở đây"
            style={{
              flex: 1,
              height: 40,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              marginLeft: 10,
              paddingHorizontal: 10,
            }}
            onSubmitEditing={handleSearchSubmit}
          />
          {searchText.length > 0 && (
            <Pressable
              style={{ position: "absolute", right: 10 }}
              onPress={handleClearSearch}
            >
              <AntDesign name="closecircle" size={20} color="#aaa" />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={handleSearchSubmit}
          style={{
            backgroundColor: "#00CED1",
            borderRadius: 5,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <AntDesign name="search1" size={20} color="white" />
        </Pressable>
      </View>

      {searchHistory.length > 0 && !searchText && (
        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Lịch sử tìm kiếm
            </Text>
            <Pressable onPress={handleClearHistory}>
              <Text style={{ color: "#00CED1", fontSize: 14 }}>Xóa tất cả</Text>
            </Pressable>
          </View>
          {searchHistory.map((history, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearchText(history);
                handleSearchSubmit();
              }}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text>{history}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredSuggestions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSearchSelect(item)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text>{item.productName}</Text>
          </TouchableOpacity>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default SearchScreen;
