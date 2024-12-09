import React from "react"
import { Link } from "react-router-dom"

import styles from "./mainview.css"

export const MainView = () => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>{"Proteins Search"}</h1>
      <span className={styles.descr}>
        {
          "High-quality, comprehensive and convenient resource of protein sequence and functional information from UniProt"
        }
      </span>
      <Link to="/auth" className={styles.loginBtn}>
        {"Login"}
      </Link>
    </div>
  )
}
