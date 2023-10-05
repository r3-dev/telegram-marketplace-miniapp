import './App.css'

import { Navigate, Route, Router, Routes } from '@solidjs/router'
import { SDKProvider } from '@tma.js/sdk-solid'

import { DisplayGate } from './components/twa-display-gate'
import { PocketbaseProvider } from './contexts/pocketbase'
import { DashboardPage } from './pages/dashboard'
import { OrdersPage } from './pages/dashboard/order'
import { OrderIdPage } from './pages/dashboard/order/order-id'
import { CreateProductPage } from './pages/dashboard/product/create'
import { ProductIdPage } from './pages/dashboard/product/product-id'
import { StoresPage } from './pages/dashboard/store'
import { CreateStorePage } from './pages/dashboard/store/create'
import { StoreIdPage } from './pages/dashboard/store/store-id'
import { StoreProductsPage } from './pages/dashboard/store/store-id/products'
import { StoreSettingsPage } from './pages/dashboard/store/store-id/settings'
import { MarketPage } from './pages/market'
import { MarketCartPage } from './pages/market/cart'
import { MarketOrdersPage } from './pages/market/order'
import { MarketOrderIdPage } from './pages/market/order/order-id'
import { MarketProductIdPage } from './pages/market/product-id'
import { MarketStoreIdPage } from './pages/market/store-id'

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
              <Route path="/market">
                <Route
                  path="/"
                  component={MarketPage}
                />
                <Route
                  path="/:storeId"
                  component={MarketStoreIdPage}
                />
                <Route
                  path="/:productId"
                  component={MarketProductIdPage}
                />
                <Route path="/order">
                  <Route
                    path="/"
                    component={MarketOrdersPage}
                  />
                  <Route
                    path="/:orderId"
                    component={MarketOrderIdPage}
                  />
                </Route>
                <Route
                  path="/cart"
                  component={MarketCartPage}
                />
                <Route
                  path="*"
                  element={<Navigate href="/" />}
                />
              </Route>
              <Route path="/dashboard">
                <Route
                  path="/"
                  component={DashboardPage}
                />
                <Route path="/product">
                  <Route
                    path="/create"
                    component={CreateProductPage}
                  />
                  <Route
                    path="/:productId"
                    component={ProductIdPage}
                  />
                </Route>
                <Route path="/orders">
                  <Route
                    path="/"
                    component={OrdersPage}
                  />
                  <Route
                    path="/:orderId"
                    component={OrderIdPage}
                  />
                </Route>
                <Route path="/store">
                  <Route
                    path="/"
                    component={StoresPage}
                  />
                  <Route
                    path="/create"
                    component={CreateStorePage}
                  />
                  <Route path="/:storeId">
                    <Route
                      path="/"
                      component={StoreIdPage}
                    />
                    <Route
                      path="/settings"
                      component={StoreSettingsPage}
                    />
                    <Route
                      path="/products"
                      component={StoreProductsPage}
                    />
                  </Route>
                </Route>
                <Route
                  path="*"
                  element={<Navigate href="/" />}
                />
              </Route>
              <Route
                path="*"
                element={<Navigate href="/market" />}
              />
            </Routes>
          </Router>
        </PocketbaseProvider>
      </DisplayGate>
    </SDKProvider>
  )
}

export default App
