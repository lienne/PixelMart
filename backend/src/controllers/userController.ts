import { Request, Response } from "express";
import { createUser, findUserByAuth0Id, findUserByEmail, updateUser, updateUserProfileByAuthId } from "../models/userModel";

export const syncUser = async (req: Request, res: Response) => {
    const { auth0_id, email, name, avatar } = req.body;

    if (!auth0_id || !email) {
        res.status(400).json({ message: 'Missing required fields.' });
        return;
    }

    try {
        // Check if a user with this Auth0 ID already exists
        let user = await findUserByAuth0Id(auth0_id);

        if (!user) {
            // If not found, check if a user exists with the same email
            user = await findUserByEmail(email);

            if (user) {
                // Update the user record if details have changed
                user = await updateUser(auth0_id, { email, name, avatar });
            } else {
                // Create a new user record
                user = await createUser(email, auth0_id, name, avatar);
            }
        } else {
            user = await updateUser(auth0_id, { email, name, avatar });
        }

        res.status(200).json({ user });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error syncing user data.' });
        return;
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    const { auth0Id } = req.params;

    try {
        const user = await findUserByAuth0Id(auth0Id);

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user profile.' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    const { auth0Id } = req.params;
    const { name, avatar } = req.body;

    try {
        const updatedUser = await updateUserProfileByAuthId(auth0Id, { name, avatar });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Error updating user profile.' });
    }
};