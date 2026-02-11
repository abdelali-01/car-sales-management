import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { setError } from '@/store/error/errorSlice';
import { AppDispatch } from '@/store/store';
import { updateTableStock } from '@/store/trodat-register/trodatRegisterHandler';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function TamponStockModal({
    tableStock,
    id,
    closeModal
}: {
    tableStock: { _id?: string; model: string; price: number; quantity: number }[];
    closeModal: () => void;
    id: string
}) {
    const [table, setTable] = useState(tableStock);
    const dispatch = useDispatch<AppDispatch>();

    // Add new item to table
    const addItem = () => {
        setTable([...table, { model: '', price: 0, quantity: 1 }]);
    };

    // Handle change in individual fields
    const handleItemChange = (
        index: number,
        field: 'model' | 'price' | 'quantity',
        value: string | number
    ) => {
        const updated = [...table];
        const updatedItem = { ...updated[index], [field]: field === 'price' || field === 'quantity' ? +value : value };
        updated[index] = updatedItem;
        setTable(updated);
    };

    // Remove item by index
    const handleRemoveItem = (index: number) => {
        const updated = table.filter((_, i) => i !== index);
        setTable(updated);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Check for duplicate models
        const models = table.map(item => item.model.trim().toLowerCase());
        const hasDuplicates = new Set(models).size !== models.length;

        if (hasDuplicates) {
            dispatch(setError({
                message : 'dupplicated model',
                desc : 'You have dupplicated model , please remove one or merge them !'
            }));
            return;
        }

        dispatch(updateTableStock(table, id));
        closeModal();
    };

    return (
        <form className="" onSubmit={handleSave}>
            <div className="max-h-[75vh] overflow-y-auto">
                <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                    Stock Table Information
                </h4>

                {table.length < 1 ? (
                    <h4 className="mb-6 text-lg font-medium text-gray-400 dark:text-gray-500 mt-5 text-center">
                        There is no item added
                    </h4>
                ) : (
                    table.map(({ model, price, quantity }, i) => (
                        <div key={i} className="flex items-end gap-2 mb-6">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3 flex-1">
                                <div className="col-span-1">
                                    <Label>Model</Label>
                                    <Input
                                        type="text"
                                        value={model}
                                        placeholder="The model name"
                                        onChange={(e) => handleItemChange(i, 'model', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        placeholder="Quantity of the model"
                                        onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => handleItemChange(i, 'price', e.target.value)}
                                        required
                                        min='100'
                                    />
                                </div>
                            </div>
                            <TrashIcon
                                className="size-8 cursor-pointer text-red-500 mb-2"
                                onClick={() => handleRemoveItem(i)}
                            />
                        </div>
                    ))
                )}

                <div className="my-4 flex justify-end" onClick={addItem}>
                    <PlusCircleIcon className="size-10 cursor-pointer text-brand-500" />
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={closeModal}>
                    Close
                </Button>
                <Button size="sm" >
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
