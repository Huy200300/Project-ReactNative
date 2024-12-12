import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewList from "./ReviewList";

const ReviewForm = ({ productId, user }) => {
  console.log(user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
    const { showToast } = useCustomToast();

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const reset = () => {
    setComment("");
    setRating(0);
  };

  const handleSubmit = async () => {
    const token = (await AsyncStorage.getItem("authToken")) || undefined;
    console.log("token", token);
    setLoading(true);

    const response = await fetch(SummaryApi.newReview.url, {
      method: SummaryApi.newReview.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || undefined}`,
      },
      body: JSON.stringify({
        productId,
        rating,
        comment,
        userId: user?._id,
      }),
    });
    setLoading(false);
    const dataApi = await response?.json();
    if (dataApi?.success) {
      showToast(dataApi?.message, "success");
      reset();
    } else {
      showToast(dataApi?.message, "error");
      reset();
    }
  };
  return (
    <View
      style={{
        marginTop: 16,
        // borderWidth: 2,
        borderColor: "#000",
        borderRadius: 8,
        padding: 8,
      }}
    >
      <View style={styles.container}>
        {user && (
          <View style={styles.userSection}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        )}
        <View style={styles.reviewSection}>
          <Text style={styles.title}>
            Bạn đã dùng sản phẩm này? Hãy đánh giá sản phẩm
          </Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setRating(index + 1)}
              >
                <FontAwesome
                  name="star"
                  size={30}
                  color={index < rating ? "#FFD700" : "#CCCCCC"}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={(text) => handleCommentChange(text)}
            placeholder="Nhận xét của bạn về sản phẩm..."
            multiline
            style={styles.textArea}
          />
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              handleSubmit(comment, rating, setLoading);
            }}
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Gửi..." : "Gửi đánh giá"}
            </Text>
          </TouchableOpacity>
        </View>
        {user && (
          <Text style={styles.productReviewTitle}>Đánh giá sản phẩm</Text>
        )}
      </View>
      {loading ? (
        <View style={{ textAlign: "center" }}>Loading...</View>
      ) : (
        <ReviewList productId={productId} loading={loading} user={user} />
      )}
    </View>
  );
};

export default ReviewForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#FFFFFF",
  },
  userSection: {
    alignItems: "center",
    // marginBottom: 20,
  },
  avatar: {
    width: 100,
    // height: 100,
    borderRadius: 50,
    // marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reviewSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  productReviewTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
