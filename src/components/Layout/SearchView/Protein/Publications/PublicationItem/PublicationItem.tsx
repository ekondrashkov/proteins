import React from "react"

import { IPublication } from "../../../../../../hooks/usePublications"
import { LinkIcon } from "../../../../../Svg/LinkIcon"
import styles from "./publicationitem.css"

interface PublicationItemProps {
  publication: IPublication
}

export const PublicationItem = ({ publication }: PublicationItemProps) => {
  return (
    <li className={styles.publicationWrapper}>
      <h4 className={styles.title}>{publication.title}</h4>
      <span className={styles.authors}>{publication.authors}</span>
      <span className={styles.categories}>
        {"Categories: "}
        <span className={styles.categoriesText}>
          {publication.sourceCategories}
        </span>
      </span>
      <span className={styles.citedFor}>
        {"Cited For: "}
        <span className={styles.citedForText}>{publication.citedFor}</span>
      </span>
      <span className={styles.source}>
        {"Source: "}
        <span className={styles.sourceText}>{publication.source}</span>
      </span>
      <div className={styles.linksWrapper}>
        <a
          href={publication.pubMedUrl}
          className={styles.pubLink}
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.linkName}>{"PubMed"}</span>
          <LinkIcon />
        </a>
        <a
          href={publication.europePmcUrl}
          className={styles.pubLink}
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.linkName}>{"Europe PMC"}</span>
          <LinkIcon />
        </a>
        {publication.articleLink !== "" && (
          <a
            href={publication.articleLink}
            className={styles.pubLink}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.linkName}>
              {publication.articleJournal}
            </span>
            <LinkIcon />
          </a>
        )}
        {publication.articleLink === "" && (
          <div className={styles.pubNoLink}>
            <span className={styles.linkName}>
              {publication.articleJournal}
            </span>
            <LinkIcon />
          </div>
        )}
      </div>
    </li>
  )
}
