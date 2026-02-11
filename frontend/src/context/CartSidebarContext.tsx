'use client'
import React, { createContext, useContext, useState } from 'react';

interface CartSidebarContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(undefined);

export const useCartSidebar = () => {
  const context = useContext(CartSidebarContext);
  if (!context) throw new Error('useCartSidebar must be used within a CartSidebarProvider');
  return context;
};

export const CartSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  return (
    <CartSidebarContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartSidebarContext.Provider>
  );
}; 