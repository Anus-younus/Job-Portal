"use client"

import { auth } from '@/config/config'
import { useAuthContext } from '@/context/auth-context'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function JobSeekerProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext()!
    const router = useRouter()
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/")
            }
        })

        return () => {
            unsub()
        }
    }, [])


    useEffect(() => {
        if (user?.role == "company") {
           router.push("/company")
        } else if (user?.role == "admin") {
          router.push("/admin")
        }
        if(user && user.role == "job seeker" && !("name" in user!)) {
            router.push("/job-seeker/job-seeker-info")
        }
    }, [user])
    return (
        <div data-theme="synthwave">
            {children}
        </div>
    )
}
