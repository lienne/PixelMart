import { Button, CircularProgress, Collapse, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { Report } from "../types";
import { ToastContainer } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import useReportsFetch from "../hooks/useReportsFetch";
import { useState } from "react";

function AdminDashboard() {
    const { reports, dismissedReports, loading, error, isAdmin, handleBanUser, dismissReport, reactivateReport } = useReportsFetch();
    const [showDismissed, setShowDismissed] = useState(false);

    if (!isAdmin) {
        return (
            <Container sx={{ py: 4, pt: 14, textAlign: "center"}}>
                <Typography variant="h5" color="error">Access Denied</Typography>
            </Container>
        )
    }

    if (loading) {
        return (
            <Container sx={{ py: 4, pt: 14, textAlign: "center" }}>
                <CircularProgress />
                <Typography>Loading reports...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4, pt: 14, textAlign: "center" }}>
                <Typography variant="h5" color="error">{error.message || "An unexpected error occurred."}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
            
            <Typography variant="h4" gutterBottom>User Reports</Typography>

            {/* Active Reports Table */}
            <Paper sx={{ overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="user reports table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reporter</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reported User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reported Listing</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reported Review</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {reports.length > 0 ? (
                            reports.map((report: Report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <MuiLink component={RouterLink} to={`/profile/${report.reporter_username}`} target="_blank" rel="noopener noreferrer">
                                            {report.reporter_username}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell>
                                        <MuiLink component={RouterLink} to={`/profile/${report.reported_username}`} target="_blank" rel="noopener noreferrer">
                                            {report.reported_username}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell>
                                        {report.reported_listing_id ? (
                                            <MuiLink component={RouterLink} to={`/listing/${report.reported_listing_id}`} underline="hover">
                                                {report.reported_listing_title || "View Listing"}
                                            </MuiLink>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {report.reported_review_id ? (
                                            <MuiLink component={RouterLink} to={`/listing/${report.listing_id_for_review}#review-${report.reported_review_id}`} underline="hover">
                                                View Review
                                            </MuiLink>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell sx={{ display: 'flex', alignContent: 'flex-start' }}>
                                        <Button
                                          variant="contained"
                                          color="error"
                                          size="small"
                                          sx={{
                                            mr: 2
                                          }}
                                          onClick={() => handleBanUser({userId: report.reported_user_id, reason: report.reason})}
                                        >
                                            Ban User
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="info"
                                          size="small"
                                          onClick={() => dismissReport(report.id)}
                                        >
                                            Dismiss
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No Reports.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Dismissed Reports (Collapsible) */}
            <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => setShowDismissed(!showDismissed)}>
                {showDismissed ? "Hide" : "Show"} Dismissed Reports
            </Button>

            <Collapse in={showDismissed}>
                <Paper sx={{ overflow: 'hidden', mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reporter</TableCell>
                                <TableCell>Reported User</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dismissedReports.map((report: Report) => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.reporter_username}</TableCell>
                                    <TableCell>{report.reported_username}</TableCell>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => reactivateReport(report.id)}>
                                            Reactivate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Collapse>
        </Container>
    );
}

export default AdminDashboard;