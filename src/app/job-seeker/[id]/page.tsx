"use client"

import { auth, firestore } from '@/config/config'
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type ApplyForJobType = {
   params: {id: string}
}

export default function ApplyForJob({params: {id}}: ApplyForJobType) {
    const [coverLetter, setCoverLetter] = useState("")
    const router = useRouter()

    const applyForJob = async () => {
        try {
            const docRef = doc(firestore, "jobs", id)
            const jobDoc = await getDoc(docRef)
            const job = jobDoc.data()
            const applyJobRef = collection(firestore, "applications")
            if(!job) return
            await addDoc(applyJobRef, {jobId: jobDoc.id, companyId: job?.uid, uid: auth.currentUser?.uid, coverLetter})
            router.push("/job-seeker")
        } catch (e) {
            console.error(e)
        }
    }
   
    return (
        <>
        <div className="flex justify-center items-center h-96">
            <div className="card bg-base-100 w-96 gap-6">
                <textarea placeholder='Enter your cover letter' value={coverLetter} onChange={(e) => { setCoverLetter(e.target.value) }} className='textarea'></textarea>
                <button className="btn btn-primary" onClick={applyForJob}>Apply job</button>
            </div>
        </div>
        </>
    )
}
