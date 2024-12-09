import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import { PersistPartial } from "redux-persist/es/persistReducer"
import storageSession from "redux-persist/lib/storage/session"

import * as authStore from "./authStore"
import * as dataStore from "./dataStore"

export type StatusType = "loading" | "resolved" | "rejected"

export interface RootState {
  user: authStore.AuthState & PersistPartial
  data: dataStore.DataState & PersistPartial
}

const userPersistConfig = {
  key: "userAuth",
  storage: storageSession,
}

const dataPersistConfig = {
  key: "dataSearch",
  storage: storageSession,
}

const authReducer = persistReducer(userPersistConfig, authStore.default)
const dataReducer = persistReducer(dataPersistConfig, dataStore.default)

const rootReducer = combineReducers({
  user: authReducer,
  data: dataReducer,
})

export const store = configureStore<RootState>({
  reducer: rootReducer,
})

export const persistor = persistStore(store)
