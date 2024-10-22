"use client"

import Loader from "@/components/loader";
import { auth, firestore } from "@/config/config";
import { useAuthContext } from "@/context/auth-context";
import { onAuthStateChanged } from "firebase/auth";
import { collection, DocumentData, onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function Company() {
    const [jobs, setJobs] = useState<DocumentData[]>([]);
    const { handleLoader, isLoading } = useAuthContext()!;
    let stopSnap: Unsubscribe;

    useEffect(() => {
        handleLoader(true);
        const unsub = onAuthStateChanged(auth, (user) => {
            setTimeout(() => {}, 2000);
            if (user) {
                fetchJobs();
            } else {
                handleLoader(false);
            }
        });
        return () => {
            if (stopSnap) {
                stopSnap();
            }
            unsub();
        };
    }, []);

    const fetchJobs = async () => {
        try {
            const collectionRef = collection(firestore, "jobs");
            const condition = where("uid", "==", auth.currentUser?.uid);
            const q = query(collectionRef, condition);
            stopSnap = onSnapshot(q, (snapshot) => {
                const jobsData = snapshot.docs.map((job) => {
                    const jobData = { ...job.data(), id: job.id };
                    return jobData;
                });
                setJobs(jobsData);
                handleLoader(false);
            });
        } catch (e) {
            console.error(e);
            handleLoader(false);
        }
    };

    return (
        <>
            {isLoading? <Loader /> :<div data-theme="synthwave" className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Salary</th>
                            <th>Type</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    {jobs.length > 0 ? jobs.map((job, index) => (
                        <tbody key={job.id}>
                            <tr>
                                <th>{index + 1}</th>
                                <td>{job.jobTitle}</td>
                                <td>{job.salaryRange}</td>
                                <td>{job.jobType}</td>
                                <td className="text-success cursor-pointer"><MdEdit /></td>
                                <td className="text-error cursor-pointer"><MdDelete /></td>
                            </tr>
                        </tbody>
                    )) : <></>}
                </table>
            </div>}
        </>
    );
}
