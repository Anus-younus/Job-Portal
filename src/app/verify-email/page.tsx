"use client"

import { useState, useEffect } from "react"
import { auth, firestore } from "@/config/config"
import { sendEmailVerification, signOut as firebaseSignOut } from "firebase/auth"
import { useAuthContext } from "@/context/auth-context"
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation" // Import useRouter
import ErrorComp from "@/components/error"

export default function VerifyEmail() {
    const { user } = useAuthContext()!
    const [message, setMessage] = useState("")
    const router = useRouter() // Initialize router

    useEffect(() => {
        const checkEmailVerification = async () => {
            // Check if email is verified and update Firestore
            if (auth.currentUser?.emailVerified) {
                const docRef = doc(firestore, "users", auth.currentUser.uid)
                await setDoc(docRef, { emailVerified: true }, { merge: true })

                // Redirect based on user role
                if (user) {
                    if (user.role === "job seeker") {
                        router.push("/job-seeker") // Redirect to job seeker page
                    } else if (user.role === "company") {
                        router.push("/company") // Redirect to company page
                    } else if (user.role === "admin") {
                        router.push("/admin") // Redirect to admin page
                    }
                }
            }
        }

        const intervalId = setInterval(async () => {
            await auth.currentUser?.reload(); // Reload user data to check for verification
            checkEmailVerification();
        }, 3000); // Check every 3 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [user, router]); // Add user and router to the dependency array

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

    const signOut = async () => {
        try {
            await firebaseSignOut(auth); // Sign out user
            router.push("/login"); // Redirect to login page after signing out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthFormProtectedRoutes>
            <div data-theme="synthwave" className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
                <p className="mb-4">Please verify your email to access all features.</p>
                <div className="flex gap-4">
                    <button onClick={resendVerificationEmail} className="btn btn-primary">
                        Resend Verification Email
                    </button>
                    <button onClick={signOut} className="btn btn-primary">
                        Sign out
                    </button>
                </div>
                {message && <ErrorComp theme={"success"} message={message} />}
            </div>
        </AuthFormProtectedRoutes>
    )
}
