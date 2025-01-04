import { Button } from "@mui/material";
import { Transaction } from "@/lib/types/Transaction";
import useFileUploader from "@/hooks/useFileUploader";

const PhotoUploader = ({ getTransactionFromImage }: {getTransactionFromImage: (items: Partial<Transaction> | null) => void}) => {
    const { videoRef,
        canvasRef,
        image,
        setImage,
        getPhoto,
        handleUploadPhoto
    } = useFileUploader({ getTransactionFromImage });

    return (
        <div>
            {image ? <>
                <img src={image} alt="Captured image" style={{ width: "100%"}} />
                <Button onClick={() => setImage(null)}>Retake</Button>
            </> : <>
                <video ref={videoRef} style={{ width: "100%" }} autoPlay playsInline />
                <Button onClick={getPhoto}>Take Photo</Button>
            </>}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Button onClick={handleUploadPhoto} disabled={!image}>
                Upload transaciton
            </Button>
        </div>        
    );
};

export default PhotoUploader;
