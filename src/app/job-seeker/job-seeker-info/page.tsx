"use client"

import { auth, firestore, storage } from "@/config/config"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"

export default function JobSeekerInfo() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [logo, setLogo] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [desccription, setDesccription] = useState("")
    const saveProfile = async () => {
        try {
            const url = await uploadImage()
            console.log(url)
            if(!url) return
            setLogo(url)
            const uid = auth.currentUser?.uid
            if (!uid) return
            const docRef = doc(firestore, "users", uid)
            const company = {
                name,
                phone,
                address,
                desccription,
                logo
            }
            await setDoc(docRef, company, { merge: true })
            setName("")
            setAddress("")
            setPhone("")
            setDesccription("")
            console.log("updated successful")
        } catch (e) {
            console.error(e)
        }
    }

    const uploadImage = async () => {
        try {
            if (!file) return
            const name = makeNewName()
            const imageRef = ref(storage, `images/${name}`)
            await uploadBytesResumable(imageRef, file)
            const url = await getDownloadURL(imageRef)
            return url
        } catch (e) {
            console.error(e)
        }
    }

    const makeNewName = () => {
        if (!file) return
        const name = `${crypto.randomUUID()}.${file.name.split(".").length - 1}`
        return name
    }
    return (
        <>
            <div className="flex flex-col justify-center items-center h-96 mt-10">
                <div className="card bg-base-100 w-96 gap-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" className="grow" placeholder="Username" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" className="grow" placeholder="Phone" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input value={address} onChange={(e) => { setAddress(e.target.value) }} type="text" className="grow" placeholder="Address" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Logo:<input onChange={(e) => {
                            const files = e.target.files
                            if (!files) return
                            setFile(files[0] as File)

                        }} type="file" className="file-input w-full" />
                    </label>
                    <textarea value={desccription} onChange={(e) => { setDesccription(e.target.value) }} className="textarea" placeholder="Description"></textarea>
                    <button onClick={saveProfile} className="btn btn-primary">Save Profile</button>
                </div>
            </div>
        </>
    )
}
