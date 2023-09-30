import {
  Router,
  Routes,
  Route,
  hashIntegration,
  Navigate,
} from "@solidjs/router";
import { DashboardPage } from "./index";
import { CreateStorePage } from "./create-store/create-store";
import { PocketbaseProvider } from "../../contexts/pocketbase";
import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
import { SDKProvider } from "@twa.js/sdk-solid";
import { DisplayGate } from "../twa-display-gate";
import { CreateProductPage } from "./create-product/create-product";
import { ProductsListPage } from "./products-list/products-list";

if (import.meta.env.DEV) {
  attachDevtoolsOverlay();

  attachDevtoolsOverlay({
    defaultOpen: false,
    noPadding: true,
  });
}

export function DashboardRoot() {
  return (
    <SDKProvider
      initOptions={{
        timeout: 3000,
        cssVars: true,
        debug: true,
      }}
    >
      <DisplayGate>
        <PocketbaseProvider>
          <Router source={hashIntegration()}>
            <Routes>
              <Route path="/" component={DashboardPage} />
              <Route path="/create-store" component={CreateStorePage} />
              <Route path="/create-product" component={CreateProductPage} />
              <Route path="/products-list" component={ProductsListPage} />
              <Route path="*" element={<Navigate href="/" />} />
            </Routes>
          </Router>
        </PocketbaseProvider>
      </DisplayGate>
    </SDKProvider>
  );
}
