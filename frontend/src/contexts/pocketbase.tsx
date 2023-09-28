import PocketBase from "pocketbase";
import { useSDK } from "@twa.js/sdk-solid";
import {
  createContext,
  createEffect,
  createMemo,
  useContext,
  type ParentComponent,
} from "solid-js";

const PocketBaseContext = createContext<PocketBase>(undefined, {
  name: "PocketBaseContext",
});

export function usePocketbase() {
  const context = useContext(PocketBaseContext);

  if (context === undefined) {
    throw new Error(
      `${usePocketbase.name} hook was used outside of ${PocketbaseProvider.name}.`
    );
  }

  return context;
}

export const PocketbaseProvider: ParentComponent = (props) => {
  const pb = createMemo(() => new PocketBase("http://127.0.0.1:3000"));
  const sdk = useSDK();

  createEffect(async () => {
    pb().beforeSend = function (url, options) {
      options.headers = Object.assign({}, options.headers, {
        "X-Init-Data": sdk.initData(),
      });

      return { url, options };
    };

    await pb()
      .collection("users")
      .authWithPassword("USERNAMELESS", "PASSWORDLESS", {
        headers: {
          "X-Init-Data": sdk.initData(),
        },
      });

    console.log(pb())
  });

  return (
    <PocketBaseContext.Provider value={pb()}>
      {props.children}
    </PocketBaseContext.Provider>
  );
};
