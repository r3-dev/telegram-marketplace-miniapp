import { A } from "@solidjs/router";
import { type ListResult } from "pocketbase";
import { Collections, type StoresResponse } from "../../../pocketbase/pb-types";
import { For, createSignal, onMount } from "solid-js";
import { pb } from "../../services/pocketbase-service";
import WebApp from "@twa-dev/sdk";

const storesDefaultValue = {
  items: [] as StoresResponse[],
} as ListResult<StoresResponse>;

export function DashboardPage() {
  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue);

  onMount(async () => {
    const records = await pb
      .collection(Collections.Stores)
      .getList<StoresResponse>();

    console.log(records);

    setStores(records);
  });

  const handleClick = async () => {
    await pb.collection("users").authRefresh({
      headers: {
        "X-Init-Data": WebApp.initData,
      }
    });
    
    console.log("Is valid", pb.authStore.isValid);
  }

  return (
    <>
      <button onClick={handleClick}>REFRESH</button>
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
