import nodemailer from "nodemailer";

export async function sendContactEmail(name: string, email: string, message: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.RECEIVING_EMAIL,
            subject: `New Contact Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully." };
    } catch (err) {
        console.error("Email sending error:", err);
        throw new Error("Failed to send email.");
    }
}