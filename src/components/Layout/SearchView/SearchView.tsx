import React from "react"
import { Outlet } from "react-router-dom"

import { SearchPageHeader } from "./SearchPageHeader/SearchPageHeader"
import styles from "./searchview.css"

export const SearchView = () => {
  return (
    <div className={styles.searchPage}>
      <SearchPageHeader />

      <Outlet />
    </div>
  )
}
