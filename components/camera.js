import React, { useRef, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "@/context/GlobalContext.js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { parseReceipt } from '@/app/actions';
import Loading from "./loading";

export default function CameraComponent() {
    const { setItems, setTotal } = useContext(GlobalContext);
    const router = useRouter();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(null); // New state for the captured image

    const startCamera = async () => {
        setLoading("Loading camera...");

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: { ideal: "environment" }, // Back camera if available
                    width: { ideal: 640 }, 
                    height: { ideal: 640 } 
                }
            })
            .then((stream) => {
                if (videoRef.current) { // If the video element reference is available
                    videoRef.current.srcObject = stream;  // assign the camera stream to the video element's srcObject
                    videoRef.current.onloadedmetadata = () => {
                        // Play video only after the metadata is loaded             
                        videoRef.current.play().catch(error => {
                            console.error("Error playing video:", error);
                        });
                    };
                }
            })
            .catch((error) => {
                setHasCameraPermission(false);
            });
        } else {
            alert("Camera not available in browser.");
            router.push("/edit-bill");
        }

        setLoading(false);
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const takePicture = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) { // Check if video and canvas elements exist
            // Get 2D drawing context of the canvas
            const context = canvas.getContext("2d");

            // Set the canvas dimensions to video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw current frame from video to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Save the canvas content as a data URL
            const imgUrl = canvas.toDataURL("image/png");

            stopCamera();

            setLoading("Extracting receipt information. Hang tight.");

            try {
                // Parse receipt and wait for the results
                console.log(imgUrl);
                const data = await parseReceipt(imgUrl);
                console.log("data ", data);

                if (data === 429) {
                    alert("Sorry, we reached our monthly quota for receipt parsing :(");
                }
                else if (data) { // If data is returned from parseReceipt
                    setItems(data[0]); // Set items
                    setTotal(data[1]); // Set total
                }
            } catch (error) {
                console.error("Error processing receipt:", error);
            } finally {
                // Navigate to "/edit-bill"
                router.push("/edit-bill");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);


    // if (!hasCameraPermission) {
    //     return (
    //         <div className="flex flex-col w-full">
    //             <div className="font-medium text-violet-700">
    //                 Please allow camera permissions.
    //             </div>
    //             <div className="w-full mt-4">
    //                 <Button variant="outline" className="flex-1 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/")}>
    //                     Back to home
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // }

    // if (!loading) {
    //     return (
    //         <div className="flex flex-col w-full items-center">
    //             <Loading/>
    //             <div className="font-semibold text-xl text-violet-700">
    //                 {loading}
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
            {loading && (
                <div className="flex flex-col w-full items-center">
                    <Loading />
                    <div className="font-semibold text-xl text-violet-700">
                        {loading}
                    </div>
                </div>
            )}
            {!hasCameraPermission && (
                <div className="flex flex-col w-full">
                    <div className="font-medium text-violet-700">
                        Please allow camera permissions.
                    </div>
                    <div className="w-full mt-4">
                        <Button variant="outline" className="flex-1 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/")}>
                            Back to home
                        </Button>
                    </div>
                </div>
            )}
            {!loading && hasCameraPermission && (
                <div className="flex flex-col items-center w-full gap-4">
                    <video ref={videoRef} style={{ width: "100%", objectFit: "cover" }} />

                    <canvas ref={canvasRef} style={{ display: "none" }} />
        
                    <div className="flex flex-col items-center w-full ">
                        <Button size="icon" className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-700 w-12 h-12 transition duration-200 hover:from-violet-500 hover:to-indigo-600" onClick={takePicture}>
                            <Camera className="w-8 h-8" />
                        </Button>
                        <div className="w-full mt-4 md:mt-0">
                            <Button variant="outline" className="flex-1 text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/")}>
                                Back to home
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
