import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { ISearchData } from "../../../../../store/dataStore"
import styles from "./searchresultsitem.css"

interface SearchResultsItemProps {
  index: number
  data: ISearchData[]
  style: React.CSSProperties
}

export const SearchResultsItem = ({
  index,
  data,
  style,
}: SearchResultsItemProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query")

  const goToProtein = () => {
    navigate(`/protein/${data[index].entry}/details?query=${query}`)
  }

  return (
    <div style={style} className={styles.itemRow}>
      <div className={styles.itemContentIndex}>
        <span className={styles.itemIndex}>{index + 1}</span>
      </div>
      <div className={styles.itemContentEntry}>
        <button className={styles.itemEntry} onClick={goToProtein}>
          {data[index]?.entry}
        </button>
      </div>
      <div className={styles.itemContent}>
        <span className={styles.itemEntryNames}>{data[index]?.entryNames}</span>
      </div>
      <div className={styles.itemContent}>
        <span className={styles.itemGenes}>
          {data[index]?.genes === "undefined" ? "" : data[index]?.genes}
        </span>
      </div>
      <div className={styles.itemContentOrganism}>
        <span className={styles.itemOrganism}>{data[index]?.organism}</span>
      </div>
      <div className={styles.itemContentSub}>
        <span className={styles.itemSubcelLoc}>
          {data[index]?.subcellularLocation}
        </span>
      </div>
      <div className={styles.itemContent}>
        <span className={styles.itemLength}>
          {data[index]?.length.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
