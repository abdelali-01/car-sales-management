import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  prevPrice?: number;
  images: string[];
  quantity: number;
  cartQuantity: number;
  attributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: typeof window !== 'undefined' && localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart')!)
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        item => item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
      );
      if (existing) {
        existing.cartQuantity += action.payload.cartQuantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<{ id: number; attributes?: Record<string, string> }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes))
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; cartQuantity: number; attributes?: Record<string, string> }>) => {
      const item = state.items.find(
        item => item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
      );
      if (item) {
        item.cartQuantity = action.payload.cartQuantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 