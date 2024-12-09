import React from "react"
import { Outlet } from "react-router-dom"

import styles from "./main.css"

export const Main = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  )
}
