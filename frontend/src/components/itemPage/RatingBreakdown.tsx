import { Box, Menu, MenuItem, Rating, Typography } from "@mui/material";
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
        setAnchorEl(null);
    };

    return (
        <Box
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Rating value={overallRating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>{overallRating}</Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              slotProps={{
                paper: {
                    onMouseLeave: handleClose,
                },
              }}
            >
                {Object.entries(breakdown).map(([star, count]) => (
                    <MenuItem key={star}>
                        <Rating value={parseFloat(star)} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {count} review{Number(count) !== 1 ? "s" : ""}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default RatingBreakdown;