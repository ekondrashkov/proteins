import { useEffect, useState } from "react"
import axios from "axios"

export interface IPublication {
  title: string
  authors: string
  sourceCategories: string
  citedFor: string
  source: string
  pubMedUrl: string
  europePmcUrl: string
  articleJournal: string
  articleLink: string
}

interface IPublicationsDataRaw {
  citation: {
    authors: string[]
    citationCrossReferences: {
      database: string
      id: string
    }[]
    citationType: string
    completeAuthorList: boolean
    firstPage: string
    id: string
    journal: string
    lastPage: string
    literatureAbstract: string
    publicationDate: string
    title: string
    volume: string
  }
  references: {
    citationId: string
    referenceNumber: number
    referencePositions: string[]
    source: {
      name: string
    }
    sourceCategories: string[]
  }[]
  statistics: {
    communityMappedProteinCount: number
    computationallyMappedProteinCount: number
    reviewedProteinCount: number
    unreviewedProteinCount: number
  }
}

const getPublicationsAsync = async (
  proteinId: string
): Promise<IPublication[]> => {
  const pubData: IPublication[] = []

  const { data } = await axios.get(
    `https://rest.uniprot.org/uniprotkb/${proteinId}/publications`
  )

  if (data.results.length === 0) {
    return []
  }

  const publicationsData = data.results as IPublicationsDataRaw[]

  publicationsData.forEach((item: IPublicationsDataRaw) => {
    const articleLink =
      item.citation.citationCrossReferences &&
      item.citation.citationCrossReferences[1]
        ? `https://dx.doi.org/${item.citation.citationCrossReferences[1].id}`
        : ""

    const publication: IPublication = {
      title: item.citation?.title ?? "",
      authors: item.citation?.authors?.join(", ") ?? "",
      sourceCategories: item.references[0].sourceCategories?.join(", ") ?? "",
      citedFor: item.references[0].referencePositions?.join(", ") ?? "",
      source: item.references[0]?.source.name ?? "",
      pubMedUrl: `https://pubmed.ncbi.nlm.nih.gov/${item.citation.id}`,
      europePmcUrl: `https://europepmc.org/article/MED/${item.citation.id}`,
      articleJournal: `${item.citation?.journal ?? ""} ${
        item.citation?.volume ?? ""
      }:${item.citation?.firstPage ?? ""}-${item.citation?.lastPage ?? ""} (${
        item.citation?.publicationDate ?? ""
      })`,
      articleLink,
    }

    pubData.push(publication)
  })

  return pubData
}

interface IPublicationState {
  publications: IPublication[]
  loading: boolean
  error: string | null
}

export const usePublications = (proteinId: string): IPublicationState => {
  const [publications, setPublications] = useState<IPublication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!proteinId) {
      setLoading(false)

      return
    }

    getPublicationsAsync(proteinId)
      .then((res) => {
        setError(null)
        setPublications(res)

        return
      })
      .catch((error_) => {
        setError(error_.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [proteinId])

  return { publications, loading, error }
}
