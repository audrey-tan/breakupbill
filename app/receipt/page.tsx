"use client"

import React from "react";

import CameraComponent from '../../components/camera.js';


export default function Index() {
    return (
        <>
            <div className="fixed top-[14%] md:top-[16%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mb-4 font-bold text-2xl xl:text-3xl">
                    Take a picture of your receipt
                </h1>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">

                <div className="flex px-10 pt-8 w-full h-screen">
                    <CameraComponent/>
                </div>
            </div>
        </>
    );
}
