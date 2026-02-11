"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false, initilizeError?: () => void) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const openModal = useCallback((item? : any) => {
    if (item) setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
    if (initilizeError) initilizeError();
  }, [initialState, initilizeError]);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, openModal, closeModal, selectedItem, toggleModal };
};
