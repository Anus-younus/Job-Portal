"use client"

import { auth, firestore } from '@/config/config'
import { UserType } from '@/types/user-type'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { createContext, useState, useContext, useEffect } from 'react'

type AuthContextType = {
    user: UserType | null,
    isLoading: boolean,
    handleLoader: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
       const unsub =  onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userFound = await fetchUser(user.uid)
                setUser(userFound as UserType)
            }
        })

        return () => {
            unsub()
        }
    }, [])

    const handleLoader = (value: boolean) => {
        setIsLoading(value)
    }


    const fetchUser = async (uid: string) => {
        const docRef = doc(firestore, "users", uid)
        const user = await getDoc(docRef)
        return user.data()
    }
    return <AuthContext.Provider value={{ user, isLoading, handleLoader }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)