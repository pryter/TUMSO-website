import { useEffect } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"
import { isClosed } from "@/utils/timer"

export const usePageRestrictionEffects = (
  query: any,
  byPass: boolean | undefined
) => {
  const { user } = useFirebaseAuth()
  const { section } = useRegister()
  useEffect(() => {
    if (!user.isLoggedIn()) {
      section.set("landing")
    } else if (Object.hasOwn(query, "filling")) {
      if (section.is("landing")) {
        if (isClosed(byPass)) return
        section.set("student")
      }
    }
  }, [user.isLoggedIn(), section])

  useEffect(() => {
    const closed = isClosed(byPass)
    if (!section.is("landing")) {
      if (closed) {
        section.set("landing")
      }
    }
  }, [section])
}
