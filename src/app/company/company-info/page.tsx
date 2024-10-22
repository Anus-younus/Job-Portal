"use client"

import ErrorComp from "@/components/error"
import { auth, firestore, storage } from "@/config/config"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useState } from "react"

export default function CompanyInfo() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false) // Add loading state
    const [errorMessage, setErrorMessage] = useState("") // Error message state

    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => setErrorMessage(""), 2000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);
    const saveProfile = async () => {
        if (!name || !phone || !address || !file) {
            setErrorMessage("Please fill in all required fields and upload a logo.")
            return
        }

        setLoading(true) // Start loading
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

            // Clear the fields after saving
            setName("")
            setPhone("")
            setAddress("")
            setDescription("")
            setFile(null)

            console.log("Profile updated successfully")
        } catch (e) {
            console.error("Error updating profile:", e)
            setErrorMessage("Error updating profile. Please try again.")
        } finally {
            setLoading(false) // Stop loading
        }
    }

    const uploadImage = async () => {
        try {
            if (!file) return

            const imageName = makeNewName(file)
            const imageRef = ref(storage, `images/${imageName}`)

            const uploadTask = await uploadBytesResumable(imageRef, file)
            const url = await getDownloadURL(imageRef)
            console.log(uploadTask)

            return url
        } catch (e) {
            console.error("Error uploading image:", e)
            setErrorMessage("Error uploading image. Please try again.")
            return null
        }
    }

    const makeNewName = (file: File) => {
        const fileExtension = file.name.split(".").pop() // Extract the file extension
        const uniqueName = `${crypto.randomUUID()}.${fileExtension}` // Generate a unique name
        return uniqueName
    }

    return (
        <>
            <div data-theme="synthwave" className="gap-4 mt-10 flex flex-col justify-center items-center h-96">
                {errorMessage && <ErrorComp theme={"error"} message={errorMessage} />}
                <h1 className="text-3xl font-bold">Company Info</h1>
                <div className="card bg-base-100 w-96 gap-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            className="grow"
                            placeholder="Company Name"
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="text"
                            className="grow"
                            placeholder="Phone"
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            type="text"
                            className="grow"
                            placeholder="Address"
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Logo:
                        <input
                            onChange={(e) => {
                                const files = e.target.files
                                if (files) setFile(files[0])
                            }}
                            type="file"
                            className="file-input w-full"
                            required
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
        </>
    )
}
