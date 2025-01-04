"use client";

import { uploadImage } from "@/backend/imageProcessor/utils";
import { Transaction } from "@/lib/types/Transaction";
import { useEffect, useRef, useState } from "react";

const useFileUploader = ({ getTransactionFromImage }: { getTransactionFromImage: (items: Partial<Transaction> | null) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        // start camera on mount
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch (error) {
                console.error(error);
            }
        };
        startCamera();
    }, []);

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      };

    const getPhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0);
            const data = canvasRef.current.toDataURL("image/jpeg");
            setImage(data);
            stopCamera();
        }
    };

    const processPhoto = async () => {
        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            return formData;
        }
    };

    const handleUploadPhoto = async () => {
        let formData: FormData | undefined | null = null;
        if (image) {
            formData = await processPhoto();
        }
        if (formData) {
            const items: Partial<Transaction> | null = await uploadImage(formData);
            getTransactionFromImage(items);
        }
    }

    return {
        videoRef,
        canvasRef,
        image,
        setImage,
        getPhoto,
        handleUploadPhoto
    }
};

export default useFileUploader;