import React from "react"
import { Params, useParams } from "react-router-dom"
import ProtvistaUniprot from "protvista-uniprot"

import styles from "./featureviewer.css"

window.customElements.define("protvista-uniprot", ProtvistaUniprot)

export const FeatureViewer = () => {
  const container = React.useRef<HTMLDivElement>(null)
  const params: Readonly<Params<string>> = useParams()
  const entry = params.proteinId

  React.useEffect(() => {
    const provistaEl = document.createElement("protvista-uniprot")

    provistaEl.setAttribute("accession", `${entry}`)
    provistaEl.classList.add(styles.uniprot)

    const provistaElWrapper = container.current

    provistaElWrapper?.append(provistaEl)
  }, [entry])

  return <div className={styles.featureViewer} ref={container} />
}
