import React from "react"
import { Provider } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"

import { persistor, store } from "../store/store"
import { Layout } from "./Layout/Layout"
import { Auth } from "./Layout/Main/Auth/Auth"
import { Main } from "./Layout/Main/Main"
import { MainView } from "./Layout/Main/MainView/MainView"
import { NoMatchView } from "./Layout/NoMatchView/NoMatchView"
import { Details } from "./Layout/SearchView/Protein/Details/Details"
import { FeatureViewer } from "./Layout/SearchView/Protein/FeatureViewer/FeatureViewer"
import { Protein } from "./Layout/SearchView/Protein/Protein"
import { Publications } from "./Layout/SearchView/Protein/Publications/Publications"
import { SearchPageContent } from "./Layout/SearchView/SearchPageContent/SearchPageContent"
import { SearchView } from "./Layout/SearchView/SearchView"

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Routes>
            <Route element={<Main />}>
              <Route path="/" element={<MainView />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
            <Route element={<SearchView />}>
              <Route path="/search" element={<SearchPageContent />} />
              <Route element={<Protein />}>
                <Route
                  path="/protein/:proteinId/details"
                  element={<Details />}
                />
                <Route
                  path="/protein/:proteinId/publications"
                  element={<Publications />}
                />
                <Route
                  path="/protein/:proteinId/featureviewer"
                  element={<FeatureViewer />}
                />
                <Route
                  path="/protein/:proteinId"
                  element={
                    <Navigate to="/protein/:proteinId/details" replace />
                  }
                />
              </Route>
              <Route path="/404" element={<NoMatchView />} />
              <Route path="/*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Layout>
      </PersistGate>
    </Provider>
  )
}

export default App
