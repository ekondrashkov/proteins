import React from "react"

import styles from "./nodata.css"

interface NoDataProps {
  query: string
}

export const NoData = ({ query }: NoDataProps) => {
  return (
    <section className={styles.noData}>
      {!query ? (
        <div className={styles.container}>
          <span className={styles.noDataText}>{"No data to display"}</span>
          <span className={styles.noDataText}>
            {"Please start search to display results"}
          </span>
        </div>
      ) : (
        <div className={styles.container}>
          <span className={styles.noDataText}>
            {`Nothing was found on "${query}"`}
          </span>
          <span className={styles.noDataText}>
            {"Please try another search"}
          </span>
        </div>
      )}
    </section>
  )
}
