"use client"

import { firestore } from "@/config/config"
import { doc, updateDoc } from "firebase/firestore"
import Image from "next/image"

type AllUsersTableType = {
    name: string
    email: string
    address: string
    phone: string
    logo: string
    hold: boolean
    deleted: boolean
    userId: string
}

export default function AllUsersTable({ name, email, address, phone, logo, hold, deleted, userId }: AllUsersTableType) {

    const changePublishStatus = async () => {
        try {
            const userRef = doc(firestore, "users", userId)
            await updateDoc(userRef, { hold: !hold })
        } catch (e) {
            console.error("Error updating publish status:", e)
        }
    }

    const changeDeleteStatus = async () => {
        try {
            const userRef = doc(firestore, "users", userId)
            await updateDoc(userRef, { deleted: !deleted })
        } catch (e) {
            console.error("Error updating delete status:", e)
        }
    }

    return (
        <tr data-theme="synthwave" className="text-center">
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <Image
                                height={30}
                                width={30}
                                src={logo || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
                                alt="User Avatar"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{name}</div>
                        <div className="text-sm opacity-50">{address || "Address not provided"}</div>
                    </div>
                </div>
            </td>
            <td>
                {phone || "Phone not provided"}
                <br />
                <span className="badge badge-ghost badge-sm">{email || "Email not provided"}</span>
            </td>
            <td>
                <button
                    onClick={changePublishStatus}
                    className={`btn btn-xs ${hold ? "btn-secondary" : "btn-primary"}`}
                >
                    {hold ? "Unhold" : "Hold"}
                </button>
            </td>
            <td>
                <button
                    onClick={changeDeleteStatus}
                    className={`btn btn-xs ${deleted ? "btn-secondary" : "btn-error"}`}
                >
                    {deleted ? "Restore" : "Delete"}
                </button>
            </td>
        </tr>
    )
}
