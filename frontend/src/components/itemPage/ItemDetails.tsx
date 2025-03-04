import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Item } from "../../types";
import AddToCartButton from "../cart/AddToCartButton";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import RatingBreakdown from "./RatingBreakdown";
import FlagIcon from "@mui/icons-material/Flag";
import { useCheckPurchase } from "../../hooks/useCheckPurchase";
import useRatingsFetch from "../../hooks/useRatingsFetch";
import useReportsFetch from "../../hooks/useReportsFetch";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function ItemDetails({ item }: { item: Item }) {
    const hasPurchased = useCheckPurchase(String(item.id));
    const { ratings, loading, error } = useRatingsFetch(String(item.id));
    const { report } = useReportsFetch();
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const handleReportProduct = () => {
        setOpenReportDialog(true);
    }

    const handleSubmitReport = async () => {
        if (!reportReason.trim()) {
            toast.info("Please enter a reason for reporting.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return;
        }

        await report({
            reportedUsername: item.uploader_username,
            reason: reportReason,
            reportedListingId: item.id
        });
        setOpenReportDialog(false);
        setReportReason("");
    }

    return (
        <CardContent sx={{ position: 'relative' }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
            
            <Typography variant="h4" gutterBottom>
                {item.title}
            </Typography>

            {hasPurchased && (
                <Typography variant="body1" color="success" sx={{ mt: 2 }}>
                    You already purchased this item!
                </Typography>
            )}

            {/* Report Button */}
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton onClick={handleReportProduct} size="small" color="error">
                    <FlagIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Star Rating Display */}
            {loading ? (
                <Typography>Loading rating...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : ratings ? (
                <RatingBreakdown overallRating={ratings.overallRating} breakdown={ratings.breakdown} />
            ) : (
                <Typography>No ratings yet.</Typography>
            )}

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
            </Typography>
            {item.uploader_username && (
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Sold by{" "}
                    <MuiLink component={RouterLink} to={`/profile/${item.uploader_username}`}>
                        {item.uploader_username}
                    </MuiLink>
                </Typography>
            )}
            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ${item.price}
            </Typography>

            {/* Add to Cart Button */}
            <AddToCartButton item={item} />

            {/* Report Dialog */}
            <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
                <DialogTitle>Report Product</DialogTitle>
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
        </CardContent>
);
}

export default ItemDetails;