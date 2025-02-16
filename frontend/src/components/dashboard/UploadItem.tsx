import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useFileUpload } from "../../hooks/useFileUpload";
import FileDropzone from "./FileDropzone";
import ShowcaseUploader from "./ShowcaseUploader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function UploadItem() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [showcaseImages, setShowcaseImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [usage, setUsage] = useState<{ uploaded: number; max: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { file, preview, error, getRootProps, getInputProps } = useFileUpload();

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            window.location.href = "/";
        }
    }, [isAuthenticated, isLoading]);

    const fetchUsage = async () => {
        if (!user) return;

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/user/${user.sub}/usage`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsage(data);
            } else {
                throw new Error("Failed to fetch usage.");
            }
        } catch (err) {
            console.error("Error fetching usage:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsage();
        }
    }, [user, getAccessTokenSilently]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            // Prevent adding more than 5 images
            if (showcaseImages.length + files.length > 5) {
                toast.error("You can upload a max of 5 images.", {
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                return;
            }

            setShowcaseImages([...showcaseImages, ...files]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setShowcaseImages((prevImages) => prevImages.filter((_, i) => i !== index));

        // Reset the file input so users can re-add the same image
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
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
                toast.error("Upload failed: " + data.message || "Unknown error", {
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                return;
            }

            toast.success("File uploaded successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            fetchUsage();
            setTitle("");
            setDescription("");
            setPrice("");
            setShowcaseImages([]);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred while attempting to upload your file.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4, pt: 14 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

            <Typography variant="h4" gutterBottom>Upload a File</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                {/* Drag & Drop File Upload */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", width: "100%" }}>
                    <FileDropzone getRootProps={getRootProps} getInputProps={getInputProps} preview={preview} error={error} />
                    <Typography variant="body2" color="textSecondary">
                        {usage ? `You have uploaded ${usage.uploaded}/${usage.max} listings.` : "Loading usage..."}
                    </Typography>
                </Box>

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
            <ShowcaseUploader showcaseImages={showcaseImages} handleImageUpload={handleImageUpload} handleRemoveImage={handleRemoveImage} fileInputRef={fileInputRef} />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit} disabled={uploading || !file}>
                {uploading ? "Uploading..." : "Submit"}
            </Button>
        </Container>
    );
}

export default UploadItem;
