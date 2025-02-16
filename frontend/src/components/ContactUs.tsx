import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

function ContactUs() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCaptcha = (token: string | null) => {
        setCaptchaToken(token);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!captchaToken) {
            setError("Please verify you are not a robot.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, captchaToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message. Please try again later.");
            }

            toast.success("Message sent successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            setFormData({ name: "", email: "", message: "" });
            setCaptchaToken(null); // Reset reCAPTCHA
        } catch (err: any) {
            console.error("Error:", err.message);
            toast.error("Error sending message. Please try again later.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, pt: 14, justifyItems: 'center' }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

            <Typography variant="h4" gutterBottom>Contact Us</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Have a question or feedback? Fill out the form below and let me know!
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                />

                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />

                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} onClick={handleSubmit}>
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ContactUs;