"use client"

import { auth } from '@/config/config'
import { useAuthContext } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function VerifyEmailProtectedRoutes({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user } = useAuthContext()!

    useEffect(() => {
        if (auth.currentUser && user) {
            if (!auth.currentUser?.emailVerified) {
                router.push("/verify-email")
            } else {
                if (user.role === "job seeker") {
                    router.push("/job-seeker")
                } else if (user.role === "admin") {
                    router.push("/admin")
                } else if (user.role === "company") {
                    router.push("/company")
                }
            }
        } else {
            router.push("/login")
        }
    }, [user, router])

    return <>{children}</>
}
