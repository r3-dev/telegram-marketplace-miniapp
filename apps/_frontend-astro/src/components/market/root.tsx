import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import { Navigate, Route, Router, Routes } from '@solidjs/router'
import { SDKProvider } from '@tma.js/sdk-solid'

import { PocketbaseProvider } from '../../contexts/pocketbase'
import { DisplayGate } from '../twa-display-gate'

import '../../styles/global.css'

import { MarketPage } from './index'

if (import.meta.env.DEV) {
  attachDevtoolsOverlay()

  attachDevtoolsOverlay({
    defaultOpen: false,
    noPadding: true
  })
}

export function MarketRoot() {
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
