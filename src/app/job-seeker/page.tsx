"use client"

import JobCard from "@/components/job-card"
import { firestore } from "@/config/config"
import { collection, doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function JobSeeker() {
  const [jobs, setJobs] = useState<DocumentData[]>([])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const jobsRef = collection(firestore, "jobs");
      onSnapshot(jobsRef, async (snapshot) => {
        console.log("Snapshot received:", snapshot); // Log snapshot
        const jobPromises = snapshot.docs.map(async (jobDoc) => {
          const jobData = jobDoc.data();
          console.log("Job Data:", jobData); // Log each job's data
  
          // Fetch user data from the users collection
          const userRef = doc(firestore, "users", jobData.uid);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
  
          return {
            ...jobData,
            id: jobDoc.id,
            user: userData ? { logo: userData.logo, name: userData.name } : {}
          };
        });
  
        // Resolve all promises and update the state
        const allJobs = await Promise.all(jobPromises);
        console.log("All Jobs:", allJobs); // Log all jobs
        setJobs(allJobs);
      });
    } catch (e) {
      console.error("Error fetching jobs:", e);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {jobs.length > 0 && jobs.map((job) => (
          <JobCard
            key={job.id} // Make sure each job card has a unique key
            jobTitle={job.jobTitle}
            jobType={job.jobType}
            salaryRange={job.salaryRange}
            jobId={job.id}
            uid={job.uid}
            logo={job.user?.logo || ""} // Handle undefined logo case
            name={job.user?.name || "Unknown Company"} // Handle undefined name case
            hold={job.hold} 
            deleted={job.deleted}          />
        ))}
      </div>
    </>
  )
}
