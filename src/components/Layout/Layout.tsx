import React from "react"

import styles from "./layout.css"

interface LayoutProps {
  children?: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className={styles.layout}>{children}</div>
}
