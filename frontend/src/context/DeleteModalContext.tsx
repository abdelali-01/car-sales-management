import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import { createContext, useContext, useState, ReactNode } from "react";

type DeleteModalContextType = {
  isOpen: boolean;
  itemId: string | null ;
  openModal: (id: string| number | undefined, onConfirm: (id: string | number) => void) => void;
  closeModal: () => void;
};

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error("useDeleteModal must be used within a DeleteModalProvider");
  }
  return context;
};

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState<string | number | null>(null);
  const [onConfirm, setOnConfirm] = useState<((id: string | number) => void) | null>(null);

  const openModal = (id: string | number | undefined, confirmFn: (id: string) => void) => {
    if(!id) return ;

    setItemId(id);
    setOnConfirm(() => confirmFn);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setItemId(null);
    setOnConfirm(null);
  };

  const value = {
    isOpen,
    itemId: itemId!,
    openModal,
    closeModal,
  };

  return (
    <DeleteModalContext.Provider value={value}>
      {children}
      {isOpen && itemId && onConfirm && (
        <DeleteModal
          isOpen={isOpen}
          itemId={itemId}
          onClose={closeModal}
          onClick={() => {
            onConfirm(itemId);
            closeModal();
          }}
        />
      )}
    </DeleteModalContext.Provider>
  );
}
