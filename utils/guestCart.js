import { parseCookies } from 'nookies';

const GUEST_CART_KEY = 'mvec_guest_cart';

/**
 * Get the current guest cart from localStorage
 * @returns {Array} Array of cart items
 */
export const getGuestCart = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
};

/**
 * Save the guest cart to localStorage
 * @param {Array} cart Array of cart items to save
 */
export const setGuestCart = (cart) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

/**
 * Add an item to the guest cart
 * @param {Object} item Product item to add
 * @returns {Array} Updated cart items
 */
export const addToGuestCart = (item) => {
  const cart = getGuestCart();
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].qty += 1;
  } else {
    cart.push({ ...item, qty: item.min_qty || 1 });
  }

  setGuestCart(cart);
  return cart;
};

/**
 * Remove an item from the guest cart
 * @param {number} itemId ID of the item to remove
 * @returns {Array} Updated cart items
 */
export const removeFromGuestCart = (itemId) => {
  const cart = getGuestCart();
  const updatedCart = cart.filter((item) => item.id !== itemId);
  setGuestCart(updatedCart);
  return updatedCart;
};

/**
 * Update the quantity of an item in the guest cart
 * @param {number} itemId ID of the item to update
 * @param {number} qty New quantity
 * @returns {Array} Updated cart items
 */
export const updateGuestCartItemQty = (itemId, qty) => {
  const cart = getGuestCart();
  const itemIndex = cart.findIndex((item) => item.id === itemId);

  if (itemIndex >= 0) {
    cart[itemIndex].qty = qty;
    setGuestCart(cart);
  }

  return cart;
};

/**
 * Calculate total price of guest cart
 * @returns {number} Total price
 */
export const calculateGuestCartTotal = () => {
  const cart = getGuestCart();
  return cart.reduce((total, item) => {
    const itemPrice = item.discount ? (item.price - item.discount) : item.price;
    return total + (itemPrice * item.qty);
  }, 0);
};

/**
 * Clear the guest cart
 */
export const clearGuestCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isUserLoggedIn = () => {
  const cookies = parseCookies();
  return !!cookies.access_token;
};
