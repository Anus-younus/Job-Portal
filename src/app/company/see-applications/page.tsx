"use client"

import Loader from "@/components/loader"
import { auth, firestore } from "@/config/config"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, DocumentData, getDoc, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function SeeApplications() {
    const [jobs, setJobs] = useState<DocumentData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchFavJobs()
            }
        })
        return () => {
            unsub()
        }
    }, [])

    const fetchFavJobs = async () => {
        try {
            const applyJobs = collection(firestore, "applications")
            const condition = where("companyId", "==", auth.currentUser?.uid)
            const q = query(applyJobs, condition)
            onSnapshot(q, async (snapshot) => {
                const job = snapshot.docs.map((job) => {
                    return {
                        jobId: job.data().jobId,
                        id: job.id,
                        coverLetter: job.data().coverLetter,
                        userId: job.data().uid
                    }
                })

                const jobPromises = job.map(async (job) => {
                    const jobRef = doc(firestore, "jobs", job.jobId)
                    const userRef = doc(firestore, "users", job.userId)
                    const getJob = await getDoc(jobRef)
                    const getUser = await getDoc(userRef)
                    return {
                        ...getJob.data(),
                        id: job.id,
                        coverLetter: job.coverLetter,
                        user: { ...getUser.data() }
                    }
                })

                const allAppliedJobs = (await Promise.all(jobPromises)).filter(job => job !== null)
                setJobs(allAppliedJobs as DocumentData[])
                setIsLoading(false) // Stop loading once data is fetched
            })
        } catch (e) {
            console.error("Error fetching favorite jobs:", e)
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div data-theme="synthwave" className="flex justify-center items-center gap-4 flex-wrap">
                    {jobs.length > 0 ? jobs.map((job) => (
                        <div key={job.id} className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Title: {job.jobTitle}</h2>
                                <p>Type: {job.jobType}</p>
                                <p>Salary: {job.salaryRange}</p>
                                <p>Cover letter: {job.coverLetter}</p>
                                <h3 className="font-bold">Phone: {job.user.phone}</h3>
                                <h3 className="font-bold">Email: {job.user.email}</h3>
                            </div>
                        </div>
                    )) : <h1 className="text-3xl font-bold">No Jobs available</h1>}
                </div>
            )}
        </>
    )
}
