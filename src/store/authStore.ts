import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

import { auth } from "../firebase/firebase"
import { StatusType } from "./store"

export interface AuthState {
  email: string
  status: null | StatusType
  error: null | string
}

const initialState: AuthState = {
  email: "",
  status: null,
  error: null,
}

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ email, password }: { email: string; password: string }) => {
    await createUserWithEmailAndPassword(auth, email, password)

    return email
  }
)

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }: { email: string; password: string }) => {
    await setPersistence(auth, browserSessionPersistence)

    await signInWithEmailAndPassword(auth, email, password)

    return email
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutUser(state) {
      signOut(auth)
      state.email = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.email = action.payload
        state.status = "resolved"
        state.error = null
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error.message ?? "Unknown error"
      })
      .addCase(signInUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.email = action.payload
        state.status = "resolved"
        state.error = null
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error.message ?? "Unknown error"
      })
  },
})

export const { signOutUser } = authSlice.actions

export default authSlice.reducer
