"use client"

import { auth, firestore } from "@/config/config"
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type JobCardType = {
  jobTitle: string,
  jobType: string,
  salaryRange: string,
  jobId: string,
  uid: string,
  logo: string,
  name: string,
  isAdmin?: boolean,
  hold: boolean,
  deleted: boolean
}

export default function JobCard({
  jobTitle,
  jobType,
  salaryRange,
  jobId,
  uid,
  name,
  logo,
  isAdmin,
  hold,
  deleted
}: JobCardType) {
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const router = useRouter()

  const handleChange = () => {
    router.push(`/job-seeker/${jobId}`)
  }

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const job = await fetchDoc()
        if (job) {
          setSaved(true)
        }
      } catch (e) {
        console.error(e)
      }
    }
    checkIfSaved()
  }, [])

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        const job = await fetchApplied()
        if (job) {
          setApplied(true)
        }
      } catch (e) {
        console.error(e)
      }
    }
    checkIfApplied()
  }, [])

  const changePublishStatus = () => {
    const jobRef = doc(firestore, "jobs", jobId);
    if (hold) {
      updateDoc(jobRef, { hold: false });
    } else {
      updateDoc(jobRef, { hold: true });
    }
  };

  const changeDeleteStatus = () => {
    const jobRef = doc(firestore, "jobs", jobId);
    if (deleted) {
      updateDoc(jobRef, { deleted: false });
    } else {
      updateDoc(jobRef, { deleted: true });
    }
  };



  const fetchDoc = async () => {
    try {
      const saveCollRef = collection(firestore, "favourites")
      const q = query(saveCollRef, where("uid", "==", auth.currentUser?.uid), where("jobId", "==", jobId), where("companyId", "==", uid))

      const querySnapshot = await getDocs(q)
      const jobs = querySnapshot.docs.map((doc) => doc.data())
      return jobs.length > 0 ? jobs[0] : null

    } catch (e) {
      console.log(e)
      return null
    }
  }

  const fetchApplied = async () => {
    try {
      const saveCollRef = collection(firestore, "applications")
      const q = query(saveCollRef, where("uid", "==", auth.currentUser?.uid), where("jobId", "==", jobId), where("companyId", "==", uid))

      const querySnapshot = await getDocs(q)
      const jobs = querySnapshot.docs.map((doc) => doc.data())
      return jobs.length > 0 ? jobs[0] : null
    } catch (e) {
      console.log(e)
      return null
    }
  }

  const addFavorite = async () => {
    try {
      const job = await fetchDoc()
      if (job) {
        console.log("Job already saved")
        return
      }

      const saveCollRef = collection(firestore, "favourites")
      await addDoc(saveCollRef, {
        jobId,
        companyId: uid,
        uid: auth.currentUser?.uid
      })

      console.log("Job saved successfully")
      setSaved(true)
    } catch (e) {
      console.error("Error saving job:", e)
    }
  }

  return (
    <>
      {!hold && !deleted && <div data-theme="synthwave" className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Title: {jobTitle}</h2>
          <p>Type : {jobType}</p>
          <p>Salary: {salaryRange}</p>
          <div className="card-actions justify-between mt-2 items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {/* Use default logo if the logo is not available */}
              <img
                className="w-full h-full object-cover"
                alt={`${name}'s logo`}
                src={logo || "/default-logo.png"}  // Use default-logo.png or any placeholder image
              />
            </div>
            <p className="font-bold">{name}</p>
            <div className="flex gap-3">
              {!isAdmin ? <><button className="btn btn-primary"
                onClick={handleChange}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply"}
              </button>
                <button
                  className="btn btn-primary"
                  onClick={addFavorite}
                  disabled={saved}
                >
                  {saved ? "Saved" : "Save"}
                </button></> : <>
                <button
                  onClick={changePublishStatus}
                  className="btn btn-primary"
                >
                  {hold ? "Unhold" : "Hold"}
                </button>
                <button
                  onClick={changeDeleteStatus}
                  className="btn btn-primary"
                >
                  {deleted ? "Restore" : "Delete"}
                </button></>}
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}
