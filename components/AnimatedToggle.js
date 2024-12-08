import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

const AnimatedToggle = ({ name, handleOnChange }) => {
  const [isDefault, setIsDefault] = useState(false);
  const animationValue = new Animated.Value(isDefault ? 1 : 0);

  const toggleSwitch = () => {
    const newValue = !isDefault;
    setIsDefault(newValue);
    handleOnChange(name, newValue);
    Animated.spring(animationValue, {
      toValue: isDefault ? 0 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D0D0D0", "#007bff"],
  });

  const togglePosition = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 24],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đặt làm địa chỉ mặc định</Text>
      <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
        <Animated.View style={[styles.toggle, { left: togglePosition }]} />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor, borderRadius: 20 },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Đặt văn bản và toggle theo hàng ngang
    alignItems: "center", // Căn giữa theo trục dọc
    justifyContent: "space-between", // Tách đều khoảng cách
    marginVertical: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10, // Tạo khoảng cách giữa văn bản và toggle
  },
  switchContainer: {
    width: 52,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#D0D0D0",
    justifyContent: "center",
    paddingHorizontal: 2,
    position: "relative",
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    position: "absolute",
    top: 2,
    zIndex: 10,
  },
});

export default AnimatedToggle;
