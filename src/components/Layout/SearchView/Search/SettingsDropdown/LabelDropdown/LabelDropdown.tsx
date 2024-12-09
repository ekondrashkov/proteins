import React from "react"

import { IFilterValue } from "../../../../../../hooks/useFilters"
import { getId } from "../../../../../../utils/utils"
import styles from "./labeldropdown.css"

interface LabelDropdownProps {
  options: IFilterValue[]
  setSelectValue: (value: string) => void
  onClose: (isClosed: boolean) => void
}

export const LabelDropdown = ({ options, setSelectValue, onClose }: LabelDropdownProps) => {
  const setValue = (value: string) => {
    setSelectValue(value)
    onClose(false)
  }

  return (
    <div className={styles.dropdown}>
      <ul className={styles.list}>
        {options.map((option: IFilterValue) => (
          <li 
            className={styles.listItem} 
            key={getId()} 
            onClick={(e) => setValue(e.currentTarget.textContent ?? "Select")}
          >
            {option.label ?? option.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
