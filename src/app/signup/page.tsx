"use client"

import { useEffect, useState } from "react";
import AuthForm from "@/components/auth-form";
import { auth, firestore } from "@/config/config";
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route";
import { UserRole } from "@/types/user-role";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import ErrorComp from "@/components/error"; // Assuming you have an error component for showing error messages

export default function SignUp() {
    const [loading, setLoading] = useState(false); // Add loading state
    const [errorMessage, setErrorMessage] = useState("");

    // Clear error message after 2 seconds
    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => setErrorMessage(""), 2000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);

    // Email validation function
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const signup = async (email: string, password: string, role?: UserRole) => {
        try {
            if (!validateEmail(email)) {
                setErrorMessage("Invalid email format.");
                return;
            }
            if (!role) {
                setErrorMessage("Please select a role.");
                return;
            }
            setErrorMessage(""); // Clear any previous error message
            setLoading(true); // Start loading when signup begins

            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredentials.user;

                // Add user data to Firestore
                const docRef = doc(firestore, "users", user.uid);
                await setDoc(docRef, { email, role, uid: user.uid, emailVerified: false });

                // Send email verification
                if (!user.emailVerified) {
                    await sendEmailVerification(user);
                    console.log("Verification email sent.");
                }

                console.log("User registration successful", user.uid);
            } catch (error) {
                setErrorMessage("Signup failed. Please try again.");
                console.error(error);
            } finally {
                setLoading(false); // Stop loading after signup attempt
            }
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <AuthFormProtectedRoutes>
            {errorMessage && <ErrorComp theme="error" message={errorMessage} />} {/* Display error message */}
            <div data-theme="synthwave" className="flex flex-col justify-center items-center h-96 gap-3">
                <h1 className="text-2xl font-bold">Signup</h1>
                {loading ? (
                    <p>Loading...</p> // Display loader while loading
                ) : (
                    <>
                        <AuthForm func={signup} signup={true} />
                        <p>Already have an account? <Link className="text-blue-300" href={"/login"}>Login</Link></p>
                    </>
                )}
            </div>
        </AuthFormProtectedRoutes>
    );
}
