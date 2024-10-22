"use client"

import { auth, firestore } from '@/config/config'
import { UserType } from '@/types/user-type'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { createContext, useState, useContext, useEffect } from 'react'

type AuthContextType = {
    user: UserType | null,
    isLoading: boolean,
    setUser: (user: UserType | null) => void,  // Corrected typing for setUser
    handleLoader: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)  // Set loading true initially

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setIsLoading(true)  // Set loading state when fetching user data
                const userFound = await fetchUser(currentUser.uid)
                setUser(userFound as UserType)
            } else {
                setUser(null)  // Clear user when not logged in
            }
            setIsLoading(false)  // Stop loading after user fetch or clear
        })

        return () => unsub()
    }, [])

    const handleLoader = (value: boolean) => {
        setIsLoading(value)
    }

    const fetchUser = async (uid: string) => {
        const docRef = doc(firestore, "users", uid)
        const user = await getDoc(docRef)
        return user.data()
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, handleLoader, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
