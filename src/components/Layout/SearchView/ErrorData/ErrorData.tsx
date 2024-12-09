import React from "react"

import styles from "./errordata.css"

export const ErrorData = () => {
  return (
    <section className={styles.noData}>
      <div className={styles.container}>
        <span className={styles.noDataText}>{"No data to show"}</span>
        <span className={styles.noDataText}>{"Please try another search"}</span>
      </div>
    </section>
  )
}
