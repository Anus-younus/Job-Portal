"use client"

import Loader from "@/components/loader"
import { auth, firestore } from "@/config/config"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, DocumentData, getDoc, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function AppliedJobs() {
  const [jobs, setJobs] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true) // Track loading state

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFavJobs()
      } else {
        setLoading(false) // Stop loading if no user is found
      }
    })
    return () => {
      unsub()
    }
  }, [])

  const fetchFavJobs = async () => {
    try {
      const applyJobs = collection(firestore, "applications")
      const condition = where("uid", "==", auth.currentUser?.uid)
      const q = query(applyJobs, condition)

      onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          setLoading(false) // No jobs found, stop loading
          setJobs([]) // Set jobs to empty array
          return
        }

        const jobPromises = snapshot.docs.map(async (jobDoc) => {
          const jobData = jobDoc.data()
          const jobRef = doc(firestore, "jobs", jobData.jobId)
          const jobSnapshot = await getDoc(jobRef)

          return {
            ...jobSnapshot.data(),
            id: jobDoc.id,
            coverLetter: jobData.coverLetter,
          }
        })

        const allAppliedJobs = (await Promise.all(jobPromises)).filter((job) => job !== null)
        setJobs(allAppliedJobs)
        setLoading(false) // Data fetched, stop loading
      })
    } catch (e) {
      console.error("Error fetching applied jobs:", e)
      setLoading(false) // Stop loading on error
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
                <p>Type: {job.jobType}</p>
                <p>Salary: {job.salaryRange}</p>
                <p>Cover letter: {job.coverLetter}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs found.</p> // Show this when no jobs are available
        )}
      </div>
    </>
  )
}
