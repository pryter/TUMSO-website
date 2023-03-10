import { PencilIcon } from "@heroicons/react/20/solid"
import Router from "next/router"
import type { Dispatch, FC } from "react"

import { DownloadCert } from "@/components/texts/static/group/DownloadCert"
import { useFireStore } from "@/contexts/firestore"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"

export const StatusActionStrip: FC<{
  submissionData: SubmitStatus | null
  setImgLoading: Dispatch<boolean>
}> = ({ submissionData, setImgLoading }) => {
  const { enableEditing } = useFireStore()

  const edit = async () => {
    await enableEditing()
    Router.push("/register?filling")
  }

  return submissionData?.status === "rejected" &&
    submissionData?.reason !== "duplicated" ? (
    <h1
      onClick={() => {}}
      className="flex cursor-not-allowed items-center justify-center space-x-1 text-center text-gray-600"
    >
      <PencilIcon className="h-4 w-4" />
      <span>แก้ไขแบบฟอร์ม</span>
    </h1>
  ) : (
    // <DownloadTicket
    //   submissionData={submissionData}
    //   setImgLoading={setImgLoading}
    // />
    <DownloadCert />
  )
}
