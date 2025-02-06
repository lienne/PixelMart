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
                // Only update fields if they are null or empty, otherwise leave them alone
                const updatedData = {
                    email,
                    name: user.name ? user.name : name,
                    avatar: user.avatar ? user.avatar : avatar,
                };
                user = await updateUserProfileByAuthId(auth0_id, updatedData);
            } else {
                user = await createUser(email, auth0_id, name, avatar);
            }
        }

        res.status(200).json({ user });
        return;
    } catch (err) {
        console.error('Error syncing user data:', err);
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