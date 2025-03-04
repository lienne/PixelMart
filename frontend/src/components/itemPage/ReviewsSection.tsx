import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Rating, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import { Review } from "../../types";
import useReportsFetch from "../../hooks/useReportsFetch";

interface ReviewsSectionProps {
    reviews: Review[];
}

function ReviewsSection ({ reviews }: ReviewsSectionProps) {
    const { report } = useReportsFetch();
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

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
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                                                {review.reviewer_id}
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