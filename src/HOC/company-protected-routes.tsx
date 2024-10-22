"use client"

import { auth } from "@/config/config"
import { useAuthContext } from "@/context/auth-context"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ComppanyProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext()!
    const router = useRouter()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/")
            }
        })
    }, [])


    useEffect(() => {
        if (user?.role == "job seeker") {
            router.push("/job-seeker")
         } else if (user?.role == "admin") {
           router.push("/admin")
         }
         if(user && user.role == "company" && !("name" in user!)) {
             router.push("/company/company-info")
         }
    }, [user])
    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
