"use client"

import { useAuthContext } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ComppanyProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext()!
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/")
            return
        }

        // Redirect based on the user's role
        if (user?.role === "job seeker") {
            router.push("/job-seeker")
        } else if (user?.role === "admin") {
            router.push("/admin")
        } else if (user?.role === "company" && !("name" in user)) {
            router.push("/company/company-info")
        }
    }, [user, router])

    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
