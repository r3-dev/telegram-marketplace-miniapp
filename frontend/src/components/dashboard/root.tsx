import { Router, Routes, Route, A } from "@solidjs/router";
import DashboardPage from ".";
import CreateStorePage from "./create-store";

export default function DashboardRoot() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard">
          <Route path="/" component={DashboardPage} />
          <Route path="/create-store" component={CreateStorePage} />
        </Route>
      </Routes>
    </Router>
  );
}
