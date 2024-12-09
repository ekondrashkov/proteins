import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

import {
  ISearchDataRaw,
  prepareSearhResults,
  prepateLinkFromHeader,
} from "../utils/utils"
import { StatusType } from "./store"

export interface ISearchData {
  entry: string
  entryNames: string
  genes: string
  organism: string
  subcellularLocation: string
  length: number
}

export interface DataState {
  payload: ISearchData[]
  nextSearchResultsUrl: string
  status: StatusType | null
  error: string | null
}

const initialState: DataState = {
  payload: [],
  nextSearchResultsUrl: "",
  status: null,
  error: null,
}

export interface IFilteredData {
  gene: string
  model_organism: string
  length: string
  annotation_score: string
  proteins_with: string
}

export const getSearchData = createAsyncThunk(
  "data/getSearchData",
  async (query: string) => {
    const { data, headers } = await axios.get(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession,id,gene_names,organism_name,length,cc_subcellular_location&query=${query}`
    )

    const dataRaw = data.results as ISearchDataRaw[]
    const dataParsed = prepareSearhResults(dataRaw)
    const nextResultsLink = prepateLinkFromHeader(headers.link as string)

    return { data: dataParsed, nextResultsLink }
  }
)

export const getFilteredhData = createAsyncThunk(
  "data/getFilteredhData",
  async ({ filters, query }: { filters: IFilteredData; query: string }) => {
    const filtersArr: string[] = []
    let filterUrlPart = ""

    for (const key in filters) {
      if (filters[key as keyof IFilteredData] !== "") {
        filtersArr.push(`(${key}:${filters[key as keyof IFilteredData]})`)
      }
    }

    if (filtersArr.length > 0) {
      filterUrlPart = `AND ${filtersArr.join(" AND ")}`
    } else {
      return
    }

    const { data, headers } = await axios.get(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession,id,gene_names,organism_name,length,cc_subcellular_location&query=${query}&filter=${filterUrlPart}`
    )

    const dataRaw = data.results as ISearchDataRaw[]
    const dataParsed = prepareSearhResults(dataRaw)
    const nextResultsLink = headers.link as string

    return { data: dataParsed, nextResultsLink }
  }
)

export const getSortedData = createAsyncThunk(
  "data/getSortedData",
  async ({
    query,
    sortedBy,
    order,
  }: {
    query: string
    sortedBy: string
    order: string
  }) => {
    const { data, headers } = await axios.get(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession,id,gene_names,organism_name,length,cc_subcellular_location&query=${query}&sort=${sortedBy}%20${order}`
    )

    const dataRaw = data.results as ISearchDataRaw[]
    const dataParsed = prepareSearhResults(dataRaw)
    const nextResultsLink = prepateLinkFromHeader(headers.link as string)

    return { data: dataParsed, nextResultsLink }
  }
)

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addSearchResults: (state, action) => {
      state.payload = [...state.payload, ...action.payload]
      state.error = null
    },
    clearSeacrhResults: (state) => {
      state.payload = []
      state.error = null
      state.nextSearchResultsUrl = ""
      state.status = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchData.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getSearchData.fulfilled, (state, action) => {
        state.nextSearchResultsUrl = action.payload.nextResultsLink
        state.payload = action.payload.data
        state.status = "resolved"
        state.error = null
      })
      .addCase(getSearchData.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error.message ?? "Unknown error"
      })
      .addCase(getFilteredhData.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getFilteredhData.fulfilled, (state, action) => {
        state.nextSearchResultsUrl = action.payload?.nextResultsLink ?? ""
        state.payload = action.payload?.data ?? []
        state.status = "resolved"
        state.error = null
      })
      .addCase(getFilteredhData.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error.message ?? "Unknown error"
      })
      .addCase(getSortedData.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getSortedData.fulfilled, (state, action) => {
        state.nextSearchResultsUrl = action.payload?.nextResultsLink ?? ""
        state.payload = action.payload?.data ?? []
        state.status = "resolved"
      })
      .addCase(getSortedData.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error.message ?? "Unknown error"
      })
  },
})

export const { addSearchResults, clearSeacrhResults } = dataSlice.actions

export default dataSlice.reducer
