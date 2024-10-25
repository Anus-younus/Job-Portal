"use client";

import { auth, firestore } from "@/config/config";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./loader";

type JobCardType = {
    jobTitle: string;
    jobType: string;
    salaryRange: string;
    jobId: string;
    uid: string;
    logo: string;
    name: string;
    isAdmin?: boolean;
    hold: boolean;
    deleted: boolean;
};

export default function AdminJobCard({
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
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initializeState = async () => {
            try {
                const isSaved = await fetchDoc();
                const isApplied = await fetchApplied();
                setSaved(!!isSaved);
                setApplied(!!isApplied);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        initializeState();
    }, []);

    const handleChange = () => {
        router.push(`/job-seeker/${jobId}`);
    };

    const changePublishStatus = async () => {
        try {
            const jobRef = doc(firestore, "jobs", jobId);
            await updateDoc(jobRef, { hold: !hold });
        } catch (e) {
            console.error("Error updating hold status:", e);
        }
    };

    const changeDeleteStatus = async () => {
        try {
            const jobRef = doc(firestore, "jobs", jobId);
            await updateDoc(jobRef, { deleted: !deleted });
        } catch (e) {
            console.error("Error updating delete status:", e);
        }
    };

    const fetchDoc = async () => {
        const saveCollRef = collection(firestore, "favourites");
        const q = query(
            saveCollRef,
            where("uid", "==", auth.currentUser?.uid),
            where("jobId", "==", jobId),
            where("companyId", "==", uid)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
    };

    const fetchApplied = async () => {
        const saveCollRef = collection(firestore, "applications");
        const q = query(
            saveCollRef,
            where("uid", "==", auth.currentUser?.uid),
            where("jobId", "==", jobId),
            where("companyId", "==", uid)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
    };

    const addFavorite = async () => {
        if (saved) {
            console.log("Job already saved");
            return;
        }
        try {
            const saveCollRef = collection(firestore, "favourites");
            await addDoc(saveCollRef, {
                jobId,
                companyId: uid,
                uid: auth.currentUser?.uid
            });
            console.log("Job saved successfully");
            setSaved(true);
        } catch (e) {
            console.error("Error saving job:", e);
        }
    };

    return (
        <div data-theme="synthwave" className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Title: {jobTitle}</h2>
                <p>Type: {jobType}</p>
                <p>Salary: {salaryRange}</p>
                <div className="card-actions justify-between mt-2 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            alt={`${name}'s logo`}
                            src={logo || "/default-logo.png"} // Use default-logo.png if no logo
                        />
                    </div>
                    <p className="font-bold">{name}</p>
                    <div className="flex gap-3">
                        {!isAdmin ? (
                            <>
                                <button className="btn btn-primary" onClick={handleChange} disabled={applied}>
                                    {applied ? "Applied" : "Apply"}
                                </button>
                                <button className="btn btn-primary" onClick={addFavorite} disabled={saved}>
                                    {saved ? "Saved" : "Save"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={changePublishStatus} className="btn btn-primary">
                                    {hold ? "Unhold" : "Hold"}
                                </button>
                                <button onClick={changeDeleteStatus} className="btn btn-primary">
                                    {deleted ? "Restore" : "Delete"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
