import { A, useNavigate } from "@solidjs/router";
import { type ListResult } from "pocketbase";
import { Collections, type StoresResponse } from "../../../pocketbase/pb-types";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { usePocketBase } from "../../contexts/pocketbase";
import { useSDK } from "@twa.js/sdk-solid";
import { MainButton } from "@twa.js/sdk";
import { LottieAnimation } from "../lottie-animation";
import "../../styles/index.css";

const storesDefaultValue = {
  items: [] as StoresResponse[],
} as ListResult<StoresResponse>;

export function DashboardPage() {
  const sdk = useSDK();
  const pb = usePocketBase();
  const navigate = useNavigate();

  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue);

  onMount(async () => {
    const records = await pb
      .collection(Collections.Stores)
      .getList<StoresResponse>();

    setStores(records);
  });

  createEffect(() => {
    const mainButton = new MainButton(
      sdk.themeParams().buttonColor!,
      true,
      true,
      false,
      "Create store",
      sdk.themeParams().buttonTextColor!
    );

    function goToCreateStore() {
      navigate("/create-store");
      mainButton.off("click", goToCreateStore);
      mainButton.hide();
    }

    mainButton.on("click", goToCreateStore);
    mainButton.show();
  });

  return (
    <div>
      <h1 style={{ "font-weight": "bold", "font-size": "3rem" }}>
        Hello, {sdk.initData()?.user?.firstName}
      </h1>
      <LottieAnimation
        animationData={location.origin + "/lottie/congratulations.json"}
        autoplay={true}
        loop={true}
      />
      <For each={stores().items}>
        {(record) => (
          <div>
            <h2>{record.name}</h2>
            <A href={`/store/${record.id}`}>Go to store</A>
          </div>
        )}
      </For>
    </div>
  );
}
