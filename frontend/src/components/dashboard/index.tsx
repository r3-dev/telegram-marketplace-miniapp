import { A } from "@solidjs/router";
import PocketBase, { type ListResult } from "pocketbase";
import WebApp from "@twa-dev/sdk";
import { Collections, type StoresResponse } from "../../../pocketbase/pb-types";
import { For, createSignal, onMount } from "solid-js";

const storesDefaultValue = {
  items: [] as StoresResponse[],
} as ListResult<StoresResponse>;

export function DashboardPage() {
  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue);
  const pb = new PocketBase("http://127.0.0.1:3000");

  // Auth with telegram init data
  pb.beforeSend = function (url, options) {
    // For list of the possible request options properties check
    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
    options.headers = Object.assign({}, options.headers, {
      "X-Init-Data": WebApp.initData,
    });

    return { url, options };
  };

  onMount(async () => {
    const records = await pb
      .collection(Collections.Stores)
      .getList<StoresResponse>();

    console.log(records);

    setStores(records);
  });

  return (
    <>
      <For each={stores().items}>
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
