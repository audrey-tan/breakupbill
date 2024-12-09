"use client"

import React, { useContext, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Item({ itemId, name, price}: { itemId: number, name: string, price: number }) {
    // Get global variables from context
    const { items, setItems, subtotal, setSubtotal } = useContext(GlobalContext);

    // Initialize references for name and price
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    // Update name of item after the user finishes typing
    const handleNameBlur = () => {
        const input = nameRef.current;
        if (input) {
            const newName = input.value.trim();
            if (newName) { // If input is not empty, update name
                setItems((currItems: any) => ({
                    ...currItems,
                    [itemId]: {
                        ...currItems[itemId],
                        name: newName
                    },
                }));
            }
            else { // Otherwise, revert input text back to current name
                input.value = items[itemId].name;
            }
        }
    }

    // Update price of item after the user finishes typing
    const handlePriceBlur = () => {
        const input = priceRef.current;
        if (input) { // If input is not empty, 
            const newPrice = (parseFloat(input.value) || 0).toFixed(2);
            if (+newPrice >= 0) {
                // Get new subtotal
                const newSubtotal = subtotal - items[itemId].price + (+newPrice);

                // Update price
                setItems((currItems: any) => ({
                    ...currItems,
                    [itemId]: {
                        ...currItems[itemId],
                        price: +newPrice
                    },
                }));
                input.value = newPrice;

                // Update subtotal
                setSubtotal(newSubtotal);
            }
            else { // Otherwise, revert input text back to current price
                input.value = items[itemId].price;
            }
        }
    };

    // Delete item
    const handleDelete = () => {
        // Update subtotal
        setSubtotal(+(subtotal - items[itemId].price).toFixed(2));

        // Delete item from items
        setItems((currItems: any) => {
            const updatedItems = { ...currItems };
            delete updatedItems[itemId];
            return updatedItems;
        });
    }

    return (
        <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 text-md xl:text-lg w-[55%] break-words">
                <input
                    ref={nameRef}
                    defaultValue={name}
                    className="py-1.5 px-4 bg-[#EBECF0] rounded w-full"
                    onBlur={handleNameBlur}
                />
            </span>
            <div className="flex items-center justify-end w-[45%]">
                <span className="text-gray-600 text-md xl:text-lg w-[80%] text-right break-words">
                    $
                    <input
                        ref={priceRef}
                        type="number"
                        defaultValue={price.toFixed(2)}
                        className="ml-1 py-1.5 px-2 xl:pr-0 bg-[#EBECF0] rounded w-[65%] text-right"
                        step="0.01"
                        min="0"
                        onBlur={handlePriceBlur}
                    />
                </span>
                <Button variant="destructive" size="icon" className="rounded-full ml-2 mr-1.5 w-6 h-6" onClick={handleDelete}>
                    <X className="w-4 h-4" strokeWidth={2.5}/>
                </Button>
            </div>
        </div>
    )
}