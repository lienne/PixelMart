import { Box, MenuItem, Popover, Rating, Typography } from "@mui/material";
import React, { useState } from "react";

interface RatingBreakdownProps {
    overallRating: number;
    breakdown: { [star: string]: number };
}

function RatingBreakdown ({ overallRating, breakdown }: RatingBreakdownProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        // Lose focus when menu is closed - helps with accessibility and screen readers
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null);
    };

    return (
        <Box
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
            <Rating value={overallRating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
                {overallRating}
            </Typography>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                disableRestoreFocus
            >
                {Object.entries(breakdown).map(([star, count]) => (
                <MenuItem key={star} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={parseFloat(star)} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {count} review{Number(count) !== 1 ? "s" : ""}
                    </Typography>
                </MenuItem>
                ))}
            </Popover>
        </Box>
    );
}

export default RatingBreakdown;