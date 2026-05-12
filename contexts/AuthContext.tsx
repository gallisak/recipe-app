"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Profile found:", docSnap.data());
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    console.warn("No profile document for UID:", currentUser.uid);
                    setProfile({
                        firstName: currentUser.displayName?.split(" ")[0] || "User",
                        lastName: currentUser.displayName?.split(" ")[1] || "",
                        email: currentUser.email || ""
                    });
                }
            }
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);