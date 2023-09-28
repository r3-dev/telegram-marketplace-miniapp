import { Router, Routes, Route, hashIntegration } from "@solidjs/router";
import { DashboardPage } from "./index";
import { CreateStorePage } from "./create-store";
import { PocketbaseProvider } from "../../contexts/pocketbase";
import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
import { SDKProvider } from "@twa.js/sdk-solid";
import { DisplayGate } from "../twa-display-gate";

if (import.meta.env.DEV) {
  attachDevtoolsOverlay();

  attachDevtoolsOverlay({
    defaultOpen: false,
    noPadding: true
  });
}

export function DashboardRoot() {
  return (
    <SDKProvider initOptions={{ timeout: 3000, debug: true }}>
      <DisplayGate>
        <PocketbaseProvider>
          <Router source={hashIntegration()}>
            <Routes>
              <Route path="/" component={DashboardPage} />
              <Route path="/create-store" component={CreateStorePage} />
            </Routes>
          </Router>
        </PocketbaseProvider>
      </DisplayGate>
    </SDKProvider>
  );
}
