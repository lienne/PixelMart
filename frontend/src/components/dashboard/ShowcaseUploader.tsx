import { Box, IconButton, Typography } from "@mui/material";
import React, { RefObject } from "react";
import { Close } from "@mui/icons-material";

interface ShowcaseUploaderProps {
    showcaseImages: File[];
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    fileInputRef: RefObject<HTMLInputElement>;
}

function ShowcaseUploader({ showcaseImages, handleImageUpload, handleRemoveImage, fileInputRef }: ShowcaseUploaderProps) {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Upload Showcase Images</Typography>
            <input type="file" accept="image/png, image/jpeg" multiple onChange={handleImageUpload} ref={fileInputRef} />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {showcaseImages.map((img, index) => (
                    <Box key={index} sx={{ position: "relative", width: 100, height: 100 }}>
                        <img key={index} src={URL.createObjectURL(img)} alt={`Showcase ${index}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
                        {/* Remove Button */}
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            backgroundColor: "rgba(255,255,255,0.7)"
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
                {showcaseImages.length}/5 images uploaded
            </Typography>
        </Box>
    );
}

export default ShowcaseUploader;