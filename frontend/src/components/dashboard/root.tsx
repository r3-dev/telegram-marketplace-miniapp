import { Router, Routes, Route, hashIntegration } from "@solidjs/router";
import { DashboardPage } from ".";
import { CreateStorePage } from "./create-store";
import { TwaSolidLayout } from "../../layouts/twa/solid-layout";

export function DashboardRoot() {
  return (
    <TwaSolidLayout>
      <Router source={hashIntegration()}>
        <Routes>
          <Route path="/" component={DashboardPage} />
          <Route path="/create-store" component={CreateStorePage} />
        </Routes>
      </Router>
    </TwaSolidLayout>
  );
}
