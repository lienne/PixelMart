import { Request, Response } from "express";
import { createUser, findUserByAuth0Id, findUserByUsername, findUserByEmail, updateUser, updateUserProfileByAuthId, User } from "../models/userModel";

export const syncUser = async (req: Request, res: Response) => {
    const { auth0_id, email, name, avatar } = req.body;

    if (!auth0_id || !email) {
        res.status(400).json({ message: 'Missing required fields.' });
        return;
    }

    try {
        // Check if a user with this Auth0 ID already exists
        let user = await findUserByAuth0Id(auth0_id);

        if (user) {
            const updatedData = {
                email,
                name: user.name ? user.name : name,
                avatar: user.avatar ? user.avatar : avatar,
            };

            user = await updateUserProfileByAuthId(auth0_id, updatedData);
        } else {
            user = await createUser(email, auth0_id, name, avatar);
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
    const { identifier } = req.params;

    const isAuth0Id = identifier.includes('|');

    let user: User | null = null;

    try {
        if (isAuth0Id) {
            user = await findUserByAuth0Id(identifier);
        } else {
            user = await findUserByUsername(identifier);
        }


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
    const { name, avatar, username } = req.body;

    try {
        const user = await findUserByAuth0Id(auth0Id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // If a username update is requested, check the last update time
        if (username) {
            const lastChanged = user.username_changed_at;
            const now = new Date();

            if (lastChanged && now.getTime() - new Date(lastChanged).getTime() < 24 * 60 * 60 * 1000) {
                res.status(400).json({ message: 'You can only change your username once a day.' });
                return;
            }
        }

        const updatedUser = await updateUserProfileByAuthId(auth0Id, { name, avatar, username });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ user: updatedUser });
    } catch (err: any) {
        if (err.code === '23505') {
            res.status(400).json({ message: 'This username is already taken.' });
            return;
        }

        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Error updating user profile.' });
    }
};