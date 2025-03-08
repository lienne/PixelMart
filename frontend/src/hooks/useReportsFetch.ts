import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Report } from "../types";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useReportsFetch() {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);
    const queryClient = useQueryClient();

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

    // Fetch reports (Active)
    const { data: reports = [], isLoading: loading, error } = useQuery({
        queryKey: ["reports"],
        queryFn: async () => {
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
            return data.reports;
        },
        staleTime: 1000 * 60 * 5, // Cache for 5min
    });

    // Fetch dismissed reports
    const { data: dismissedReports = [] } = useQuery({
        queryKey: ["dismissedReports"],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/admin/dismissed-reports`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch dismissed reports.");
            }

            const data = await response.json();
            return data.dismissedReports;
        },
        staleTime: 1000 * 60 * 5,
    });

    // Mutation to ban a user
    const banUserMutation = useMutation({
        mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
            if (!isAdmin) {
                toast.error("Attempt to ban user without admin permissions.", {
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                return;
            }
            
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

            return userId;
        },
        onMutate: async ({ userId }) => {
            await queryClient.cancelQueries({ queryKey: ["reports"]});

            const previousReports = queryClient.getQueryData<Report[]>(["reports"]) || [];
            queryClient.setQueryData(
                ["reports"],
                previousReports.filter((report) => report.reported_user_id !== userId)
            );

            return { previousReports };
        },
        onSuccess: () => {
            toast.success("User banned successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
        onError: (error, { userId }, context) => {
            console.error("Error banning user: ", error, userId);
            queryClient.setQueryData(["reports"], context?.previousReports);
            toast.error("Failed to ban user.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
    });

    // Mutation to dismiss a report
    const dismissReportMutation = useMutation({
        mutationFn: async (reportId: string) => {
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

            return reportId;
        },
        onMutate: async (reportId) => {
            await queryClient.cancelQueries({ queryKey: ["reports"]});

            const previousReports = queryClient.getQueryData<Report[]>(["reports"]) || [];
            queryClient.setQueryData(
                ["reports"],
                previousReports.filter((report) => report.id !== reportId)
            );

            return { previousReports };
        },
        onSuccess: (reportId) => {
            // Remove from active reports
            queryClient.setQueryData<Report[]>(["reports"], (old =[]) =>
                old.filter((report) => report.id !== reportId)
            );

            // Move to dismissed reports
            queryClient.setQueryData<Report[]>(["dismissedReports"], (old = []) => {
                const dismissedReport = old.find((report) => report.id === reportId);

                // If no reports found, return unchanged array
                if (!dismissedReport) return old;

                return [
                    ...old.filter((report) => report.id !== reportId),
                    { ...dismissedReport, status: "dismissed" }
                ];
            });

            // **Trigger a fresh fetch of dismissed reports from the API**
            queryClient.invalidateQueries({ queryKey: ["dismissedReports"] });

            toast.success("Report dismissed successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
        onError: (error, reportId, context) => {
            console.error("Error dismissing report: ", error, reportId);
            queryClient.setQueryData(["reports"], context?.previousReports);
            toast.error("Failed to dismiss report.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
    });

    // Mutation to reactivate a report
    const reactivateReportMutation = useMutation({
        mutationFn: async (reportId: string) => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/admin/reactivate/${reportId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to reactivate report.");
            }

            return reportId;
        },
        onMutate: async (reportId) => {
            await queryClient.cancelQueries({ queryKey: ["dismissedReports"] });

            const prevDismissedReports = queryClient.getQueryData<Report[]>(["dismissedReports"]) || [];
            const reactivatedReport = prevDismissedReports.find((report) => report.id === reportId);

            if (!reactivatedReport) {
                return { prevDismissedReports };
            }

            // Remove from dismissed reports
            queryClient.setQueryData(
                ["dismissedReports"],
                prevDismissedReports.filter((report) => report.id !== reportId)
            );

            // Add it to active reports
            queryClient.setQueryData<Report[]>(["reports"], (old = []) => [
                ...old,
                { ...reactivatedReport, status: "pending" }
            ]);

            return { prevDismissedReports };
        },
        onSuccess: (reportId) => {
            // Remove from dismissed reports
            queryClient.setQueryData<Report[]>(["dismissedReports"], (old = []) =>
                old.filter((report) => report.id !== reportId)
            );

            // Move to active reports
            queryClient.setQueryData<Report[]>(["reports"], (old = []) => {
                const reactivatedReport = dismissedReports.find((report: Report) => report.id === reportId);

                if (!reactivatedReport) return old;

                return [...old, { ...reactivatedReport, status: "pending" }];
            });

            // **Trigger a fresh fetch of active reports from the API**
            queryClient.invalidateQueries({ queryKey: ["reports"] });

            toast.success("Report reactivated successfully!", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
        onError: (error, reportId, context) => {
            console.error("Error reactivating report: ", error, reportId);
            queryClient.setQueryData(["dismissedReports"], context?.prevDismissedReports);
            toast.error("Failed to reactivate report.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        },
    });

    return {
        reports,
        dismissedReports,
        loading,
        error,
        isAdmin,
        report,
        dismissReport: dismissReportMutation.mutate,
        handleBanUser: banUserMutation.mutate,
        reactivateReport: reactivateReportMutation.mutate
    };
}

export default useReportsFetch;