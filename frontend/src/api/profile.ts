export interface UserProfile {
    id: number;
    auth0_id?: string;
    email: string;
    name?: string;
    avatar?: string;
    created_at: Date;
}

// This function calls the backend to fetch a user's profile
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
    const response = await fetch(`http://localhost:3000/api/users/profile/${userId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch user profile.');
    }

    const data: UserProfile = await response.json();
    return data;
};