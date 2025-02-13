import { createContext, useState, useEffect, ReactNode } from "react";
import { fetchUserProfile, UserProfile } from "../api/profile";
import { useAuth0 } from "@auth0/auth0-react";

interface ProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth0();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (isAuthenticated && user && user.sub) {
            fetchUserProfile(user.sub)
                .then((data) => {
                    const is_seller = !!data.stripe_account_id;
                    setProfile({ ...data, is_seller });
                })
                .catch((err) => console.error('Error fetching profile:', err));
        }
    }, [isAuthenticated, user]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};