"use client"


import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthContext } from "../context/auth-context"

export default function AuthFormProtectedRoutes({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user } = useAuthContext()!
    useEffect(() => {
        if (user && user.role == "job seeker") {
            router.push("/job-seeker")
        }
        else if (user && user.role == "company") {
            router.push("/company")
        }
        else if (user && user.role == "admin") {
            router.push("/admin")
        }
    }, [user])
    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
