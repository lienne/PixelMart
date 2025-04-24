import { Request, Response } from "express";
import { sendContactEmail } from "../services/emailService";
import validator from "validator";

export const contactUs = async (req: Request, res: Response) => {
    let { name, email, message, captchaToken } = req.body;

    if (!captchaToken) {
        res.status(400).json({ error: "Captcha verification failed." });
        return;
    }

    try {
        const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

        const response = await fetch(captchaVerifyUrl, { method: "POST" });
        const captchaRes = await response.json();

        if (!captchaRes.success) {
            res.status(400).json({ error: "Captcha failed. Are you a bot?" });
            return;
        }
    } catch (err) {
        console.error("reCAPTCHA verification error:", err);
        res.status(500).json({ error: "Failed to verify reCAPTCHA." });
    }

    if (!name || !email || !message) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ error: "Invalid email format." });
        return;
    }

    // Sanitize inputs
    name = validator.escape(name); // Prevents HTML/JS injection
    email = validator.normalizeEmail(email); // Normalizes email format
    message = validator.escape(message); // Prevents HTML/JS injection

    try {
        const result = await sendContactEmail(name, email, message);
        res.status(200).json(result);
        return;
    } catch (err) {
        console.log("Email send error: ", err);
        res.status(500).json({ error: "Failed to send email." });
        return;
    }
};