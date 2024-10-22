"use client"

import { auth, firestore } from "@/config/config";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNewJob() {
    const [jobTitle, setJobTitle] = useState("");
    const [jd, setJD] = useState("");
    const [qualification, setQualification] = useState("");
    const [skillSet, setSkillSet] = useState("");
    const [otherReq, setOtherReq] = useState("");
    const [jobType, setJobType] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [address, setAddress] = useState("");
    const router = useRouter()
    const createNewJob = async () => {
        const newJob = {
          jobTitle,
          jobDescription: jd,
          qualification,
          skillSet,
          otherRequirements: otherReq,
          jobType,
          salaryRange,
          address,
          hold: false,
          deleted: false,
          uid: auth.currentUser?.uid,
        };
        const collectionRef = collection(firestore, "jobs")
        await addDoc(collectionRef, newJob)
        setJobTitle("")
        setJD("")
        setAddress("")
        setJobType("")
        setOtherReq("")
        setQualification("")
        setSalaryRange("")
        setSkillSet("")
        router.push("/company")
    }
    return (
        <div data-theme="synthwave" className="flex flex-col justify-center items-center">
            <div className="card bg-base-100 w-96 gap-2 mt-5">
                <label className="input input-bordered flex items-center gap-2">
                    <input value={jobTitle} onChange={(e) => {setJobTitle(e.target.value)}} type="text" className="grow" placeholder="title" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={skillSet} onChange={(e) => {setSkillSet(e.target.value)}} type="text" className="grow" placeholder="skills" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={qualification} onChange={(e) => {setQualification(e.target.value)}} type="text" className="grow" placeholder="qualificatrions" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={otherReq} onChange={(e) => {setOtherReq(e.target.value)}} type="text" className="grow" placeholder="other requirement" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={jobType} onChange={(e) => {setJobType(e.target.value)}} type="text" className="grow" placeholder="job type" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={salaryRange} onChange={(e) => {setSalaryRange(e.target.value)}} type="text" className="grow" placeholder="salary range" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input value={address} onChange={(e) => {setAddress(e.target.value)}} type="text" className="grow" placeholder="location" />
                </label>
                <textarea value={jd} onChange={(e) => {setJD(e.target.value)}} className="textarea" placeholder="Description"></textarea>
                <button onClick={createNewJob} className="btn btn-primary">Create Job</button>
            </div>
        </div>
    )
}
