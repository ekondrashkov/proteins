import { ISearchData } from "../store/dataStore"

interface IGenesRaw {
  geneName: {
    evidences?: {
      evidenceCode: string
      id: string
      source: string
    }[]
    value: string
    orfNames: {
      value: string
    }[]
  }
  synonyms: {
    evidences?: {
      evidenceCode: string
      id: string
      source: string
    }[]
    value: string
  }[]
}

interface ISubcellularLocationsRaw {
  location: {
    evidences: {
      evidenceCode: string
      id: string
      source: string
    }[]
    id: string
    value: string
  }
}

export interface ISearchDataRaw {
  comments?: {
    commentType: string
    subcellularLocations: ISubcellularLocationsRaw[]
  }[]
  genes?: IGenesRaw[]
  organism: {
    commonName: string
    lineage: string[]
    scientificName: string
    taxonId: number
  }
  primaryAccession: string
  sequence: {
    length: number
  }
  uniProtkbId: string
}

/**
 * Id generator.
 */
export const getId = (): string => {
  return Math.random().toString(36).slice(2, 15)
}

/**
 * Correct date generator.
 */
export const generateDate = (lastUpd: string): string => {
  const date: Date = new Date(lastUpd)
  const dateNum: string = date.getDate().toString()
  const dateYear: string = date.getFullYear().toString()
  const dateMonth: number = date.getMonth()

  let monthToDisplay = ""

  switch (dateMonth) {
    case 1:
      monthToDisplay = "Feb"
      break
    case 2:
      monthToDisplay = "Mar"
      break
    case 3:
      monthToDisplay = "Apr"
      break
    case 4:
      monthToDisplay = "May"
      break
    case 5:
      monthToDisplay = "Jun"
      break
    case 6:
      monthToDisplay = "Jul"
      break
    case 7:
      monthToDisplay = "Aug"
      break
    case 8:
      monthToDisplay = "Sep"
      break
    case 9:
      monthToDisplay = "Oct"
      break
    case 10:
      monthToDisplay = "Nov"
      break
    case 11:
      monthToDisplay = "Dec"
      break
    case 0:
      monthToDisplay = "Jan"
      break
  }

  return `${monthToDisplay} ${dateNum} ${dateYear}`
}

export const prepareSearhResults = (data: ISearchDataRaw[]): ISearchData[] => {
  const searchData: ISearchData[] = []

  data.forEach((item: ISearchDataRaw) => {
    const genesList = item.genes
      ? item.genes.reduce((list, gene) => {
          const geneValue: string =
            gene.geneName?.value ?? gene.geneName?.orfNames[0]?.value ?? ""

          if (!geneValue) {
            return list
          }

          return list ? list + ", " + geneValue : geneValue
        }, "")
      : ""

    const subcellularLocations = item.comments?.[0]?.subcellularLocations[0]
      ? item.comments[0].subcellularLocations.reduce((list, value) => {
          return list
            ? list + ", " + value.location.value
            : value.location.value
        }, "")
      : ""

    const dataItem: ISearchData = {
      entry: item?.primaryAccession ?? "",
      entryNames: item?.uniProtkbId ?? "",
      genes: genesList,
      organism: item?.organism?.scientificName ?? "",
      subcellularLocation: subcellularLocations ?? "",
      length: item?.sequence?.length ?? 0,
    }

    searchData.push(dataItem)
  })

  return searchData
}

export const prepateLinkFromHeader = (header: string): string => {
  const regExp = /<|>|"\$/g
  const nextResultsLink = header.split(";")[0].replace(regExp, "").trim()

  return nextResultsLink
}

export const prepateLinkFromHeaders = (headers: string[]): string => {
  let nextResultsLink = ""
  const regExp = /<|>|"\$/g

  headers.forEach((header: string) => {
    ;/https/.test(header)
      ? (nextResultsLink = header.split(";")[0].replace(regExp, ""))
      : nextResultsLink
  })

  return nextResultsLink
}
