export interface UserProfile {
    id: string;
    auth0_id?: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
    created_at: Date;
    is_seller?: boolean;
    stripe_account_id?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// This function calls the backend to fetch a user's profile
export const fetchUserProfile = async (identifier: string, token?: string): Promise<UserProfile> => {
    const url = token
        ? `${API_BASE_URL}/users/profile/${identifier}`
        : `${API_BASE_URL}/users/public-profile/${identifier}`;
    const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile.');
    }

    const data: UserProfile = await response.json();

    console.log("Fetched profile data:", data);

    return data;
};