import React from "react"
import { useDispatch } from "react-redux"
import {
  NavLink,
  Outlet,
  Params,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

import { useProteinDetails } from "../../../../hooks/useProteinDetails"
import { clearSeacrhResults } from "../../../../store/dataStore"
import { Spinner } from "../../Spinner/Spinner"
import styles from "./protein.css"

export const Protein = () => {
  const params: Readonly<Params<string>> = useParams()
  const entry = params.proteinId ?? ""
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { proteinDetails: data, loading } = useProteinDetails(entry)

  const [searchParams, _setSearchParams] = useSearchParams()
  const query = searchParams.get("query")

  if (!entry) {
    navigate(`/search?query=${query}`)
  }

  const goToSearch = () => {
    dispatch(clearSeacrhResults())
    navigate(`/search?query=${query}`)
  }

  return (
    <main>
      <section>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner />
          </div>
        )}
        {data && !loading && (
          <div className={styles.container}>
            <div className={styles.commonDataWrapper}>
              <div className={styles.commonData}>
                <div className={styles.titleWrapper}>
                  <h2
                    className={styles.title}
                  >{`${data.entry} / ${data.id}`}</h2>
                  <span className={styles.organism}>{data.organism}</span>
                </div>
                <div className={styles.proteinDescr}>
                  <h3 className={styles.proteinDescrTitle}>{"Protein"}</h3>
                  <span className={styles.proteinDescrText}>
                    {data.protein}
                  </span>
                  <h3 className={styles.proteinDescrTitle}>{"Gene"}</h3>
                  <span className={styles.proteinDescrText}>{data.gene}</span>
                </div>
              </div>
              <button className={styles.toSearchBtn} onClick={goToSearch}>
                {"Back to Search"}
              </button>
            </div>

            <div className={styles.proteinInfo}>
              <nav className={styles.proteinInfoNav}>
                <NavLink
                  to={`/protein/${data.entry}/details?query=${query}`}
                  className={({ isActive }) =>
                    isActive
                      ? styles.proteinInfoNavBtnActive
                      : styles.proteinInfoNavBtn
                  }
                >
                  {"Details"}
                </NavLink>
                <NavLink
                  to={`/protein/${data.entry}/featureviewer?query=${query}`}
                  className={({ isActive }) =>
                    isActive
                      ? styles.proteinInfoNavBtnActive
                      : styles.proteinInfoNavBtn
                  }
                >
                  {"Feature viewer"}
                </NavLink>
                <NavLink
                  to={`/protein/${data.entry}/publications?query=${query}`}
                  className={({ isActive }) =>
                    isActive
                      ? styles.proteinInfoNavBtnActive
                      : styles.proteinInfoNavBtn
                  }
                >
                  {"Publications"}
                </NavLink>
              </nav>
            </div>

            <Outlet context={data} />
          </div>
        )}
      </section>
    </main>
  )
}
