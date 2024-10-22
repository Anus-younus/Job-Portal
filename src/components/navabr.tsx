"use client"

import { auth } from "@/config/config"
import { signOut } from "firebase/auth"
import Link from "next/link"

type NavbarType = {
    company?: boolean
}

export default function Navbar({ company }: NavbarType) {
    const logout = async () => {
        await signOut(auth)
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
                        {company ? <>
                            <li><Link href={"/company"}>All Jobs</Link></li>
                            <li><Link href={"/company/see-applications"}>See Applications</Link></li>
                            <li><Link href={"/company/create-new-job"}>Create New Job</Link></li>
                            <li><Link href={"/company/company-info"}>Company Info</Link></li>
                        </> :
                            <>
                                <li><Link href={"/job-seeker"}>All Jobs</Link></li>
                                <li><Link href={"/job-seeker/applied-jobs"}>Applied Jobs</Link></li>
                                <li><Link href={"/job-seeker/favorites"}>Favorite jobs</Link></li>
                                <li><Link href={"/job-seeker/job-seeker-info"}>User Info</Link></li>
                            </>
                        }
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Oldano Job Portal</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {company ? <>
                        <li><Link href={"/company"}>All Jobs</Link></li>
                        <li><Link href={"/company/see-applications"}>See Applications</Link></li>
                        <li><Link href={"/company/create-new-job"}>Create New Job</Link></li>
                        <li><Link href={"/company/company-info"}>Company Info</Link></li>
                    </> :
                        <>
                            <li><Link href={"/job-seeker"}>All Jobs</Link></li>
                            <li><Link href={"/job-seeker/applied-jobs"}>Applied Jobs</Link></li>
                            <li><Link href={"/job-seeker/favorites"}>Favorite jobs</Link></li>
                            <li><Link href={"/job-seeker/job-seeker-info"}>User Info</Link></li>
                        </>
                    }
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn" onClick={logout}>Logout</a>
            </div>
        </div>
    )
}
