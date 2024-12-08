import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

const cities = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Bình Định",
];

const districtsByCity = {
  "An Giang": ["Huyện Chợ Mới", "Huyện Châu Thành"],
  "Bà Rịa - Vũng Tàu": ["Thành phố Vũng Tàu", "Huyện Xuyên Mộc"],
  "Bình Dương": ["Thành phố Thủ Dầu Một", "Huyện Dĩ An"],
  "Bình Phước": ["Thành phố Đồng Xoài", "Huyện Bù Đăng"],
  "Bình Thuận": ["Thành phố Phan Thiết", "Huyện Bắc Bình"],
  "Bình Định": ["Thành phố Quy Nhơn", "Huyện An Nhơn"],
};

const wardsByDistrict = {
  "Huyện Chợ Mới": ["Xã Mỹ Hội Đông", "Xã An Thạnh Trung"],
  "Huyện Châu Thành": ["Xã Bình Thạnh", "Xã Vĩnh Bình"],
  "Thành phố Vũng Tàu": ["Phường 1", "Phường 2"],
  "Huyện Xuyên Mộc": ["Xã Xuyên Mộc", "Xã Bông Trang"],
  "Thành phố Thủ Dầu Một": ["Phường Phú Hòa", "Phường Hiệp Thành"],
  "Huyện Dĩ An": ["Phường Dĩ An", "Phường An Bình"],
  "Thành phố Đồng Xoài": ["Phường Tân Bình", "Phường Tân Xuân"],
  "Huyện Bù Đăng": ["Xã Đức Liễu", "Xã Phước Sơn"],
  "Thành phố Phan Thiết": ["Phường Bình Hưng", "Phường Phú Thủy"],
  "Huyện Bắc Bình": ["Xã Phan Rí Thành", "Xã Hải Ninh"],
  "Thành phố Quy Nhơn": ["Phường Trần Phú", "Phường Ngô Mây"],
  "Huyện An Nhơn": ["Xã Nhơn Lộc", "Xã Nhơn Hòa"],
};

const AddressPicker = ({ onChange }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("city");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    setSelectedWard("");
    setSelectedTab("district");
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedWard("");
    setSelectedTab("ward");
  };

  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
    setDropdownVisible(false);
    onChange("fullAddress", `${ward} ${selectedDistrict} ${selectedCity}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={
          selectedWard || selectedDistrict || selectedCity
            ? `${selectedWard} ${selectedDistrict} ${selectedCity}`
            : ""
        }
        style={styles.textInput}
        placeholder="Chọn Địa chỉ"
        onPressIn={() => setDropdownVisible(true)}
      />

      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.dropdown}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    selectedTab === "city" && styles.selectedTab,
                  ]}
                  onPress={() => setSelectedTab("city")}
                >
                  <Text style={styles.tabText}>Tỉnh/Thành phố</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    selectedTab === "district" && styles.selectedTab,
                  ]}
                  onPress={() => setSelectedTab("district")}
                  disabled={!selectedCity}
                >
                  <Text style={styles.tabText}>Quận/Huyện</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    selectedTab === "ward" && styles.selectedTab,
                  ]}
                  onPress={() => setSelectedTab("ward")}
                  disabled={!selectedDistrict}
                >
                  <Text style={styles.tabText}>Phường/Xã</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.listContainer}>
                {selectedTab === "city" &&
                  cities.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={styles.listItem}
                      onPress={() => handleCitySelect(city)}
                    >
                      <Text style={styles.listItemText}>{city}</Text>
                    </TouchableOpacity>
                  ))}

                {selectedTab === "district" &&
                  districtsByCity[selectedCity]?.map((district) => (
                    <TouchableOpacity
                      key={district}
                      style={styles.listItem}
                      onPress={() => handleDistrictSelect(district)}
                    >
                      <Text style={styles.listItemText}>{district}</Text>
                    </TouchableOpacity>
                  ))}

                {selectedTab === "ward" &&
                  wardsByDistrict[selectedDistrict]?.map((ward) => (
                    <TouchableOpacity
                      key={ward}
                      style={styles.listItem}
                      onPress={() => handleWardSelect(ward)}
                    >
                      <Text style={styles.listItemText}>{ward}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomColor: "#00CED1",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    maxHeight: 300,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listItemText: {
    fontSize: 16,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    borderRadius: 8,
    fontSize: 16,
  },
});

export default AddressPicker;
