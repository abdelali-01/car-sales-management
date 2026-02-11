'use client';

import Image from 'next/image';
import { Modal } from '../ui/modal';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | File | null;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  if (!imageUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5">
      <div className="flex justify-center items-center">
        <Image
          src={imageUrl}
          alt="Full Product"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
    </Modal>
  );
}
