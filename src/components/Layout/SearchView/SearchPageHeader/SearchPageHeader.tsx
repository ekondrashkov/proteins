import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { signOutUser } from "../../../../store/authStore"
import { clearSeacrhResults } from "../../../../store/dataStore"
import { RootState } from "../../../../store/store"
import styles from "./searchpageheader.css"

export const SearchPageHeader = () => {
  const email = useSelector<RootState, string>((state) => state.user.email)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!email) {
      navigate("/auth")
    }
  }, [email, navigate])

  const onLogOut = () => {
    navigate("/auth")
    dispatch(clearSeacrhResults())
    dispatch(signOutUser())
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>{"Proteins Search"}</div>
        <div className={styles.usedData}>
          <span className={styles.email}>{email}</span>
          <button className={styles.logOutBtn} onClick={onLogOut}>
            {"Log out"}
          </button>
        </div>
      </div>
    </header>
  )
}
