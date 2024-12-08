import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "../api";

const useProduct = (productId) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    colors: [],
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [displayPrice, setDisplayPrice] = useState(data?.sellingPrice);
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState(data?.price);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await fetch(SummaryApi.product_detail.url, {
        method: SummaryApi.product_detail.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const result = await response.json();
      setData(result.data);
      setSelectedColor(result.data.colors[0]?.colorName);
    };
    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    if (data?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(data.colors[0].colorName);
    }
  }, [data, selectedColor, setSelectedColor]);

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    updatePrice(selectedStorage, colorName);
  };

  const handleStorageChange = (size) => {
    setSelectedStorage(size);
    const filteredColors = data?.colors.filter((color) => color.size === size);
    setAvailableColors(filteredColors);

    if (filteredColors.length > 0) {
      const firstAvailableColor = filteredColors[0];
      setSelectedColor(firstAvailableColor.colorName);
      updatePrice(size, firstAvailableColor.colorName);
    } else {
      setSelectedColor(null);
    }
  };

  const updatePrice = (size, colorName) => {
    const selectedColorData = data?.colors?.find(
      (color) => color.size === size && color.colorName === colorName
    );

    if (
      selectedColorData &&
      selectedColorData.price > 0 &&
      selectedColorData.sellingPrice > 0
    ) {
      setDisplayPrice(selectedColorData.sellingPrice);
      setDisplayOriginalPrice(selectedColorData.price);
    } else {
      setDisplayPrice(data?.sellingPrice || 0);
      setDisplayOriginalPrice(data?.price || 0);
    }
  };

  useEffect(() => {
    if (data?.colors?.length > 0) {
      const firstColor = data.colors[0];
      setSelectedStorage(firstColor.size);
      setAvailableColors(
        data.colors.filter((color) => color.size === firstColor.size)
      );
      setSelectedColor(firstColor.colorName);
      updatePrice(firstColor.size, firstColor.colorName);
    } else {
      setDisplayPrice(data?.sellingPrice || 0);
      setDisplayOriginalPrice(data?.price || 0);
    }
  }, [data]);

  const selectedProductStock = (data) => {
    if (data?.colors?.length > 0) {
      return (
        data?.colors.find(
          (color) =>
            color.colorName === selectedColor && color.size === selectedStorage
        )?.stock || 0
      );
    }
    return data?.countInStock;
  };

  const getImagesForSelectedColor = () => {
    const selectedColorData = data.colors.find(
      (color) =>
        color.colorName === selectedColor && color.size === selectedStorage
    );
    return selectedColorData ? selectedColorData.colorImages : data?.productImage;
  };

  const uniqueSizes = [...new Set(data?.colors?.map((color) => color.size))];

  return {
    data,
    selectedColor,
    availableColors,
    handleColorChange,
    displayPrice,
    uniqueSizes,
    displayOriginalPrice,
    handleStorageChange,
    selectedProductStock,
    getImagesForSelectedColor,
    selectedStorage,
  };
};

export default useProduct;
