"use client"

import JobCard from "@/components/job-card"
import { firestore } from "@/config/config"
import { collection, doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"


export default function AllJobs() {
    const [jobs, setJobs] = useState<DocumentData[]>([])

    useEffect(() => {
        fetchJobs()
    }, [])


    const fetchJobs = () => {
        try {
            const jobCollRef = collection(firestore, "jobs")
            onSnapshot(jobCollRef, async (snashot) => {
                const jobs = snashot.docs.map(async (job) => {
                    const userRef = doc(firestore, "users", job.data().uid)
                    const userSnapshot = await getDoc(userRef)
                    console.log({...job.data(), id: job.id, user: { ...userSnapshot.data() }})
                    return { ...job.data(), id: job.id, user: { ...userSnapshot.data() } }
                })
                const allJobs = await Promise.all(jobs)
                setJobs(allJobs)
            })
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div data-theme="synthwave" className="flex justify-center items-center gap-4 flex-wrap">
        {jobs.length > 0 && jobs.map((job) => (
          <JobCard
            key={job.id}
            jobTitle={job.jobTitle}
            jobType={job.jobType}
            salaryRange={job.salaryRange}
            jobId={job.id}
            uid={job.uid}
            logo={job.user?.logo || ""} 
            name={job.user?.name || "Unknown Company"}
            isAdmin={true}
            hold={job.hold}
            deleted={job.deleted}
          />
        ))}
      </div>
    )
}
