import { useState } from 'react';

export function useImageModal() {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | File | null>(null);

  const openImageModal = (image: string | File) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  return {
    imageModalOpen,
    selectedImage,
    openImageModal,
    closeImageModal
  };
}
