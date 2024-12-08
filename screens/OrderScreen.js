import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../context/UserContext";
import SummaryApi from "../api";
import displayCurrency from "../helpers/displayCurrency";
import CancelOrder from "../components/CancelOrder";

const OrderScreen = () => {
  const { userId } = useContext(UserType);
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (route.params?.selectedStatus) {
      setSelectedStatus(route.params.selectedStatus);
      const defaultIndex = statuses.findIndex(
        (status) => status.key === route.params.selectedStatus
      );

      if (defaultIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: defaultIndex * 110,
          animated: true,
        });
      }
    }
  }, [route.params?.selectedStatus]);

  useEffect(() => {
    const fetchOrders = async (userId, page = 1, limit = 3, status) => {
      try {
        const response = await fetch(
          `${SummaryApi.getOrderUser.url}/${userId}?page=${page}&limit=${limit}&status=${status}`,
          {
            method: SummaryApi.getOrderUser.method,
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        setLoading(false);
        const orders = await response.json();
        const fetchedOrders = orders?.data || [];
        setOrders(orders.data);
        setCurrentPage(orders.currentPage);
        setTotalPages(orders.totalPages);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchOrders(userId, currentPage, 3, selectedStatus);
  }, [userId, currentPage, selectedStatus]);

  const statuses = [
    { key: "Pending", label: "Chờ xác nhận" },
    { key: "Processing", label: "Đang xử lý" },
    { key: "Shipping", label: "Vận chuyển" },
    { key: "Shipped", label: "Chờ giao hàng" },
    { key: "Delivered", label: "Hoàn thành" },
    { key: "Cancelled", label: "Đã hủy" },
  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const getStatusStyle = (statusKey) => {
    switch (statusKey) {
      case "Pending":
        return { color: "#FFA500" };
      case "Processing":
        return { color: "#2196F3" };
      case "Shipping":
        return { color: "#FFC107" };
      case "Shipped":
        return { color: "#00BCD4" };
      case "Delivered":
        return { color: "#4CAF50" };
      case "Cancelled":
        return { color: "#F44336" };
      default:
        return { color: "#616161" };
    }
  };
  const getCurrentStatus = orders?.map(
    (i) => i?.statusHistory?.slice(-1)[0]?.orderStatus
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Đơn đã mua</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusContainer}
        ref={scrollViewRef}
      >
        {statuses?.map((status) => (
          <Pressable
            key={status.key}
            onPress={() => handleStatusChange(status.key)}
            style={[
              styles.statusButton,
              selectedStatus === status.key && styles.selectedStatus,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status.key && styles.selectedText,
              ]}
            >
              {status.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.ordersContainer}>
        {selectedStatus ? (
          <View>
            {orders && orders.length > 0 ? (
              <>
                {orders.map((product, index) => (
                  <View key={index} style={styles.orderContainer}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>
                        Mã đơn hàng: {product?.orderId}
                      </Text>
                      <Text style={styles.orderStatus}>
                        <Text
                          style={[
                            styles.statusText,
                            getStatusStyle(getCurrentStatus[0] || ""),
                          ]}
                        >
                          {statuses.find((s) => s.key === getCurrentStatus[0])
                            ?.label || selectedStatus}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.orderItemContainer}>
                      <View style={styles.productList}>
                        {product?.productDetails?.map((p, idx) => (
                          <View key={idx} style={styles.productItem}>
                            <Image
                              source={{ uri: p?.colorImage }}
                              style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                              <Text
                                style={styles.productName}
                                numberOfLines={2}
                              >
                                {p?.productName}
                              </Text>
                              <Text style={styles.price}>
                                Giá: {displayCurrency(p?.sellingPrice)}
                              </Text>
                              <Text style={styles.quantity}>
                                Số lượng: {p?.quantity}
                              </Text>
                              {p?.color && (
                                <Text style={styles.color}>Màu: {p.color}</Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                      <View style={styles.totalContainer}>
                        <Text style={styles.totalAmount}>
                          Tổng số sản phẩm:{" "}
                          {product.productDetails.reduce(
                            (acc, item) => acc + item?.quantity,
                            0
                          )}
                        </Text>
                        <Text style={styles.totalPrice}>
                          Tổng tiền: {displayCurrency(product?.amount)}
                        </Text>
                      </View>
                    </View>

                    <CancelOrder
                      status={getCurrentStatus[0]}
                      orderId={product?._id}
                      setSelectedStatus={setSelectedStatus}
                    />
                  </View>
                ))}

                <View style={styles.pagination}>
                  <Pressable
                    onPress={() => handlePageChange(currentPage - 1)}
                    style={styles.pageButton}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                  <Text style={styles.pageText}>
                    Trang {currentPage} / {totalPages}
                  </Text>
                  <Pressable
                    onPress={() => handlePageChange(currentPage + 1)}
                    style={styles.pageButton}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.noOrdersText}>Không có đơn hàng nào</Text>
            )}
          </View>
        ) : (
          <Text style={styles.noOrdersText}>
            Chọn trạng thái để xem đơn hàng
          </Text>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    marginHorizontal: 10,
    height: 50,
  },
  selectedStatus: {
    borderBottomWidth: 2,
    borderColor: "#FF0000",
  },
  statusText: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedText: {
    color: "#FF0000",
  },
  orderContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    // marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: "#333",
    // marginBottom: 10,
  },
  statusText: {
    fontWeight: "bold",
  },
  orderItemContainer: {
    flexDirection: "column",
    // justifyContent: "space-between",
  },
  productList: {
    flex: 3,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: "#616161",
  },
  quantity: {
    fontSize: 14,
    color: "#333",
  },
  color: {
    fontSize: 14,
    color: "#FF5722",
    fontWeight: "500",
  },
  totalContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5722",
  },
  noOrdersText: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    marginBottom: 20,
  },
  pageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  pageButtonText: {
    fontSize: 18,
    color: "#333",
  },
  pageText: {
    fontSize: 16,
    color: "#333",
    alignSelf: "center",
  },
});

export default OrderScreen;
