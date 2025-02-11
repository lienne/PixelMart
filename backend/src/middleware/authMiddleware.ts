import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();

// Validate JWT tokens issued by Auth0, ensures the token has the
// correct audience and issuer. If valid, attaches the authenticated
// user info to req.auth.
export const authenticatedUser = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

export const checkFileUploadPermissions = requiredScopes("write:files");