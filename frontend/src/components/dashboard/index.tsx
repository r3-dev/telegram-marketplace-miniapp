import { A } from "@solidjs/router";
import { type ListResult } from "pocketbase";
import { Collections, type StoresResponse } from "../../../pocketbase/pb-types";
import { For, createSignal, onMount } from "solid-js";
import { usePocketbase } from "../../contexts/pocketbase";

const storesDefaultValue = {
  items: [] as StoresResponse[],
} as ListResult<StoresResponse>;

export function DashboardPage() {
  const pb = usePocketbase()
  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue);

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
