import { useEffect, useState } from "react"

export interface IFilterValue {
  count: number;
  label?: string;
  value: string;
}

interface IFilterDataRaw {
  allowMultipleSelection: boolean;
  label: string;
  name: string;
  values: IFilterValue[]
}

export interface IFilterData {
  organism: IFilterValue[];
  annotationScore: IFilterValue[];
  proteinsWith: IFilterValue[];
}

export const initialData: IFilterData = {
  organism: [],
  annotationScore: [],
  proteinsWith: []
}

const initialDataraw: IFilterDataRaw = {
  allowMultipleSelection: false,
  label: "",
  name: "",
  values: []
}

export const useFilters = (query: string) => {
  const [ results, setResults ] = useState(initialData)

  useEffect(() => {
    if (query === "") {
      return
    }

    fetch(`https://rest.uniprot.org/uniprotkb/search?facets=model_organism,proteins_with,annotation_score&query=(${query})`)
    .then(async (res) => {
      const resultsData = await res.json()
      let organismData: IFilterDataRaw = {...initialDataraw}
      let annotationScoreData: IFilterDataRaw = {...initialDataraw}
      let proteinsWithData: IFilterDataRaw = {...initialDataraw}

      if (!resultsData.facets) {
        return
      }

      resultsData.facets.forEach((facet: IFilterDataRaw) => {
        switch (facet.name) {
        case "model_organism": {
          organismData = facet
          break
        }

        case "proteins_with": {
          proteinsWithData = facet
          break
        }

        case "annotation_score": {
          annotationScoreData = facet
          break
        }
        // No default
        }
      })

      const filterData: IFilterData = {
        organism: organismData.values,
        annotationScore: annotationScoreData.values,
        proteinsWith: proteinsWithData.values
      }

      setResults(filterData)

      return
    })
    .catch((error) => {
      throw new Error(error)
    })
  }, [query])

  return results
}