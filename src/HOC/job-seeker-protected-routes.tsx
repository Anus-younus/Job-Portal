"use client"

import { auth } from '@/config/config'
import { useAuthContext } from '@/context/auth-context'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function JobSeekerProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user, setUser } = useAuthContext()! // Assuming your context provides a setUser function
    
    const router = useRouter()

    useEffect(() => {
        // Listen for auth state changes to detect logout
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // If user logs out, redirect to login
                setUser(null); // Update the user state in your context
                router.push("/login");
            }
        });

        return () => {
            // Unsubscribe from the listener when the component unmounts
            unsubscribe();
        };
    }, [router, setUser]);

    useEffect(() => {
        // Handle role-based redirects
        if (user == null) {
            router.push("/login");
            return;
        }
        if (user?.role == "company") {
            router.push("/company");
        } else if (user?.role == "admin") {
            router.push("/admin");
        }
        if (user && user.role == "job seeker" && !("name" in user!)) {
            router.push("/job-seeker/job-seeker-info");
        }
    }, [user, router]);

    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
