"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthContext } from "../context/auth-context"

export default function AuthFormProtectedRoutes({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user } = useAuthContext()!

    useEffect(() => {
        // Check if the user is not verified
        if (user) {
            if (!user.emailVerified) {
                router.push("/verify-email") // Redirect to verify email page
                return; // Exit the effect after redirect
            }
            
            // Redirect based on user role if email is verified
            if (user.role === "job seeker") {
                router.push("/job-seeker")
            } else if (user.role === "company") {
                router.push("/company")
            } else if (user.role === "admin") {
                router.push("/admin")
            }
        }
    }, [user, router]) // Add user and router to the dependency array

    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
