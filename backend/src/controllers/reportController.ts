import { Request, Response } from "express";
import { createReport, dismissReportById, getAllReportsFromDatabase, getDismissedReportsFromDatabase, reactivateReportById } from "../models/reportModel";
import { findUserByAuth0Id, findUserByUsername } from "../models/userModel";
import validator from "validator";

export const reportUserOrListingOrReview = async (req: Request, res: Response) => {
    let { reporterAuth0Id, reportedUsername, reportedListingId, reportedReviewId, reason } = req.body;

    if (!reporterAuth0Id || !reason || !reportedUsername) {
        console.log("Invalid report details: ", req.body);
        res.status(400).json({ message: "Invalid report details" });
        return;
    }

    if (!validator.isAlphanumeric(reportedUsername.replace(/_/g, ''))) {
        res.status(400).json({ message: "Invalid username format." });
        return;
    }

    reason = validator.escape(reason.trim());
    if (!validator.isLength(reason, { min: 5, max: 2000 })) {
        res.status(400).json({ message: "Reason must be between 5 and 2000 characters." });
        return;
    }

    const reporter = await findUserByAuth0Id(reporterAuth0Id);
    const reportedUser = await findUserByUsername(reportedUsername);
    if (!reportedUser || !reporter) {
        console.log("User not found: ", { reporterAuth0Id, reportedUsername });
        res.status(404).json({ message: "User not found." });
        return;
    }

    if (reporterAuth0Id === reportedUser.auth0_id) {
        res.status(400).json({ message: "You cannot report yourself." });
        return;
    }

    if (reportedListingId && !validator.isUUID(reportedListingId)) {
        res.status(400).json({ message: "invalid listing ID." });
        return;
    }

    if (reportedReviewId && !validator.isUUID(reportedReviewId)) {
        res.status(400).json({ message: "Invalid review ID." });
        return;
    }

    try {
        const report = await createReport(reporter.id, reportedUser.id, reportedListingId, reportedReviewId, reason);
        res.status(201).json({ message: "Report submitted successfully.", report });
    } catch (err) {
        console.error("Error submitting report: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getAllReports = async (req: Request, res: Response) => {
    try {
        const allReports = await getAllReportsFromDatabase();
        res.status(200).json({ reports: allReports });
    } catch (err) {
        console.error("Error fetching reports: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const dismissReport = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const dismissedReport = await dismissReportById(reportId);
        res.status(200).json({ message: "Report dismissed successfully.", dismissedReport });
    } catch (err) {
        console.error("Error dismissing report: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getDismissedReports = async (req: Request, res: Response) => {
    try {
        const dismissedReports = await getDismissedReportsFromDatabase();
        res.status(200).json({ dismissedReports });
    } catch (err) {
        console.error("Error fetching dismissed reports: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const reactivateReport = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const reactivatedReport = await reactivateReportById(reportId);
        res.status(200).json({ message: "Report reactivated successfully.", reactivatedReport });
    } catch (err) {
        console.error("Error reactivating report: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}