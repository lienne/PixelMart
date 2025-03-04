import { Request, Response } from "express";
import { createReport, dismissReportById, getAllReportsFromDatabase } from "../models/reportModel";
import { findUserByAuth0Id, findUserByUsername } from "../models/userModel";

export const reportUserOrListingOrReview = async (req: Request, res: Response) => {
    const { reporterAuth0Id, reportedUsername, reportedListingId, reportedReviewId, reason } = req.body;

    if (!reporterAuth0Id || !reason || !reportedUsername) {
        console.log("Invalid report details: ", req.body);
        res.status(400).json({ message: "Invalid report details" });
        return;
    }

    const reporter = await findUserByAuth0Id(reporterAuth0Id);
    const reportedUser = await findUserByUsername(reportedUsername);
    if (!reportedUser || !reporter) {
        console.log("User not found: ", { reporterAuth0Id, reportedUsername });
        res.status(404).json({ message: "User not found." });
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
        const result = await getAllReportsFromDatabase();
        res.status(200).json({ reports: result });
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