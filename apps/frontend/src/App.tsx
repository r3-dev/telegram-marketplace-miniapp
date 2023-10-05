import { createSignal } from 'solid-js'

import './App.css'

import { Navigate, Route, Router, Routes } from '@solidjs/router'
import { SDKProvider } from '@tma.js/sdk-solid'

import { CreateProductPage } from './components/create-product/create-product'
import { CreateStorePage } from './components/create-store/create-store'
import { ProductsListPage } from './components/products-list/products-list'
import { SuccessMock } from './components/success/success'
import { Welcome } from './components/welcome/welcome'
import { PocketbaseProvider } from './contexts/pocketbase'
import { DisplayGate } from './twa-display-gate'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <Router>
      <Routes>
        <SDKProvider
          initOptions={{
            timeout: 3000,
            cssVars: true,
            debug: true
          }}
        >
          <DisplayGate>
            <PocketbaseProvider>
              <Route path="/dashboard">
                <Route
                  path="/"
                  component={Welcome}
                />
                <Route
                  path="/create-store"
                  component={CreateStorePage}
                />
                <Route
                  path="/create-product"
                  component={CreateProductPage}
                />
                <Route
                  path="/products-list"
                  component={ProductsListPage}
                />
                <Route
                  path="/success"
                  component={SuccessMock}
                />
                <Route
                  path="*"
                  element={<Navigate href="/" />}
                />
              </Route>
            </PocketbaseProvider>
          </DisplayGate>
        </SDKProvider>
      </Routes>
    </Router>
  )
}

export default App
