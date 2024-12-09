import React from "react"
import { useSelector } from "react-redux"

import { DataState } from "../../../../store/dataStore"
import { RootState } from "../../../../store/store"
import { Spinner } from "../../Spinner/Spinner"
import { ErrorData } from "../ErrorData/ErrorData"
import { NoData } from "../NoData/NoData"
import { Search } from "../Search/Search"
import { SearchResults } from "../SearchResults/SearchResults"
import styles from "./searchpagecontent.css"

export const SearchPageContent = () => {
  const [query, setQuery] = React.useState("")

  const { payload: searchResult, status } = useSelector<RootState, DataState>(
    (state) => state.data
  )

  return (
    <main className={styles.main}>
      <Search setQuery={setQuery} status={status} />
      {status === "loading" && (
        <div className={styles.loader}>
          <div className={styles.spinnerWrapper}>
            <Spinner />
          </div>
        </div>
      )}
      {searchResult.length === 0 &&
        (status === "resolved" || status === null) && <NoData query={query} />}
      {status === "rejected" && <ErrorData />}
      {searchResult.length > 0 && status === "resolved" && <SearchResults />}
    </main>
  )
}
