import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Report } from "../types";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useReportsFetch() {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = await getAccessTokenSilently();
                const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
                const roles = decodedToken["https://pixelmart.dev/roles"] || [];

                setIsAdmin(roles.includes("admin"));
            } catch (err) {
                console.error("Error checking admin status: ", err);
            }
        };

        if (user) checkAdminStatus();
    }, [user, getAccessTokenSilently]);

    const report = async ({
        reportedUsername,
        reason,
        reportedListingId = null,
        reportedReviewId = null
    }: {
        reportedUsername: string;
        reason: string;
        reportedListingId?: number | null;
        reportedReviewId?: string | null;
    }) => {
        if (!user) return;

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reporterAuth0Id: user.sub,
                    reportedUsername,
                    reportedListingId,
                    reportedReviewId,
                    reason
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit report.");
            }

            toast.success("Report submitted successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return await response.json();
        } catch (err) {
            console.error("Error reporting user: ", err);
            toast.error("Failed to submit report.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };

    const handleBanUser = async (userId: string, reason: string) => {
        if (!isAdmin) {
            toast.error("Attempt to ban user without admin permissions.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/admin/ban`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId, reason }),
            });

            if (!response.ok) {
                throw new Error("Failed to ban user.");
            }

            // After banning, refetch the reports
            fetchReports();

            setReports((prevReports) => prevReports.filter((report) => report.reported_user_id !== userId));
            toast.success("User banned successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            console.error("Error banning user: ", err);
            toast.error("Failed to ban user.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    }

    const fetchReports = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/admin/reports`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch reports.");
            }

            const data = await response.json();
            setReports(data.reports);
        } catch (err: any) {
            console.error("Error fetching reports: ", err);
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const dismissReport = async (reportId: string) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/admin/dismiss/${reportId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to dismiss report.");
            }

            // Remove dismissed report from the list
            setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
            toast.success("Report dismissed successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } catch (err) {
            console.error("Error dismissing report: ", err);
            toast.error("Failed to dismiss report.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    }

    useEffect(() => {
        if (isAdmin) fetchReports();
    }, [isAdmin, getAccessTokenSilently]);

    return { reports, loading, error, isAdmin, report, handleBanUser, fetchReports, dismissReport };
}

export default useReportsFetch;