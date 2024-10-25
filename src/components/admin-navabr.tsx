"use client"

import { auth } from "@/config/config"
import { signOut } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
    const router = useRouter()
    const logout = async () => {
        await signOut(auth)
        router.push("/login") 
    }
    return (
        <div data-theme="synthwave" className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link href={"/admin"}>All Jobs</Link></li>
                        <li><Link href={"/admin/all-users"}>All Users</Link></li>
                        <li><Link href={"/admin/messages"}>Messages</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Oldano Job Portal</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href={"/admin"}>All Jobs</Link></li>
                    <li><Link href={"/admin/all-users"}>All Users</Link></li>
                    <li><Link href={"/admin/messages"}>Messages</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn" onClick={logout}>Logout</a>
            </div>
        </div>
    )
}
