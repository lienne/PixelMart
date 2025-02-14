import { Paper, Typography, Button, Box } from "@mui/material";

interface FileDropzoneProps {
    getRootProps: any;
    getInputProps: any;
    preview: string | null;
    error: string | null;
}

function FileDropzone({ getRootProps, getInputProps, preview, error }: FileDropzoneProps) {
    return (
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
                Max file size: 5GB
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

            {error && <Typography color="error">{error}</Typography>}
        </Paper>
    );
}

export default FileDropzone;