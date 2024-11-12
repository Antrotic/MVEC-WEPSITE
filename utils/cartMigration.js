import { getGuestCart, clearGuestCart } from './guestCart';
import { CartApi } from '../api/main/cart';
import { store } from '../redux/store';
import { setCartData, getTotals } from '../redux/slices/cart';

export const migrateGuestCart = async () => {
  try {
    const guestCart = getGuestCart();

    if (!guestCart || guestCart.length === 0) {
      return;
    }

    // Convert guest cart items to the format expected by the API
    const cartItems = guestCart.map(item => ({
      shop_product_id: item.id,
      quantity: item.qty
    }));

    // Add items to the user's cart through the API
    for (const item of cartItems) {
      await CartApi.add(item);
    }

    // Clear the guest cart from localStorage
    clearGuestCart();

    // Fetch updated cart data and update Redux store
    const cartResponse = await CartApi.get();
    store.dispatch(setCartData(cartResponse.data));
    store.dispatch(getTotals());

  } catch (error) {
    console.error('Error migrating guest cart:', error);
    // Don't clear guest cart if migration fails
  }
};
