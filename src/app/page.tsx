"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [])
  return (
    <>
      <div data-theme="synthwave" className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </>
  )
}
