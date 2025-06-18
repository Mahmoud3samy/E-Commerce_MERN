import { createContext, useContext } from 'react';
import type { cartItems } from '../../../types/CartItem';

interface CartContextType {
  cartItems: cartItems[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {}
});

export const useCart = () => useContext(CartContext);
