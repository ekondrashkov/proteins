import { useEffect, useState } from "react"
import axios from "axios"

import { generateDate } from "../utils/utils"

export interface IProteinDetails {
  entry: string
  id: string
  protein: string
  organism: string
  gene: string
  length: string
  mass: string
  sequence: string
  lastUpd: string
  checksum: string
}

const getProteinDetailsAsync = async (
  proteinId: string
): Promise<IProteinDetails> => {
  const { data } = await axios.get(
    `https://rest.uniprot.org/uniprotkb/${proteinId}`
  )

  const proteinInfo: IProteinDetails = {
    entry: proteinId,
    id: data.uniProtkbId,
    protein:
      data.proteinDescription?.recommendedName?.fullName?.value ??
      "No name data",
    organism: data.organism?.commonName ?? "",
    gene: data.genes[0]?.geneName?.value ?? "",
    length: data.sequence?.length ?? "",
    mass: data.sequence?.molWeight
      ? ((data.sequence.molWeight as number) / 1000)
          .toFixed(2)
          .split(".")
          .join(",")
      : "",
    sequence: data.sequence?.value ?? "",
    lastUpd: generateDate(data.entryAudit.lastSequenceUpdateDate),
    checksum: data.sequence?.crc64 ?? "",
  }

  return proteinInfo
}

interface IProteinDetailsState {
  proteinDetails: IProteinDetails | null
  loading: boolean
  error: string | null
}

export const useProteinDetails = (proteinId: string): IProteinDetailsState => {
  const [proteinDetails, setProteinDetails] = useState<IProteinDetails | null>(
    null
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!proteinId) {
      return
    }

    getProteinDetailsAsync(proteinId)
      .then((res) => {
        setError(null)
        setProteinDetails(res)

        return
      })
      .catch((error_) => {
        setError(error_.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [proteinId])

  return { proteinDetails, loading, error }
}
