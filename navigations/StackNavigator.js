import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import { CartType } from "../context/CartContext";
import MyWebViewScreen from "../screens/MyWebViewScreen";
import ProfileDetail from "../screens/ProfileDetail";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EditEmail from "../components/EditEmail";
import EditPhone from "../components/EditPhone";
import EditProfile from "../components/EditProfile";
import CategoryProductScreen from "../screens/CategoryProductScreen";
import OrderStatus from "../screens/OrderStatus";
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const { cartLength } = useContext(CartType);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#008E97" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Tài Khoản",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#008E97" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Giỏ hàng",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const IconComponent = focused ? MaterialIcons : AntDesign;
            const iconColor = focused ? "#008E97" : "black";

            return (
              <View style={{ position: "relative", alignItems: "center" }}>
                <IconComponent
                  name={focused ? "shopping-cart" : "shoppingcart"}
                  size={24}
                  color={iconColor}
                />
                {cartLength > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -5,
                      backgroundColor: "red",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 11,
                        fontWeight: "bold",
                      }}
                    >
                      {cartLength}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebView"
          component={MyWebViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditEmail"
          component={EditEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPhone"
          component={EditPhone}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryProduct"
          component={CategoryProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderStatus"
          component={OrderStatus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
