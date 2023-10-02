import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import {
  hashIntegration,
  Navigate,
  Route,
  Router,
  Routes
} from '@solidjs/router'
import { SDKProvider } from '@tma.js/sdk-solid'

import { PocketbaseProvider } from '../../contexts/pocketbase'
import { DisplayGate } from '../twa-display-gate'
import { CreateProductPage } from './create-product/create-product'
import { CreateStorePage } from './create-store/create-store'
import { DashboardPage } from './index'
import { ProductsListPage } from './products-list/products-list'

if (import.meta.env.DEV) {
  attachDevtoolsOverlay()

  attachDevtoolsOverlay({
    defaultOpen: false,
    noPadding: true
  })
}

export function DashboardRoot() {
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
          <Router source={hashIntegration()}>
            <Routes>
              <Route
                path="/"
                component={DashboardPage}
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
                path="*"
                element={<Navigate href="/" />}
              />
            </Routes>
          </Router>
        </PocketbaseProvider>
      </DisplayGate>
    </SDKProvider>
  )
}
