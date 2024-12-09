import React from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { clearSeacrhResults } from "../../../store/dataStore"
import styles from "./nomatchview.css"

export const NoMatchView = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const goToSearch = () => {
    dispatch(clearSeacrhResults())
    navigate("/search")
  }

  return (
    <div className={styles.noMatchWrapper}>
      <main className={styles.main}>
        <section>
          <div className={styles.container}>
            <h2 className={styles.errorNum}>{"404"}</h2>
            <span className={styles.errorMessage}>{"Page not found"}</span>
            <button className={styles.toSearchBtn} onClick={goToSearch}>
              {"Back to Search"}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
