"use client"

import AuthForm from "@/components/auth-form"
import { auth, firestore } from "@/config/config"
import AuthFormProtectedRoutes from "@/HOC/auth-form-protectd-route"
import { UserRole } from "@/types/user-role"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import Link from "next/link"

export default function SignUp() {
    const signup = async (email: string, password: string, role?: UserRole) => {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const docRef = doc(firestore, "users", userCredentials.user.uid)
        await setDoc(docRef, { email, role, uid: userCredentials.user.uid, emailVerified: false })
        console.log("user register succesful", userCredentials.user.uid)
    }
    return (
        <AuthFormProtectedRoutes>
            <div data-theme="synthwave" className="flex flex-col justify-center items-center h-96 gap-3">
                <h1 className="text-2xl font-bold">Signup</h1>
                <AuthForm func={signup} signup={true} />
                <p>already have an account <Link className="text-blue-300" href={"/login"}>login</Link></p>
            </div>
        </AuthFormProtectedRoutes>
    )
}
