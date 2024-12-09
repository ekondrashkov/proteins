import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  clearSeacrhResults,
  getSearchData,
  IFilteredData,
  ISearchData,
} from "../../../../store/dataStore"
import { RootState, StatusType } from "../../../../store/store"
import styles from "./search.css"
import { Settings } from "./Settings/Settings"

export const initialFilters: IFilteredData = {
  gene: "",
  model_organism: "",
  length: "",
  annotation_score: "",
  proteins_with: "",
}

interface SearchProps {
  status: StatusType | null
  setQuery: (query: string) => void
}

export const Search = ({ status, setQuery }: SearchProps) => {
  const searchRef = React.useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterValues, setFilterValues] = React.useState(initialFilters)

  const searchResult = useSelector<RootState, ISearchData[]>(
    (state) => state.data.payload
  )

  const navigate = useNavigate()

  const initialInputvalue = searchParams.get("query")

  const [searchQuery, setSearchQuery] = React.useState(initialInputvalue ?? "")

  React.useEffect(() => {
    if (
      searchResult.length === 0 &&
      initialInputvalue &&
      initialInputvalue !== ""
    ) {
      setFilterValues(initialFilters)
      dispatch(getSearchData(initialInputvalue))
      setSearchParams(`query=${initialInputvalue}`)
    }
  }, [
    dispatch,
    initialInputvalue,
    navigate,
    searchResult.length,
    setSearchParams,
  ])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === "loading") {
      return
    }

    const query = searchRef.current?.value.trim() ?? ""

    setQuery(query)
    setFilterValues(initialFilters)

    if (query === "") {
      searchParams.delete("query")
      setSearchParams(searchParams)
      dispatch(clearSeacrhResults())
    } else {
      setFilterValues(initialFilters)
      dispatch(getSearchData(query))
      setSearchParams(`query=${query}`)
    }
  }

  return (
    <section className={styles.search}>
      <div className={styles.container}>
        <form className={styles.searchForm} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter search value"
            ref={searchRef}
            className={styles.searchInput}
            value={searchQuery}
            onInput={() => setSearchQuery(searchRef.current?.value ?? "")}
          />
          <button className={styles.searchBtn} disabled={status === "loading"}>
            {"Search"}
          </button>
        </form>

        <Settings
          isDisabled={searchQuery === "" || status !== "resolved"}
          setFilterValues={setFilterValues}
          filterValues={filterValues}
        />
      </div>
    </section>
  )
}
