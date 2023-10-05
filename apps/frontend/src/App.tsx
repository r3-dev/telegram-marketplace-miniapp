import './App.css'

import { Navigate, Route, Router, Routes } from '@solidjs/router'
import { SDKProvider } from '@tma.js/sdk-solid'

import { CreateProductPage } from './components/create-product/create-product'
import { CreateStorePage } from './components/create-store/create-store'
import { ProductsListPage } from './components/products-list/products-list'
import { SuccessMock } from './components/success/success'
import { DisplayGate } from './components/twa-display-gate'
import { Welcome } from './components/welcome/welcome'
import { PocketbaseProvider } from './contexts/pocketbase'

/* SITE MAP
  /market
    /
    /:storeId
    /:productId
    /order
      /:orderId
    /cart
  /dashboard
    /
    /store
      /
      /create
      /:storeId
        /
        /products
        /settings
    /orders

      /
      /:orderId
    /product
      /create
      /:productId
*/

function App() {
  return (
    <SDKProvider
      initOptions={{
        timeout: 3000,
        cssVars: true,
        debug: true
      }}
    >
      <DisplayGate>
        <PocketbaseProvider>
          <Router>
            <Routes>
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
            </Routes>
          </Router>
        </PocketbaseProvider>
      </DisplayGate>
    </SDKProvider>
  )
}

export default App
