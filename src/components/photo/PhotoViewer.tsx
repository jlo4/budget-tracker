import Button from "@mui/material/Button";
import React from "react";

interface PhotoViewerProps {
    getPhoto: () => void;
    image: string | null;
    setImage: (image: string | null) => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ getPhoto, image, setImage, videoRef }) => {
    return (
        <>
            {image ? (
                <>
                    <img src={image} alt="Captured image" style={{ minHeight: "20vh", width: "100%"}} />
                    <Button onClick={() => setImage(null)}>Retake</Button>
                </>
            ) : (
                <>
                    <video ref={videoRef} style={{ minHeight: "20vh", width: "100%" }} autoPlay playsInline />
                    <Button onClick={getPhoto}>Take photo</Button>
                </>
            )}
        </>
    );
};

export default PhotoViewer;
