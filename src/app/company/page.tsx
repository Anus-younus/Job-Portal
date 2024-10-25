"use client";

import ErrorComp from "@/components/error";
import Loader from "@/components/loader";
import { auth, firestore } from "@/config/config";
import { useAuthContext } from "@/context/auth-context";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { collection, doc, DocumentData, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdPauseCircle, MdPlayCircle, MdRestore } from "react-icons/md";

export default function Company() {
    const { user } = useAuthContext()!;
    const router = useRouter();
    const [jobs, setJobs] = useState<DocumentData[]>([]);
    const { handleLoader, isLoading } = useAuthContext()!;
    let stopSnap: Unsubscribe | null = null;

    useEffect(() => {
        handleLoader(true);
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchJobs();
            } else {
                handleLoader(false);
            }
        });
        return () => {
            if (stopSnap) stopSnap();
            unsub();
        };
    }, []);

    const handleDelete = async (jobId: string) => {
        try {
            const jobRef = doc(firestore, "jobs", jobId);
            await updateDoc(jobRef, { deleted: true });
        } catch (e) {
            console.error("Error marking job as deleted:", e);
        }
    };

    const restoreJob = async (jobId: string) => {
        try {
            const jobRef = doc(firestore, "jobs", jobId);
            await updateDoc(jobRef, { deleted: false });
        } catch (e) {
            console.error("Error restoring job:", e);
        }
    };

    const handleEdit = (jobId: string) => {
        router.push(`/company/${jobId}`);
    };

    const toggleJobHoldStatus = async (jobId: string, currentHoldStatus: boolean) => {
        try {
            const jobRef = doc(firestore, "jobs", jobId);
            await updateDoc(jobRef, { hold: !currentHoldStatus });
        } catch (e) {
            console.error("Error updating job hold status:", e);
        }
    };

    const fetchJobs = () => {
        const jobsRef = collection(firestore, "jobs");
        const userJobsQuery = query(jobsRef, where("uid", "==", auth.currentUser?.uid));
        stopSnap = onSnapshot(userJobsQuery, (snapshot) => {
            const fetchedJobs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setJobs(fetchedJobs);
            handleLoader(false);
        });
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : user?.deleted ? (
                <ErrorComp theme="error" message="Your account has been removed." />
            ) : user?.hold ? (
                <ErrorComp theme="info" message="Your account has been frozen." />
            ) : (
                <div data-theme="synthwave" className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Salary</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.filter(job => !job.deleted).length > 0 ? (
                                jobs.filter(job => !job.deleted).map((job, index) => (
                                    <tr key={job.id}>
                                        <th>{index + 1}</th>
                                        <td>{job.jobTitle}</td>
                                        <td>{job.salaryRange}</td>
                                        <td className={job.hold ? "text-warning" : "text-success"}>
                                            {job.hold ? "On Hold" : "Active"}
                                            {job.hold ? (
                                                <MdPlayCircle className="cursor-pointer ml-2" onClick={() => toggleJobHoldStatus(job.id, job.hold)} />
                                            ) : (
                                                <MdPauseCircle className="cursor-pointer ml-2" onClick={() => toggleJobHoldStatus(job.id, job.hold)} />
                                            )}
                                        </td>
                                        <td className="text-success cursor-pointer">
                                            <MdEdit onClick={() => handleEdit(job.id)} />
                                        </td>
                                        <td className="text-error cursor-pointer">
                                            <MdDelete onClick={() => handleDelete(job.id)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">No jobs available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Show deleted jobs in a separate section */}
                    {jobs.some(job => job.deleted) && (
                        <div>
                            <h3>Deleted Jobs</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Restore</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.filter(job => job.deleted).map((job, index) => (
                                        <tr key={job.id}>
                                            <th>{index + 1}</th>
                                            <td>{job.jobTitle}</td>
                                            <td className="text-warning cursor-pointer">
                                                <MdRestore onClick={() => restoreJob(job.id)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
