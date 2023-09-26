import { Router, Routes, Route } from "@solidjs/router";
import { DashboardPage } from ".";
import { CreateStorePage } from "./create-store";
import { TwaSolidLayout } from "../../layouts/twa/solid-layout";

export function DashboardRoot() {
  return (
    <TwaSolidLayout>
      <Router>
        <Routes>
          <Route path="/dashboard">
            <Route path="/" component={DashboardPage} />
            <Route path="/create-store" component={CreateStorePage} />
          </Route>
        </Routes>
      </Router>
    </TwaSolidLayout>
  );
}
