import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import classNames from "classnames"

import { useResultsNumber } from "../../../../hooks/useSearchNumber"
import {
  addSearchResults,
  getSearchData,
  getSortedData,
  ISearchData,
} from "../../../../store/dataStore"
import { RootState } from "../../../../store/store"
import {
  ISearchDataRaw,
  prepareSearhResults,
  prepateLinkFromHeaders,
} from "../../../../utils/utils"
import { SortIcon } from "../../../Svg/SortIcon"
import styles from "./searchresults.css"
import { SearchResultsItem } from "./SearchResultsItem/SearchResultsItem"

interface IInitialSortValue {
  class: string
  sorted: boolean
  sortedValue: string
}

interface ISortBtnStyles {
  accession: IInitialSortValue
  id: IInitialSortValue
  gene: IInitialSortValue
  organism_name: IInitialSortValue
  length: IInitialSortValue
}

const initialSortValue: IInitialSortValue = {
  class: classNames(styles.sortBtn),
  sorted: false,
  sortedValue: "no",
}

const sortBtnPropsInitial: ISortBtnStyles = {
  accession: initialSortValue,
  id: initialSortValue,
  gene: initialSortValue,
  organism_name: initialSortValue,
  length: initialSortValue,
}

export const SearchResults = () => {
  const searchResult = useSelector<RootState, ISearchData[]>(
    (state) => state.data.payload
  )

  const nextSearchResultUrl = useSelector<RootState, string>(
    (state) => state.data.nextSearchResultsUrl
  )

  const [searchParams, _setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const [url, setUrl] = React.useState(nextSearchResultUrl)
  const [btnProps, setBtnProps] = React.useState({ ...sortBtnPropsInitial })
  const [isPending, setIsPending] = React.useState(false)

  const query = searchParams.get("query")
  const [resultsNumber] = useResultsNumber(query ?? "", searchResult.length)

  React.useEffect(() => {
    setBtnProps(sortBtnPropsInitial)
  }, [query])

  const onSort = (sordedBy: string) => {
    const newBtnProps = { ...btnProps }

    if (!btnProps[sordedBy as keyof ISortBtnStyles].sorted) {
      newBtnProps.accession = { ...initialSortValue }
      newBtnProps.id = { ...initialSortValue }
      newBtnProps.gene = { ...initialSortValue }
      newBtnProps.organism_name = { ...initialSortValue }
      newBtnProps.length = { ...initialSortValue }
    }

    const pressedBtn = newBtnProps[sordedBy as keyof ISortBtnStyles]

    if (!pressedBtn.sorted) {
      pressedBtn.class = classNames(styles.sortBtnActive)
      pressedBtn.sorted = true
      pressedBtn.sortedValue = "asc"
      newBtnProps[sordedBy as keyof ISortBtnStyles] = pressedBtn
      setBtnProps(newBtnProps)
      dispatch(
        getSortedData({
          query: query ?? "",
          sortedBy: sordedBy,
          order: pressedBtn.sortedValue,
        })
      )
    } else if (pressedBtn.sortedValue === "desc") {
      pressedBtn.sortedValue = "no"
      pressedBtn.sorted = false
      pressedBtn.class = classNames(styles.sortBtn)
      setBtnProps(newBtnProps)
      dispatch(getSearchData(query ?? ""))
    } else if (pressedBtn.sortedValue === "asc") {
      pressedBtn.sortedValue = "desc"
      pressedBtn.class = classNames(styles.sortBtnActive, styles.rotate)
      setBtnProps(newBtnProps)
      dispatch(
        getSortedData({
          query: query ?? "",
          sortedBy: sordedBy,
          order: pressedBtn.sortedValue,
        })
      )
    }
  }

  const observerCallback = () => {
    if (isPending) {
      return
    }

    setIsPending(true)

    return fetch(url)
      .then(async (res) => {
        const searchResults = await res.json()
        const dataRaw = searchResults.results as ISearchDataRaw[]
        const headers = [...res.headers].flat() as string[]
        const nextResultsLink = prepateLinkFromHeaders(headers)

        setUrl(nextResultsLink)
        dispatch(addSearchResults(prepareSearhResults(dataRaw)))

        setIsPending(false)

        return
      })
      .catch((error) => {
        setIsPending(false)

        throw new Error(error)
      })
  }

  const isItemLoaded = (index: number) =>
    index < searchResult.length && searchResult[index] !== null

  return (
    <section className={styles.searchResults}>
      <div className={styles.container}>
        <div className={styles.searchDescr}>
          {`${resultsNumber.toLocaleString()} Search Results for "${query}"`}
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.thIndex}>
              <div className={classNames(styles.thItem, styles.thItemLeft)}>
                <span className={styles.thTitle}>{"#"}</span>
              </div>
            </div>
            <div className={styles.thEntry}>
              <div className={styles.thItem}>
                <span className={styles.thTitle}>{"Entry"}</span>
                <button
                  onClick={() => onSort("accession")}
                  className={btnProps.accession.class}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
            <div className={styles.th}>
              <div className={styles.thItem}>
                <span className={styles.thTitle}>{"Entry Names"}</span>
                <button
                  onClick={() => onSort("id")}
                  className={btnProps.id.class}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
            <div className={styles.th}>
              <div className={styles.thItem}>
                <span className={styles.thTitle}>{"Genes"}</span>
                <button
                  onClick={() => onSort("gene")}
                  className={btnProps.gene.class}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
            <div className={styles.thOrganism}>
              <div className={styles.thItem}>
                <span className={styles.thTitle}>{"Organism"}</span>
                <button
                  onClick={() => onSort("organism_name")}
                  className={btnProps.organism_name.class}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
            <div className={styles.thSub}>
              <div className={styles.thItemNoSort}>
                <span className={styles.thTitle}>{"Subcellular Location"}</span>
              </div>
            </div>
            <div className={styles.th}>
              <div className={classNames(styles.thItem, styles.thItemRight)}>
                <span className={styles.thTitle}>{"Length"}</span>
                <button
                  onClick={() => onSort("length")}
                  className={btnProps.length.class}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              loadMoreItems={observerCallback}
              itemCount={
                searchResult.length + 25 > resultsNumber
                  ? resultsNumber
                  : searchResult.length + 25
              }
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className={styles.scroll}
                  height={height ?? "100vh"}
                  width={width ?? "100%"}
                  itemCount={
                    searchResult.length + 25 > resultsNumber
                      ? resultsNumber
                      : searchResult.length + 25
                  }
                  itemSize={48}
                  itemData={searchResult}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                >
                  {SearchResultsItem}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </section>
  )
}
