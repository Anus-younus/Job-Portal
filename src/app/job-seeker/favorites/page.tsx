"use client"

import Loader from "@/components/loader"
import { auth, firestore } from "@/config/config"
import { onAuthStateChanged } from "firebase/auth"
import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Favorites() {
    const [jobs, setJobs] = useState<DocumentData[]>([])
    const [loading, setLoading] = useState(true) // Track loading state
    const [appliedJobs, setAppliedJobs] = useState<{ [key: string]: boolean }>({}) // Track applied jobs
    const router = useRouter()

    const handleChange = (jobId: string) => {
        router.push(`/job-seeker/${jobId}`)
    }
    const deleteJob = async (jobId: string) => {
        try {
            const docRef = doc(firestore, "favourites", jobId)
            await deleteDoc(docRef)
            setJobs(jobs.filter((job) => job.id !== jobId)) // Optimistic UI update
        } catch (e) {
            console.error("Error deleting favorite job:", e)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchFavJobs()
            } else {
                setLoading(false) // Stop loading if no user is found
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe()
    })

    const fetchFavJobs = async () => {
        try {
            const jobFavRef = collection(firestore, "favourites")
            const condition = where("uid", "==", auth.currentUser?.uid)
            const q = query(jobFavRef, condition)

            onSnapshot(q, async (snapshot) => {
                if (snapshot.empty) {
                    setJobs([]) // No favorite jobs
                    setLoading(false) // Stop loading
                    return
                }

                const favJobs = snapshot.docs.map((job) => {
                    return { jobId: job.data().jobId, id: job.id }
                })

                const jobPromises = favJobs.map(async (job) => {
                    const jobRef = doc(firestore, "jobs", job.jobId)
                    const jobDoc = await getDoc(jobRef)
                    return { ...jobDoc.data(), id: job.id, jobId: job.jobId }
                })

                const allFavJobs = (await Promise.all(jobPromises)).filter(job => job !== null)
                setJobs(allFavJobs as DocumentData[])
                setLoading(false) // Stop loading

                // Check if user has applied to each job
                checkIfApplied(allFavJobs)
            })
        } catch (e) {
            console.error("Error fetching favorite jobs:", e)
            setLoading(false) // Stop loading on error
        }
    }

    const checkIfApplied = async (favJobs: DocumentData[]) => {
        try {
            const applicationsRef = collection(firestore, "applications")
            const appliedJobsMap: { [key: string]: boolean } = {}

            for (const job of favJobs) {
                const condition1 = where("uid", "==", auth.currentUser?.uid)
                const condition2 = where("jobId", "==", job.jobId)
                const q = query(applicationsRef, condition1, condition2)

                const querySnapshot = await getDocs(q)
                appliedJobsMap[job.jobId] = !querySnapshot.empty
            }

            setAppliedJobs(appliedJobsMap)
        } catch (e) {
            console.error("Error checking applied jobs:", e)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                {loading ? (
                    <Loader /> // Show loader while data is being fetched
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.id} className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Title: {job.jobTitle}</h2>
                                <p>Type : {job.jobType}</p>
                                <p>Salary: {job.salaryRange}</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary"
                                        disabled={appliedJobs[job.jobId]}
                                        onClick={() => { handleChange(job.jobId) }}
                                    >
                                        {appliedJobs[job.jobId] ? "Applied" : "Apply"}
                                    </button>
                                    <button onClick={() => { deleteJob(job.id) }} className="btn btn-primary">
                                        Unsave
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No favorite jobs found.</p> // Message when no jobs are available
                )}
            </div>
        </>
    )
}
