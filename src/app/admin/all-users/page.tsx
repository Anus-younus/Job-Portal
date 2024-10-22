"use client"

import AllUsersTable from "@/components/admin-users-table"
import { firestore } from "@/config/config"
import { collection, DocumentData, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function AllUsers() {
    const [users, setUsers] = useState<DocumentData[]>([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = () => {
        try {
            const userCollRef = collection(firestore, "users")
            onSnapshot(userCollRef, (snapshot) => {
                const fetchedUsers = snapshot.docs.map((user) => ({
                    ...user.data(),
                    id: user.id
                }))
                setUsers(fetchedUsers)
            })
        } catch (e) {
            console.error("Error fetching users:", e)
        }
    }

    return (
        <div className="container mx-auto px-4" data-theme="synthwave">
            <div className="overflow-x-auto" data-theme="synthwave">
                <table className="table-auto w-full min-w-full text-center">
                    {/* Table Head */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Hold</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <AllUsersTable
                                    key={user.id}
                                    name={user.name || "Unnamed User"}
                                    email={user.email || ""}
                                    address={user.address || ""}
                                    phone={user.phone || ""}
                                    logo={user.logo || ""}
                                    hold={user.hold || false}
                                    deleted={user.deleted || false}
                                    userId={user.id}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center p-4">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
