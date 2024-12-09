"use client"

import React, { useContext, useState, useRef } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Person from "./person"


export default function Index() {
    // Get global variables from context
    const { people, setPeople, noEmailPlaceholder } = useContext(GlobalContext);

    // Initialize router to navigate to other pages
    const router = useRouter();

    // Initialize errors
    const [errorName, setErrorName] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);

    // Initialize references for name and email
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    // Add new person 
    const handleAdd = () => {
        const nameInput = nameRef.current;
        const emailInput = emailRef.current;

        if (nameInput) { // Check if name input is not empty
            const name = nameInput.value.trim();
            const email = emailInput?.value.trim() || noEmailPlaceholder;

            // Validate name
            if (name === "") {
                setErrorName("Name cannot be empty.")
                return;
            }
            else if (people[name]) {
                setErrorName("Name already used.")
                return;
            }
            setErrorName(null);

            // Validate email
            if (email !== noEmailPlaceholder && !isValidEmail(email)) {
                setErrorEmail("Not a valid email address.")
                return;
            }
            setErrorEmail(null);

            // Add new person to people
            setPeople((currPeople: any) => ({
                ...currPeople,
                [name]: email,
            }));
            console.log(people);

            // Clear name and email inputs
            nameInput.value = "";
            if (emailInput) {
                emailInput.value = "";
            }
        }
    }

    // Check if email is valid
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    return (
        <>
            <div className="fixed top-[14%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mb-4 font-bold text-2xl xl:text-3xl">
                    Add people
                </h1>
                <h3 className="px-5 mb-6 font-medium text-gray-500 text-sm md:text-base mr-10 md:mr-20">
                    Enter the names of the people in your group.
                </h3>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">

                <div className="flex flex-col items-start justify-start px-10 h-full">
                    <div className="flex w-full mb-2 px-2 pt-10 items-start space-x-2">
                        <div className="flex-1">
                            <Input ref={nameRef} placeholder="Name" className="focus-visible:ring-indigo-700 bg-[#EBECF0] border-0"/>
                            {errorName && <span className="ml-1 text-red-600 text-xs font-medium">{errorName}</span>}
                        </div>
                        <div className="flex-1">
                            <Input ref={emailRef} type="email" placeholder="Email (optional)" className="flex-1 focus-visible:ring-indigo-700 bg-[#EBECF0] border-0"/>
                            {errorEmail && <span className="ml-1 text-red-600 text-xs font-medium">{errorEmail}</span>}
                        </div>
                        <Button type="submit" className="rounded-full p-2 bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600" onClick={handleAdd}>
                            <Plus/>
                        </Button>
                    </div>

                    <div className="overflow-y-scroll scrollbar w-full h-[57%] mt-8 py-2 flex flex-col space-y-5 px-5">
                        {Object.entries(people as Record<string, string>).reverse().map(([name, email]) => (
                            <Person key={name} name={name} email={email} />
                        ))}
                    </div>
                    <div className="pt-9 px-2 flex w-full">
                        <Button variant="outline" className="flex-1 mr-2 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/edit-bill")}>
                            Previous
                        </Button>
                        <Button variant="default" className="flex-1 ml-2 bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600" onClick={() => router.push("/assign-people")}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
