"use client"

import { useEffect, useState } from "react";
import AuthForm from "@/components/auth-form";
import { auth } from "@/config/config";
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import ErrorComp from "@/components/error";

export default function Login() {
    const [loading, setLoading] = useState(false); // Add loading state
    const [errorMessage, setErrorMessage] = useState(""); // Add state for error messages

    // Clear error message after a certain duration
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
            return () => clearTimeout(timer); // Cleanup timer on unmount or when errorMessage changes
        }
    }, [errorMessage]);

    // Function to validate email format
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const login = (email: string, password: string) => {
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email format.");
            return;
        }

        setErrorMessage(""); // Clear any previous error message
        setLoading(true); // Start loading when login starts

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User login successful", user.uid);

                // Check if the user's email is verified and send email verification if not
                if (!user.emailVerified) {
                    sendEmailVerification(user)
                        .then(() => {
                            console.log("Verification email sent.");
                        })
                        .catch((error) => {
                            console.error("Error sending verification email:", error);
                        });
                }
            })
            .catch((error) => {
                // Check for specific error codes from Firebase
                if (error.code === "auth/wrong-password") {
                    setErrorMessage("Incorrect password. Please try again.");
                } else if (error.code === "auth/user-not-found") {
                    setErrorMessage("No user found with this email.");
                } else {
                    setErrorMessage("Login failed. Please check your credentials.");
                }
                console.error(error);
            })
            .finally(() => {
                setLoading(false); // Stop loading after login attempt
            });
    };

    return (
        <AuthFormProtectedRoutes>
            {errorMessage && <ErrorComp theme="error" message={errorMessage} />} {/* Display error if exists */}
            <div data-theme="synthwave" className="flex flex-col justify-center items-center h-96 gap-3">
                <h1 className="text-3xl font-bold">Login</h1>
                {loading ? (
                    <p>Loading...</p> // Display loader when loading
                ) : (
                    <>
                        <AuthForm func={login} />
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link className="text-blue-300" href={"/signup"}>Signup</Link>
                        </p>
                    </>
                )}
            </div>
        </AuthFormProtectedRoutes>
    );
}
