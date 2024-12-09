import React from "react"
import { Params, useParams } from "react-router-dom"

import {
  IPublication,
  usePublications,
} from "../../../../../hooks/usePublications"
import { getId } from "../../../../../utils/utils"
import { Spinner } from "../../../Spinner/Spinner"
import { PublicationItem } from "./PublicationItem/PublicationItem"
import styles from "./publications.css"

export const Publications = () => {
  const params: Readonly<Params<string>> = useParams()
  const entry = params.proteinId ?? ""
  const { publications, loading } = usePublications(entry)

  return (
    <div className={styles.publications}>
      {loading ? (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      ) : (
        <ul className={styles.publicationsList}>
          {publications.map((publication: IPublication) => (
            <PublicationItem publication={publication} key={getId()} />
          ))}
        </ul>
      )}
    </div>
  )
}
