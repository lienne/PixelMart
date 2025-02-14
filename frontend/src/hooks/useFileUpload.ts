import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 50 * 1024 * 1024 * 1024;

export function useFileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle File Validation & Upload
    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const newFile = acceptedFiles[0];

            if (newFile.size > MAX_FILE_SIZE) {
                toast.error("File size exceeds the 5GB limit.", {
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                return;
            }

            setFile(newFile);
            setError(null);

            // Generate preview
            const fileType = newFile.type;
            if (fileType.includes("image")) {
                setPreview(URL.createObjectURL(newFile));
            } else if (fileType === "application/pdf") {
                setPreview("pdf");
            } else if (fileType.includes("video")) {
                setPreview(URL.createObjectURL(newFile));
            } else {
                setPreview(null);
            }
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "video/mp4": [],
            "application/pdf": [],
            "text/plain": []
        },
        maxSize: MAX_FILE_SIZE,
        onDrop: handleFileDrop,
        onDropRejected: () => {
            setError("Invalid file type or size. Only images, PDFs, videos, and text files up to 5GB are allowed.");
        }
    });

    return { file, preview, error, getRootProps, getInputProps };
}