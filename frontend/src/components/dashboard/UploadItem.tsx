import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useFileUpload } from "../../hooks/useFileUpload";
import FileDropzone from "./FileDropzone";
import ShowcaseUploader from "./ShowcaseUploader";

function UploadItem() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [showcaseImages, setShowcaseImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    
    const { file, preview, error, getRootProps, getInputProps } = useFileUpload();

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            window.location.href = "/";
        }
    }, [isAuthenticated, isLoading]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            // Prevent adding more than 5 images
            if (showcaseImages.length + files.length > 5) {
                alert("You can upload a max of 5 images.");
                return;
            }

            setShowcaseImages([...showcaseImages, ...files]);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal points
        if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
            setPrice(value);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setUploading(true);

        if (!user) {
            console.error("User not authenticated.");
            return;
        }

        const formData = new FormData();
        formData.append("auth0_id", user?.sub || "");
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("currency", "USD");
        formData.append("is_public", "true"); // Default to public for now

        if (file) formData.append("file", file);
        showcaseImages.forEach((img) => formData.append("showcase_images", img));

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                console.error("Upload failed:", data);
                alert("Upload failed: " + data.message || "Unknown error");
                return;
            }

            alert("File uploaded successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
            setShowcaseImages([]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred while attempting to upload your file.");
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4, pt: 14 }}>
            <Typography variant="h4" gutterBottom>Upload a File</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                {/* Drag & Drop File Upload */}
                <FileDropzone getRootProps={getRootProps} getInputProps={getInputProps} preview={preview} error={error} />

                {/* Form Fields */}
                <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="File Name"
                        fullWidth
                        slotProps={{
                            htmlInput: { maxLength: 255 }
                        }}
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        slotProps={{
                            htmlInput: { maxLength: 2000 }
                        }}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        helperText={`${description.length}/2000 characters`}
                    />
                    <TextField
                      label="Price (USD)"
                      fullWidth
                      required
                      value={price}
                      onChange={handlePriceChange}
                      placeholder="Enter price"
                      slotProps={{
                        input: {
                            inputProps: {
                                inputMode: "decimal",
                                pattern: "[0-9]*[.,]?[0-9]*",
                            }
                        }
                      }}
                    />
                </Box>
            </Box>

            {/* Showcase Images Upload */}
            <ShowcaseUploader showcaseImages={showcaseImages} handleImageUpload={handleImageUpload} />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit} disabled={uploading || !file}>
                {uploading ? "Uploading..." : "Submit"}
            </Button>
        </Container>
    );
}

export default UploadItem;
