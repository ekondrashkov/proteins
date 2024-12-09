import React from "react"
import { useDispatch } from "react-redux"
import { useSearchParams } from "react-router-dom"

import { IFilterData, useFilters } from "../../../../../hooks/useFilters"
import {
  getFilteredhData,
  getSearchData,
  IFilteredData,
} from "../../../../../store/dataStore"
import { SelectIcon } from "../../../../Svg/SelectIcon"
import { initialFilters } from "../Search"
import { LabelDropdown } from "./LabelDropdown/LabelDropdown"
import styles from "./settingsdropdown.css"

interface SettingsDropdownProps {
  dropdownRef: React.RefObject<HTMLDivElement>
  filterValues: IFilteredData
  onClose: () => void
  setFilterValues: (filterValues: IFilteredData) => void
}

const SELECT_BTN_TEXT = "Select"

export const SettingsDropdown = ({
  dropdownRef,
  filterValues,
  onClose,
  setFilterValues,
}: SettingsDropdownProps) => {
  const [proteinDropdown, setProteinDropdown] = React.useState(false)

  const [proteinValue, setProteinValue] = React.useState(
    filterValues.proteins_with === ""
      ? SELECT_BTN_TEXT
      : filterValues.proteins_with
  )

  const [annotationDropdown, setAnnotationDropdown] = React.useState(false)

  const [annotationValue, setAnnotationValue] = React.useState(
    filterValues.annotation_score === ""
      ? SELECT_BTN_TEXT
      : filterValues.annotation_score
  )

  const [organismDropdown, setOrganismDropdown] = React.useState(false)

  const [organismValue, setOrganismValue] = React.useState(
    filterValues.model_organism === ""
      ? SELECT_BTN_TEXT
      : filterValues.model_organism
  )

  const [searchParams, _setSearchParams] = useSearchParams()
  const query = searchParams.get("query")
  const geneInput = React.useRef<HTMLInputElement>(null)
  const lengthMinInput = React.useRef<HTMLInputElement>(null)
  const lengthMaxInput = React.useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (geneInput.current) {
      geneInput.current.value = filterValues.gene
    }

    if (lengthMinInput.current && filterValues.length !== "") {
      lengthMinInput.current.value = filterValues.length
        .split(" ")[0]
        .replace("%5B", "")
        .replace("*", "")
    }

    if (lengthMaxInput.current && filterValues.length !== "") {
      lengthMaxInput.current.value = filterValues.length
        .split(" ")[2]
        .replace("%5D", "")
        .replace("*", "")
    }
  })

  const filters: IFilterData = useFilters(query ?? "")

  const onCancel = () => {
    setFilterValues(initialFilters)
    dispatch(getSearchData(query ?? ""))
    onClose()
  }

  const onApply = () => {
    let lengthValue = ""
    let organismFilterValue = ""
    let annotationFilterValue = ""
    let proteinFilterValue = ""
    const minLength = lengthMinInput.current?.value ?? ""
    const maxLength = lengthMaxInput.current?.value ?? ""

    if (minLength === "" && maxLength !== "") {
      lengthValue = `%5B* TO ${maxLength}%5D`
    } else if (minLength !== "" && maxLength === "") {
      lengthValue = `%5B${minLength} TO *%5D`
    } else if (
      minLength !== "" &&
      maxLength !== "" &&
      Number(minLength) < Number(maxLength)
    ) {
      lengthValue = `%5B${minLength} TO ${maxLength}%5D`
    } else {
      lengthValue = ""
    }

    if (organismValue !== SELECT_BTN_TEXT) {
      for (let i = 0; i < filters.organism.length; i++) {
        if (filters.organism[i].label === organismValue) {
          organismFilterValue = filters.organism[i].label ?? ""
          break
        }
      }
    }

    if (proteinValue !== SELECT_BTN_TEXT) {
      for (let i = 0; i < filters.proteinsWith.length; i++) {
        if (filters.proteinsWith[i].label === proteinValue) {
          proteinFilterValue = filters.proteinsWith[i].label ?? ""
          break
        }
      }
    }

    if (annotationValue !== SELECT_BTN_TEXT) {
      for (let i = 0; i < filters.annotationScore.length; i++) {
        if (filters.annotationScore[i].value === annotationValue) {
          annotationFilterValue = filters.annotationScore[i].value
          break
        }
      }
    }

    const activeFilters = {
      gene: geneInput.current?.value ?? "",
      model_organism: organismFilterValue,
      length: lengthValue,
      annotation_score: annotationFilterValue,
      proteins_with: proteinFilterValue,
    }

    setFilterValues(activeFilters)
    dispatch(getFilteredhData({ filters: activeFilters, query: query ?? "" }))
    onClose()
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <h2 className={styles.title}>{"Filters "}</h2>
      <div className={styles.form}>
        <label className={styles.label}>
          <span className={styles.filterName}>{"Gene Name"}</span>
          <input
            type="text"
            name="geneName"
            className={styles.input}
            placeholder="Enter Gene Name"
            ref={geneInput}
          />
        </label>
        <div className={styles.optionWrapper}>
          <span className={styles.filterName}>{"Organism"}</span>
          <button
            className={styles.chooseBtn}
            onClick={() => setOrganismDropdown(!organismDropdown)}
          >
            {organismValue}
            <SelectIcon />
          </button>
          {organismDropdown && filters.organism.length > 0 && (
            <LabelDropdown
              options={filters.organism}
              setSelectValue={setOrganismValue}
              onClose={setOrganismDropdown}
            />
          )}
        </div>
        <div className={styles.optionWrapper}>
          <span className={styles.filterName}>{"Sequence length"}</span>
          <div className={styles.rangeWrapper}>
            <input
              type="number"
              name="sequenceLenMin"
              className={styles.inputRange}
              placeholder="Min"
              ref={lengthMinInput}
            />
            <span className={styles.delim} />
            <input
              type="number"
              name="sequenceLenMax"
              className={styles.inputRange}
              placeholder="Max"
              ref={lengthMaxInput}
            />
          </div>
        </div>
        <div className={styles.optionWrapper}>
          <span className={styles.filterName}>{"Annotation score"}</span>
          <button
            className={styles.chooseBtn}
            onClick={() => setAnnotationDropdown(!annotationDropdown)}
          >
            {annotationValue}
            <SelectIcon />
          </button>
          {annotationDropdown && filters.annotationScore.length > 0 && (
            <LabelDropdown
              options={filters.annotationScore}
              setSelectValue={setAnnotationValue}
              onClose={setAnnotationDropdown}
            />
          )}
        </div>
        <div className={styles.optionWrapper}>
          <span className={styles.filterName}>{"Protein with"}</span>
          <button
            className={styles.chooseBtn}
            onClick={() => setProteinDropdown(!proteinDropdown)}
          >
            {proteinValue}
            <SelectIcon />
          </button>
          {proteinDropdown && filters.proteinsWith.length > 0 && (
            <LabelDropdown
              options={filters.proteinsWith}
              setSelectValue={setProteinValue}
              onClose={setProteinDropdown}
            />
          )}
        </div>
      </div>
      <div className={styles.buttonsWrapper}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          {"Cancel"}
        </button>
        <button className={styles.applyBtn} onClick={onApply}>
          {"Apply filters"}
        </button>
      </div>
    </div>
  )
}
