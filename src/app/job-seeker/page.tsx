"use client"

import JobCard from "@/components/job-card"
import Loader from "@/components/loader" // Import your Loader component
import { firestore } from "@/config/config"
import { useAuthContext } from "@/context/auth-context"
import { collection, doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function JobSeeker() {
  const { user } = useAuthContext()!
  const [jobs, setJobs] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const unsubscribe = fetchJobs(); // Set up the snapshot listener
    return () => unsubscribe(); // Cleanup on component unmount
  }, [])

  const fetchJobs = () => {
    const jobsRef = collection(firestore, "jobs");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(jobsRef, async (snapshot) => {
      try {
        const jobPromises = snapshot.docs.map(async (jobDoc) => {
          const jobData = jobDoc.data();

          // Fetch user data from the "users" collection
          const userRef = doc(firestore, "users", jobData.uid);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();

          return {
            ...jobData,
            id: jobDoc.id,
            user: userData ? { logo: userData.logo, name: userData.name } : {}
          };
        });

        const allJobs = await Promise.all(jobPromises);
        setJobs(allJobs); // Update jobs state
      } catch (e) {
        console.error("Error fetching jobs:", e);
      } finally {
        setLoading(false); // Set loading to false after jobs are fetched
      }
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  return (
    <>
      {!user?.deleted && !user?.hold ? (
        <div>
          {loading ? ( // Conditional rendering for loader
            <Loader /> // Show Loader while loading
          ) : (
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id} // Ensure unique key
                    jobTitle={job.jobTitle}
                    jobType={job.jobType}
                    salaryRange={job.salaryRange}
                    jobId={job.id}
                    uid={job.uid}
                    logo={job.user?.logo || "/default-avatar.png"} // Fallback logo
                    name={job.user?.name || "Unknown Company"} // Fallback name
                    hold={job.hold}
                    deleted={job.deleted}
                  />
                ))
              ) : (
                <div>No jobs found</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {user?.deleted && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your Account has been removed.</span>
            </div>
          )}
          {user?.hold && (
            <div role="alert" className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Your Account has been freezed.</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
