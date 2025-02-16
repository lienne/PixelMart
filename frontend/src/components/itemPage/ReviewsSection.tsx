import { Box, Divider, IconButton, List, ListItem, ListItemText, Rating, Typography } from "@mui/material";
import React from "react";
import FlagIcon from "@mui/icons-material/Flag";

export interface Review {
    id: string;
    reviewer: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
}

function ReviewsSection ({ reviews }: ReviewsSectionProps) {
    const handleReport = (reviewId: string) => {
        // Implement logic to report reviews here
        console.log("Report review: ", reviewId);
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography variant="body1">No reviews yet.</Typography>
            ) : (
                <List>
                    {reviews.map((review) => (
                        <React.Fragment key={review.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                                                {review.reviewer}
                                            </Typography>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </Box>
                                        <IconButton onClick={() => handleReport(review.id)} size="small">
                                            <FlagIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                  }
                                  secondary={
                                    <>
                                        <Typography variant="body2" color="textSecondary" component="span">
                                            {review.comment}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" component="span" sx={{ display: "block" }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </>
                                  }
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default ReviewsSection;