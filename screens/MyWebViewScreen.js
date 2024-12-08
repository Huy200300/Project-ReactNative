import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, SafeAreaView, StyleSheet, Text, Alert } from "react-native";
import { WebView } from "react-native-webview";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CartType } from "../context/CartContext";

const MyWebView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const { clearCart } = useContext(CartType);


  const handlePaymentResult = (resultCode) => {
    if (resultCode === "0") {
      clearCart();
      navigation.navigate("OrderStatus");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable style={styles.button_back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        <Text style={styles.text}>Thanh Toán Bằng {route.params.type}</Text>
      </Pressable>
      <WebView
        ref={webViewRef}
        source={{ uri: route.params.url }}
        style={{ marginTop: 20 }}
        javaScriptEnabled={true}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("resultCode")) {
            const url = navState.url;
            console.log(url)
            const resultCode = new URLSearchParams(url.split("?")[1]).get(
              "resultCode"
            );
            handlePaymentResult(resultCode);
            
          }
        }}
      />
    </SafeAreaView>
  );
};

export default MyWebView;

const styles = StyleSheet.create({
  button_back: {
    height: 50,
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
  },
});
