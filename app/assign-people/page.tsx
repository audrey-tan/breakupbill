"use client"

import React, { useContext, useState, useEffect, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";
import { useRouter } from "next/navigation";

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"



export default function Index() {
     // Get global variables from context
    const { items, setItems, people } = useContext(GlobalContext);

    // Initialize router to navigate to other pages
    const router = useRouter();

    // Initialize selectedPerson
    const [selectedPerson, setSelectedPerson] = useState<any>();

    // Set selectedPerson after people is obtained
    useEffect(() => {
        setSelectedPerson(Object.keys(people).pop() || undefined);
    }, [people]);

    // Add number of item selectedPerson ordered
    const handlePlus = (itemId: string) => {
        setItems((currItems: any) => ({
            ...currItems,
            [itemId]: {
                ...currItems[itemId],
                people: {
                    ...currItems[itemId]?.people,
                    [selectedPerson]: (currItems[itemId]?.people?.[selectedPerson] || 0) + 1 // Add number of item selectedPerson ordered by 1
                },
                itemCount: (currItems[itemId]?.itemCount || 0) + 1 // Add total number ordered for that item by 1
            }
        }));
    };

    // Subtract number of item selectedPerson ordered
    const handleMinus = (itemId: string) => {
        setItems((currItems: any) => ({
            ...currItems,
            [itemId]: {
                ...currItems[itemId],
                itemCount: (currItems[itemId]?.people?.[selectedPerson] || 0) > 0 // If number of item ordered by selectedPerson is greater than 0,
                    ? (currItems[itemId]?.itemCount || 0) - 1 // subtract number of item selectedPerson ordered by 1
                    : (currItems[itemId]?.itemCount || 0),
                people: {
                    ...currItems[itemId]?.people,
                    [selectedPerson]: (currItems[itemId]?.people?.[selectedPerson] || 0) > 0 // If total number ordered for that item is greater than 0,
                        ? (currItems[itemId]?.people?.[selectedPerson] || 0) - 1 // subtract total number ordered for that item by 1
                        : 0 
                }
            }
        }));
    };
    

    return (
        <>
            <div className="fixed top-[12%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mb-4 font-bold text-2xl xl:text-3xl">
                    Assign people
                </h1>
                <h3 className="px-5 mb-6 font-medium text-gray-500 text-sm md:text-base mr-10 md:mr-20">
                    Select each person and specify how many items they ordered.
                </h3>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">

                <div className="flex flex-col items-start justify-start px-10 h-full">
                    <div className="horizontal-scroll flex overflow-x-auto w-full space-x-4 pt-9 py-2">
                        {Object.keys(people).reverse().map((person: string) => (
                            <Button key={person} 
                                    className={
                                        person === selectedPerson ?
                                        "bg-indigo-700 border-indigo-500 font-semibold rounded-full hover:bg-indigo-700":
                                        "bg-indigo-100 text-indigo-400 font-semibold rounded-full hover:bg-indigo-200 hover:text-indigo-500"
                                    }
                                    onClick={() => setSelectedPerson(person)}
                            >
                                {person}
                            </Button>
                        ))}
                    </div>

                    <div className="overflow-y-scroll scrollbar w-full h-[62%] mt-6 flex flex-col space-y-6 pb-6 px-3">
                        {Object.keys(items).map((id) => (
                            <div key={id} 
                                 className={
                                    !items[id]?.people?.[selectedPerson]
                                        ? "w-full max-w-lg bg-white shadow-lg rounded-2xl p-5"
                                        : "w-full max-w-lg bg-gradient-to-r from-[#E6E2FE] via-violet-50 to-white shadow-lg rounded-2xl p-5"
                                 }
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-800 text-base md:text-lg max-w-[58%] break-words">
                                        {items[id].name}
                                    </span>
                                    <span className="font-semibold text-gray-800 text-base md:text-lg max-w-[27%] text-right break-words">
                                        ${items[id].price.toFixed(2)}
                                    </span>
                                </div>
                                <hr className={
                                        !items[id]?.people?.[selectedPerson]
                                            ? "my-3 border-gray-300"
                                            : "my-3 h-0.5 bg-gradient-to-r from-violet-300 to-violet-100 border-none"
                                    }/>
                                <div className="flex items-center justify-between">
                                    <div className="mt-2 max-w-[55%] md:max-w-[65%] flex flex-wrap gap-2">
                                        {Object.keys(items[id].people || {}).map((person) => {
                                            const count = items[id].people[person];
                                            if (count > 0) {
                                                return (
                                                    <span
                                                        key={person}
                                                        className="p-1.5 px-2.5 rounded-sm bg-violet-800 text-xs md:text-sm text-white">
                                                        {person} x{count}
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div className="flex items-center justify-center max-w-[45%] md:max-w-[28%] space-x-4">
                                        <Button variant="outline" 
                                            size="icon" 
                                            className={
                                                !items[id]?.people?.[selectedPerson]
                                                    ? "rounded-full w-6 h-6 border-gray-400"
                                                    : "rounded-full w-6 h-6 border-violet-300 bg-transparent hover:bg-violet-50"
                                            }
                                            onClick={() => handleMinus(id)}
                                        >
                                            <Minus className="w-4 h-4 text-gray-600" strokeWidth={2.5}/>
                                        </Button>
                                        <span className="font-bold text-3xl md:text-4xl">
                                            {items[id]?.people?.[selectedPerson] || 0}
                                        </span>
                                        <Button variant="outline" 
                                            size="icon" 
                                            className={
                                                !items[id]?.people?.[selectedPerson]
                                                    ? "rounded-full w-6 h-6 border-gray-400"
                                                    : "rounded-full w-6 h-6 border-violet-300 bg-transparent hover:bg-violet-50"
                                            }
                                            onClick={() => handlePlus(id)}
                                        >
                                            <Plus className="w-4 h-4 text-gray-600" strokeWidth={2.5}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-9 px-2 flex w-full">
                        <Button variant="outline" className="flex-1 mr-2 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/add-people")}>
                            Previous
                        </Button>
                        <Button variant="default" className="flex-1 ml-2 bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600" onClick={() => router.push("/results")}>
                            Calculate
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
