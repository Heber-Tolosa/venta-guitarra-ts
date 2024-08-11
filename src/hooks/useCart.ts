import { useEffect, useState } from "react";
import { db } from "../data/db";
import { useMemo } from "react";
import type { Guitar, CartItem } from "../types";

const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data, setData] = useState<Guitar[]>([]);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;
  useEffect(() => {
    setData(db);
  }, []);
  const addToCart = (item: Guitar) => {
    const itemExist = cart.findIndex((e) => e.id === item.id);

    if (itemExist >= 0) {
      const updatedCart = [...cart];
      if (cart[itemExist].quantity >= MAX_ITEMS) return;
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function removeCart(id: Guitar["id"]) {
    setCart((prevCart) => prevCart.filter((e) => e.id !== id));
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function cleanCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeCart,
    decreaseQuantity,
    increaseQuantity,
    cleanCart,
    isEmpty,
    cartTotal,
  };
};

export default useCart;
