"use client"

import { useState, useEffect } from "react"
import { auth, firestore } from "@/config/config"
import { sendEmailVerification, signOut } from "firebase/auth"
import { useAuthContext } from "@/context/auth-context"
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route"
import { doc, setDoc } from "firebase/firestore"

export default function VerifyEmail() {
    const { user } = useAuthContext()!
    const [message, setMessage] = useState("")

    useEffect(() => {
        const checkFunction = async () => {
            console.log(auth.currentUser?.emailVerified)
            if (auth.currentUser?.emailVerified) {
                const docRef = doc(firestore, "users", auth.currentUser.uid)
                await setDoc(docRef, { emailVerified: true }, { merge: true })
            }
        }
        checkFunction()
    }, [])

    const resendVerificationEmail = async () => {
        if (user && !user.emailVerified) {
            try {
                await sendEmailVerification(auth.currentUser!)
                setMessage("Verification email sent! Please check your inbox.")
            } catch (error) {
                setMessage("Error sending email. Please try again later.")
                console.error(error)
            }
        }
    }
    return (
        <AuthFormProtectedRoutes>
            <div data-theme="synthwave" className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
                <p className="mb-4">Please verify your email to access all features.</p>
                <div className="flex gap-4">
                    <button onClick={resendVerificationEmail} className="btn btn-primary">
                        Resend Verification Email
                    </button>
                    <button onClick={() => { signOut(auth) }} className="btn btn-primary">
                        Sign out
                    </button>
                </div>
                    {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
            </div>
        </AuthFormProtectedRoutes>
    )
}
