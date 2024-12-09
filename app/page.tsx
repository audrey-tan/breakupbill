"use client"

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import Image from "next/image";



export default function Index() {
    // Initialize router to navigate to other pages
    const router = useRouter();
    
    return (
        <>
            <div className="fixed top-[12%] md:top-[14%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mb-4 font-bold text-2xl xl:text-3xl">
                    Welcome to BreakUp
                </h1>
                <h3 className="px-5 mb-6 font-medium text-gray-500 text-sm md:text-base mr-10 md:mr-20">
                    Break up your bills, not your friendships
                </h3>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">

            <div className="flex px-10 w-full h-screen">
                <div className="flex flex-col justify-start w-full items-center">
                    <div className="relative mt-12 w-full h-1/2">
                        <Image 
                            src="/images/receipt_home.png"
                            alt="receipt_monster" 
                            fill 
                            style={{ objectFit: "contain" }} 
                        />
                        </div>
                        <div className="w-full mt-12">
                            <Button 
                                className="bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600 w-full" 
                                onClick={() => router.push("/receipt")}
                            >
                                Start
                            </Button>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    );
}
