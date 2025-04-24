import { Request, Response } from "express";
import {
    User,
    createUser,
    findUserByAuth0Id,
    findUserByUsername,
    updateUserProfileByAuthId,
    deleteUserByAuth0Id,
    reactivateUserByAuth0Id,
    banUserByUserId
} from "../models/userModel";
import validator from "validator";

export const syncUser = async (req: Request, res: Response) => {
    console.log(">>> syncUser handler invoked with body: ", req.body);

    const { auth0_id, email, name, avatar } = req.body;

    if (!auth0_id || !email) {
        res.status(400).json({ message: "Missing required fields." });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ message: "Invalid email format." });
        return;
    }

    try {
        // Check if a user with this Auth0 ID already exists
        let user = await findUserByAuth0Id(auth0_id);

        if (user && user.is_deleted) {
            res.status(403).json({ message: "Your account is deactivated. Please reactivate it to continue." });
            return;
        }

        if (user) {
            const updatedData = {
                email,
                name: user.name ? (user.name === user.email ? "New User" : user.name) : name,
                avatar: user.avatar ? user.avatar : avatar,
            };

            user = await updateUserProfileByAuthId(auth0_id, updatedData);
        } else {
            user = await createUser(email, auth0_id, name, avatar);
        }

        res.status(200).json({ user });
        return;
    } catch (err) {
        console.error("Error syncing user data:", err);
        res.status(500).json({ message: "Error syncing user data." });
        return;
    }
};

const sanitizeUserProfile = (user: User) => {
    return {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        is_banned: user.is_banned
    };
};

export const getPrivateUserProfile = async (req: Request, res: Response) => {
    const auth0Id = (req.auth as any).payload.sub;
    if (!auth0Id) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
    }

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

export const getPublicUserProfile = async (req: Request, res: Response) => {
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

        res.status(200).json(sanitizeUserProfile(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user profile.' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    const { auth0Id } = req.params;
    let { name, avatar, username } = req.body;

    // Ensure user is updating their own profile
    const authenticatedAuth0Id = req.auth?.payload.sub;
    if (!authenticatedAuth0Id || authenticatedAuth0Id !== auth0Id) {
        res.status(403).json({ message: "Unauthorized request." });
        return;
    }

    // Sanitize name
    if (name) {
        name = validator.trim(name);
        if (!validator.isLength(name, { min: 3, max: 50 })) {
            res.status(400).json({ message: "Name must be between 3 and 50 characters." });
            return;
        }
        name = validator.escape(name); // Escape HTML characters
    }

    // Sanitize username
    if (username) {
        username = validator.trim(username);
        if (!validator.isAlphanumeric(username.replace(/_/g, ""))) {
            res.status(400).json({ message: "Username can only contain letters, numbers, and underscores." });
            return;
        }
        if (!validator.isLength(username, { min: 3, max: 20 })) {
            res.status(400).json({ message: "Username must be between 3 and 20 characters." });
            return;
        }
    }

    // Sanitize avatar url
    if (avatar) {
        avatar = validator.trim(avatar);
        if (!validator.isURL(avatar, { protocols: ["http", "https"], require_protocol: true })) {
            res.status(400).json({ message: "Invalid avatar URL." });
            return;
        }
        if (!/\.(jpg|jpeg|png|gif)$/i.test(avatar)) {
            res.status(400).json({ message: "Avatar must be a valid image URL." });
            return;
        }
        if (!validator.isLength(avatar, { max: 300 })) {
            res.status(400).json({ message: "Avatar URL is too long." });
            return;
        }
    }

    try {
        const user = await findUserByAuth0Id(auth0Id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // If a username update is requested, check the last update time
        if (username && username !== user.username) {
            const lastChanged = user.username_changed_at;
            const now = new Date();

            if (lastChanged && now.getTime() - new Date(lastChanged).getTime() < 24 * 60 * 60 * 1000) {
                res.status(400).json({ message: 'You can only change your username once a day.' });
                return;
            }
        }

        const updatedFields: { name?: string; avatar?: string; username?: string } = { name, avatar };

        // Only update username if it has a non-empty value
        if (username && username.trim() !== "") {
            updatedFields.username = username;
        }

        const updatedUser = await updateUserProfileByAuthId(auth0Id, updatedFields);
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

export const checkUsernameAvailability = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const user = await findUserByUsername(username);
        if (user) {
            // Username is taken
            res.status(200).json({ available: false });
            return;
        } else {
            // Username is available
            res.status(200).json({ available: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error checking username availability.' });
    }
};

// Soft delete user
export const deleteUser = async (req: Request, res: Response) => {
    const { auth0Id } = req.params;

    try {
        const user = await findUserByAuth0Id(auth0Id);

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        await deleteUserByAuth0Id(auth0Id);

        res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const reactivateUser = async (req: Request, res: Response) => {
    const { auth0Id } = req.params;

    try {
        const user = await findUserByAuth0Id(auth0Id);

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        // Reactivate account by setting is_deleted = FALSE
        await reactivateUserByAuth0Id(auth0Id);

        res.status(200).json({ message: " Your account has been restored successfully." });
    } catch (err) {
        console.error("Error reactivating user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const banUserAccount = async (req: Request, res: Response) => {
    const { userId, reason } = req.body;
    const auth0Id = req.auth?.payload.sub;
    if (!auth0Id) {
        return;
    }
    const admin = await findUserByAuth0Id(auth0Id);
    if (!admin?.id) {
        res.status(404).json({ message: "User not found." });
        return;
    }
    
    if (!userId || !reason) {
        res.status(400).json({ message: "Invalid request." });
        return;
    }

    try {
        const bannedUser = await banUserByUserId(userId, admin.id, reason);
        res.status(200).json({ message: "User banned successfully.", bannedUser });
    } catch (err) {
        console.error("Error banning user: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}