import { Box, Typography } from "@mui/material";
import React from "react";

interface ShowcaseUploaderProps {
    showcaseImages: File[];
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ShowcaseUploader({ showcaseImages, handleImageUpload }: ShowcaseUploaderProps) {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Upload Showcase Images</Typography>
            <input type="file" accept="image/png, image/jpeg" multiple onChange={handleImageUpload} />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {showcaseImages.map((img, index) => (
                    <img key={index} src={URL.createObjectURL(img)} alt={`Showcase ${index}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
                ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
                {showcaseImages.length}/5 images uploaded
            </Typography>
        </Box>
    );
}

export default ShowcaseUploader;