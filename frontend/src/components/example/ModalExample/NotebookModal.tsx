"use client";
import React, { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { NotebookItem } from "../../../../public/types";
import { formatDateToISO, getNotebookStatus } from "@/utils";
import Badge from "@/components/ui/badge/Badge";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateNotebook } from "@/store/notebooks/notebookHandler";
import Image from "next/image";
import { useImageModal } from "@/hooks/useImage";
import ImageModal from "../ImageModal";
import { setError } from "@/store/error/errorSlice";

interface Props {
  notebookData?: NotebookItem;
  closeModal: () => void;
}


export default function NotebookModal({ notebookData, closeModal }: Props) {
  const [item, setItem] = useState<NotebookItem | null>(null);
  const [images, setImages] = useState<(File | null)[]>([]);

  const { notebookId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const addProduct = () => {
    if (!item) return;
    const newProduct = { product: '', price: 0, quantity: 1 };
    const updatedItem = {
      ...item,
      products: [...item.products, newProduct],
    };

    setItem(updatedItem);
  }

  const handleInputChange = (field: keyof NotebookItem, value: string | number | Date) => {
    if (!item) return;
    setItem({ ...item, [field]: value });
  };

  const handleProductChange = (
    index: number,
    field: string,
    value: string | number | File
  ) => {
    if (!item) return;

    const updatedProducts = [...item.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };

    setItem({ ...item, products: updatedProducts });
  };

  const handleRemoveProduct = (index: number) => {
    if (!item) return;
    const updatedProducts = item.products.filter((_, i) => i !== index);
    setItem({ ...item, products: updatedProducts });
  };

  useEffect(() => {
    if (notebookData) {
      setItem(notebookData);
      setImages(notebookData.products.map(() => null)); // init with nulls
    } else {
      setItem({
        products: [{ product: '', quantity: 1, price: 0, image: '' }],
        total: 0,
        prePayment: 0,
        paid: false,
      });
      setImages([null]);
    }
  }, [notebookData]);


  // to update the total of the item based on the products
  useEffect(() => {
    if (!item) return;

    const calculatedTotal = item.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    if (calculatedTotal !== item.total) {
      setItem((prev) => prev ? { ...prev, total: calculatedTotal } : null);
    }
  }, [item]);


  const handleSave = (e) => {
     e.preventDefault() 
    if (!item) return;
    if(!item.products || item.products.length < 1) {
      dispatch(setError({
        message : 'You can`t add page without products ?'
      }));
      return ;
    }

    const formData = new FormData();

    // Append image files
    images.forEach((file, index) => {
      if (file) {
        formData.append(`image_${index}`, file);
      }
    });

    // Append the item JSON as a string
    formData.append("item", JSON.stringify(item));


    dispatch(updateNotebook(formData, notebookId, () => closeModal()));
  };


  const { label, color } = getNotebookStatus(item?.total || 0, item?.prePayment || 0);

  const { closeImageModal, openImageModal, imageModalOpen, selectedImage } = useImageModal()

  if (!item) return null;
  return (
    <form className="" onSubmit={handleSave}>
      <div className="max-h-[75vh] overflow-y-auto">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 flex items-center gap-2 ">
          <span>{notebookData ? `Credit Information of ${item.date && formatDateToISO(item.date)}` : 'Add The credit information'}</span>
          <Badge
            size="sm"
            color={color}
          >
            {label}
          </Badge>
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Pre Payment</Label>
            <Input type="number" value={item.prePayment} placeholder="The pre payment "
              onChange={(e) => handleInputChange("prePayment", +e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <Label>Rest</Label>
            <Input type="number" placeholder="Rest" value={item.total - item.prePayment} disabled />
          </div>

          <div className="col-span-1">
            <Label>Total</Label>
            <Input type="number" placeholder="total credit in this date" value={item.total}
              onChange={(e) => handleInputChange("total", +e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <Label>Paid date</Label>
            <Input type='date' placeholder="paid date" value={item.paidDate && formatDateToISO(item.paidDate)}
              onChange={(e) => handleInputChange("paidDate", e.target.value)}
            />
          </div>
        </div>

        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 mt-5">
          Products
        </h4>
        {item.products.length < 1 ? <div>
          <h4 className="mb-6 text-lg font-medium text-gray-400 dark:text-gray-500 mt-5 text-center">
            The is no product added
          </h4>
        </div> :
          item.products.map(({ product, price, quantity, image }, i) => (
            <div key={i}>
              <h4 className="ms-3 font-medium text-gray-800 dark:text-white/90 mt-6 mb-3 flex items-center justify-between">
                <span>Product {i + 1}</span>
                <TrashIcon className="size-7 cursor-pointer text-brand-500"
                  onClick={() => handleRemoveProduct(i)}
                />
              </h4>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                <div className="col-span-1">
                  <Label>Product</Label>
                  <Input type="text" value={product} placeholder="The product name"
                    onChange={(e) => handleProductChange(i, 'product', e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-2">
                    {image && <Image
                      src={image}
                      alt='img'
                      width={60}
                      height={50}
                      className="rounded-lg object-cover cursor-pointer"
                      onClick={() => openImageModal(image)}
                    />}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const updatedImages = [...images];
                          updatedImages[i] = file;
                          setImages(updatedImages);
                        }
                      }}
                    />
                  </div>

                </div>

                <div className="col-span-1">
                  <Label>Price</Label>
                  <Input type="number" placeholder="Rest" value={price}
                    onChange={(e) => handleProductChange(i, 'price', +e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label>Quantity</Label>
                  <Input type='number' min="1" placeholder="Quantity of product" value={quantity}
                    onChange={(e) => handleProductChange(i, 'quantity', +e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Label>Total</Label>
                  <Input type="number" placeholder="Total" value={price * quantity} disabled />
                </div>


              </div>

              {i !== item.products.length - 1 && <hr className="border-gray-500 my-4" />}
            </div>
          ))
        }

        <div className="my-4 flex justify-end" onClick={addProduct}>
          <PlusCircleIcon className="size-10 cursor-pointer text-brand-500" />
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>
        <Button size="sm">
          Save Changes
        </Button>
      </div>

      {selectedImage && imageModalOpen && <ImageModal onClose={closeImageModal} isOpen={imageModalOpen} imageUrl={selectedImage} />}
    </form>
  );
}
