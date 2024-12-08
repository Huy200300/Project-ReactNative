import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SummaryApi from "../api";
import useCustomToast from "../helpers/useCustomToast";

const CancelOrder = ({ status, orderId, setSelectedStatus }) => {
  const cancelReasons = [
    "Đặt nhầm sản phẩm",
    "Tìm thấy giá tốt hơn",
    "Không muốn mua nữa",
    "Sản phẩm không phù hợp với nhu cầu",
    "Đã đặt hàng từ cửa hàng khác",
    "Sản phẩm không có đánh giá tốt",
    "Lo lắng về chất lượng sản phẩm",
    "Đã nhận được ưu đãi từ nơi khác",
  ];
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const { showToast } = useCustomToast();

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (id, newStatus, reason) => {
    const token = await AsyncStorage.getItem("authToken");
    const res = await fetch(SummaryApi.update_status_order.url, {
      method: SummaryApi.update_status_order.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId: id, newStatus, reason }),
    });
    const dataApi = await res.json();
    if (dataApi?.success) {
      setShowCancelModal(false);
      showToast("Bạn đã hủy đơn hàng thành công", "success");
      setSelectedStatus(newStatus);
    } else {
      showToast(dataApi?.message, "error");
    }
  };

  return (
    <View>
      {status === "Pending" && (
        <View style={styles.cancelButtonContainer}>
          <Text style={styles.cancelButton} onPress={() => handleCancelOrder()}>
            Hủy đơn hàng
          </Text>
        </View>
      )}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn lý do hủy đơn hàng</Text>
            {cancelReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedReason(reason);
                }}
                style={[
                  styles.reasonButton,
                  selectedReason === reason && styles.selectedReasonButton,
                ]}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalButtonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  handleConfirmCancel(orderId, "Cancelled", selectedReason)
                }
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CancelOrder;

const styles = StyleSheet.create({
  cancelButtonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  reasonButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  selectedReasonButton: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
  },
  reasonText: {
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#1890ff",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
