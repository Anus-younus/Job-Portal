"use client"

import { auth, firestore } from "@/config/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UpdateJobType = {
    params: { id: string }
}

export default function UpdateDoc({ params: { id } }: UpdateJobType) {
    const [jobTitle, setJobTitle] = useState("");
    const [jd, setJD] = useState("");
    const [qualification, setQualification] = useState("");
    const [skillSet, setSkillSet] = useState("");
    const [otherReq, setOtherReq] = useState("");
    const [jobType, setJobType] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [address, setAddress] = useState("");
    const [msg, setMsg] = useState("");
    const [alertType, setAlertType] = useState<"error" | "success">("error");
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();
    useEffect(() => {
        getDocs()
    })

    const validateFields = () => {
        if (!jobTitle || !jd || !qualification || !skillSet || !otherReq || !jobType || !salaryRange || !address) {
            setMsg("All fields are required.");
            setAlertType("error");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            return false;
        }
        return true;
    };

    const getDocs = async () => {
        try {
            const docRef = doc(firestore, "jobs", id)
            onSnapshot(docRef, (job) => {
                setJobTitle(job.data()?.jobTitle)
                setJD(job.data()?.jobDescription)
                setQualification(job.data()?.qualification)
                setSkillSet(job.data()?.skillSet)
                setOtherReq(job.data()?.otherRequirements)
                setJobType(job.data()?.jobType)
                setSalaryRange(job.data()?.salaryRange)
                setAddress(job.data()?.address)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const createNewJob = async () => {
        if (!validateFields()) return;

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

        try {
            const docRef = doc(firestore, "jobs", id);
            await setDoc(docRef, newJob, { merge: true });

            // Show success message
            setMsg("Job created successfully!");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            // Clear form after submission
            setJobTitle("");
            setJD("");
            setAddress("");
            setJobType("");
            setOtherReq("");
            setQualification("");
            setSalaryRange("");
            setSkillSet("");

            router.push("/company");
        } catch (error) {
            setMsg("Error creating job. Please try again.");
            setAlertType("error");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            console.log(error)
        }
    };

    return (
        <div data-theme="synthwave" className="flex flex-col justify-center items-center gap-3 mb-10">
            {showAlert && (
                <div role="alert" className={`alert alert-${alertType === "error" ? "error" : "success"}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 shrink-0 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={alertType === "error" ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"}
                        />
                    </svg>
                    <span>{msg}</span>
                </div>
            )}
            <h1 className="text-3xl font-bold">Update this Job</h1>
            <div className="card bg-base-100 w-96 mt-5 gap-3">
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="title"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={skillSet}
                        onChange={(e) => setSkillSet(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="skills"
                    />
                </label>
                <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>
                        --Select Qualification--
                    </option>
                    <option value="high_school">High School</option>
                    <option value="bachelors">Bachelor&apos;s Degree</option>
                    <option value="masters">Master&apos;s Degree</option>
                    <option value="phd">PhD</option>
                    <option value="diploma">Diploma</option>
                </select>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={otherReq}
                        onChange={(e) => setOtherReq(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="other requirement"
                    />
                </label>
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">--Select Job Type--</option>
                    <option value="full_time">Full-Time</option>
                    <option value="part_time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                </select>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="salary range"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="location"
                    />
                </label>
                <textarea
                    value={jd}
                    onChange={(e) => setJD(e.target.value)}
                    className="textarea"
                    placeholder="Description"
                />
                <button onClick={createNewJob} className="btn btn-primary">
                    Update job
                </button>
            </div>
        </div>
    );
}
