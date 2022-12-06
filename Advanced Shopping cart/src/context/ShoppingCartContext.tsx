import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart',[]);
  const [isOpen, setIsOpen] = useState(false)

  const getItemQuantity = (id: number) => {
    //check if item present in cart if present return its quantity or else return 0
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      //check if item is present in cart or not
      if (currItems.find((item) => item.id === id) == null) {
        //if item not present in cart then set quantity of that item to 1 in cart
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          //if item present in cart
          if (item.id === id) {
            //increase quantity by 1
            return { ...item, quantity: item.quantity + 1 };
          } else {
            //else return item as is
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      //check if item is present in cart or not and if present check the quantity if 1
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        //if item is present in cart and it's quantity is 1 the remove it from cart after pressing -
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          //if item present in cart
          if (item.id === id) {
            //increase quantity by 1
            return { ...item, quantity: item.quantity - 1 };
          } else {
            //else return item as is
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number) => {
    //remove the item from cart
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  };

  const openCart = () => setIsOpen(true)

  const closeCart = () => setIsOpen(false)


  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen}/>
    </ShoppingCartContext.Provider>
  );
};
