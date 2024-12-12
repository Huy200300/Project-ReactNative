import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";

const ReviewList = ({ productId, loading, user }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReview, setTotalReview] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const { showToast } = useCustomToast();

  useEffect(() => {
    fetchReviews(currentPage);
  }, [productId, currentPage]);

  useEffect(() => {
    const sum = reviews?.reduce((acc, curr) => acc + curr?.rating, 0);
    if (reviews?.length > 0) {
      setAverageRating(sum / reviews?.length);
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  const fetchReviews = async (page = 1, limit = 3) => {
    const response = await fetch(
      `${SummaryApi.getReview.url}?page=${page}&limit=${limit}`,
      {
        method: SummaryApi.getReview.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      }
    );
    const data = await response?.json();
    if (data?.success) {
      setReviews(data?.data);
      setCurrentPage(data?.currentPage);
      setTotalPages(data?.totalPages);
      setTotalReview(data?.totalReview?.count);
    } else {
      showToast(data?.message, "error");
    }
  };

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleReplyForm = (reviewId) => {
    setShowReplyForm({
      ...showReplyForm,
      [reviewId]: !showReplyForm[reviewId],
    });
  };

  const handleLikeReview = async (reviewId, userId) => {
    const response = await fetch(SummaryApi.reviews_like.url, {
      method: SummaryApi.reviews_like.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewId: reviewId,
        userId: userId,
      }),
    });

    const json = await response.json();

    if (json?.error) {
      showToast(json?.message, "error");
    } else if (json?.success) {
      setReviews(
        reviews?.map((review) =>
          review?._id === reviewId
            ? {
                ...review,
                likedBy: review?.likedBy?.includes(userId)
                  ? review?.likedBy
                  : [...review?.likedBy, userId],
                likes: review?.likedBy.includes(userId)
                  ? review?.likes
                  : review?.likes + 1,
              }
            : review
        )
      );
    }
  };

  const handleReplyChange = (reviewId, value) => {
    setReplyContent({ ...replyContent, [reviewId]: value });
  };

  const handleReplySubmit = async (reviewId, userId, userName, avatar) => {
    const comment = replyContent[reviewId];
    if (!comment) return;
    const response = await fetch(SummaryApi.reviews_replies.url, {
      method: SummaryApi.reviews_replies.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewId: reviewId,
        comment: comment,
        userId: userId,
        userName: userName,
        avatar: avatar,
      }),
    });
    const reply = await response?.json();
    if (reply?.success) {
      const updatedReviews = reviews?.map((review) =>
        review?._id === reviewId
          ? {
              ...review,
              replies: [...review?.replies, reply?.data?.replies.pop()],
            }
          : review
      );
      setReviews(updatedReviews);
      setReplyContent({ ...replyContent, [reviewId]: "" });
      setShowReplyForm({ ...showReplyForm, [reviewId]: false });
    } else {
      showToast(reply?.message, "error");
    }
  };

  const isLiked = (likedBy, userId) => likedBy?.includes(userId);
  return (
    <ScrollView style={styles.container}>
      {totalReview > 0 && (
        <View style={[styles.flexCenter, styles.mb2]}>
          <Text>Đánh giá trung bình</Text>
          <View style={styles.flexRow}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={24}
                color={index < averageRating?.toFixed(1) ? "yellow" : "gray"}
              />
            ))}
          </View>
          <Text style={styles.averageText}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.subText}>Đã có {totalReview} đánh giá</Text>
        </View>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : reviews?.length === 0 ? (
        <View style={styles.textCenter}>
          <Text style={styles.noReviewTitle}>
            Sản phẩm chưa có đánh giá nào
          </Text>
          <Text style={styles.noReviewSubTitle}>
            Hãy là người đánh giá đầu tiên!!!
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {reviews?.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.flexRow}>
                <Image
                  source={{ uri: review?.userId?.avatar }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{review?.userId?.name}</Text>
                  <View style={styles.flexRow}>
                    {[...Array(5)].map((_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={24}
                        color={
                          index < averageRating?.toFixed(1) ? "yellow" : "gray"
                        }
                      />
                    ))}
                  </View>
                  <Text style={styles.commentText}>{review?.comment}</Text>
                  <View style={styles.flexRow}>
                    <Text style={styles.dateText}>
                      Ngày {moment(review?.createAt).format("DD/MM/YYYY")}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleReplyForm(review?._id)}
                      style={styles.actionButton}
                    >
                      <FontAwesome name="reply" size={20} color="gray" />
                      <Text>Trả lời</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleLikeReview(review?._id, user?._id)}
                      style={[
                        styles.actionButton,
                        isLiked(review?.likedBy, user?._id)
                          ? styles.liked
                          : styles.unliked,
                      ]}
                    >
                      <FontAwesome
                        name="thumbs-up"
                        size={20}
                        color={isLiked ? "blue" : "gray"}
                      />
                      <Text>{review?.likes} Thích</Text>
                    </TouchableOpacity>
                  </View>
                  {showReplyForm[review?._id] && (
                    <View style={styles.replyForm}>
                      <TextInput
                        value={replyContent[review?._id] || ""}
                        onChangeText={(text) =>
                          handleReplyChange(review?._id, text)
                        }
                        placeholder="Trả lời đánh giá này..."
                        style={styles.textInput}
                        multiline
                      />
                      <View style={styles.flexRow}>
                        <TouchableOpacity
                          onPress={() =>
                            handleReplySubmit(
                              review?._id,
                              user?._id,
                              user?.name,
                              user?.avatar
                            )
                          }
                          style={styles.submitButton}
                        >
                          <FontAwesome name="check" size={24} color="black" />
                          <Text>Gửi trả lời</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => toggleReplyForm(review?._id)}
                          style={styles.cancelButton}
                        >
                          <FontAwesome name="times" size={24} color="black" />{" "}
                          <Text>Hủy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {review?.replies?.length > 0 && (
                    <ScrollView style={styles.container}>
                      <Text style={styles.heading}>Các trả lời:</Text>
                      <ScrollView>
                        <FlatList
                          data={review?.replies}
                          nestedScrollEnabled={true}
                          keyExtractor={(item) => item?._id}
                          renderItem={({ item: reply }) => (
                            <View style={styles.replyContainer}>
                              <View style={styles.userInfo}>
                                <Text style={styles.userName}>
                                  {reply?.userName}
                                </Text>
                                <Text style={styles.date}>
                                  Ngày{" "}
                                  {moment(reply?.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Text>
                              </View>
                              <Text style={styles.comment}>
                                {reply?.comment}
                              </Text>
                            </View>
                          )}
                        />
                      </ScrollView>
                    </ScrollView>
                  )}
                </View>
              </View>
            </View>
          ))}
          <View style={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                onPress={() => changePage(index + 1)}
                style={[
                  styles.pageButton,
                  currentPage === index + 1
                    ? styles.activePage
                    : styles.inactivePage,
                ]}
              >
                <Text>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  flexRow: { flexDirection: "row", alignItems: "center" },
  flexCenter: { alignItems: "center", justifyContent: "center" },
  mb2: { marginBottom: 8 },
  icon: { fontSize: 18, marginHorizontal: 2 },
  yellow: { color: "#FFD700" },
  gray: { color: "#D3D3D3" },
  averageText: { fontSize: 16, fontWeight: "bold" },
  subText: { color: "#6B7280", fontSize: 14 },
  loadingText: { textAlign: "center", marginVertical: 20 },
  textCenter: { alignItems: "center", justifyContent: "center" },
  noReviewTitle: { fontSize: 20, fontWeight: "bold" },
  noReviewSubTitle: { fontSize: 16, color: "#9CA3AF" },
  reviewList: { marginTop: 16 },
  reviewItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  commentText: { marginVertical: 8, color: "#6B7280" },
  dateText: { fontSize: 12, color: "#9CA3AF" },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  liked: { color: "#3B82F6" },
  unliked: { color: "#9CA3AF" },
  replyForm: { marginTop: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#D1D5DB",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  pagination: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  pageButton: { padding: 8, borderRadius: 8, marginHorizontal: 4 },
  activePage: { backgroundColor: "#3B82F6", color: "#FFF" },
  inactivePage: { backgroundColor: "#E5E7EB", color: "#374151" },
  container: {
    marginLeft: 16,
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 8,
  },
  heading: {
    color: "#4B5563",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  replyContainer: {
    flexDirection: "column",
    backgroundColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#D1D5DB",
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: {
    color: "#1F2937",
    fontWeight: "bold",
    fontSize: 14,
  },
  date: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  comment: {
    color: "#1F2937",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
