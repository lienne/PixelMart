import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { findUserByAuth0Id } from "../models/userModel";

dotenv.config();

// Validate JWT tokens issued by Auth0, ensures the token has the
// correct audience and issuer. If valid, attaches the authenticated
// user info to req.auth.
// export const authenticatedUser = auth({
//     audience: process.env.AUTH0_AUDIENCE,
//     issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
// });

export const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    // console.log("Incoming Authorization Header:", req.headers.authorization || "No Authorization Header");

    await checkJwt(req, res, async () => {
        try {
            const auth0Id = req.auth?.payload.sub;
            if (!auth0Id) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }

            const user = await findUserByAuth0Id(auth0Id);
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            if (user.is_banned) {
                res.status(403).json({ message: "Your accoutn has been banned." });
                return;
            }

            next();
        } catch (err) {
            console.error("Error verifying user: ", err);
            res.status(500).json({ message: "Internal server error." });
        }
    });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const roles = Array.isArray(req.auth?.payload?.["https://pixelmart.dev/roles"])
        ? req.auth.payload["https://pixelmart.dev/roles"]
        : [];

    if (!roles.includes("admin")) {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }

    next();
}

export const checkFileUploadPermissions = requiredScopes("write:files");