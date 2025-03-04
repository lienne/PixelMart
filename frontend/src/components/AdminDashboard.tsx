import { Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { Report } from "../types";
import { ToastContainer } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import useReportsFetch from "../hooks/useReportsFetch";

function AdminDashboard() {
    const { reports, loading, error, isAdmin, handleBanUser, dismissReport } = useReportsFetch();

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
                <Typography variant="h5" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
            
            <Typography variant="h4" gutterBottom>User Reports</Typography>

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
                                            <MuiLink component={RouterLink} to={`/listing/${report.listing_id_for_review}`} underline="hover">
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
                                          onClick={() => handleBanUser(report.reported_user_id, report.reason)}
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
        </Container>
    );
}

export default AdminDashboard;