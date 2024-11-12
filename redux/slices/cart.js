import { createSlice } from "@reduxjs/toolkit";
import { parseCookies } from "nookies";
import {
  getGuestCart,
  setGuestCart,
  addToGuestCart as addToGuestCartStorage,
  removeFromGuestCart as removeFromGuestCartStorage,
  updateGuestCartItemQty,
  calculateGuestCartTotal,
} from "../../utils/guestCart";

const initialState = {
  cartData: {},
  memberData: {},
  cartItems: [],
  generalData: {},
  orderedProduct: [],
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
  isGuest: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData(state, action) {
      state.cartData = action.payload;
    },
    setMember(state, action) {
      state.memberData = action.payload;
    },
    initializeCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        state.isGuest = true;
        state.cartItems = getGuestCart();
        const total = calculateGuestCartTotal();
        state.cartTotalAmount = total;
        state.cartTotalQuantity = state.cartItems.reduce((sum, item) => sum + item.qty, 0);
      }
    },
    addToCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        const updatedCart = addToGuestCartStorage(action.payload);
        state.cartItems = updatedCart;
        state.cartTotalAmount = calculateGuestCartTotal();
        state.cartTotalQuantity = updatedCart.reduce((sum, item) => sum + item.qty, 0);
      } else {
        const findedIndex = state.cartItems.findIndex(
          (item) =>
            item.id === action.payload.id &&
            item.user_cart_uuid === action.payload.user_cart_uuid
        );
        if (findedIndex >= 0) {
          state.cartItems[findedIndex] = {
            ...state.cartItems[findedIndex],
            qty: state.cartItems[findedIndex].qty + 1,
          };
        } else {
          let tempProductItem = {
            ...action.payload,
            qty: action.payload.min_qty,
          };
          state.cartItems.push(tempProductItem);
        }
      }
    },
    setToCart(state, action) {
      state.cartItems = action.payload;
    },
    decreaseCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        const updatedCart = updateGuestCartItemQty(action.payload.id,
          state.cartItems.find(item => item.id === action.payload.id)?.qty - 1 || 0
        );
        state.cartItems = updatedCart;
        state.cartTotalAmount = calculateGuestCartTotal();
        state.cartTotalQuantity = updatedCart.reduce((sum, item) => sum + item.qty, 0);
      } else {
        const findedIndex = state.cartItems.findIndex(
          (item) =>
            item.id === action.payload.id &&
            item.user_cart_uuid === action.payload.user_cart_uuid
        );

        if (state.cartItems[findedIndex]?.qty > action.payload.min_qty) {
          state.cartItems[findedIndex].qty -= 1;
        } else if (state.cartItems[findedIndex].qty === action.payload.min_qty) {
          const nextCartItems = state.cartItems.filter(
            (item) => item.id !== action.payload.id
          );
          state.cartItems = nextCartItems;
        }
      }
    },
    removeFromCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        const updatedCart = removeFromGuestCartStorage(action.payload.id);
        state.cartItems = updatedCart;
        state.cartTotalAmount = calculateGuestCartTotal();
        state.cartTotalQuantity = updatedCart.reduce((sum, item) => sum + item.qty, 0);
      } else {
        state.cartItems.map((cartItem) => {
          if (
            cartItem.id === action.payload.id &&
            cartItem.user_cart_uuid === action.payload.user_cart_uuid
          ) {
            const nextCartItems = state.cartItems.filter(
              (item) => item.id !== action.payload.id
            );
            state.cartItems = nextCartItems;
          }
          return state;
        });
      }
    },
    getTotals(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        state.cartTotalAmount = calculateGuestCartTotal();
        state.cartTotalQuantity = state.cartItems.reduce((sum, item) => sum + item.qty, 0);
      } else if (action.payload) {
        let { total, quantity } = state.cartItems
          .filter((item) => item.shop_id === action.payload)
          .reduce(
            (cartTotal, cartItem) => {
              const { qty, price, discount } = cartItem;
              let itemTotal = 0;
              if (discount) {
                itemTotal = (price - discount) * qty;
              } else {
                itemTotal = price * qty;
              }
              cartTotal.total += itemTotal;
              cartTotal.quantity += qty;
              return cartTotal;
            },
            {
              total: 0,
              quantity: 0,
            }
          );
        total = parseFloat(total.toFixed(2));
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      }
    },
    clearCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        setGuestCart([]);
        state.cartItems = [];
        state.cartTotalAmount = 0;
        state.cartTotalQuantity = 0;
      } else {
        const newCartItems = state.cartItems.filter(
          (item) => item.shop_id !== action.payload
        );
        state.cartItems = newCartItems;
      }
      state.generalData = {};
      state.orderedProduct = [];
      state.cartData = {};
      state.memberData = {};
    },
    clearAllCart(state, action) {
      const cookies = parseCookies();
      if (!cookies.access_token && !cookies.cart_id) {
        setGuestCart([]);
      }
      state.cartItems = [];
      state.generalData = {};
      state.orderedProduct = [];
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;
      state.cartData = {};
      state.memberData = {};
    },
    addToGeneralData(state, action) {
      state.generalData = { ...state.generalData, ...action.payload } || {};
    },
    clearGeneralData(state, action) {
      state.generalData = {};
    },
    setDeliveryTime(state, action) {
      const { payload } = action;
      state.generalData.delivery_date = payload.delivery_date;
      state.generalData.delivery_time = payload.delivery_time;
      state.generalData.shop_id = payload.shop_id;
    },
  },
});
export const {
  addToCart,
  decreaseCart,
  removeFromCart,
  getTotals,
  clearCart,
  addToGeneralData,
  setCartData,
  setMember,
  setToCart,
  clearAllCart,
  setDeliveryTime,
  clearGeneralData,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
