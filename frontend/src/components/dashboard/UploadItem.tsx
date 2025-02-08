import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Paper, Alert } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useDropzone } from "react-dropzone";

function UploadItem() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [showcaseImages, setShowcaseImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            window.location.href = "/";
        }
    }, [isAuthenticated, isLoading]);

    // Handle File Validation & Upload
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "video/mp4": [],
            "application/pdf": [],
            "text/plain": []
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const newFile = acceptedFiles[0];
                setFile(newFile);
                setError(null);

                // Generate preview if possible
                const fileType = newFile.type;
                if (fileType.includes("image")) {
                    setPreview(URL.createObjectURL(newFile));
                } else if (fileType === "application/pdf") {
                    setPreview("pdf"); // PDF icon or generic preview
                } else if (fileType.includes("video")) {
                    setPreview(URL.createObjectURL(newFile));
                } else {
                    setPreview(null);
                }
            }
        },
        onDropRejected: () => {
            setError("Invalid file type or size. Only images, PDFs, videos, and text files up to 50MB are allowed.");
        }
    });

    // Handle Showcase Image Upload
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append("user_id", user?.sub || "");
        formData.append("title", title);
        formData.append("description", description);
        if (file) formData.append("file", file);
        showcaseImages.forEach((img) => formData.append("showcase_images", img));

        try {
            const response = await fetch("https://my-api.com/upload", { // update with API when written
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("File uploaded successfully!");
                setTitle("");
                setDescription("");
                setFile(null);
                setPreview(null);
                setShowcaseImages([]);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
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
                <Paper
                    {...getRootProps()}
                    sx={{
                        width: "50%",
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #aaa",
                        borderRadius: 2,
                        cursor: "pointer",
                        textAlign: "center",
                        p: 2
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography variant="body1">Drag & Drop a file here</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }}>Browse Files</Button>
                    <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
                        Max file size: 50MB
                    </Typography>

                    {/* File Preview */}
                    {preview && (
                        <Box sx={{ mt: 2 }}>
                            {preview === "pdf" ? (
                                <Typography>📄 PDF Selected</Typography>
                            ) : preview.includes("video") ? (
                                <video src={preview} width="100%" controls />
                            ) : (
                                <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 100 }} />
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Form Fields */}
                <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="File Name"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
            </Box>

            {/* Showcase Images Upload */}
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

            {/* 🔥 Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit} disabled={uploading || !file}>
                {uploading ? "Uploading..." : "Submit"}
            </Button>
        </Container>
    );
}

export default UploadItem;
