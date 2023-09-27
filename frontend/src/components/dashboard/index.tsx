import { A } from "@solidjs/router";
import PocketBase from "pocketbase";
import WebApp from "@twa-dev/sdk";
import { Collections, type StoresResponse } from "../../../pocketbase/pb-types";
import { For } from "solid-js";

export async function DashboardPage() {
  const pb = new PocketBase("http://127.0.0.1:3000");

  pb.beforeSend = function (url, options) {
    // For list of the possible request options properties check
    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
    options.headers = Object.assign({}, options.headers, {
      "X-Init-Data": WebApp.initData,
    });

    return { url, options };
  };

  const records = await pb
    .collection(Collections.Stores)
    .getFullList<StoresResponse>();

  return (
    <>
      <For each={records}>
        {(record) => (
          <div>
            <h2>{record.name}</h2>
            <A href={`/store/${record.id}`}>Go to store</A>
          </div>
        )}
      </For>
      <h1>Dashboard Home Page</h1>
      <A href="/create-store">Create store</A>
    </>
  );
}
