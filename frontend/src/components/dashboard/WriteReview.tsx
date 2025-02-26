import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Rating, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function WriteReview() {
    const { itemId } = useParams<{ itemId: string }>();
    const { getAccessTokenSilently } = useAuth0();
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!rating || !comment.trim()) {
            setError("Please provide a rating and a comment.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ itemId, rating, comment })
            });

            if (response.status === 409) {
                throw new Error("You have already reviewed this item.");
            }

            if (!response.ok) {
                throw new Error("Failed to submit review.");
            }

            setSuccess(true);
            setTimeout(() => navigate(`/listing/${itemId}`), 2000); // Redirect after success
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ py: 4, pt: 14, maxWidth: "600px" }}>
            <Typography variant="h4" gutterBottom>
                Write a Review
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Rate your experience with this item.
            </Typography>

            {/* Star Rating */}
            <Box sx={{ mb: 3 }}>
                <Rating
                    name="star-rating"
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    size="large"
                />
            </Box>

            {/* Comment Box */}
            <TextField
                fullWidth
                label="Your Review"
                multiline
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 3 }}
            />

            {/* Error Message */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Success Message */}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Review submitted successfully!</Alert>}

            {/* Submit Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit Review"}
            </Button>
        </Container>
    );
}

export default WriteReview;