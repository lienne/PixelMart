import { createContext, useState, ReactNode } from "react";
import { UserProfile } from "../api/profile";

interface ProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};