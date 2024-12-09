"use client"

import React, { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Person({ name, email }: { name: string, email:string}) {
    // Get global variables from context
    const { setPeople } = useContext(GlobalContext);

    // Delete person
    const handleDelete = () => {
        setPeople((currPeople: any) => {
            const updatedPeople = { ...currPeople };
            delete updatedPeople[name]; 
            return updatedPeople; 
        });
    };
    
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex flex-col max-w-[75%]">
                    <span className="font-semibold text-gray-800 text-lg break-words">{name}</span>
                    <span className="font-normal text-sm text-gray-500 break-words">{email}</span>
                </div>
                <Button variant="destructive" size="icon" className="rounded-full ml-10 w-6 h-6" onClick={handleDelete}>
                    <X className="w-4 h-4" strokeWidth={2.5}/>
                </Button>
            </div>
            <hr className="mx-2"/>
        </>
    )
}