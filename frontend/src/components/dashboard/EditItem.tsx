import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSingleItemFetch } from "../../hooks/useSingleItemFetch";
import { toast, ToastContainer } from "react-toastify";
import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";


function EditItem() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { itemId } = useParams<{ itemId: string }>();
    const { getAccessTokenSilently } = useAuth0();
    const { item, loading, error } = useSingleItemFetch(itemId);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title,
                description: item.description,
                price: item.price.toString(),
            });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/files/edit-item/${itemId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update item.");
            }
            
            toast.success("Item updated successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            toast.error("Error updating item. Please try again.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            console.error("Update error:", err);
        }
    };

    const handleCancel = () => {
        window.location.href = "/dashboard/listings";
    };

    if (loading) {
        return (
            <Container sx={{ py: 4, textAlign: "center "}}>
                <CircularProgress />
                <Typography>Loading item...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4, pt: 14 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

            <Typography variant="h4" gutterBottom>Edit Item</Typography>
            <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="Price ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  margin="normal"
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={!formData.title || !formData.description || !formData.price}>Save Changes</Button>
                </Box>
            </Box>
        </Container>
    );
}

export default EditItem;