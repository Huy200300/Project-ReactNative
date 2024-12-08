import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import _ from "lodash";

const updateCart = (newCart) => {
  if (!_.isEqual(newCart, cart)) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }
};

const CartType = createContext();

const CartContext = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng từ AsyncStorage:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    try {
      AsyncStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào AsyncStorage:", error);
    }
  }, [cart]);

  const updateCart = (updates) => {
    setCart((prevCart) => {
      const updatesArray = Array.isArray(updates) ? updates : [updates];
      const updatedCart = prevCart
        .map((item) => {
          const update = updatesArray.find((u) => {
            const isProductMatch = u.productId === item._id;
            const isColorMatch =
              !u.selectedColor || u.selectedColor === item.selectedColor;
            const isSizeMatch =
              !u.selectedSize || u.selectedSize === item.selectedStorage;

            return isProductMatch && isColorMatch && isSizeMatch;
          });
          if (update) {
            const newQuantity = item.amount + update.quantityChange;
            return newQuantity > 0 ? { ...item, amount: newQuantity } : null;
          }

          return item;
        })
        .filter(Boolean);

      AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedColor === product.selectedColor &&
        item.selectedStorage === product.selectedStorage
    );

    if (existingProductIndex >= 0) {
      return;
      // const updatedCart = [...cart];
      // updatedCart[existingProductIndex].amount += 1;
      // setCart(updatedCart);
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
      setCart([...cart, { ...product, amount: 1 }]);
    }
  };

  const removeFromCart = (productId, selectedColor) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item._id === productId && item.selectedColor === selectedColor)
    );
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartType.Provider
      value={{
        cart,
        cartLength: cart.length,
        addToCart,
        removeFromCart,
        clearCart,
        updateCart,
      }}
    >
      {children}
    </CartType.Provider>
  );
};

export { CartType, CartContext };
