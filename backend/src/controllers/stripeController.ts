import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { updateStripeAccountIdByAuth0Id } from "../models/userModel";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment variables.");
  }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});

export const stripeOauthCallback = async (req: Request, res: Response): Promise<void> => {
    const { code, error } = req.query;

    if (error) {
        res.redirect(`${FRONTEND_URL}/dashboard/overview?error=${error}`);
        return;
    }

    if (!code || typeof code !== "string") {
        res.status(400).send("Invalid request.");
        return;
    }

    try {
        const response = await stripe.oauth.token({
            grant_type: 'authorization_code',
            code,
        });
        const acctId = response.stripe_user_id;
        if (!acctId) {
            throw new Error("Stripe OAuth did not return a connected account ID.");
        }
        
        // Fetch the full account record
        const acct = await stripe.accounts.retrieve(acctId);

        // Only treat as a seller if they're fully enabled
        if (!acct.charges_enabled) {
            // Redirect them back to onboarding or show a "Complete your Stripe setup" page
            return res.redirect(
                `${FRONTEND_URL}/dashboard/overview?error=incomplete_stripe_setup`
            );
        }

        // Store the connectedAccountId in database and associate it with seller's record here
        // Here, req.query.state grabs the auth0 id directly from the oauth url that stripe sends back
        const connectedAccountId = response.stripe_user_id;
        const auth0_id = req.query.state as string;
        if (!auth0_id || !connectedAccountId) {
            throw new Error("Missing user identifier or connected account ID from Stripe.");
        }
        await updateStripeAccountIdByAuth0Id(auth0_id, connectedAccountId);

        // Redirect the user to a success page in dashboard
        res.redirect(`${FRONTEND_URL}/dashboard/overview?connectedAccountId=${encodeURIComponent(connectedAccountId)}`);
    } catch(err) {
        console.error("Stripe OAuth error: ", err);
        res.status(500).send("An error occurred during Stripe OAuth.");
    }
};