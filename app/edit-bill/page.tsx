"use client"

import React, { useContext, useState, useEffect, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";
import { useRouter } from "next/navigation";

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Item from "./item"


export default function Index() {
    // Get global variables from context
    const { items, setItems, total, setTotal, subtotal } = useContext(GlobalContext);

    // Initialize router to navigate to other pages
    const router = useRouter();

    const [start, setStart] = useState(false);

    // Initialize tip and taxAndFees and their references
    const [tip, setTip] = useState(parseFloat(localStorage.getItem("tip") || "0.00"));
    const [taxAndFees, setTaxAndFees] = useState(total - subtotal - tip);

    const tafRef = useRef<HTMLInputElement>(null);
    const tipRef = useRef<HTMLInputElement>(null);

    // Update taxAndFees after the user finishes typing
    const handleTafBlur = () => {
        const input = tafRef.current;
        if (input) {
            const newValue = (parseFloat(input.value) || 0).toFixed(2);
            if (+newValue >= 0) { // If value is greater than or equal to 0, update taxAndFees
                setTaxAndFees(+newValue);
                input.value = newValue;
            }
            else { // Otherwise, revert input text back to current value
                input.value = taxAndFees.toFixed(2);
            }
        }
    };

    // Update tip after the user finishes typing
    const handleTipBlur = () => {
        const input = tipRef.current;
        if (input) {
            const newValue = (parseFloat(input.value) || 0).toFixed(2);
            if (+newValue >= 0) { // If value is greater than or equal to 0, update tip
                setTip(+newValue);
                input.value = newValue;
            }
            else { // Otherwise, revert input text back to current tip
                input.value = tip.toFixed(2);
            }
        }
    };

    // Add new item
    const handleAdd = () => {
        let lastId = 0;
        const itemIds = Object.keys(items).map(Number);

        // If the number of items is not 0, get the item id of the last item
        if (itemIds.length !== 0) {
            lastId = Math.max(...itemIds);
        }

        // Add new item with the last id + 1
        setItems((currItems: any) => ({
            ...currItems,
            [lastId + 1]: {name: "New item", price: 0.00}
        }));
    };

    // Get taxAndFees and tip from localStorage or set it to default value if they don't exist when the page renders at the beginning
    useEffect(() => {
        setTip(parseFloat(localStorage.getItem("tip") || "0.00"));
        setTaxAndFees(parseFloat(localStorage.getItem("taf") || (total - subtotal - tip).toFixed(2)));
    }, []);

    // Update total when subtotal, taxAndFees, or tip changes
    useEffect(() => {
        setTotal(subtotal + taxAndFees + tip);
    }, [subtotal, taxAndFees, tip]);

    // Store new taxAndFees in localStorage when the value changes
    useEffect(() => {
        localStorage.setItem("taf", taxAndFees.toString());
      }, [taxAndFees]);

    // Store new tip in localStorage when the value changes
    useEffect(() => {
        localStorage.setItem("tip", tip.toString());
    }, [tip]);

    return (
        <>
            <div className="fixed top-[12%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mb-4 font-bold text-2xl xl:text-3xl">
                    Edit bill
                </h1>
                <h3 className="px-5 mb-6 font-medium text-gray-500 text-sm md:text-base mr-10 md:mr-20">
                    You can add, edit, or delete items and update other details as needed.
                </h3>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">
            
                <Button size="icon" className="absolute -top-5 right-1 mr-6 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-700 w-12 h-12 md:w-16 md:h-16 transition duration-200 hover:from-violet-500 hover:to-indigo-600" onClick={handleAdd}>
                    <Plus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4}/>
                </Button>

                <div className="flex flex-col items-start justify-start px-10 h-full">
                    <h2 className="mt-8 ml-2 font-bold text-xl md:text-2xl">{Object.keys(items).length} {Object.keys(items).length == 1 ? "item" : "items"}</h2>

                    <div className="overflow-y-scroll scrollbar w-full h-[26%] mt-4 mb-7 py-2 flex flex-col space-y-5 px-3">
                        {Object.keys(items).map((id) => (
                            <Item key={id} itemId={+id} name={items[id].name} price={items[id].price}/>
                        ))}
                    </div>

                    <div className="w-full max-h-[40%] max-w-lg bg-white shadow-lg rounded-3xl p-2">
                        <div className="p-4 pb-0 flex items-center justify-between">
                            <span className="font-semibold text-gray-400 text-sm md:text-base max-w-[60%] break-words">Subtotal</span>
                            <span className="font-semibold text-gray-600 text-sm md:text-base max-w-[35%] text-right break-words">${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="p-4 pb-0 flex items-center justify-between">
                            <span className="font-medium text-gray-400 text-sm md:text-base max-w-[60%] break-words">Tax + additional fees</span>
                            <span className="font-medium text-gray-600 text-sm md:text-base max-w-[35%] text-right break-words">
                                $
                                <input
                                    ref={tafRef}
                                    type="number"
                                    defaultValue={taxAndFees.toFixed(2)}
                                    className="ml-1 pl-1 font-medium text-gray-600 text-sm md:text-base max-w-[80%] text-right bg-gray-100 rounded px-2 xl:px-1"
                                    step="0.01"
                                    min="0"
                                    onBlur={handleTafBlur}
                                />
                            </span>
                        </div>

                        <div className="p-4 pb-0 flex items-center justify-between">
                            <span className="font-medium text-gray-400 text-sm md:text-base max-w-[60%] break-words">Tip</span>
                            <span className="font-medium text-gray-600 text-sm md:text-base max-w-[35%] text-right break-words">
                                $
                                <input
                                    ref={tipRef}
                                    type="number"
                                    defaultValue={tip.toFixed(2)}
                                    className="ml-1 pl-1 font-medium text-gray-600 text-sm md:text-base max-w-[80%] text-right bg-gray-100 rounded px-2 xl:px-1"
                                    step="0.01"
                                    min="0"
                                    onBlur={handleTipBlur}
                                />
                            </span>
                        </div>

                        <hr className="my-5 mx-4"/>

                        <div className="px-4 pb-4 flex items-center justify-between">
                            <span className="font-bold text-gray-800 text-lg md:text-xl max-w-[45%] break-words">TOTAL</span>
                            <span className="font-bold text-violet-700 text-2xl md:text-3xl max-w-[45%] text-right break-words">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="pt-9 px-2 flex w-full">
                        <Button variant="outline" className="flex-1 mr-2 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/receipt")}>
                            Previous
                        </Button>
                        <Button variant="default" className="flex-1 ml-2 bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600" onClick={() => router.push("/add-people")}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
