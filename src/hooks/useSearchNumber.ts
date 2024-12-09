import { useEffect, useState } from "react"

export interface IResultsValues {
  count: number;
  label: string;
  value: string;
}

export const useResultsNumber = (query: string, initialValue: number) => {
  const [ results, setResults ] = useState(initialValue)

  useEffect(() => {
    if (query === "") {
      return
    }

    fetch(`https://rest.uniprot.org/uniprotkb/search?facets=reviewed%2Cmodel_organism%2Cproteins_with%2Cexistence%2Cannotation_score%2Clength&query=${query}&size=0`)
    .then(async (res) => {
      const resultsData = await res.json()
      const resultsValues = resultsData.facets[0]?.values as IResultsValues[]
      let resultsNumber = 0

      resultsValues.forEach((value: IResultsValues) => {
        resultsNumber += value.count
      }) 

      setResults(resultsNumber)

      return
    })
    .catch((error) => {
      throw new Error(error)
    })
  }, [query])

  return [results]
}