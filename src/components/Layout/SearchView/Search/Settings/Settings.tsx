import React from "react"

import { IFilteredData } from "../../../../../store/dataStore"
import { SettingsIcon } from "../../../../Svg/SettingsIcon"
import { SettingsDropdown } from "../SettingsDropdown/SettingsDropdown"
import styles from "./settings.css"

interface SettingsProps {
  isDisabled: boolean
  setFilterValues: (filterValues: IFilteredData) => void
  filterValues: IFilteredData
}

export const Settings = ({
  isDisabled,
  setFilterValues,
  filterValues,
}: SettingsProps) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [isFilterActive, setIsFilterActive] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const settingsBtnRef = React.useRef<HTMLButtonElement>(null)

  const onClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !settingsBtnRef.current?.contains(event.target as Node)
    ) {
      setSettingsOpen(false)
    }
  }

  const onToggle = (open: boolean) => {
    setSettingsOpen(open)

    if (open) {
      document.body.addEventListener("click", onClickOutside)
    } else {
      document.body.removeEventListener("click", onClickOutside)
    }
  }

  React.useEffect(() => {
    if (
      filterValues.gene !== "" ||
      filterValues.annotation_score !== "" ||
      filterValues.length !== "" ||
      filterValues.model_organism !== "" ||
      filterValues.proteins_with !== ""
    ) {
      setIsFilterActive(true)
    } else {
      setIsFilterActive(false)
    }

    return () => {
      document.body.removeEventListener("click", onClickOutside)
    }
  }, [filterValues])

  return (
    <div className={styles.setings}>
      <button
        ref={settingsBtnRef}
        disabled={isDisabled}
        className={styles.searchSettingsBtn}
        onClick={() => onToggle(isDisabled ? false : !settingsOpen)}
      >
        <SettingsIcon />
      </button>
      {settingsOpen && (
        <SettingsDropdown
          dropdownRef={dropdownRef}
          onClose={() => onToggle(false)}
          setFilterValues={setFilterValues}
          filterValues={filterValues}
        />
      )}
      {isFilterActive && <div className={styles.filtersActive} />}
    </div>
  )
}
