import { createContext, useContext } from 'react';
import type { CartItems } from '../../../types/CartItem';

interface CartContextType {
  cartItems: CartItems[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
  updateItemInCart: (productId: string, quantity: number) => void
  removeItemInCart: (productId: string) => void
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  removeItemInCart: () => {}
});

export const useCart = () => useContext(CartContext);
