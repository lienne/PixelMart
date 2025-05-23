import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Rating, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import { Review } from "../../types";
import useReportsFetch from "../../hooks/useReportsFetch";
import { useLocation } from "react-router-dom";

interface ReviewsSectionProps {
    reviews: Review[];
}

function ReviewsSection ({ reviews }: ReviewsSectionProps) {
    const { report } = useReportsFetch();
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const location = useLocation();
    const reviewRefs = useRef<{ [key: string]: HTMLElement | null}>({});

    useEffect(() => {
        // Get the review ID from the URL hash, if present
        const reviewIdFromUrl = location.hash.replace("#review-", "");

        if (reviewIdFromUrl) {
            setTimeout(() => {
                const reviewElement = reviewRefs.current[reviewIdFromUrl];
                if (reviewElement) {
                    reviewElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    reviewElement.style.transition = "background-color 0.5s ease-in-out";
                    reviewElement.style.backgroundColor = "#ffff99";

                    // Remove highlight after 1.5s
                    setTimeout(() => {
                        reviewElement.style.backgroundColor = "transparent";
                    }, 1500);
                }
            }, 500); // Delay to ensure page fully loads before scrolling
        }
    }, [location]);

    const handleReportReview = (review: Review) => {
        setSelectedReview(review);
        setOpenReportDialog(true);
    };

    const handleSubmitReport = async () => {
        if (!reportReason.trim() || !selectedReview) {
            return;
        }

        await report({
            reportedUsername: selectedReview.reviewer_username,
            reason: reportReason,
            reportedReviewId: selectedReview.id
        });
        setOpenReportDialog(false);
        setReportReason("");
    };

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
                            <ListItem
                              alignItems="flex-start"
                              ref={(el) => (reviewRefs.current[review.id] = el)} // Store ref for each review
                              id={`review-${review.id}`} // Give each review an ID
                            >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                                                {review.reviewer_username}
                                            </Typography>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </Box>
                                        <IconButton size="small" color="error" onClick={() => handleReportReview(review)}>
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
                                            {new Date(review.created_at).toLocaleDateString()}
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

            {/* Report Dialog */}
            <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
                <DialogTitle>Report Review</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for Reporting"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReportDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitReport} color="error">
                        Submit Report
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ReviewsSection;