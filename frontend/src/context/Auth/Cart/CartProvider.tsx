import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import { CartContext } from './CartContext';
import { CartItem } from '../../../types/CartItem';
import { useAuth } from '../AuthContext';
import { BASE_URL } from '../../../constants/baseUrl';

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } =useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState('');

  useEffect(() => {
      if (!token) {
        return;
      }
  
      const fetchCart = async () => {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          setError("Failed to fetch user cart. please try again");
        }
        
        const cart = await response.json();

        const cartItemsMapped = cart.items.map(
          ({ product, quantity, unitPrice }: { product: any; quantity: number; unitPrice: number }) => ({
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity,
            unitPrice,
          })
        );

        setCartItems([...cartItemsMapped]);
        setTotalAmount(cart.totalAmount)
      };
  
      fetchCart();
    }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      const response = await fetch(`$(BASE_URL)/cart/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authhorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        setError('Failed to add to cart');
      }

      const cart = await response.json();

      if (!cart) {
        setError('Failed to parse cart data');
      }

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItemInCart = async (productId: string) => {
    try {
      const response = await fetch(`$(BASE_URL)/cart/item/${productId}`, {
        method: 'DELETE',
        headers: {
          Authhorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError('Failed to delete to cart');
      }

      const cart = await response.json();

      if (!cart) {
        setError('Failed to parse cart data');
      }

      const cartItemsMapped = cart.items.map (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: Number;
        }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`$(BASE_URL)/cart`, {
        method: 'DELETE',
        headers: {
          Authhorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError('Failed to empty to cart');
      }

      const cart = await response.json();

      if (!cart) {
        setError('Failed to parse cart data');
      }

      setCartItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        addItemToCart,
        updateItemInCart,
        removeItemInCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
