"use client"

import ErrorComp from "@/components/error"
import { auth, firestore, storage } from "@/config/config"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useState } from "react"

export default function JobSeekerInfo() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => setErrorMessage(""), 2000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);

    const saveProfile = async () => {
        if (!name || !phone || !address || !file) {
            setErrorMessage("Please fill in all fields and upload a logo.")
            return
        }

        setLoading(true)
        setErrorMessage("") // Clear previous errors

        try {
            const url = await uploadImage()
            if (!url) return

            const uid = auth.currentUser?.uid
            if (!uid) return

            const docRef = doc(firestore, "users", uid)
            const company = {
                name,
                phone,
                address,
                description,
                logo: url
            }

            await setDoc(docRef, company, { merge: true })

            // Clear fields after saving
            setName("")
            setPhone("")
            setAddress("")
            setDescription("")
            setFile(null)

            console.log("Profile updated successfully")
        } catch (e) {
            console.error("Error saving profile:", e)
            setErrorMessage("Failed to save profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const uploadImage = async () => {
        try {
            if (!file) return

            const name = makeNewName(file)
            const imageRef = ref(storage, `images/${name}`)
            await uploadBytesResumable(imageRef, file)
            const url = await getDownloadURL(imageRef)
            return url
        } catch (e) {
            console.error("Error uploading image:", e)
            setErrorMessage("Failed to upload image. Please try again.")
        }
    }

    const makeNewName = (file: File) => {
        const fileExtension = file.name.split(".").pop() // Get the file extension
        const uniqueName = `${crypto.randomUUID()}.${fileExtension}` // Generate a unique name
        return uniqueName
    }

    return (
        <div className="flex flex-col justify-center items-center h-96 mt-10">
            <div className="card bg-base-100 w-96 gap-5">
                {errorMessage && <ErrorComp theme={"error"} message={errorMessage} />} {/* Display error message */}
                <h1 className="text-2xl font-bold">Job Seeker Info</h1>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="Username"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="Phone"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="Address"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Logo:
                    <input
                        onChange={(e) => {
                            const files = e.target.files
                            if (!files) return
                            setFile(files[0])
                        }}
                        type="file"
                        className="file-input w-full"
                    />
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea"
                    placeholder="Description"
                />
                <button
                    onClick={saveProfile}
                    className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </div>
    )
}
