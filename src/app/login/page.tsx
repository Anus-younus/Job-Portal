"use client"

import AuthForm from "@/components/auth-form"
import { auth } from "@/config/config"
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"

export default function Login() {
    const login = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("user login successful", user.uid)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error, errorCode, errorMessage)
            });

    }
    return (
        <AuthFormProtectedRoutes>
            <div  data-theme="synthwave" className="flex flex-col justify-center items-center h-96 gap-3">
                <h1 className="text-3xl font-bold">Login</h1>
                <AuthForm func={login} />
                <p>dont have an account <Link className="text-blue-300" href={"/signup"}>signup</Link></p>
            </div>
        </AuthFormProtectedRoutes>
    )
}
