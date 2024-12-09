import React from "react"
import { useOutletContext } from "react-router-dom"

import { IProteinDetails } from "../../../../../hooks/useProteinDetails"
import { CopyIcon } from "../../../../Svg/CopyIcon"
import styles from "./details.css"

export const Details = () => {
  const details = useOutletContext<IProteinDetails | null>()

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(`${details?.sequence ?? ""}`)
  }

  return details ? (
    <div className={styles.details}>
      <h4 className={styles.title}>{"Sequence"}</h4>
      <div className={styles.sequenceData}>
        <div className={styles.sequenceDataCol}>
          <h5 className={styles.sequenceDataColTitle}>{"Length"}</h5>
          <span className={styles.sequenceDataColValue}>{details.length}</span>
          <h5 className={styles.sequenceDataColTitle}>{"Mass (Da)"}</h5>
          <span className={styles.sequenceDataColValue}>{details.mass}</span>
        </div>
        <div className={styles.sequenceDataCol}>
          <h5 className={styles.sequenceDataColTitle}>{"Last updated"}</h5>
          <span className={styles.sequenceDataColValue}>{details.lastUpd}</span>
          <h5 className={styles.sequenceDataColTitle}>{"Checksum"}</h5>
          <span className={styles.sequenceDataColValue}>
            {details.checksum}
          </span>
        </div>
      </div>
      <div className={styles.sequenceValue}>
        {details.sequence}
        <button className={styles.clipboardBtn} onClick={onClipboardCopy}>
          <CopyIcon />
          <span className={styles.clipboardBtnText}>{"Copy"}</span>
        </button>
      </div>
    </div>
  ) : null
}
