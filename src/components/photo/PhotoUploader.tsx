import { Box, Button } from "@mui/material";
import { Transaction } from "@/lib/types/Transaction";
import useFileUploader from "@/hooks/useFileUploader";
import PhotoViewer from "./PhotoViewer";
import { Photo } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const PhotoUploader = ({ getTransactionFromImage }: {getTransactionFromImage: (items: Partial<Transaction> | null) => void}) => {
    const {
        videoRef,
        canvasRef,
        image,
        setImage,
        getPhoto,
        handleUploadPhoto,
        loading,
    } = useFileUploader({ getTransactionFromImage });

    return (
        <>
            <Box>
                <PhotoViewer getPhoto={getPhoto} image={image} setImage={setImage} videoRef={videoRef} />                
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Button startIcon={<Photo />} onClick={handleUploadPhoto} disabled={!image}>
                    Upload transaciton
                </Button>                
            </Box>
            {loading && <CircularProgress />}
        </>
    );
};

export default PhotoUploader;
