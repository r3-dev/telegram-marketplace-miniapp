import { A } from "@solidjs/router";

export function DashboardPage() {
  return (
    <>
      <h1>Dashboard Home Page</h1>
      <A href="/dashboard/create-store">Create store</A>
    </>
  );
}
