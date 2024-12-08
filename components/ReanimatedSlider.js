import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const ReanimatedSlider = () => {
  const data = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
    "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
    "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
    "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={200}
        data={data}
        scrollAnimationDuration={1000}
        autoPlay
        autoPlayInterval={3000}
        loop
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default ReanimatedSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: width,
    height: 200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Chỉnh vị trí
    bottom: 10, // Khoảng cách với đáy của ảnh
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});
